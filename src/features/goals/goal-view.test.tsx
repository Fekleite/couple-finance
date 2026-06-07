import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { GoalView } from "./goal-view";

describe("GoalView", () => {
  it("wires loading, empty, edit, complete, archive, filters, and keyboard actions", async () => {
    const user = userEvent.setup();
    const onStatusFilterChange = vi.fn();
    const onUpdate = vi.fn();
    const onComplete = vi.fn();
    const onArchive = vi.fn();
    render(
      <GoalView
        state={{
          status: "ready",
          items: [createGoal()],
          statusFilter: "active",
          hasActiveSharedBudget: false,
          activeSharedBudgetId: null
        }}
        statusFilter="active"
        onStatusFilterChange={onStatusFilterChange}
        onRetry={vi.fn()}
        onCreate={vi.fn()}
        onUpdate={onUpdate}
        onComplete={onComplete}
        onArchive={onArchive}
      />
    );
    expect(screen.getAllByText(/metas compartilhadas ficam disponiveis/i)).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: /concluidas/i }));
    expect(onStatusFilterChange).toHaveBeenCalledWith("completed");
    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.clear(screen.getByLabelText(/valor atual/i));
    await user.type(screen.getByLabelText(/valor atual/i), "900,00");
    await user.click(screen.getByRole("button", { name: /salvar meta/i }));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ currentAmountCents: 90000 })
    );
    await user.click(screen.getByRole("button", { name: /concluir a meta/i }));
    await user.click(screen.getByRole("button", { name: /arquivar a meta/i }));
    expect(onComplete).toHaveBeenCalledWith("11111111-1111-4111-8111-111111111111");
    expect(onArchive).toHaveBeenCalledWith("11111111-1111-4111-8111-111111111111");
  });
});
