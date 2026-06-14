import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { transactionTableRows } from "@/test/transaction-table-test-utils";
import { TransactionTable } from "./transaction-table";

describe("TransactionTable", () => {
  it("renders a structured table with every essential transaction field", () => {
    render(<TransactionTable items={transactionTableRows()} />);
    const table = screen.getByRole("table");

    expect(within(table).getByRole("columnheader", { name: /titulo/i })).toBeInTheDocument();
    expect(within(table).getByText("Mercado semanal")).toBeInTheDocument();
    expect(within(table).getByText("R$ 245,90")).toBeInTheDocument();
    expect(within(table).getByText("Despesa")).toBeInTheDocument();
    expect(within(table).getByText("Alimentacao")).toBeInTheDocument();
    expect(within(table).getByText("14 de jun. de 2026")).toBeInTheDocument();
    expect(within(table).getByText("Voce")).toBeInTheDocument();
    expect(within(table).queryByRole("columnheader", { name: /visibilidade/i })).toBeNull();
  });

  it("sorts by date and amount with accessible active state", async () => {
    const user = userEvent.setup();
    render(<TransactionTable items={transactionTableRows()} />);

    expect(screen.getByRole("columnheader", { name: /data/i })).toHaveAttribute(
      "aria-sort",
      "descending"
    );

    await user.click(screen.getAllByRole("button", { name: /ordenar por data/i })[0]);
    expect(screen.getByRole("columnheader", { name: /data/i })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );

    await user.click(screen.getAllByRole("button", { name: /ordenar por valor/i })[0]);
    expect(screen.getByRole("columnheader", { name: /valor/i })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("keeps compact mobile labels available without relying on horizontal table scroll", () => {
    render(<TransactionTable items={transactionTableRows()} />);
    const compact = screen.getByLabelText("Transacoes em formato compacto");

    expect(within(compact).getAllByText("Valor")[0]).toBeInTheDocument();
    expect(within(compact).getAllByText("Tipo")[0]).toBeInTheDocument();
    expect(within(compact).getAllByText("Data")[0]).toBeInTheDocument();
    expect(within(compact).getAllByText("Responsavel")[0]).toBeInTheDocument();
    expect(within(compact).getAllByText("Visibilidade")[0]).toBeInTheDocument();
  });

  it("renders permission-sensitive actions only when callbacks exist", async () => {
    const user = userEvent.setup();
    const onEditTransaction = vi.fn();
    const onDeleteTransaction = vi.fn();
    const { rerender } = render(<TransactionTable items={transactionTableRows()} />);

    expect(screen.queryByRole("button", { name: /editar transacao mercado semanal/i })).toBeNull();
    expect(screen.getAllByText("Sem acoes")[0]).toBeInTheDocument();

    rerender(
      <TransactionTable
        items={transactionTableRows()}
        onEditTransaction={onEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    );

    await user.click(
      screen.getAllByRole("button", { name: /editar transacao mercado semanal/i })[0]
    );
    await user.click(
      screen.getAllByRole("button", { name: /excluir transacao mercado semanal/i })[0]
    );
    expect(onEditTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Mercado semanal" })
    );
    expect(onDeleteTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Mercado semanal" })
    );
  });
});
