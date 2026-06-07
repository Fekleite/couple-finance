import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import { AUDIT_MESSAGES } from "./audit-messages";
import type { AuditQuery, AuditServiceResult, FinancialAuditEventRow } from "./audit-types";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

type QueryListResult<T> = { data: T[] | null; error: { message?: string } | null };
type QueryBuilder<T> = {
  select: (columns?: string) => QueryBuilder<T>;
  eq: (column: string, value: string) => QueryBuilder<T>;
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder<T>;
  limit: (count: number) => Promise<QueryListResult<T>>;
};
type AuditClient = SupabaseClient & {
  from: <T = unknown>(table: string) => QueryBuilder<T>;
};
type MembershipRow = { shared_budget_id: string };

export async function listAuditEvents(query: AuditQuery = {}): Promise<AuditServiceResult> {
  try {
    const supabase = client();
    const activeSharedBudgetId = await resolveActiveSharedBudgetId(supabase);
    let builder = supabase
      .from<FinancialAuditEventRow>("financial_audit_events")
      .select("*")
      .order("occurred_at", { ascending: false })
      .order("id", { ascending: false });
    if (query.itemType && query.itemType !== "all")
      builder = builder.eq("item_type", query.itemType);
    if (query.visibility && query.visibility !== "all") {
      builder = builder.eq("visibility", query.visibility);
    }
    const result = await builder.limit(clampAuditLimit(query.limit));
    if (result.error) return failure("temporary_failure");
    return {
      ok: true,
      data: {
        items: (result.data ?? []).map(mapAuditRow),
        hasActiveSharedBudget: Boolean(activeSharedBudgetId),
        activeSharedBudgetId,
        generatedAt: new Date().toISOString()
      }
    };
  } catch {
    return failure("temporary_failure");
  }
}

export function mapAuditRow(row: FinancialAuditEventRow) {
  return {
    id: row.id,
    occurredAt: row.occurred_at,
    actorUserId: row.actor_user_id,
    itemType: row.item_type,
    itemId: row.item_id,
    actionType: row.action_type,
    visibility: row.visibility,
    ownerUserId: row.owner_user_id,
    sharedBudgetId: row.shared_budget_id,
    subjectLabel: row.subject_label,
    subjectAmountCents: row.subject_amount_cents === null ? null : Number(row.subject_amount_cents),
    subjectDate: row.subject_date,
    subjectStatus: row.subject_status,
    summaryKey: row.summary_key
  };
}

export function clampAuditLimit(limit: number | undefined) {
  if (!limit || !Number.isFinite(limit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_LIMIT);
}

async function resolveActiveSharedBudgetId(supabase: AuditClient): Promise<string | null> {
  const result = await supabase
    .from<MembershipRow>("budget_members")
    .select("shared_budget_id")
    .eq("status", "active")
    .limit(1);
  return result.error ? null : (result.data?.[0]?.shared_budget_id ?? null);
}

function client(): AuditClient {
  return getSupabaseClient() as AuditClient;
}

function failure(reason: "blocked" | "temporary_failure"): AuditServiceResult {
  return {
    ok: false,
    reason,
    message: reason === "blocked" ? AUDIT_MESSAGES.blocked : AUDIT_MESSAGES.error
  };
}
