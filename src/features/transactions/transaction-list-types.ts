import type { TransactionType, TransactionVisibility } from "./transaction-types";

export type CivilMonth = {
  key: string;
  startDate: string;
  nextStartDate: string;
  label: string;
};

export type TransactionFilterSet = {
  month: string;
  categoryCode: string | null;
  responsibleUserId: string | null;
  transactionType: TransactionType | null;
  searchText: string | null;
};

export type PaginationCursor = {
  transactionDate: string;
  createdAt: string;
  id: string;
};

export type TransactionListItemData = {
  id: string;
  title: string;
  amountCents: number;
  transactionType: TransactionType;
  transactionDate: string;
  createdAt: string;
  categoryCode: string;
  categoryLabel: string;
  createdByUserId: string;
  creatorLabel: "Voce" | "Pessoa parceira";
  responsibleUserId: string;
  responsibleLabel: "Voce" | "Pessoa parceira";
  visibility: TransactionVisibility;
};

export type CategoryFilterOption = {
  code: string;
  label: string;
  isActive: boolean;
};

export type ResponsibleFilterOption = {
  userId: string;
  label: "Voce" | "Pessoa parceira";
};

export type TransactionQueryInput = {
  monthStart: string;
  nextMonthStart: string;
  categoryCode: string | null;
  responsibleUserId: string | null;
  transactionType: TransactionType | null;
  searchText: string | null;
  cursor: PaginationCursor | null;
  pageSize: number;
};

export type AuthorizedTransactionQueryResult = {
  items: TransactionListItemData[];
  nextCursor: PaginationCursor | null;
  hasMore: boolean;
  hasAuthorizedMonthData: boolean;
  categoryOptions: CategoryFilterOption[];
  responsibleOptions: ResponsibleFilterOption[];
};

export type TransactionListServiceFailureReason = "invalid_query" | "temporary_failure";

export type TransactionListServiceResult =
  | { ok: true; data: AuthorizedTransactionQueryResult }
  | { ok: false; reason: TransactionListServiceFailureReason; message: string };

export type TransactionListState =
  | { status: "loading" }
  | ({ status: "ready" | "loading_more" } & AuthorizedTransactionQueryResult)
  | ({ status: "empty_month" } & AuthorizedTransactionQueryResult)
  | ({ status: "no_matches" } & AuthorizedTransactionQueryResult)
  | { status: "error"; message: string };
