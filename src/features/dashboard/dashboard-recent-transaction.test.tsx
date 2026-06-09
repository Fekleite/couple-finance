import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { dashboardRecentTransaction } from "@/test/dashboard-test-utils";
import { DashboardRecentTransactionItem } from "./dashboard-recent-transaction";

describe("DashboardRecentTransactionItem", () => {
  it("shows concise authorized transaction context without internal IDs or observation", () => {
    const item = dashboardRecentTransaction({
      visibility: "shared",
      createdByUserId: "creator",
      creatorLabel: "Pessoa parceira",
      responsibleUserId: "responsible"
    });
    render(
      <ul>
        <DashboardRecentTransactionItem item={item} />
      </ul>
    );
    expect(screen.getByText("Mercado")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*123,45/)).toBeInTheDocument();
    expect(screen.getByText(/Despesa/)).toHaveTextContent(/Alimentacao/);
    expect(screen.getByText(/Responsavel:/)).toHaveTextContent(/Voce/);
    expect(screen.getByText(/Responsavel:/)).toHaveTextContent(/Compartilhada/);
    expect(screen.getByText(/Responsavel:/)).toHaveTextContent(/Criador: Pessoa parceira/);
    expect(document.body.textContent).not.toContain(item.id);
  });
});
