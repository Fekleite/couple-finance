import type { TransactionListItemData, TransactionSortState } from "./transaction-list-types";

export const DEFAULT_TRANSACTION_SORT: TransactionSortState = {
  column: "transactionDate",
  direction: "desc"
};

export function nextTransactionSortState(
  current: TransactionSortState,
  column: NonNullable<TransactionSortState["column"]>
): TransactionSortState {
  if (current.column !== column) return { column, direction: "desc" };
  if (current.direction === "desc") return { column, direction: "asc" };
  return DEFAULT_TRANSACTION_SORT;
}

export function sortTransactions(
  items: TransactionListItemData[],
  sort: TransactionSortState
): TransactionListItemData[] {
  if (!sort.column || !sort.direction) return [...items];

  return [...items].sort((left, right) => {
    const result =
      sort.column === "amountCents"
        ? left.amountCents - right.amountCents
        : compareDate(left.transactionDate, right.transactionDate) ||
          compareDate(left.createdAt, right.createdAt);
    const directed = sort.direction === "asc" ? result : -result;
    return directed || left.id.localeCompare(right.id);
  });
}

function compareDate(left: string, right: string): number {
  return left.localeCompare(right);
}
