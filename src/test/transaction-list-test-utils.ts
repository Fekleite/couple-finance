import type {
  AuthorizedTransactionQueryResult,
  TransactionListItemData
} from "@/features/transactions/transaction-list-types";

export function transactionListItem(
  overrides: Partial<TransactionListItemData> = {}
): TransactionListItemData {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Mercado",
    amountCents: 12345,
    transactionType: "expense",
    transactionDate: "2026-06-04",
    createdAt: "2026-06-04T12:00:00Z",
    categoryCode: "food",
    categoryLabel: "Alimentacao",
    createdByUserId: "00000000-0000-4000-8000-000000000001",
    creatorLabel: "Voce",
    responsibleUserId: "00000000-0000-4000-8000-000000000001",
    responsibleLabel: "Voce",
    visibility: "individual",
    ...overrides
  };
}

export function transactionQueryResult(
  overrides: Partial<AuthorizedTransactionQueryResult> = {}
): AuthorizedTransactionQueryResult {
  return {
    items: [transactionListItem()],
    nextCursor: null,
    hasMore: false,
    hasAuthorizedMonthData: true,
    categoryOptions: [{ code: "food", label: "Alimentacao", isActive: true }],
    responsibleOptions: [{ userId: "00000000-0000-4000-8000-000000000001", label: "Voce" }],
    ...overrides
  };
}
