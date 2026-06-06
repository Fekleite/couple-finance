import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { Bar, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { buildMonthlyEvolutionSummary } from "./accessible-chart-summary";
import { chartResultMeaningMessage, DASHBOARD_CHART_MESSAGES } from "./dashboard-chart-messages";
import type { ChartEvolutionWindow, MonthlyEvolutionPoint } from "./dashboard-chart-types";

type Props = {
  periodLabel: string;
  window: ChartEvolutionWindow;
  points: MonthlyEvolutionPoint[];
};

export function MonthlyEvolutionChart({ periodLabel, window, points }: Props) {
  const summary = buildMonthlyEvolutionSummary(window.startMonth, periodLabel, points);
  const selectedPoint = points.find((point) => point.isSelectedMonth) ?? points[points.length - 1];

  return (
    <article
      className="grid min-w-0 gap-3 rounded-md border bg-card p-3 text-card-foreground"
      aria-labelledby="monthly-evolution-chart-title"
      aria-describedby="monthly-evolution-chart-summary"
    >
      <header className="grid gap-1">
        <h3 id="monthly-evolution-chart-title" className="text-base font-semibold">
          {DASHBOARD_CHART_MESSAGES.evolutionTitle}
        </h3>
        <p className="text-sm text-muted-foreground">
          {window.startMonth} a {periodLabel}
        </p>
      </header>
      <p id="monthly-evolution-chart-summary" className="sr-only">
        {summary.headline} {summary.details.join(" ")}
      </p>
      <ChartContainer
        config={monthlyEvolutionChartConfig}
        className="h-40 min-h-0 w-full aspect-auto"
      >
        <ComposedChart
          accessibilityLayer
          data={points}
          margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
        >
          <XAxis
            dataKey="monthLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickFormatter={(value) => String(value).slice(0, 3)}
          />
          <YAxis hide />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  typeof value === "number" ? formatCurrencyFromCents(value) : String(value)
                }
              />
            }
          />
          <Bar dataKey="incomeCents" fill="var(--color-incomeCents)" radius={3} />
          <Bar dataKey="expenseCents" fill="var(--color-expenseCents)" radius={3} />
          <Line
            dataKey="balanceCents"
            type="monotone"
            stroke="var(--color-balanceCents)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
      {selectedPoint ? (
        <div
          className="grid gap-2 rounded-md border border-border/70 p-3 text-sm"
          aria-current={selectedPoint.isSelectedMonth ? "date" : undefined}
        >
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="min-w-0 break-words font-semibold">
              {selectedPoint.monthLabel}
              {selectedPoint.isSelectedMonth
                ? `, ${DASHBOARD_CHART_MESSAGES.evolutionSelected}`
                : ""}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {selectedPoint.hasAuthorizedMonthData
                ? chartResultMeaningMessage(selectedPoint.resultMeaning)
                : DASHBOARD_CHART_MESSAGES.evolutionEmpty}
            </span>
          </div>
          <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
            <p>
              {DASHBOARD_CHART_MESSAGES.incomeLabel}:{" "}
              {formatCurrencyFromCents(selectedPoint.incomeCents)}
            </p>
            <p>
              {DASHBOARD_CHART_MESSAGES.expenseLabel}:{" "}
              {formatCurrencyFromCents(selectedPoint.expenseCents)}
            </p>
            <p>
              {DASHBOARD_CHART_MESSAGES.balanceLabel}:{" "}
              {formatCurrencyFromCents(selectedPoint.balanceCents)}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}

const monthlyEvolutionChartConfig = {
  incomeCents: {
    label: "Receitas",
    color: "var(--chart-2)"
  },
  expenseCents: {
    label: "Despesas",
    color: "var(--chart-5)"
  },
  balanceCents: {
    label: "Saldo",
    color: "var(--chart-3)"
  }
} satisfies ChartConfig;
