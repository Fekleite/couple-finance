import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NewTransactionPage } from "./new-transaction-page";

vi.mock("@/features/transactions/transaction-form", () => ({
  TransactionForm: () => <div>Formulario de transacao</div>
}));

describe("new transaction page", () => {
  it("uses a mobile-first bounded structure and clear heading", () => {
    render(<NewTransactionPage />);
    expect(screen.getByRole("heading", { name: "Registrar transacao" })).toBeInTheDocument();
    expect(screen.getByText("Formulario de transacao").closest("section")).toHaveClass("min-w-0");
  });
});
