import type {
  AuthorizedTransactionQueryResult,
  TransactionFilterSet
} from "./transaction-list-types";

export type ActiveTransactionFilter = {
  key: Exclude<keyof TransactionFilterSet, "month">;
  label: string;
};

export function activeTransactionFilters(
  filters: TransactionFilterSet,
  options: Pick<AuthorizedTransactionQueryResult, "categoryOptions" | "responsibleOptions">
): ActiveTransactionFilter[] {
  const active: ActiveTransactionFilter[] = [];
  if (filters.categoryCode) {
    active.push({
      key: "categoryCode",
      label:
        options.categoryOptions.find((option) => option.code === filters.categoryCode)?.label ??
        "Categoria"
    });
  }
  if (filters.responsibleUserId) {
    active.push({
      key: "responsibleUserId",
      label:
        options.responsibleOptions.find((option) => option.userId === filters.responsibleUserId)
          ?.label ?? "Responsavel"
    });
  }
  if (filters.transactionType) {
    active.push({
      key: "transactionType",
      label: filters.transactionType === "income" ? "Receita" : "Despesa"
    });
  }
  if (filters.searchText) active.push({ key: "searchText", label: `Busca: ${filters.searchText}` });
  return active;
}
