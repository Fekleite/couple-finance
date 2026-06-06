import { describe, expect, it } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { calculateGoalProgress } from "./goal-progress";
import { GOAL_MESSAGES, deadlineMessage, progressSummary } from "./goal-messages";

describe("goal messages", () => {
  it("uses private and non-judgmental language for empty and blocked states", () => {
    expect(GOAL_MESSAGES.empty).not.toMatch(/outra pessoa|inacess/i);
    expect(GOAL_MESSAGES.sharedBlocked).toMatch(/espaco compartilhado ativo/i);
    expect(GOAL_MESSAGES.temporaryFailure).not.toMatch(/id|uuid|policy/i);
  });

  it("describes progress, exceeded values, and deadlines with financial clarity", () => {
    const exceeded = createGoal({ currentAmountCents: 125000 });
    expect(progressSummary(exceeded, calculateGoalProgress(exceeded))).toContain("acima do alvo");
    expect(deadlineMessage("none", null)).toBe("Sem prazo definido.");
    expect(deadlineMessage("overdue", "2026-06-05")).toContain("Prazo em");
  });
});
