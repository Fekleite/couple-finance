import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { GoalForm } from "./goal-form";

describe("GoalForm", () => {
  it("submits individual values with cent conversion, optional deadline, and focusable errors", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <GoalForm
        hasActiveSharedBudget={false}
        activeSharedBudgetId={null}
        submitting={false}
        onCreate={onCreate}
        onUpdate={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /criar meta/i }));
    expect(await screen.findByText("Informe um nome.")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/nome da meta/i), "Reserva");
    await user.type(screen.getByLabelText(/valor alvo/i), "1000,00");
    await user.type(screen.getByLabelText(/valor atual/i), "25,00");
    await user.click(screen.getByRole("button", { name: /criar meta/i }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Reserva",
          targetAmountCents: 100000,
          currentAmountCents: 2500,
          deadlineDate: null,
          visibility: "individual"
        })
      )
    );
  });

  it("supports shared visibility when available and prevents visibility edits", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onUpdate = vi.fn();
    const { rerender } = render(
      <GoalForm
        hasActiveSharedBudget
        activeSharedBudgetId="33333333-3333-4333-8333-333333333333"
        submitting={false}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );
    await user.click(screen.getByLabelText(/compartilhada/i));
    await user.type(screen.getByLabelText(/nome da meta/i), "Viagem");
    await user.type(screen.getByLabelText(/valor alvo/i), "200,00");
    await user.click(screen.getByRole("button", { name: /criar meta/i }));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ visibility: "shared" }));

    rerender(
      <GoalForm
        hasActiveSharedBudget
        activeSharedBudgetId="33333333-3333-4333-8333-333333333333"
        submitting={false}
        editingGoal={createGoal()}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );
    expect(screen.getByLabelText(/compartilhada/i)).toBeDisabled();
    await user.clear(screen.getByLabelText(/valor atual/i));
    await user.type(screen.getByLabelText(/valor atual/i), "500,00");
    await user.click(screen.getByRole("button", { name: /salvar meta/i }));
    expect(onUpdate).toHaveBeenCalledWith(
      "11111111-1111-4111-8111-111111111111",
      expect.objectContaining({ currentAmountCents: 50000 })
    );
  });
});
