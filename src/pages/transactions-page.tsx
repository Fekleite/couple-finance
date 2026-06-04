import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { useAuth } from "@/features/auth/use-auth";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import {
  clearAdditionalTransactionFilters,
  parseTransactionFilters,
  serializeTransactionFilters
} from "@/features/transactions/transaction-query";
import { TransactionListControls } from "@/features/transactions/transaction-list-controls";
import { TransactionList } from "@/features/transactions/transaction-list";
import { useTransactionList } from "@/features/transactions/use-transaction-list";
import { setPageTitle } from "@/lib/page-title";

export function TransactionsPage() {
  const { user } = useAuth();
  const { relationshipState } = useCoupleRelationship();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseTransactionFilters(searchParams), [searchParams]);
  const authorizationContext = `${user?.id ?? "signed-out"}:${relationshipContext(relationshipState)}`;
  const { state, retry, loadMore } = useTransactionList(filters, authorizationContext);
  const options =
    state.status === "loading" || state.status === "error"
      ? { categoryOptions: [], responsibleOptions: [] }
      : state;

  useEffect(() => setPageTitle(PRIVATE_ROUTES.transactions.title), []);
  useEffect(() => {
    const canonical = serializeTransactionFilters(filters);
    if (canonical.toString() !== searchParams.toString())
      setSearchParams(canonical, { replace: true });
  }, [filters, searchParams, setSearchParams]);

  const update = (next: typeof filters) => setSearchParams(serializeTransactionFilters(next));

  return (
    <section
      className="mx-auto grid w-full min-w-0 max-w-3xl gap-5"
      aria-labelledby="transactions-title"
    >
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Consulta mensal
        </p>
        <h2 id="transactions-title" className="mt-2 text-2xl font-bold">
          Transacoes
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Consulte somente as movimentacoes disponiveis para voce.
        </p>
      </header>
      <TransactionListControls filters={filters} options={options} onChange={update} />
      <TransactionList
        state={state}
        onRetry={retry}
        onLoadMore={loadMore}
        onClearFilters={() => update(clearAdditionalTransactionFilters(filters))}
      />
    </section>
  );
}

function relationshipContext(state: ReturnType<typeof useCoupleRelationship>["relationshipState"]) {
  if (state.status === "couple_linked") return `${state.status}:${state.sharedBudget.id}`;
  return state.status;
}
