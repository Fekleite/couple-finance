import type {
  TransactionActionAvailability,
  TransactionListItemData
} from "@/features/transactions/transaction-list-types";
import { transactionListItem } from "@/test/transaction-list-test-utils";

export function transactionTableRows(): TransactionListItemData[] {
  return [
    transactionListItem({
      id: "00000000-0000-4000-8000-000000000101",
      title: "Mercado semanal",
      amountCents: 24590,
      transactionType: "expense",
      transactionDate: "2026-06-14",
      categoryCode: "food",
      categoryLabel: "Alimentacao",
      visibility: "shared",
      responsibleLabel: "Voce",
      creatorLabel: "Pessoa parceira",
      createdByUserId: "00000000-0000-4000-8000-000000000002",
      responsibleUserId: "00000000-0000-4000-8000-000000000001"
    }),
    transactionListItem({
      id: "00000000-0000-4000-8000-000000000102",
      title: "Salario",
      amountCents: 850000,
      transactionType: "income",
      transactionDate: "2026-06-05",
      categoryCode: "income",
      categoryLabel: "Renda",
      visibility: "individual",
      responsibleLabel: "Pessoa parceira",
      creatorLabel: "Pessoa parceira",
      createdByUserId: "00000000-0000-4000-8000-000000000002",
      responsibleUserId: "00000000-0000-4000-8000-000000000002"
    })
  ];
}

export function transactionActionAvailability(
  overrides: Partial<TransactionActionAvailability> = {}
): TransactionActionAvailability {
  return { canEdit: true, canDelete: true, ...overrides };
}
