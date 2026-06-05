import type { CivilMonth } from "@/features/transactions/transaction-list-types";
import type {
  TransactionType,
  TransactionVisibility
} from "@/features/transactions/transaction-types";

export type DashboardResultMeaning = "positive" | "negative" | "zero";

export type DashboardPeriod = CivilMonth;

export type DashboardIndicatorSet = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  resultMeaning: DashboardResultMeaning;
  hasAuthorizedMonthData: boolean;
};

export type DashboardRecentTransaction = {
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

export type AuthorizedDashboardResponse = {
  period: DashboardPeriod;
  indicators: DashboardIndicatorSet;
  recentTransactions: DashboardRecentTransaction[];
  generatedAt: string;
};

export type DashboardQueryInput = {
  monthStart: string;
  nextMonthStart: string;
  recentLimit: number;
};

export type DashboardFailureReason = "invalid_query" | "temporary_failure";

export type DashboardServiceResult =
  | { ok: true; data: AuthorizedDashboardResponse }
  | { ok: false; reason: DashboardFailureReason; message: string };

export type DashboardState =
  | { status: "loading"; period: DashboardPeriod }
  | { status: "refreshing"; period: DashboardPeriod }
  | ({ status: "ready"; period: DashboardPeriod } & AuthorizedDashboardResponse)
  | ({ status: "empty_month"; period: DashboardPeriod } & AuthorizedDashboardResponse)
  | { status: "error"; period: DashboardPeriod; message: string };
