import { describe, expect, it } from "vitest";

import { transactionTableRows } from "@/test/transaction-table-test-utils";
import {
  DEFAULT_TRANSACTION_SORT,
  nextTransactionSortState,
  sortTransactions
} from "./transaction-table-sort";

describe("transaction table sort", () => {
  it("uses recent transactions first by default", () => {
    expect(DEFAULT_TRANSACTION_SORT).toEqual({ column: "transactionDate", direction: "desc" });
    expect(
      sortTransactions(transactionTableRows(), DEFAULT_TRANSACTION_SORT).map((item) => item.title)
    ).toEqual(["Mercado semanal", "Salario"]);
  });

  it("sorts by amount and preserves the same authorized rows", () => {
    const rows = transactionTableRows();
    const sorted = sortTransactions(rows, { column: "amountCents", direction: "asc" });
    expect(sorted.map((item) => item.title)).toEqual(["Mercado semanal", "Salario"]);
    expect(sorted.map((item) => item.id).sort()).toEqual(rows.map((item) => item.id).sort());
  });

  it("cycles sort transitions without creating filter state", () => {
    expect(nextTransactionSortState(DEFAULT_TRANSACTION_SORT, "transactionDate")).toEqual({
      column: "transactionDate",
      direction: "asc"
    });
    expect(
      nextTransactionSortState({ column: "transactionDate", direction: "asc" }, "transactionDate")
    ).toEqual(DEFAULT_TRANSACTION_SORT);
    expect(nextTransactionSortState(DEFAULT_TRANSACTION_SORT, "amountCents")).toEqual({
      column: "amountCents",
      direction: "desc"
    });
  });
});
