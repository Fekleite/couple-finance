import type { TransactionListItemData } from "./transaction-list-types";

export function transactionTypeLabel(type: TransactionListItemData["transactionType"]) {
  return type === "income" ? "Receita" : "Despesa";
}

export function visibilityLabel(item: TransactionListItemData) {
  const visibility = item.visibility === "individual" ? "Individual" : "Compartilhada";
  const showCreator =
    item.visibility === "shared" && item.createdByUserId !== item.responsibleUserId;
  return showCreator ? `${visibility}; Criador: ${item.creatorLabel}` : visibility;
}
