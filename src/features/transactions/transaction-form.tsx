import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CategorySelector } from "@/features/categories";
import { TRANSACTION_MESSAGES } from "./transaction-messages";
import { TransactionSuccessSummary } from "./transaction-success-summary";
import { useTransactionForm } from "./use-transaction-form";

export function TransactionForm() {
  const form = useTransactionForm();
  if (form.state.status === "success") {
    return (
      <TransactionSuccessSummary
        summary={form.state.summary}
        categories={form.categories}
        responsibleOptions={form.responsibleOptions}
        onNewRegistration={form.reset}
      />
    );
  }
  const submitting = form.state.status === "submitting";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da transacao</CardTitle>
        <CardDescription>
          Informe os dados essenciais. Nenhuma categoria e escolhida automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.state.status === "recoverable_error" || form.state.status === "blocked" ? (
          <Alert variant="destructive" className="mb-6" aria-live="assertive">
            <AlertDescription>{form.state.message}</AlertDescription>
          </Alert>
        ) : null}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
        >
          <FieldGroup>
            <TextField
              id="transaction-title"
              label="Titulo"
              value={form.values.title}
              error={form.errors.title}
              onChange={(value) => form.updateValue("title", value)}
            />
            <TextField
              id="transaction-amount"
              label="Valor em reais"
              value={form.values.amount}
              error={form.errors.amountCents}
              inputMode="decimal"
              placeholder="0,00"
              onChange={(value) => form.updateValue("amount", value)}
            />
            <Choice
              legend="Tipo"
              name="transaction-type"
              value={form.values.transactionType}
              options={[
                ["income", "Receita"],
                ["expense", "Despesa"]
              ]}
              error={form.errors.transactionType}
              onChange={(value) => form.updateValue("transactionType", value)}
            />
            <TextField
              id="transaction-date"
              label="Data"
              type="date"
              value={form.values.transactionDate}
              error={form.errors.transactionDate}
              onChange={(value) => form.updateValue("transactionDate", value)}
            />
            <div data-invalid={Boolean(form.errors.categoryCode)}>
              <CategorySelector
                categories={form.categories}
                applicability={form.values.transactionType || undefined}
                value={form.values.categoryCode}
                onValueChange={(value) => form.updateValue("categoryCode", value)}
                label="Categoria"
                description="Escolha uma categoria aplicavel ao tipo."
                disabled={submitting || !form.values.transactionType}
              />
              <FieldError errors={[{ message: form.errors.categoryCode }]} />
            </div>
            <Choice
              legend="Visibilidade"
              name="visibility"
              value={form.values.visibility}
              options={[
                ["individual", "Individual"],
                ["shared", "Compartilhada"]
              ]}
              disabledOption={!form.sharedAvailable ? "shared" : undefined}
              error={form.errors.visibility}
              onChange={(value) => form.updateValue("visibility", value)}
            />
            <FieldDescription>
              {form.values.visibility === "individual"
                ? TRANSACTION_MESSAGES.visibilityIndividual
                : TRANSACTION_MESSAGES.visibilityShared}
            </FieldDescription>
            {form.values.visibility === "shared" ? (
              <Choice
                legend="Pessoa responsavel"
                name="responsible"
                value={form.values.responsibleUserId}
                options={form.responsibleOptions.map((option) => [option.userId, option.label])}
                error={form.errors.responsibleUserId}
                onChange={(value) => form.updateValue("responsibleUserId", value)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Responsavel: Voce</p>
            )}
            <Field data-invalid={Boolean(form.errors.observation)}>
              <FieldLabel htmlFor="transaction-observation">Observacao opcional</FieldLabel>
              <textarea
                id="transaction-observation"
                className="min-h-24 w-full rounded-md border bg-transparent p-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                value={form.values.observation}
                maxLength={500}
                aria-invalid={Boolean(form.errors.observation)}
                aria-describedby={
                  form.errors.observation ? "transaction-observation-error" : undefined
                }
                onChange={(event) => form.updateValue("observation", event.target.value)}
              />
              <FieldError
                id="transaction-observation-error"
                errors={[{ message: form.errors.observation }]}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="min-h-11 w-full sm:w-fit"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {submitting ? "Registrando..." : "Confirmar registro"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
} & Pick<React.ComponentProps<"input">, "type" | "inputMode" | "placeholder">) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      <FieldError id={`${id}-error`} errors={[{ message: error }]} />
    </Field>
  );
}

function Choice({
  legend,
  name,
  value,
  options,
  onChange,
  error,
  disabledOption
}: {
  legend: string;
  name: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
  error?: string;
  disabledOption?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map(([optionValue, label]) => (
          <label
            key={optionValue}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border p-3 has-[:focus-visible]:ring-2 has-[:checked]:border-primary"
          >
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              disabled={disabledOption === optionValue}
              onChange={() => onChange(optionValue)}
            />
            {label}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} errors={[{ message: error }]} />
    </fieldset>
  );
}
