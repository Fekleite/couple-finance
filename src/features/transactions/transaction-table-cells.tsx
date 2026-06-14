import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  TransactionListItemData,
  TransactionSortColumn,
  TransactionSortState
} from "./transaction-list-types";
import {
  getTransactionActionAvailability,
  type TransactionActionCallbacks
} from "./transaction-table-actions";

export type SortableHeaderContext = {
  sort: TransactionSortState;
  onSort: (column: TransactionSortColumn) => void;
};

export function SortableHeader({
  label,
  column,
  context,
  align = "start"
}: {
  label: string;
  column: TransactionSortColumn;
  context: SortableHeaderContext;
  align?: "start" | "end";
}) {
  const active = context.sort.column === column;
  const direction = active ? context.sort.direction : null;
  const directionLabel =
    direction === "asc" ? "crescente" : direction === "desc" ? "decrescente" : "sem ordenacao";
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`h-auto min-h-9 w-full px-0 text-xs font-semibold ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
      aria-label={`Ordenar por ${label}`}
      aria-pressed={active}
      onClick={() => context.onSort(column)}
    >
      <span>{label}</span>
      <ArrowDownUp aria-hidden="true" className="size-4" />
      <span className="sr-only">Ordenacao {directionLabel}</span>
    </Button>
  );
}

export function TransactionActions({
  item,
  callbacks
}: {
  item: TransactionListItemData;
  callbacks: TransactionActionCallbacks;
}) {
  const availability = getTransactionActionAvailability(callbacks);
  if (!availability.canEdit && !availability.canDelete) {
    return <span className="text-xs text-muted-foreground">Sem acoes</span>;
  }
  return (
    <div className="flex min-w-24 justify-end gap-1">
      {availability.canEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Editar transacao ${item.title}`}
          onClick={() => callbacks.onEditTransaction?.(item)}
        >
          <Pencil aria-hidden="true" />
        </Button>
      ) : null}
      {availability.canDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Excluir transacao ${item.title}`}
          onClick={() => callbacks.onDeleteTransaction?.(item)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
