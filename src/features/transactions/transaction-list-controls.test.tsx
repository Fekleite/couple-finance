import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { parseTransactionFilters } from "./transaction-query";
import { TransactionListControls } from "./transaction-list-controls";

describe("TransactionListControls", () => {
  it("operates labeled month and combined filters by keyboard", async () => {
    const onChange = vi.fn();
    render(
      <TransactionListControls
        filters={parseTransactionFilters("?month=2026-06&category=food")}
        options={{
          categoryOptions: [{ code: "food", label: "Alimentacao", isActive: true }],
          responsibleOptions: [{ userId: "00000000-0000-4000-8000-000000000001", label: "Voce" }]
        }}
        onChange={onChange}
      />
    );
    expect(screen.getByText("junho de 2026")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ month: "2026-05" }));
    await userEvent.selectOptions(screen.getByLabelText("Tipo"), "expense");
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ transactionType: "expense" }));
    await userEvent.click(screen.getByRole("button", { name: /remover filtro alimentacao/i }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ categoryCode: null }));
  });
});
