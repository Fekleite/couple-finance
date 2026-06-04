import type {
  AuthorizedTransactionSummary,
  FinancialTransactionRow,
  TransactionSubmission
} from "@/features/transactions";

export const USER_ID = "00000000-0000-4000-8000-000000000001";
export const PARTNER_ID = "00000000-0000-4000-8000-000000000002";
export const BUDGET_ID = "00000000-0000-4000-8000-000000000003";
export const ATTEMPT_ID = "00000000-0000-4000-8000-000000000004";

export function transactionSubmission(
  overrides: Partial<TransactionSubmission> = {}
): TransactionSubmission {
  return {
    title: "Mercado",
    amountCents: 12345,
    transactionType: "expense",
    transactionDate: "2026-06-04",
    categoryCode: "food",
    responsibleUserId: USER_ID,
    visibility: "individual",
    sharedBudgetId: null,
    observation: null,
    idempotencyKey: ATTEMPT_ID,
    ...overrides
  };
}

export function transactionRow(
  overrides: Partial<FinancialTransactionRow> = {}
): FinancialTransactionRow {
  const submission = transactionSubmission();
  return {
    id: "00000000-0000-4000-8000-000000000005",
    title: submission.title,
    amount_cents: submission.amountCents,
    transaction_type: submission.transactionType,
    transaction_date: submission.transactionDate,
    category_code: submission.categoryCode,
    created_by_user_id: USER_ID,
    responsible_user_id: USER_ID,
    visibility: submission.visibility,
    shared_budget_id: null,
    observation: null,
    created_at: "2026-06-04T12:00:00Z",
    ...overrides
  };
}

export function transactionSummary(
  overrides: Partial<AuthorizedTransactionSummary> = {}
): AuthorizedTransactionSummary {
  const row = transactionRow();
  return {
    id: row.id,
    title: row.title,
    amountCents: row.amount_cents,
    transactionType: row.transaction_type,
    transactionDate: row.transaction_date,
    categoryCode: row.category_code,
    createdByUserId: row.created_by_user_id,
    responsibleUserId: row.responsible_user_id,
    visibility: row.visibility,
    sharedBudgetId: row.shared_budget_id,
    observation: row.observation,
    createdAt: row.created_at,
    ...overrides
  };
}
