import { moveCivilMonth, parseCivilMonth } from "@/features/transactions/transaction-month";
import { civilMonthFromStartDate } from "./dashboard-state";
import type {
  AuthorizedDashboardChartsResponse,
  DashboardChartPeriod,
  DashboardChartQueryInput,
  DashboardChartServiceResult,
  DashboardChartsState
} from "./dashboard-chart-types";

export const CHART_EVOLUTION_MONTH_COUNT = 6;

export function toDashboardChartQuery(period: DashboardChartPeriod): DashboardChartQueryInput {
  return {
    monthStart: period.startDate,
    nextMonthStart: period.nextStartDate,
    evolutionMonthCount: CHART_EVOLUTION_MONTH_COUNT
  };
}

export function chartEvolutionWindowFor(period: DashboardChartPeriod) {
  return {
    startMonth: moveCivilMonth(period, -(CHART_EVOLUTION_MONTH_COUNT - 1)).key,
    endMonth: period.key,
    monthCount: CHART_EVOLUTION_MONTH_COUNT
  };
}

export function chartPeriodFromStartDate(startDate: string): DashboardChartPeriod {
  return civilMonthFromStartDate(startDate);
}

export function startDashboardChartsLoad(
  previous: DashboardChartsState | null,
  period: DashboardChartPeriod,
  contextChanged = false
): DashboardChartsState {
  if (contextChanged || !previous || previous.status === "loading" || previous.status === "error") {
    return { status: "loading", period };
  }
  return { status: "refreshing", period };
}

export function dashboardChartsStateFromResult(
  period: DashboardChartPeriod,
  result: DashboardChartServiceResult
): DashboardChartsState {
  if (!result.ok) return { status: "error", period, message: result.message };
  return { ...sanitizeDashboardChartsResponse(result.data), status: "ready" };
}

export function sanitizeDashboardChartsResponse(
  data: AuthorizedDashboardChartsResponse
): AuthorizedDashboardChartsResponse {
  const normalizedPeriod = parseCivilMonth(data.period.key) ?? data.period;
  return {
    ...data,
    period: normalizedPeriod,
    categoryDistribution: data.categoryDistribution.filter((item) => item.expenseCents > 0),
    monthlyEvolution: data.monthlyEvolution.map((item) =>
      item.hasAuthorizedMonthData
        ? item
        : {
            ...item,
            incomeCents: 0,
            expenseCents: 0,
            balanceCents: 0,
            resultMeaning: "zero"
          }
    ),
    memberComparison:
      data.memberComparison.status === "unavailable_shared"
        ? { ...data.memberComparison, members: [] }
        : data.memberComparison
  };
}
