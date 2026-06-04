import type { StandardFinancialCategory } from "@/features/categories";

export type TransactionType = "income" | "expense";
export type TransactionVisibility = "individual" | "shared";

export type FinancialTransactionRow = {
  id: string;
  title: string;
  amount_cents: number;
  transaction_type: TransactionType;
  transaction_date: string;
  category_code: string;
  created_by_user_id: string;
  responsible_user_id: string;
  visibility: TransactionVisibility;
  shared_budget_id: string | null;
  observation: string | null;
  created_at: string;
};

export type TransactionSubmission = {
  title: string;
  amountCents: number;
  transactionType: TransactionType;
  transactionDate: string;
  categoryCode: string;
  responsibleUserId: string | null;
  visibility: TransactionVisibility;
  sharedBudgetId: string | null;
  observation: string | null;
  idempotencyKey: string;
};

export type AuthorizedTransactionSummary = Omit<TransactionSubmission, "idempotencyKey"> & {
  id: string;
  createdByUserId: string;
  createdAt: string;
};

export type ResponsibleOption = {
  userId: string;
  label: "Voce" | "Pessoa parceira";
};

export type TransactionFormContext = {
  currentUserId: string;
  categories: StandardFinancialCategory[];
  sharedBudgetId: string | null;
  responsibleOptions: ResponsibleOption[];
};

export type TransactionServiceFailureReason =
  | "validation"
  | "category_unavailable"
  | "shared_context_unavailable"
  | "responsible_unavailable"
  | "submission_conflict"
  | "temporary_failure";

export type TransactionServiceResult =
  | { ok: true; data: AuthorizedTransactionSummary }
  | { ok: false; reason: TransactionServiceFailureReason; message: string };

export type TransactionFormState =
  | { status: "loading_context" }
  | { status: "ready" }
  | { status: "submitting"; message: string }
  | { status: "recoverable_error"; message: string }
  | { status: "blocked"; message: string }
  | { status: "success"; summary: AuthorizedTransactionSummary };

export type TransactionFormValues = {
  title: string;
  amount: string;
  transactionType: TransactionType | "";
  transactionDate: string;
  categoryCode: string;
  visibility: TransactionVisibility;
  responsibleUserId: string;
  observation: string;
};
