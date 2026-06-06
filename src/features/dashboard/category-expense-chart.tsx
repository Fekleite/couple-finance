import { EmptyState } from "@/components/feedback/empty-state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildCategorySummary } from "./accessible-chart-summary";
import { DASHBOARD_CHART_MESSAGES, formatBasisPoints } from "./dashboard-chart-messages";
import type { CategoryExpenseDistributionItem } from "./dashboard-chart-types";

type Props = {
  periodLabel: string;
  items: CategoryExpenseDistributionItem[];
};

export function CategoryExpenseChart({ periodLabel, items }: Props) {
  const summary = buildCategorySummary(periodLabel, items);
  const total = items.reduce((sum, item) => sum + item.expenseCents, 0);
  const chartData = items.map((item) => ({
    ...item,
    chartLabel: `${item.rank}. ${item.categoryLabel}`
  }));

  return (
    <article
      className="grid min-w-0 gap-4 rounded-md border bg-card p-4 text-card-foreground"
      aria-labelledby="category-expense-chart-title"
      aria-describedby="category-expense-chart-summary"
    >
      <header className="grid gap-1">
        <h3 id="category-expense-chart-title" className="text-base font-semibold">
          {DASHBOARD_CHART_MESSAGES.categoryTitle}
        </h3>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </header>
      <p id="category-expense-chart-summary" className="sr-only">
        {summary.headline} {summary.details.join(" ")} {summary.privacyNote}
      </p>
      {items.length ? (
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Total autorizado: {formatCurrencyFromCents(total)}
          </p>
          <ChartContainer config={categoryChartConfig} className="min-h-[220px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" dataKey="expenseCents" hide />
              <YAxis
                type="category"
                dataKey="chartLabel"
                tickLine={false}
                axisLine={false}
                width={112}
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
          <ol className="grid gap-3">
            {items.map((item) => (
              <li key={item.categoryCode} className="grid gap-1">
                <div className="flex min-w-0 items-start justify-between gap-3 text-sm">
                  <span className="min-w-0 break-words font-medium">
                    {item.rank}. {item.categoryLabel}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatCurrencyFromCents(item.expenseCents)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-sm bg-muted" aria-hidden="true">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.max(item.weightBasisPoints / 100, 2)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatBasisPoints(item.weightBasisPoints)} do total de despesas autorizadas.
                </p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <EmptyState
          title={DASHBOARD_CHART_MESSAGES.categoryEmptyTitle}
          message={DASHBOARD_CHART_MESSAGES.categoryEmpty}
        />
      )}
    </article>
  );
}

const categoryChartConfig = {
  expenseCents: {
    label: "Despesas",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;
