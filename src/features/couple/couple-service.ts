import type { SupabaseClient } from "@supabase/supabase-js";

import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { normalizeEmail } from "@/features/couple/couple-schemas";
import type {
  CoupleOperationContext,
  CoupleServiceResult,
  CreateInviteInput,
  InvitationDetail,
  RawRelationshipData,
  ReceivedInvitationSummary,
  SentInvitationSummary,
  SharedBudgetSummary,
  UnavailableReason
} from "@/features/couple/couple-types";
import {
  resolveRelationshipState,
  type RelationshipState
} from "@/features/couple/relationship-state";
import { getPermissionMessage, mapPermissionFailure } from "@/features/permissions";
import { getSupabaseClient } from "@/lib/supabase";

type QueryResult<T> = { data: T | null; error: { message?: string; code?: string } | null };
type QueryListResult<T> = { data: T[] | null; error: { message?: string; code?: string } | null };

type QueryBuilder<T> = {
  select: (columns?: string) => QueryBuilder<T>;
  eq: (column: string, value: string | number | boolean) => QueryBuilder<T>;
  gt: (column: string, value: string) => QueryBuilder<T>;
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder<T>;
  limit: (count: number) => QueryBuilder<T>;
  maybeSingle: () => Promise<QueryResult<T>>;
};

type CoupleSupabaseClient = SupabaseClient & {
  from: <T = unknown>(table: string) => QueryBuilder<T>;
  rpc: <T = unknown>(fn: string, args?: Record<string, unknown>) => Promise<QueryResult<T>>;
};

type MembershipRow = {
  shared_budget_id: string;
  role: "creator" | "partner";
};

type BudgetRow = {
  id: string;
  name: string;
};

type InvitationRow = {
  id: string;
  shared_budget_id: string;
  inviter_user_id: string;
  invitee_email: string;
  invitee_email_normalized: string;
  status: "pending" | "accepted" | "declined" | "cancelled" | "expired";
  expires_at: string;
  created_at: string;
  shared_budgets?: { name?: string } | null;
};

type RpcInvitationRow = {
  id: string;
  invitee_email: string;
  status: InvitationRow["status"];
  expires_at: string;
  created_at: string;
};

export async function getRelationshipState(
  context: CoupleOperationContext
): Promise<CoupleServiceResult<RelationshipState>> {
  try {
    const data = await loadRelationshipData(context);
    return { ok: true, data: resolveRelationshipState(data) };
  } catch (error) {
    return temporaryFailure(error);
  }
}

export async function createSharedBudgetAndInvite(
  context: CoupleOperationContext,
  input: CreateInviteInput
): Promise<CoupleServiceResult<SentInvitationSummary>> {
  try {
    const { data, error } = await client().rpc<RpcInvitationRow>(
      "create_shared_budget_and_invite",
      {
        invitee_email_input: normalizeEmail(input.inviteeEmail)
      }
    );

    if (error || !data) {
      return mapMutationFailure(error?.message);
    }

    return {
      ok: true,
      data: mapSentInvitation(data),
      message: COUPLE_MESSAGES.inviteCreated
    };
  } catch (error) {
    return temporaryFailure(error);
  }
}

export async function getInvitation(
  context: CoupleOperationContext,
  invitationId: string
): Promise<CoupleServiceResult<InvitationDetail>> {
  try {
    const { data, error } = await client()
      .from<InvitationRow>("budget_invitations")
      .select("*, shared_budgets(name)")
      .eq("id", invitationId)
      .maybeSingle();

    if (error || !data) {
      return unavailable("not_found");
    }

    if (isExpired(data)) {
      return unavailable("expired");
    }

    if (data.status !== "pending") {
      return unavailable(data.status);
    }

    const userEmail = normalizeEmail(context.user.email ?? "");
    const currentUserRole =
      data.inviter_user_id === context.user.id
        ? "inviter"
        : data.invitee_email_normalized === userEmail
          ? "invitee"
          : null;

    if (!currentUserRole) {
      return unavailable("unauthorized");
    }

    return {
      ok: true,
      data: {
        id: data.id,
        inviterLabel: "Pessoa que convidou",
        inviteeEmail: data.invitee_email,
        sharedBudgetName: data.shared_budgets?.name ?? "Espaco compartilhado",
        status: data.status,
        expiresAt: data.expires_at,
        createdAt: data.created_at,
        currentUserRole
      }
    };
  } catch (error) {
    return temporaryFailure(error);
  }
}

export async function acceptInvitation(
  _context: CoupleOperationContext,
  invitationId: string
): Promise<CoupleServiceResult<RelationshipState>> {
  return runInvitationRpc("accept_invitation", invitationId, COUPLE_MESSAGES.inviteAccepted);
}

export async function declineInvitation(
  _context: CoupleOperationContext,
  invitationId: string
): Promise<CoupleServiceResult<RelationshipState>> {
  return runInvitationRpc("decline_invitation", invitationId, COUPLE_MESSAGES.inviteDeclined);
}

export async function cancelInvitation(
  _context: CoupleOperationContext,
  invitationId: string
): Promise<CoupleServiceResult<RelationshipState>> {
  return runInvitationRpc("cancel_invitation", invitationId, COUPLE_MESSAGES.inviteCancelled);
}

