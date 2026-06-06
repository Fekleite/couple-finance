import { describe, expect, it } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { calculateGoalProgress, resolveDeadlineState } from "./goal-progress";

describe("goal progress", () => {
  it("calculates zero, reached, and exceeded progress with capped bars", () => {
    expect(calculateGoalProgress(createGoal({ currentAmountCents: 0 }))).toMatchObject({
      displayPercent: 0,
      barPercent: 0,
      remainingAmountCents: 100000,
      achievement: "in_progress"
    });
    expect(calculateGoalProgress(createGoal({ currentAmountCents: 100000 }))).toMatchObject({
      displayPercent: 100,
      barPercent: 100,
      remainingAmountCents: 0,
      achievement: "reached"
    });
    expect(calculateGoalProgress(createGoal({ currentAmountCents: 125000 }))).toMatchObject({
      displayPercent: 125,
      barPercent: 100,
      exceededAmountCents: 25000,
      achievement: "exceeded"
    });
  });

  it("resolves civil deadline states without treating null as overdue", () => {
    const today = new Date(2026, 5, 6);
    expect(resolveDeadlineState(createGoal({ deadlineDate: null }), today)).toBe("none");
    expect(resolveDeadlineState(createGoal({ deadlineDate: "2026-06-06" }), today)).toBe("today");
    expect(resolveDeadlineState(createGoal({ deadlineDate: "2026-06-07" }), today)).toBe("future");
    expect(resolveDeadlineState(createGoal({ deadlineDate: "2026-06-05" }), today)).toBe("overdue");
    expect(resolveDeadlineState(createGoal({ status: "completed" }), today)).toBe("completed");
  });
});
