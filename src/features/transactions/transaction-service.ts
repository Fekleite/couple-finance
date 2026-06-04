import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import { TRANSACTION_MESSAGES } from "./transaction-messages";
import type {
  AuthorizedTransactionSummary,
  FinancialTransactionRow,
  TransactionServiceFailureReason,
  TransactionServiceResult,
  TransactionSubmission
} from "./transaction-types";
import type { ResponsibleOption } from "./transaction-types";

type RpcResult = {
  data: FinancialTransactionRow | FinancialTransactionRow[] | null;
  error: { message?: string } | null;
};
type TransactionClient = SupabaseClient & {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<RpcResult>;
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string
      ) => {
        eq: (
          column: string,
          value: string
        ) => Promise<{
          data: { user_id: string }[] | null;
          error: { message?: string } | null;
        }>;
      };
    };
  };
};

export async function createFinancialTransaction(
  submission: TransactionSubmission
): Promise<TransactionServiceResult> {
  try {
    const { data, error } = await client().rpc("create_financial_transaction", {
      title_input: submission.title,
      amount_cents_input: submission.amountCents,
      transaction_type_input: submission.transactionType,
      transaction_date_input: submission.transactionDate,
      category_code_input: submission.categoryCode,
      visibility_input: submission.visibility,
      shared_budget_id_input: submission.sharedBudgetId,
      responsible_user_id_input: submission.responsibleUserId,
      observation_input: submission.observation,
      idempotency_key_input: submission.idempotencyKey
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row) return failureFromMessage(error?.message);
    return { ok: true, data: mapAuthorizedSummary(row) };
  } catch {
    return failure("temporary_failure");
  }
}

export async function listResponsibleOptions(
  currentUserId: string,
  sharedBudgetId: string
): Promise<ResponsibleOption[] | null> {
  try {
    const { data, error } = await client()
      .from("budget_members")
      .select("user_id")
      .eq("shared_budget_id", sharedBudgetId)
      .eq("status", "active");
    if (error) return null;
    return (data ?? []).map(({ user_id }) => ({
      userId: user_id,
      label: user_id === currentUserId ? "Voce" : "Pessoa parceira"
    }));
  } catch {
    return null;
  }
}

export function mapAuthorizedSummary(row: FinancialTransactionRow): AuthorizedTransactionSummary {
  return {
    id: row.id,
    title: row.title,
    amountCents: Number(row.amount_cents),
    transactionType: row.transaction_type,
    transactionDate: row.transaction_date,
    categoryCode: row.category_code,
    createdByUserId: row.created_by_user_id,
    responsibleUserId: row.responsible_user_id,
    visibility: row.visibility,
    sharedBudgetId: row.shared_budget_id,
    observation: row.observation,
    createdAt: row.created_at
  };
}

function client(): TransactionClient {
  return getSupabaseClient() as TransactionClient;
}

function failureFromMessage(message = ""): TransactionServiceResult {
  const code = message.match(/transaction_([a-z_]+)/)?.[1];
  const reason: TransactionServiceFailureReason =
    code === "validation" ||
    code === "category_unavailable" ||
    code === "shared_context_unavailable" ||
    code === "responsible_unavailable" ||
    code === "submission_conflict"
      ? code
      : "temporary_failure";
  return failure(reason);
}

function failure(reason: TransactionServiceFailureReason): TransactionServiceResult {
  const messages = {
    validation: TRANSACTION_MESSAGES.validation,
    category_unavailable: TRANSACTION_MESSAGES.categoryUnavailable,
    shared_context_unavailable: TRANSACTION_MESSAGES.sharedContextUnavailable,
    responsible_unavailable: TRANSACTION_MESSAGES.responsibleUnavailable,
    submission_conflict: TRANSACTION_MESSAGES.conflict,
    temporary_failure: TRANSACTION_MESSAGES.temporaryFailure
  };
  return { ok: false, reason, message: messages[reason] };
}