async function runInvitationRpc(
  fn: string,
  invitationId: string,
  message: string
): Promise<CoupleServiceResult<RelationshipState>> {
  try {
    const { error } = await client().rpc(fn, { invitation_id_input: invitationId });

    if (error) {
      return mapMutationFailure(error.message);
    }

    return { ok: true, data: { status: "no_shared_budget" }, message };
  } catch (error) {
    return temporaryFailure(error);
  }
}

async function loadRelationshipData({
  user
}: CoupleOperationContext): Promise<RawRelationshipData> {
  const supabase = client();
  const membership = await supabase
    .from<MembershipRow>("budget_members")
    .select("shared_budget_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membership.error) {
    throw new Error(membership.error.message);
  }

  if (membership.data) {
    return {
      activeMembership: {
        sharedBudget: await loadSharedBudgetSummary(
          supabase,
          membership.data.shared_budget_id,
          membership.data.role
        ),
        pendingInvitation: await loadSentInvitation(
          supabase,
          user.id,
          membership.data.shared_budget_id
        )
      }
    };
  }

  return {
    receivedInvitation: await loadReceivedInvitation(supabase, user.email ?? "")
  };
}

async function loadSharedBudgetSummary(
  supabase: CoupleSupabaseClient,
  sharedBudgetId: string,
  currentUserRole: SharedBudgetSummary["currentUserRole"]
): Promise<SharedBudgetSummary> {
  const budget = await supabase
    .from<BudgetRow>("shared_budgets")
    .select("id, name")
    .eq("id", sharedBudgetId)
    .maybeSingle();

  if (budget.error || !budget.data) {
    throw new Error(budget.error?.message ?? "Budget not found");
  }

  const members = (await supabase
    .from<MembershipRow>("budget_members")
    .select("shared_budget_id, role")
    .eq("shared_budget_id", sharedBudgetId)
    .eq("status", "active")) as unknown as QueryListResult<MembershipRow>;

  if (members.error) {
    throw new Error(members.error.message);
  }

  return {
    id: budget.data.id,
    name: budget.data.name,
    memberCount: members.data?.length ?? 1,
    currentUserRole
  };
}

async function loadSentInvitation(
  supabase: CoupleSupabaseClient,
  userId: string,
  sharedBudgetId: string
): Promise<SentInvitationSummary | undefined> {
  const invitation = await supabase
    .from<InvitationRow>("budget_invitations")
    .select("id, invitee_email, status, expires_at, created_at")
    .eq("inviter_user_id", userId)
    .eq("shared_budget_id", sharedBudgetId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (invitation.error) {
    throw new Error(invitation.error.message);
  }

  return invitation.data ? mapSentInvitation(invitation.data) : undefined;
}

async function loadReceivedInvitation(
  supabase: CoupleSupabaseClient,
  email: string
): Promise<ReceivedInvitationSummary | undefined> {
  const invitation = await supabase
    .from<InvitationRow>("budget_invitations")
    .select("*, shared_budgets(name)")
    .eq("invitee_email_normalized", normalizeEmail(email))
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (invitation.error) {
    throw new Error(invitation.error.message);
  }

  if (!invitation.data) {
    return undefined;
  }

  return {
    id: invitation.data.id,
    inviterLabel: "Pessoa que convidou",
    sharedBudgetName: invitation.data.shared_budgets?.name ?? "Espaco compartilhado",
    status: invitation.data.status,
    expiresAt: invitation.data.expires_at,
    createdAt: invitation.data.created_at
  };
}

function mapSentInvitation(row: RpcInvitationRow | InvitationRow): SentInvitationSummary {
  return {
    id: row.id,
    inviteeEmail: row.invitee_email,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at
  };
}

function isExpired(invitation: InvitationRow): boolean {
  return invitation.expires_at ? new Date(invitation.expires_at).getTime() <= Date.now() : false;
}

function mapMutationFailure(message: string | undefined): CoupleServiceResult<never> {
  const lower = message?.toLowerCase() ?? "";

  if (lower.includes("already linked") || lower.includes("active membership")) {
    return {
      ok: false,
      reason: "validation",
      message: COUPLE_MESSAGES.alreadyLinked
    };
  }

  if (lower.includes("expired")) {
    return unavailable("expired");
  }

  if (lower.includes("not found") || lower.includes("unavailable")) {
    return unavailable("not_found");
  }

  return temporaryFailure(message);
}

function unavailable(reason: UnavailableReason): CoupleServiceResult<never> {
  return {
    ok: false,
    reason,
    message: getPermissionMessage("permissionUnavailable")
  };
}

function temporaryFailure(error: unknown): CoupleServiceResult<never> {
  const messageKey = mapPermissionFailure({
    kind: "service_failure",
    message: error instanceof Error ? error.message : undefined
  });

  return {
    ok: false,
    reason: "temporary_failure",
    message: getPermissionMessage(messageKey)
  };
}

function client(): CoupleSupabaseClient {
  return getSupabaseClient() as CoupleSupabaseClient;
}
