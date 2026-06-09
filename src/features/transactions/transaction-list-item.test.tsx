import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { transactionListItem } from "@/test/transaction-list-test-utils";
import { TransactionListItem } from "./transaction-list-item";

describe("TransactionListItem", () => {
  it("shows complete explicit financial context without internal IDs or observation", () => {
    const item = transactionListItem({
      visibility: "shared",
      creatorLabel: "Pessoa parceira",
      createdByUserId: "creator",
      responsibleUserId: "responsible"
    });
    render(
      <ul>
        <TransactionListItem item={item} />
      </ul>
    );
    expect(screen.getByText("Mercado")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*123,45/)).toBeInTheDocument();
    expect(screen.getByText(/Tipo: Despesa/)).toHaveTextContent(/Categoria: Alimentacao/);
    expect(screen.getByText(/Tipo: Despesa/)).toHaveTextContent(/Data:/);
    expect(screen.getByText(/Responsavel:/)).toHaveTextContent(/Visibilidade: Compartilhada/);
    expect(screen.getByText(/Responsavel:/)).toHaveTextContent(/Criador: Pessoa parceira/);
    expect(document.body.textContent).not.toContain(item.id);
  });
});
