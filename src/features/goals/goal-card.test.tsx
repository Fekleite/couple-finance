import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { GoalCard } from "./goal-card";

describe("GoalCard", () => {
  it("renders authorized metadata, progress text, values, deadline, and actions", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onComplete = vi.fn();
    const onArchive = vi.fn();
    render(
      <ul>
        <GoalCard
          goal={createGoal({ currentAmountCents: 125000, visibility: "shared" })}
          submitting={false}
          onEdit={onEdit}
          onComplete={onComplete}
          onArchive={onArchive}
        />
      </ul>
    );
    expect(screen.getByText("Reserva de emergencia")).toBeInTheDocument();
    expect(screen.getByText(/compartilhada/i)).toBeInTheDocument();
    expect(screen.getAllByText(/125% alcancado/i)).toHaveLength(2);
    expect(screen.getByText(/R\$ 1.250,00/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.click(screen.getByRole("button", { name: /concluir a meta/i }));
    await user.click(screen.getByRole("button", { name: /arquivar a meta/i }));
    expect(onEdit).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith("11111111-1111-4111-8111-111111111111");
    expect(onArchive).toHaveBeenCalledWith("11111111-1111-4111-8111-111111111111");
  });
});
