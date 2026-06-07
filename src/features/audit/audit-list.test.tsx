import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuditList } from "./audit-list";
import { createAuditEvent } from "@/test/audit-test-utils";

describe("AuditList", () => {
  it("renders authorized list without global counts", () => {
    render(
      <AuditList
        state={{
          status: "ready",
          items: [createAuditEvent()],
          generatedAt: "now",
          hasActiveSharedBudget: true,
          activeSharedBudgetId: "budget-1"
        }}
        currentUserId="22222222-2222-4222-8222-222222222222"
        onRetry={vi.fn()}
      />
    );
    expect(
      screen.getByRole("list", { name: /alteracoes financeiras recentes/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
  });

  it("renders loading, empty, and retryable error states", async () => {
    const retry = vi.fn();
    const { rerender } = render(
      <AuditList state={{ status: "loading", items: [] }} onRetry={retry} />
    );
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    rerender(
      <AuditList
        state={{
          status: "empty",
          items: [],
          generatedAt: "now",
          hasActiveSharedBudget: false,
          activeSharedBudgetId: null
        }}
        onRetry={retry}
      />
    );
    expect(screen.getByText(/nenhuma alteracao/i)).toBeInTheDocument();
    rerender(
      <AuditList state={{ status: "error", items: [], message: "Falha segura" }} onRetry={retry} />
    );
    await userEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(retry).toHaveBeenCalled();
  });
});
