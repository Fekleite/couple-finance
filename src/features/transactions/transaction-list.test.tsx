import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { transactionQueryResult } from "@/test/transaction-list-test-utils";
import { TransactionList } from "./transaction-list";

describe("TransactionList", () => {
  it("renders populated results and keyboard-operable pagination", async () => {
    const onLoadMore = vi.fn();
    render(
      <TransactionList
        state={{ ...transactionQueryResult({ hasMore: true }), status: "ready" }}
        onRetry={vi.fn()}
        onLoadMore={onLoadMore}
        onClearFilters={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Carregar mais" }));
    expect(onLoadMore).toHaveBeenCalledOnce();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("preserves loading, loading more, empty, no-match, and retryable error states", () => {
    const props = { onRetry: vi.fn(), onLoadMore: vi.fn(), onClearFilters: vi.fn() };
    const view = render(<TransactionList state={{ status: "loading" }} {...props} />);
    expect(screen.getByText("Consultando transacoes")).toBeInTheDocument();

    view.rerender(
      <TransactionList
        state={{ ...transactionQueryResult({ hasMore: true }), status: "loading_more" }}
        {...props}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Carregando mais transacoes...");
    expect(screen.getByRole("button", { name: "Carregando mais transacoes..." })).toBeDisabled();

    view.rerender(
      <TransactionList
        state={{
          ...transactionQueryResult({ items: [], hasAuthorizedMonthData: false }),
          status: "empty_month"
        }}
        {...props}
      />
    );
    expect(screen.getByText("Nenhuma transacao neste mes")).toBeInTheDocument();
    view.rerender(
      <TransactionList
        state={{ ...transactionQueryResult({ items: [] }), status: "no_matches" }}
        {...props}
      />
    );
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeInTheDocument();
    view.rerender(
      <TransactionList state={{ status: "error", message: "Falha segura." }} {...props} />
    );
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/supabase|rls|policy/i);
  });
});
