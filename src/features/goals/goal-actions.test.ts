import { describe, expect, it } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { canMutateGoal, confirmationMessage } from "./goal-actions";

describe("goal actions", () => {
  it("keeps confirmation copy explicit and only mutates active goals", () => {
    const active = createGoal({ name: "Reserva" });
    expect(confirmationMessage("complete", active)).toBe("Concluir a meta Reserva?");
    expect(confirmationMessage("archive", active)).toBe("Arquivar a meta Reserva?");
    expect(canMutateGoal(active)).toBe(true);
    expect(
      canMutateGoal(createGoal({ status: "completed", completedAt: "2026-06-06T12:00:00Z" }))
    ).toBe(false);
    expect(
      canMutateGoal(createGoal({ status: "archived", archivedAt: "2026-06-06T12:00:00Z" }))
    ).toBe(false);
  });
});
