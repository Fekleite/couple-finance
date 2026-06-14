import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Header,
  type Row
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type {
  TransactionListItemData,
  TransactionSortColumn,
  TransactionSortState
} from "./transaction-list-types";
import { formatCivilDate, formatCurrencyFromCents } from "./transaction-money";
import { createTransactionTableColumns } from "./transaction-table-columns";
import { transactionTypeLabel, visibilityLabel } from "./transaction-table-format";
import {
  DEFAULT_TRANSACTION_SORT,
  nextTransactionSortState,
  sortTransactions
} from "./transaction-table-sort";
import type { TransactionActionCallbacks } from "./transaction-table-actions";

type Props = {
  items: TransactionListItemData[];
} & TransactionActionCallbacks;

export function TransactionTable({ items, onEditTransaction, onDeleteTransaction }: Props) {
  const [sort, setSort] = useState<TransactionSortState>(DEFAULT_TRANSACTION_SORT);
  const sortedItems = useMemo(() => sortTransactions(items, sort), [items, sort]);
  const columns = useMemo(
    () => createTransactionTableColumns({ onEditTransaction, onDeleteTransaction }),
    [onDeleteTransaction, onEditTransaction]
  );
  // TanStack Table intentionally returns table functions; this component keeps them local.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sortedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    meta: {
      sort,
      onSort: (column: TransactionSortColumn) =>
        setSort((current) => nextTransactionSortState(current, column))
    }
  });
  const rows = table.getRowModel().rows;

  return (
    <div className="grid min-w-0 gap-3">
      <div className="hidden min-w-0 overflow-hidden rounded-lg border bg-card lg:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[12%]" />
            <col className="w-[9%]" />
            <col className="w-[15%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[7rem]" />
          </colgroup>
          <thead className="bg-muted/50 text-left text-xs font-semibold uppercase text-muted-foreground">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <TableHeaderCell key={header.id} header={header} sort={sort} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="min-w-0 px-3 py-3 align-top text-foreground last:w-28"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid min-w-0 gap-3 lg:hidden" aria-label="Transacoes em formato compacto">
        <div className="grid grid-cols-2 gap-2">
          {table
            .getHeaderGroups()[0]
            ?.headers.filter(
              (header) => header.column.id === "date" || header.column.id === "amount"
            )
            .map((header) => (
              <div key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
        </div>
        <ul className="grid min-w-0 gap-3">
          {rows.map((row) => (
            <CompactTransactionRow key={row.id} row={row} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function TableHeaderCell({
  header,
  sort
}: {
  header: Header<TransactionListItemData, unknown>;
  sort: TransactionSortState;
}) {
  const sortColumn =
    header.column.id === "date"
      ? "transactionDate"
      : header.column.id === "amount"
        ? "amountCents"
        : null;
  const active = sortColumn && sort.column === sortColumn;
  const alignEnd = header.column.id === "actions";
  const ariaSort = !sortColumn
    ? undefined
    : active && sort.direction === "asc"
      ? "ascending"
      : active && sort.direction === "desc"
        ? "descending"
        : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cn("min-w-0 px-3 py-2 align-middle last:w-28", alignEnd && "text-right")}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
}

function CompactTransactionRow({ row }: { row: Row<TransactionListItemData> }) {
  const item = row.original;
  const actionCell = row.getVisibleCells().find((cell) => cell.column.id === "actions");

  return (
    <li className="grid min-w-0 gap-3 rounded-lg border bg-card p-4">
      <div className="grid min-w-0 gap-1">
        <p className="break-words font-semibold">{item.title}</p>
        <p className="break-words text-sm text-muted-foreground">{item.categoryLabel}</p>
      </div>
      <dl className="grid min-w-0 grid-cols-2 gap-3 text-sm">
        <Field label="Valor" value={row.getValue("amount") as number} formatted />
        <Field label="Tipo" value={transactionTypeLabel(item.transactionType)} />
        <Field label="Data" value={item.transactionDate} date />
        <Field label="Responsavel" value={item.responsibleLabel} />
        <Field label="Visibilidade" value={visibilityLabel(item)} wide />
      </dl>
      {actionCell ? (
        <div className="flex min-w-0 justify-end">
          {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
        </div>
      ) : null}
    </li>
  );
}

function Field({
  label,
  value,
  formatted = false,
  date = false,
  wide = false
}: {
  label: string;
  value: number | string;
  formatted?: boolean;
  date?: boolean;
  wide?: boolean;
}) {
  const displayValue = formatted
    ? formatCurrencyFromCents(Number(value))
    : date
      ? formatCivilDate(String(value))
      : value;
  return (
    <div className={wide ? "col-span-2 min-w-0" : "min-w-0"}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words tabular-nums">{displayValue}</dd>
    </div>
  );
}
