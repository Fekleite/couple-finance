import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { transactionTableRows } from "@/test/transaction-table-test-utils";
import { createTransactionTableColumns } from "./transaction-table-columns";
import { TransactionTable } from "./transaction-table";

describe("transaction table columns", () => {
  it("defines every required column and sortable amount/date metadata", () => {
    const columns = createTransactionTableColumns();
    expect(columns.map((column) => column.meta.key)).toEqual([
      "title",
      "amount",
      "type",
      "category",
      "date",
      "responsible",
      "actions"
    ]);
    expect(
      columns.filter((column) => column.meta.sortable).map((column) => column.meta.key)
    ).toEqual(["amount", "date"]);
  });

  it("renders essential headers and formatted cell content", () => {
    render(<TransactionTable items={transactionTableRows()} />);
    expect(screen.getByRole("columnheader", { name: /titulo/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /valor/i })).toHaveAttribute(
      "aria-sort",
      "none"
    );
    expect(screen.getByRole("columnheader", { name: /data/i })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(screen.getAllByText("Mercado semanal")[0]).toBeInTheDocument();
    expect(screen.getAllByText("R$ 245,90")[0]).toBeInTheDocument();
  });
});
