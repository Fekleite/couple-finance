import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCivilDate,
  formatCurrencyFromCents
} from "@/features/transactions/transaction-money";
import type { DashboardRecentTransaction } from "./dashboard-types";

export function DashboardRecentTransactionItem({ item }: { item: DashboardRecentTransaction }) {
  const showCreator =
    item.visibility === "shared" && item.createdByUserId !== item.responsibleUserId;
  return (
    <li>
      <Card size="sm" className="min-w-0">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <CardTitle className="min-w-0 break-words text-base">{item.title}</CardTitle>
          <p className="whitespace-nowrap font-semibold tabular-nums">
            {formatCurrencyFromCents(item.amountCents)}
          </p>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-x-4 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Tipo: {item.transactionType === "income" ? "Receita" : "Despesa"}</p>
          <p>Data: {formatCivilDate(item.transactionDate)}</p>
          <p>Categoria: {item.categoryLabel}</p>
          <p>Responsavel: {item.responsibleLabel}</p>
          <p>Visibilidade: {item.visibility === "individual" ? "Individual" : "Compartilhada"}</p>
          {showCreator ? <p>Criador: {item.creatorLabel}</p> : null}
        </CardContent>
      </Card>
    </li>
  );
}
