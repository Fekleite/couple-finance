import { currentCivilMonth, parseCivilMonth } from "@/features/transactions/transaction-month";
import type {
  AuthorizedDashboardResponse,
  DashboardIndicatorSet,
  DashboardPeriod,
  DashboardServiceResult,
  DashboardState
} from "./dashboard-types";

export const RECENT_DASHBOARD_LIMIT = 5;

export function civilMonthFromStartDate(startDate: string): DashboardPeriod {
  const month = parseCivilMonth(startDate.slice(0, 7));
  if (!month) throw new Error("invalid_dashboard_period");
  return month;
}

export function toDashboardQuery(period: DashboardPeriod) {
  return {
    monthStart: period.startDate,
    nextMonthStart: period.nextStartDate,
    recentLimit: RECENT_DASHBOARD_LIMIT
  };
}

export function normalizeDashboardMonth(value: string | null | undefined): DashboardPeriod {
  return parseCivilMonth(value) ?? currentCivilMonth();
}

export function startDashboardLoad(
  previous: DashboardState | null,
  period: DashboardPeriod,
  contextChanged = false
): DashboardState {
  if (contextChanged || !previous || previous.status === "loading" || previous.status === "error") {
    return { status: "loading", period };
  }
  return { status: "refreshing", period };
}

export function dashboardStateFromResult(
  period: DashboardPeriod,
  result: DashboardServiceResult
): DashboardState {
  if (!result.ok) return { status: "error", period, message: result.message };
  const data = sanitizeDashboardResponse(result.data);
  return data.indicators.hasAuthorizedMonthData
    ? { ...data, status: "ready", period: data.period }
    : { ...data, status: "empty_month", period: data.period };
}

export function sanitizeDashboardResponse(
  data: AuthorizedDashboardResponse
): AuthorizedDashboardResponse {
  if (data.indicators.hasAuthorizedMonthData) return data;
  return {
    ...data,
    indicators: zeroIndicators(data.indicators),
    recentTransactions: []
  };
}

function zeroIndicators(indicators: DashboardIndicatorSet): DashboardIndicatorSet {
  return {
    ...indicators,
    incomeCents: 0,
    expenseCents: 0,
    balanceCents: 0,
    resultMeaning: "zero",
    hasAuthorizedMonthData: false
  };
}
