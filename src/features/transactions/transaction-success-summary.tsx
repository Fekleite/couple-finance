import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StandardFinancialCategory } from "@/features/categories";
import { formatCivilDate, formatCurrencyFromCents } from "./transaction-money";
import type { AuthorizedTransactionSummary, ResponsibleOption } from "./transaction-types";

export function TransactionSuccessSummary({
  summary,
  categories,
  responsibleOptions,
  onNewRegistration
}: {
  summary: AuthorizedTransactionSummary;
  categories: StandardFinancialCategory[];
  responsibleOptions: ResponsibleOption[];
  onNewRegistration: () => void;
}) {
  const category = categories.find((item) => item.code === summary.categoryCode);
  const responsible =
    responsibleOptions.find((item) => item.userId === summary.responsibleUserId)?.label ?? "Voce";
  return (
    <Card role="status" aria-live="polite" tabIndex={-1}>
      <CardHeader>
        <CardTitle>Transacao registrada</CardTitle>
        <CardDescription>{summary.title}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
          <Summary
            label="Tipo"
            value={summary.transactionType === "income" ? "Receita" : "Despesa"}
          />
          <Summary label="Valor" value={formatCurrencyFromCents(summary.amountCents)} />
          <Summary label="Data" value={formatCivilDate(summary.transactionDate)} />
          <Summary label="Categoria" value={category?.displayName ?? "Categoria registrada"} />
          <Summary label="Responsavel" value={responsible} />
          <Summary
            label="Visibilidade"
            value={summary.visibility === "individual" ? "Individual" : "Compartilhada"}
          />
          <Summary label="Criada por" value="Voce" />
        </dl>
        <Button type="button" size="lg" className="w-full sm:w-fit" onClick={onNewRegistration}>
          Registrar outra transacao
        </Button>
      </CardContent>
    </Card>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}
