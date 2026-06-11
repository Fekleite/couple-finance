import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { useTransactionList } from "@/features/transactions/use-transaction-list";
import { TransactionsPage } from "@/pages/transactions-page";
import { renderWithCoupleAuth } from "@/test/couple-test-utils";
import { transactionQueryResult } from "@/test/transaction-list-test-utils";

vi.mock("@/features/couple/use-couple-relationship", () => ({ useCoupleRelationship: vi.fn() }));
vi.mock("@/features/transactions/use-transaction-list", () => ({ useTransactionList: vi.fn() }));

describe("TransactionsPage", () => {
  it("composes a mobile-safe authenticated monthly consultation from URL filters", async () => {
    const user = userEvent.setup();
    vi.mocked(useCoupleRelationship).mockReturnValue({
      relationshipState: { status: "no_shared_budget" },
      invitation: null,
      mutationState: { status: "idle", message: null },
      refresh: vi.fn(),
      createInvite: vi.fn(),
      accept: vi.fn(),
      decline: vi.fn(),
      cancel: vi.fn()
    });
    vi.mocked(useTransactionList).mockReturnValue({
      state: { ...transactionQueryResult(), status: "ready" },
      retry: vi.fn(),
      loadMore: vi.fn()
    });
    renderWithCoupleAuth(<TransactionsPage />, {
      route: "/app/transactions?month=2026-06&type=expense"
    });
    expect(screen.getByRole("heading", { name: "Transacoes" })).toBeInTheDocument();
    expect(screen.getByText("junho de 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo")).toHaveValue("expense");
    expect(screen.getByLabelText("Transacoes do mes")).toHaveClass("min-w-0");
    expect(screen.queryByRole("dialog", { name: /registrar transacao/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /registrar transacao/i }));

    expect(screen.getByRole("dialog", { name: /registrar transacao/i })).toBeInTheDocument();
    expect(screen.getByText("Dados da transacao")).toBeInTheDocument();
  });
});
