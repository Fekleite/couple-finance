import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import {
  chartResultMeaningMessage,
  DASHBOARD_CHART_MESSAGES,
  formatBasisPoints
} from "./dashboard-chart-messages";
import type {
  AccessibleChartSummary,
  AuthorizedDashboardChartsResponse,
  CategoryExpenseDistributionItem,
  MemberResponsibilityComparison,
  MonthlyEvolutionPoint
} from "./dashboard-chart-types";

export function buildAccessibleChartSummaries(
  data: AuthorizedDashboardChartsResponse
): AccessibleChartSummary[] {
  return [
    buildCategorySummary(data.period.label, data.categoryDistribution),
    buildMonthlyEvolutionSummary(
      data.evolutionWindow.startMonth,
      data.period.label,
      data.monthlyEvolution
    ),
    buildMemberComparisonSummary(data.period.label, data.memberComparison)
  ];
}

export function buildCategorySummary(
  periodLabel: string,
  items: CategoryExpenseDistributionItem[]
): AccessibleChartSummary {
  const total = items.reduce((sum, item) => sum + item.expenseCents, 0);
  const highest = items[0];
  return {
    chartId: "category",
    periodLabel,
    headline: highest
      ? `${DASHBOARD_CHART_MESSAGES.categoryHighestPrefix}: ${highest.categoryLabel}, ${formatCurrencyFromCents(highest.expenseCents)}.`
      : DASHBOARD_CHART_MESSAGES.categoryEmpty,
    details: highest
      ? items.map(
          (item) =>
            `${item.categoryLabel}: ${formatCurrencyFromCents(item.expenseCents)}, ${formatBasisPoints(item.weightBasisPoints)} do total.`
        )
      : [`Total de despesas autorizadas: ${formatCurrencyFromCents(total)}.`],
    privacyNote: DASHBOARD_CHART_MESSAGES.categoryPrivacy
  };
}

export function buildMonthlyEvolutionSummary(
  startMonth: string,
  periodLabel: string,
  points: MonthlyEvolutionPoint[]
): AccessibleChartSummary {
  const selected = points.find((point) => point.isSelectedMonth) ?? points[points.length - 1];
  return {
    chartId: "evolution",
    periodLabel: `${startMonth} a ${periodLabel}`,
    headline: selected
      ? `${periodLabel}: ${chartResultMeaningMessage(selected.resultMeaning)} de ${formatCurrencyFromCents(Math.abs(selected.balanceCents))}.`
      : "Sem meses para resumir.",
    details: points.map(
      (point) =>
        `${point.monthLabel}: receitas ${formatCurrencyFromCents(point.incomeCents)}, despesas ${formatCurrencyFromCents(point.expenseCents)}, ${chartResultMeaningMessage(point.resultMeaning)}.`
    )
  };
}

export function buildMemberComparisonSummary(
  periodLabel: string,
  comparison: MemberResponsibilityComparison
): AccessibleChartSummary {
  if (comparison.status === "unavailable_shared") {
    return {
      chartId: "member_comparison",
      periodLabel,
      headline: DASHBOARD_CHART_MESSAGES.memberUnavailable,
      details: [],
      privacyNote: DASHBOARD_CHART_MESSAGES.memberPrivacy
    };
  }
  if (comparison.status === "empty") {
    return {
      chartId: "member_comparison",
      periodLabel,
      headline: DASHBOARD_CHART_MESSAGES.memberEmpty,
      details: [DASHBOARD_CHART_MESSAGES.responsibleBasis],
      privacyNote: DASHBOARD_CHART_MESSAGES.memberPrivacy
    };
  }
  return {
    chartId: "member_comparison",
    periodLabel,
    headline: "Despesas compartilhadas autorizadas por responsavel.",
    details: comparison.members.map(
      (item) =>
        `${item.memberLabel}: ${formatCurrencyFromCents(item.expenseCents)}, ${formatBasisPoints(item.weightBasisPoints)} do total compartilhado.`
    ),
    privacyNote: `${DASHBOARD_CHART_MESSAGES.memberPrivacy} ${DASHBOARD_CHART_MESSAGES.creatorResponsibleNote}`
  };
}
