import { EmptyState } from "@/components/feedback/empty-state";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { buildMemberComparisonSummary } from "./accessible-chart-summary";
import { DASHBOARD_CHART_MESSAGES, formatBasisPoints } from "./dashboard-chart-messages";
import type { MemberResponsibilityComparison } from "./dashboard-chart-types";

type Props = {
  periodLabel: string;
  comparison: MemberResponsibilityComparison;
};

export function MemberComparisonChart({ periodLabel, comparison }: Props) {
  const summary = buildMemberComparisonSummary(periodLabel, comparison);

  return (
    <article
      className="grid min-w-0 gap-3 rounded-md border bg-card p-3 text-card-foreground"
      aria-labelledby="member-comparison-chart-title"
      aria-describedby="member-comparison-chart-summary"
    >
      <header className="grid gap-1">
        <h3 id="member-comparison-chart-title" className="text-base font-semibold">
          {DASHBOARD_CHART_MESSAGES.memberTitle}
        </h3>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </header>
      <p id="member-comparison-chart-summary" className="sr-only">
        {summary.headline} {summary.details.join(" ")} {summary.privacyNote}
      </p>
      {comparison.status === "unavailable_shared" ? (
        <EmptyState
          title={DASHBOARD_CHART_MESSAGES.memberUnavailableTitle}
          message={DASHBOARD_CHART_MESSAGES.memberUnavailable}
        />
      ) : null}
      {comparison.status === "empty" ? (
        <EmptyState
          title={DASHBOARD_CHART_MESSAGES.memberEmptyTitle}
          message={DASHBOARD_CHART_MESSAGES.memberEmpty}
        />
      ) : null}
      {comparison.status === "ready" ? (
        <div className="grid gap-2">
          <ul className="grid gap-2">
            {comparison.members.map((item) => (
              <li
                key={item.memberKey}
                className="grid gap-1 rounded-md border border-border/70 p-3"
              >
                <div className="flex min-w-0 justify-between gap-3 text-sm">
                  <span className="font-medium">{item.memberLabel}</span>
                  <span className="font-semibold">
                    {formatCurrencyFromCents(item.expenseCents)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-sm bg-muted" aria-hidden="true">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.max(item.weightBasisPoints / 100, 2)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatBasisPoints(item.weightBasisPoints)} do total compartilhado.
                </p>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-5 text-muted-foreground">
            {DASHBOARD_CHART_MESSAGES.responsibleBasis}{" "}
            {DASHBOARD_CHART_MESSAGES.creatorResponsibleNote}
          </p>
        </div>
      ) : null}
      <p className="text-xs leading-5 text-muted-foreground">
        {DASHBOARD_CHART_MESSAGES.memberPrivacy}
      </p>
    </article>
  );
}
