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
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 pb-0">
          <CardTitle className="min-w-0 break-words text-base">{item.title}</CardTitle>
          <p className="whitespace-nowrap font-semibold tabular-nums">
            {formatCurrencyFromCents(item.amountCents)}
          </p>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-1 text-sm text-muted-foreground">
          <p className="break-words">
            {item.transactionType === "income" ? "Receita" : "Despesa"} •{" "}
            {formatCivilDate(item.transactionDate)} • {item.categoryLabel}
          </p>
          <p className="break-words">
            Responsavel: {item.responsibleLabel} •{" "}
            {item.visibility === "individual" ? "Individual" : "Compartilhada"}
            {showCreator ? ` • Criador: ${item.creatorLabel}` : ""}
          </p>
        </CardContent>
      </Card>
    </li>
  );
}
