import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { TRANSACTION_LIST_MESSAGES as messages } from "./transaction-list-messages";
import type { TransactionListState } from "./transaction-list-types";
import { TransactionTable } from "./transaction-table";
import type { TransactionActionCallbacks } from "./transaction-table-actions";

type Props = {
  state: TransactionListState;
  onRetry: () => void;
  onLoadMore: () => void;
  onClearFilters: () => void;
} & TransactionActionCallbacks;

export function TransactionList({
  state,
  onRetry,
  onLoadMore,
  onClearFilters,
  onEditTransaction,
  onDeleteTransaction
}: Props) {
  if (state.status === "loading") {
    return <LoadingState title={messages.loadingTitle} message={messages.loading} />;
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title={messages.errorTitle}
        message={state.message || messages.error}
        actionLabel="Tentar novamente"
        onAction={onRetry}
      />
    );
  }
  if (state.status === "empty_month") {
    return <EmptyState title={messages.emptyMonthTitle} message={messages.emptyMonth} />;
  }
  if (state.status === "no_matches") {
    return (
      <EmptyState
        title={messages.noMatchesTitle}
        message={messages.noMatches}
        actionLabel="Limpar filtros"
        onAction={onClearFilters}
      />
    );
  }
  return (
    <section
      className="grid min-w-0 gap-4"
      aria-label="Transacoes do mes"
      aria-busy={state.status === "loading_more"}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {state.status === "loading_more" ? messages.loadingMore : "Transacoes atualizadas."}
      </p>
      <TransactionTable
        items={state.items}
        onEditTransaction={onEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
      {state.hasMore ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-fit sm:justify-self-center"
          disabled={state.status === "loading_more"}
          onClick={onLoadMore}
        >
          {state.status === "loading_more" ? messages.loadingMore : "Carregar mais"}
        </Button>
      ) : null}
    </section>
  );
}
