import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import { goalFailureMessage, GOAL_MESSAGES } from "./goal-messages";
import type {
  AuthorizedGoal,
  FinancialGoalRow,
  GoalListResult,
  GoalMutation,
  GoalQuery,
  GoalServiceFailureReason,
  GoalServiceResult,
  GoalUpdateMutation
} from "./goal-types";

type QueryResult<T> = { data: T | null; error: { message?: string; code?: string } | null };
type QueryListResult<T> = { data: T[] | null; error: { message?: string; code?: string } | null };
type QueryBuilder<T> = {
  select: (columns?: string) => QueryBuilder<T>;
  eq: (column: string, value: string | number | boolean) => QueryBuilder<T>;
  in: (column: string, values: string[]) => QueryBuilder<T>;
  order: (
    column: string,
    options?: { ascending?: boolean; nullsFirst?: boolean }
  ) => QueryBuilder<T>;
  limit: (count: number) => Promise<QueryListResult<T>>;
  maybeSingle: () => Promise<QueryResult<T>>;
};

type GoalSupabaseClient = SupabaseClient & {
  from: <T = unknown>(table: string) => QueryBuilder<T>;
  rpc: <T = unknown>(fn: string, args?: Record<string, unknown>) => Promise<QueryResult<T>>;
};

type MembershipRow = { shared_budget_id: string };

export async function listGoals(query: GoalQuery = {}): Promise<GoalServiceResult<GoalListResult>> {
  try {
    const supabase = client();
    const activeSharedBudgetId = await resolveActiveSharedBudgetId(supabase);
    const builder = supabase
      .from<FinancialGoalRow>("financial_goals")
      .select("*")
      .order("deadline_date", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: false });
    const byStatus =
      query.status && query.status !== "all" ? builder.eq("status", query.status) : builder;
    const byVisibility =
      query.visibility && query.visibility !== "all"
        ? byStatus.eq("visibility", query.visibility)
        : byStatus;
    const result = await byVisibility.limit(query.limit ?? 100);
    if (result.error) return failure("temporary_failure");
    return {
      ok: true,
      data: {
        items: (result.data ?? []).map(mapGoalRow),
        hasActiveSharedBudget: Boolean(activeSharedBudgetId),
        activeSharedBudgetId,
        generatedAt: new Date().toISOString()
      }
    };
  } catch {
    return failure("temporary_failure");
  }
}

export async function createGoal(input: GoalMutation): Promise<GoalServiceResult<AuthorizedGoal>> {
  const fn = input.visibility === "shared" ? "create_shared_goal" : "create_individual_goal";
  return mutateGoal(
    fn,
    {
      name_input: input.name,
      target_amount_cents_input: input.targetAmountCents,
      current_amount_cents_input: input.currentAmountCents,
      deadline_date_input: input.deadlineDate,
      shared_budget_id_input: input.sharedBudgetId
    },
    GOAL_MESSAGES.createSuccess
  );
}

export async function updateGoal(
  goalId: string,
  input: GoalUpdateMutation
): Promise<GoalServiceResult<AuthorizedGoal>> {
  return mutateGoal(
    "update_goal",
    {
      goal_id_input: goalId,
      name_input: input.name,
      target_amount_cents_input: input.targetAmountCents,
      current_amount_cents_input: input.currentAmountCents,
      deadline_date_input: input.deadlineDate
    },
    GOAL_MESSAGES.updateSuccess
  );
}

export async function completeGoal(goalId: string): Promise<GoalServiceResult<AuthorizedGoal>> {
  return mutateGoal("complete_goal", { goal_id_input: goalId }, GOAL_MESSAGES.completeSuccess);
}

export async function archiveGoal(goalId: string): Promise<GoalServiceResult<AuthorizedGoal>> {
  return mutateGoal("archive_goal", { goal_id_input: goalId }, GOAL_MESSAGES.archiveSuccess);
}

export function mapGoalRow(row: FinancialGoalRow): AuthorizedGoal {
  return {
    id: row.id,
    name: row.name,
    targetAmountCents: Number(row.target_amount_cents),
    currentAmountCents: Number(row.current_amount_cents),
    deadlineDate: row.deadline_date,
    visibility: row.visibility,
    status: row.status,
    createdByUserId: row.created_by_user_id,
    sharedBudgetId: row.shared_budget_id,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function mutateGoal(
  fn: string,
  args: Record<string, unknown>,
  message: string
): Promise<GoalServiceResult<AuthorizedGoal>> {
  try {
    const { data, error } = await client().rpc<FinancialGoalRow>(fn, args);
    if (error || !data) return failureFromMessage(error?.message);
    return { ok: true, data: mapGoalRow(data), message };
  } catch {
    return failure("temporary_failure");
  }
}

async function resolveActiveSharedBudgetId(supabase: GoalSupabaseClient): Promise<string | null> {
  const result = await supabase
    .from<MembershipRow>("budget_members")
    .select("shared_budget_id")
    .eq("status", "active")
    .limit(1);
  return result.error ? null : (result.data?.[0]?.shared_budget_id ?? null);
}

function client(): GoalSupabaseClient {
  return getSupabaseClient() as GoalSupabaseClient;
}

function failureFromMessage(message = ""): GoalServiceResult<AuthorizedGoal> {
  const code = message.match(/goal_([a-z_]+)/)?.[1];
  const reason: GoalServiceFailureReason =
    code === "validation" || code === "unavailable" || code === "shared_context_unavailable"
      ? code === "unavailable"
        ? "goal_unavailable"
        : code
      : "temporary_failure";
  return failure(reason);
}

function failure<T = never>(reason: GoalServiceFailureReason): GoalServiceResult<T> {
  return { ok: false, reason, message: goalFailureMessage(reason) };
}
