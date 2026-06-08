import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCivilDate, formatCurrencyFromCents } from "./transaction-money";
import type { TransactionListItemData } from "./transaction-list-types";

export function TransactionListItem({ item }: { item: TransactionListItemData }) {
  const showCreator =
    item.visibility === "shared" && item.createdByUserId !== item.responsibleUserId;
  return (
    <li>
      <Card size="sm" className="min-w-0">
        <CardHeader className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <CardTitle className="min-w-0 break-words">{item.title}</CardTitle>
          <p className="min-w-0 font-semibold break-words tabular-nums">
            {formatCurrencyFromCents(item.amountCents)}
          </p>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <p className="break-words">
            Tipo: {item.transactionType === "income" ? "Receita" : "Despesa"}
          </p>
          <p className="break-words">Data: {formatCivilDate(item.transactionDate)}</p>
          <p className="break-words">Categoria: {item.categoryLabel}</p>
          <p className="break-words">Responsavel: {item.responsibleLabel}</p>
          <p className="break-words">
            Visibilidade: {item.visibility === "individual" ? "Individual" : "Compartilhada"}
          </p>
          {showCreator ? <p className="break-words">Criador: {item.creatorLabel}</p> : null}
        </CardContent>
      </Card>
    </li>
  );
}
