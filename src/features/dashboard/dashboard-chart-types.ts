import type { DashboardPeriod, DashboardResultMeaning } from "./dashboard-types";

export type DashboardChartPeriod = DashboardPeriod;

export type DashboardChartQueryInput = {
  monthStart: string;
  nextMonthStart: string;
  evolutionMonthCount: number;
};

export type ChartPresentationStatus =
  | "loading"
  | "refreshing"
  | "ready"
  | "empty"
  | "unavailable_shared"
  | "error";

export type DashboardChartId = "category" | "evolution" | "member_comparison";

export type ChartEvolutionWindow = {
  startMonth: string;
  endMonth: string;
  monthCount: number;
};

export type CategoryExpenseDistributionItem = {
  categoryCode: string;
  categoryLabel: string;
  expenseCents: number;
  weightBasisPoints: number;
  rank: number;
};

export type MonthlyEvolutionPoint = {
  monthKey: string;
  monthLabel: string;
  isSelectedMonth: boolean;
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  resultMeaning: DashboardResultMeaning;
  hasAuthorizedMonthData: boolean;
};

export type MemberComparisonItem = {
  memberKey: "self" | "partner";
  memberLabel: "Voce" | "Pessoa parceira";
  expenseCents: number;
  weightBasisPoints: number;
};

export type MemberResponsibilityComparison = {
  status: "ready" | "empty" | "unavailable_shared";
  basis: "responsible_user";
  members: MemberComparisonItem[];
  summary: string;
};

export type AccessibleChartSummary = {
  chartId: DashboardChartId;
  periodLabel: string;
  headline: string;
  details: string[];
  privacyNote?: string;
};

export type AuthorizedDashboardChartsResponse = {
  period: DashboardChartPeriod;
  evolutionWindow: ChartEvolutionWindow;
  categoryDistribution: CategoryExpenseDistributionItem[];
  monthlyEvolution: MonthlyEvolutionPoint[];
  memberComparison: MemberResponsibilityComparison;
  summaries: AccessibleChartSummary[];
  generatedAt: string;
};

export type DashboardChartFailureReason = "invalid_query" | "temporary_failure";

export type DashboardChartServiceResult =
  | { ok: true; data: AuthorizedDashboardChartsResponse }
  | { ok: false; reason: DashboardChartFailureReason; message: string };

export type DashboardChartsState =
  | { status: "loading"; period: DashboardChartPeriod }
  | { status: "refreshing"; period: DashboardChartPeriod }
  | ({ status: "ready"; period: DashboardChartPeriod } & AuthorizedDashboardChartsResponse)
  | { status: "error"; period: DashboardChartPeriod; message: string };
