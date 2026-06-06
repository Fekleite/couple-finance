import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

  return (
    <article
      className="grid min-w-0 gap-4 rounded-md border bg-card p-4 text-card-foreground"
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
      <ChartContainer config={monthlyEvolutionChartConfig} className="min-h-[260px] w-full">
        <BarChart accessibilityLayer data={points} margin={{ left: 4, right: 12, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="monthLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
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
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="incomeCents" fill="var(--color-incomeCents)" radius={4} />
          <Bar dataKey="expenseCents" fill="var(--color-expenseCents)" radius={4} />
        </BarChart>
      </ChartContainer>
      <ChartContainer config={monthlyEvolutionChartConfig} className="min-h-[120px] w-full">
        <LineChart accessibilityLayer data={points} margin={{ left: 4, right: 12, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="monthLabel" hide />
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
          <Line
            dataKey="balanceCents"
            type="monotone"
            stroke="var(--color-balanceCents)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartContainer>
      <ul className="grid gap-3">
        {points.map((point) => (
          <li
            key={point.monthKey}
            className="grid gap-2 rounded-md border border-border/70 p-3"
            aria-current={point.isSelectedMonth ? "date" : undefined}
          >
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="min-w-0 break-words text-sm font-semibold">
                {point.monthLabel}
                {point.isSelectedMonth ? `, ${DASHBOARD_CHART_MESSAGES.evolutionSelected}` : ""}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {point.hasAuthorizedMonthData
                  ? chartResultMeaningMessage(point.resultMeaning)
                  : DASHBOARD_CHART_MESSAGES.evolutionEmpty}
              </span>
            </div>
            <div className="grid gap-2 text-xs">
              <p>
                {DASHBOARD_CHART_MESSAGES.incomeLabel}: {formatCurrencyFromCents(point.incomeCents)}
              </p>
              <p>
                {DASHBOARD_CHART_MESSAGES.expenseLabel}:{" "}
                {formatCurrencyFromCents(point.expenseCents)}
              </p>
              <p className="text-muted-foreground">
                {DASHBOARD_CHART_MESSAGES.balanceLabel}:{" "}
                {formatCurrencyFromCents(point.balanceCents)}
              </p>
            </div>
          </li>
        ))}
      </ul>
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
