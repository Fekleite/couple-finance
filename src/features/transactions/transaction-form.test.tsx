import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { category } from "@/test/category-test-utils";
import { USER_ID } from "@/test/transaction-test-utils";
import { transactionSummary } from "@/test/transaction-test-utils";
import { TransactionForm } from "./transaction-form";
import { useTransactionForm } from "./use-transaction-form";

vi.mock("./use-transaction-form", () => ({ useTransactionForm: vi.fn() }));

function readyForm() {
  return {
    values: {
      title: "",
      amount: "",
      transactionType: "expense" as const,
      transactionDate: "2026-06-04",
      categoryCode: "",
      visibility: "individual" as const,
      responsibleUserId: USER_ID,
      observation: ""
    },
    errors: {},
    state: { status: "ready" as const },
    categories: [category()],
    responsibleOptions: [{ userId: USER_ID, label: "Voce" as const }],
    sharedAvailable: false,
    updateValue: vi.fn(),
    submit: vi.fn(),
    reset: vi.fn(),
    refresh: vi.fn()
  };
}

describe("transaction form", () => {
  it("renders labeled fields, explicit visibility, and no list or totals", () => {
    vi.mocked(useTransactionForm).mockReturnValue(readyForm());
    render(<TransactionForm />);
    expect(screen.getByLabelText("Titulo")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor em reais")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Individual" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Compartilhada" })).toBeDisabled();
    expect(screen.queryByText(/saldo|total|lista de transacoes/i)).not.toBeInTheDocument();
  });

  it("is keyboard operable and submits once through the controller", async () => {
    const user = userEvent.setup();
    const form = readyForm();
    vi.mocked(useTransactionForm).mockReturnValue(form);
    render(<TransactionForm />);
    await user.click(screen.getByRole("button", { name: "Confirmar registro" }));
    expect(form.submit).toHaveBeenCalledTimes(1);
  });

  it("announces a perceivable summary and offers a keyboard-operable new registration", async () => {
    const user = userEvent.setup();
    const form = {
      ...readyForm(),
      state: { status: "success" as const, summary: transactionSummary() }
    };
    vi.mocked(useTransactionForm).mockReturnValue(form);
    render(<TransactionForm />);
    expect(screen.getByRole("status")).toHaveTextContent("Transacao registrada");
    expect(screen.getByText("Visibilidade").parentElement).toHaveTextContent("Individual");
    await user.click(screen.getByRole("button", { name: "Registrar outra transacao" }));
    expect(form.reset).toHaveBeenCalled();
  });
});
