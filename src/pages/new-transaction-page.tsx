import { useEffect } from "react";

import { PRIVATE_ROUTES } from "@/app/routes";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { setPageTitle } from "@/lib/page-title";

export function NewTransactionPage() {
  useEffect(() => setPageTitle(PRIVATE_ROUTES.newTransaction.title), []);
  return (
    <section className="mx-auto w-full min-w-0 max-w-2xl" aria-labelledby="new-transaction-title">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Novo registro</p>
        <h2 id="new-transaction-title" className="mt-2 text-2xl font-bold">
          Registrar transacao
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Registre uma receita ou despesa com visibilidade clara.
        </p>
      </header>
      <TransactionForm />
    </section>
  );
}
