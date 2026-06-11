import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/features/auth/use-auth";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { TransactionForm } from "@/features/transactions/transaction-form";
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
  const [registrationOpen, setRegistrationOpen] = useState(false);
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
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Consulta mensal
          </p>
          <h2 id="transactions-title" className="mt-2 text-2xl font-bold">
            Transacoes
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Consulte somente as movimentacoes disponiveis para voce.
          </p>
        </div>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => setRegistrationOpen(true)}
        >
          <Plus aria-hidden="true" />
          Registrar transacao
        </Button>
      </header>
      <Modal
        open={registrationOpen}
        title="Registrar transacao"
        description="Registre uma receita ou despesa com visibilidade clara."
        onClose={() => setRegistrationOpen(false)}
      >
        <TransactionForm />
      </Modal>
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
