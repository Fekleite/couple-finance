import type {
  AuthorizedDashboardResponse,
  DashboardIndicatorSet,
  DashboardRecentTransaction
} from "@/features/dashboard";
import { parseCivilMonth } from "@/features/transactions/transaction-month";

export function dashboardPeriod(month = "2026-06") {
  const period = parseCivilMonth(month);
  if (!period) throw new Error("invalid test month");
  return period;
}

export function dashboardIndicators(
  overrides: Partial<DashboardIndicatorSet> = {}
): DashboardIndicatorSet {
  return {
    incomeCents: 500000,
    expenseCents: 320000,
    balanceCents: 180000,
    resultMeaning: "positive",
    hasAuthorizedMonthData: true,
    ...overrides
  };
}

export function dashboardRecentTransaction(
  overrides: Partial<DashboardRecentTransaction> = {}
): DashboardRecentTransaction {
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

export function dashboardResponse(
  overrides: Partial<AuthorizedDashboardResponse> = {}
): AuthorizedDashboardResponse {
  const period = overrides.period ?? dashboardPeriod();
  return {
    period,
    indicators: dashboardIndicators(),
    recentTransactions: [dashboardRecentTransaction()],
    generatedAt: "2026-06-05T12:00:00Z",
    ...overrides
  };
}
