import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activeTransactionFilters } from "./transaction-filters";
import type {
  AuthorizedTransactionQueryResult,
  TransactionFilterSet
} from "./transaction-list-types";
import { moveCivilMonth, parseCivilMonth } from "./transaction-month";

type Props = {
  filters: TransactionFilterSet;
  options: Pick<AuthorizedTransactionQueryResult, "categoryOptions" | "responsibleOptions">;
  onChange: (filters: TransactionFilterSet) => void;
};

export function TransactionListControls({ filters, options, onChange }: Props) {
  const month = parseCivilMonth(filters.month);
  const active = activeTransactionFilters(filters, options);
  const update = (values: Partial<TransactionFilterSet>) => onChange({ ...filters, ...values });

  return (
    <section className="grid min-w-0 gap-4 rounded-xl border bg-card p-4" aria-label="Filtros">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Mes anterior"
          onClick={() => update({ month: moveCivilMonth(filters.month, -1).key })}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <p className="min-w-0 text-center font-semibold capitalize">{month?.label}</p>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Proximo mes"
          onClick={() => update({ month: moveCivilMonth(filters.month, 1).key })}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Categoria
          <select
            className="min-h-10 min-w-0 rounded-md border bg-background px-2 md:min-h-9"
            value={filters.categoryCode ?? ""}
            onChange={(event) => update({ categoryCode: event.target.value || null })}
          >
            <option value="">Todas</option>
            {options.categoryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Responsavel
          <select
            className="min-h-10 min-w-0 rounded-md border bg-background px-2 md:min-h-9"
            value={filters.responsibleUserId ?? ""}
            onChange={(event) => update({ responsibleUserId: event.target.value || null })}
          >
            <option value="">Todas as pessoas</option>
            {options.responsibleOptions.map((option) => (
              <option key={option.userId} value={option.userId}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Tipo
          <select
            className="min-h-10 min-w-0 rounded-md border bg-background px-2 md:min-h-9"
            value={filters.transactionType ?? ""}
            onChange={(event) =>
              update({ transactionType: (event.target.value as "income" | "expense") || null })
            }
          >
            <option value="">Todos</option>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Buscar por titulo ou observacao
          <Input
            type="search"
            value={filters.searchText ?? ""}
            maxLength={100}
            onChange={(event) => update({ searchText: event.target.value.trimStart() || null })}
          />
        </label>
      </div>
      {active.length ? (
        <div className="flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
          {active.map((filter) => (
            <Button
              key={filter.key}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => update({ [filter.key]: null })}
              aria-label={`Remover filtro ${filter.label}`}
            >
              {filter.label} <X aria-hidden="true" />
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              update({
                categoryCode: null,
                responsibleUserId: null,
                transactionType: null,
                searchText: null
              })
            }
          >
            Limpar filtros
          </Button>
        </div>
      ) : null}
    </section>
  );
}
