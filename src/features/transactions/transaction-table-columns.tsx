import type { ColumnDef } from "@tanstack/react-table";

import { formatCivilDate, formatCurrencyFromCents } from "./transaction-money";
import type { TransactionColumnKey, TransactionListItemData } from "./transaction-list-types";
import {
  SortableHeader,
  TransactionActions,
  type SortableHeaderContext
} from "./transaction-table-cells";
import { transactionTypeLabel } from "./transaction-table-format";
import type { TransactionActionCallbacks } from "./transaction-table-actions";

type ColumnMeta = {
  key: TransactionColumnKey;
  label: string;
  sortable?: boolean;
};

export type TransactionTableColumn = ColumnDef<TransactionListItemData> & {
  meta: ColumnMeta;
};

export function createTransactionTableColumns(
  callbacks: TransactionActionCallbacks = {}
): TransactionTableColumn[] {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => <span className="break-words font-medium">{row.original.title}</span>,
      meta: { key: "title", label: "Titulo" }
    },
    {
      id: "amount",
      accessorKey: "amountCents",
      header: ({ table }) => (
        <SortableHeader
          label="Valor"
          column="amountCents"
          context={table.options.meta as SortableHeaderContext}
        />
      ),
      cell: ({ row }) => (
        <span className="block whitespace-nowrap font-semibold tabular-nums">
          {formatCurrencyFromCents(row.original.amountCents)}
        </span>
      ),
      meta: { key: "amount", label: "Valor", sortable: true }
    },
    {
      id: "type",
      accessorKey: "transactionType",
      header: "Tipo",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {transactionTypeLabel(row.original.transactionType)}
        </span>
      ),
      meta: { key: "type", label: "Tipo" }
    },
    {
      id: "category",
      accessorKey: "categoryLabel",
      header: "Categoria",
      cell: ({ row }) => <span className="break-words">{row.original.categoryLabel}</span>,
      meta: { key: "category", label: "Categoria" }
    },
    {
      id: "date",
      accessorKey: "transactionDate",
      header: ({ table }) => (
        <SortableHeader
          label="Data"
          column="transactionDate"
          context={table.options.meta as SortableHeaderContext}
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatCivilDate(row.original.transactionDate)}
        </span>
      ),
      meta: { key: "date", label: "Data", sortable: true }
    },
    {
      id: "responsible",
      accessorKey: "responsibleLabel",
      header: "Responsavel",
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.responsibleLabel}</span>,
      meta: { key: "responsible", label: "Responsavel" }
    },
    {
      id: "actions",
      header: "Acoes",
      cell: ({ row }) => <TransactionActions item={row.original} callbacks={callbacks} />,
      meta: { key: "actions", label: "Acoes" }
    }
  ];
}
