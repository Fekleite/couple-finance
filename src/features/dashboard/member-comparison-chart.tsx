import { EmptyState } from "@/components/feedback/empty-state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
      className="grid min-w-0 gap-4 rounded-md border bg-card p-4 text-card-foreground"
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
        <div className="grid gap-3">
          <ChartContainer config={memberComparisonChartConfig} className="min-h-[180px] w-full">
            <BarChart
              accessibilityLayer
              data={comparison.members}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" dataKey="expenseCents" hide />
              <YAxis
                type="category"
                dataKey="memberLabel"
                tickLine={false}
                axisLine={false}
                width={104}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) =>
                      typeof value === "number" ? formatCurrencyFromCents(value) : String(value)
                    }
                  />
                }
              />
              <Bar dataKey="expenseCents" fill="var(--color-expenseCents)" radius={4} />
            </BarChart>
          </ChartContainer>
          <ul className="grid gap-3">
            {comparison.members.map((item) => (
              <li key={item.memberKey} className="grid gap-1">
                <div className="flex min-w-0 justify-between gap-3 text-sm">
                  <span className="font-medium">{item.memberLabel}</span>
                  <span className="font-semibold">
                    {formatCurrencyFromCents(item.expenseCents)}
                  </span>
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

const memberComparisonChartConfig = {
  expenseCents: {
    label: "Despesas compartilhadas",
    color: "var(--chart-3)"
  }
} satisfies ChartConfig;
