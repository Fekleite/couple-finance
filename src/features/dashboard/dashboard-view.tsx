import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { moveCivilMonth } from "@/features/transactions/transaction-month";
import { DashboardIndicatorCard } from "./dashboard-indicator-card";
import { DASHBOARD_MESSAGES as messages, resultMeaningMessage } from "./dashboard-messages";
import { DashboardRecentTransactionItem } from "./dashboard-recent-transaction";
import { formatSignedCurrency } from "./dashboard-summary";
import type { DashboardPeriod, DashboardState } from "./dashboard-types";

type Props = {
  state: DashboardState;
  selectedPeriod: DashboardPeriod;
  onMonthChange: (period: DashboardPeriod) => void;
  onRetry: () => void;
};

export function DashboardView({ state, selectedPeriod, onMonthChange, onRetry }: Props) {
  const period = state.period ?? selectedPeriod;

  if (state.status === "loading" || state.status === "refreshing") {
    return (
      <section className="grid gap-5" aria-labelledby="dashboard-title">
        <DashboardHeader period={period} onMonthChange={onMonthChange} busy />
        <LoadingState title={messages.loadingTitle} message={messages.loading} />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="grid gap-5" aria-labelledby="dashboard-title">
        <DashboardHeader period={period} onMonthChange={onMonthChange} />
        <ErrorState
          title={messages.errorTitle}
          message={state.message || messages.error}
          actionLabel={messages.retry}
          onAction={onRetry}
        />
      </section>
    );
  }

  const indicators = state.indicators;
  const recentTransactions = state.recentTransactions;
  const resultTone =
    indicators.resultMeaning === "positive"
      ? "positive"
      : indicators.resultMeaning === "negative"
        ? "negative"
        : "neutral";

  return (
    <section className="grid min-w-0 gap-5" aria-labelledby="dashboard-title" aria-busy={false}>
      <DashboardHeader period={period} onMonthChange={onMonthChange} />
      <p className="sr-only" role="status" aria-live="polite">
        {messages.updated}
      </p>
      {state.status === "empty_month" ? (
        <EmptyState title={messages.emptyTitle} message={messages.empty} />
      ) : null}
      <section className="grid min-w-0 gap-3" aria-label={messages.summaryRegion}>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardIndicatorCard
            label={messages.incomeLabel}
            value={formatCurrencyFromCents(indicators.incomeCents)}
            description={messages.incomeDescription}
            tone="positive"
          />
          <DashboardIndicatorCard
            label={messages.expenseLabel}
            value={formatCurrencyFromCents(indicators.expenseCents)}
            description={messages.expenseDescription}
            tone="negative"
          />
          <DashboardIndicatorCard
            label={messages.balanceLabel}
            value={formatSignedCurrency(indicators.balanceCents)}
            description={messages.balanceDescription}
            resultText={resultMeaningMessage(indicators.resultMeaning)}
            tone={resultTone}
          />
          <DashboardIndicatorCard
            label={messages.resultLabel}
            value={formatSignedCurrency(indicators.balanceCents)}
            description={resultMeaningMessage(indicators.resultMeaning)}
            tone={resultTone}
          />
        </div>
      </section>
      <section className="grid min-w-0 gap-3" aria-label={messages.recentRegion}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">{messages.recentRegion}</h3>
          <Button asChild variant="secondary" size="sm">
            <Link to={PRIVATE_ROUTES.transactions.path}>{messages.fullList}</Link>
          </Button>
        </div>
        {recentTransactions.length ? (
          <ul className="grid min-w-0 gap-3">
            {recentTransactions.map((item) => (
              <DashboardRecentTransactionItem key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <EmptyState title={messages.recentEmptyTitle} message={messages.recentEmpty} />
        )}
      </section>
    </section>
  );
}

function DashboardHeader({
  period,
  onMonthChange,
  busy = false
}: {
  period: DashboardPeriod;
  onMonthChange: (period: DashboardPeriod) => void;
  busy?: boolean;
}) {
  return (
    <header className="grid min-w-0 gap-4">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">{messages.currentMonth}</p>
        <h2 id="dashboard-title" className="mt-2 text-2xl font-bold">
          Dashboard financeiro
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Acompanhe os indicadores e as ultimas movimentacoes disponiveis para voce.
        </p>
      </div>
      <div
        className="flex min-w-0 flex-col gap-2 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label={messages.selectedPeriod}
      >
        <p className="min-w-0 break-words text-base font-semibold">{period.label}</p>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={messages.previousMonth}
            disabled={busy}
            onClick={() => onMonthChange(moveCivilMonth(period, -1))}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={messages.nextMonth}
            disabled={busy}
            onClick={() => onMonthChange(moveCivilMonth(period, 1))}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="col-span-2 sm:col-span-1"
            disabled={busy}
            onClick={() => onMonthChange(moveCivilMonth(new Date().toISOString().slice(0, 7), 0))}
          >
            <RotateCcw aria-hidden="true" />
            {messages.currentMonth}
          </Button>
        </div>
      </div>
    </header>
  );
}
