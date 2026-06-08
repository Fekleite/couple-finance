import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { CategoryExpenseChart } from "./category-expense-chart";
import { DASHBOARD_CHART_MESSAGES } from "./dashboard-chart-messages";
import type { DashboardChartPeriod, DashboardChartsState } from "./dashboard-chart-types";
import { MemberComparisonChart } from "./member-comparison-chart";
import { MonthlyEvolutionChart } from "./monthly-evolution-chart";

type Props = {
  state: DashboardChartsState;
  selectedPeriod: DashboardChartPeriod;
  onRetry: () => void;
};

export function DashboardChartsSection({ state, selectedPeriod, onRetry }: Props) {
  const period = state.period ?? selectedPeriod;

  return (
    <section
      className="grid min-w-0 gap-3"
      aria-labelledby="dashboard-charts-title"
      aria-live="polite"
      aria-busy={state.status === "loading" || state.status === "refreshing"}
    >
      <div className="grid min-w-0 gap-1">
        <h3 id="dashboard-charts-title" className="text-lg font-semibold break-words">
          {DASHBOARD_CHART_MESSAGES.sectionTitle}
        </h3>
        <p className="text-sm break-words text-muted-foreground">
          {DASHBOARD_CHART_MESSAGES.sectionDescription}
        </p>
      </div>
      {state.status === "loading" || state.status === "refreshing" ? (
        <LoadingState
          title={DASHBOARD_CHART_MESSAGES.loadingTitle}
          message={
            state.status === "refreshing"
              ? DASHBOARD_CHART_MESSAGES.refreshing
              : DASHBOARD_CHART_MESSAGES.loading
          }
        />
      ) : null}
      {state.status === "error" ? (
        <ErrorState
          title={DASHBOARD_CHART_MESSAGES.errorTitle}
          message={state.message || DASHBOARD_CHART_MESSAGES.error}
          actionLabel={DASHBOARD_CHART_MESSAGES.retry}
          onAction={onRetry}
        />
      ) : null}
      {state.status === "ready" ? (
        <div className="grid min-w-0 gap-3 lg:grid-cols-2">
          <MonthlyEvolutionChart
            periodLabel={period.label}
            window={state.evolutionWindow}
            points={state.monthlyEvolution}
          />
          <CategoryExpenseChart periodLabel={period.label} items={state.categoryDistribution} />
          <MemberComparisonChart periodLabel={period.label} comparison={state.memberComparison} />
        </div>
      ) : null}
    </section>
  );
}
