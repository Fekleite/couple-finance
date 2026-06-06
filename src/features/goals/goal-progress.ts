import type { AuthorizedGoal, GoalDeadlineState, GoalProgress } from "./goal-types";

export function calculateGoalProgress(
  goal: Pick<AuthorizedGoal, "targetAmountCents" | "currentAmountCents">
): GoalProgress {
  const percent =
    goal.targetAmountCents > 0 ? (goal.currentAmountCents / goal.targetAmountCents) * 100 : 0;
  const remainingAmountCents = Math.max(goal.targetAmountCents - goal.currentAmountCents, 0);
  const exceededAmountCents = Math.max(goal.currentAmountCents - goal.targetAmountCents, 0);
  return {
    percent,
    displayPercent: Math.round(percent),
    barPercent: Math.min(Math.max(percent, 0), 100),
    remainingAmountCents,
    exceededAmountCents,
    achievement:
      exceededAmountCents > 0 ? "exceeded" : remainingAmountCents === 0 ? "reached" : "in_progress"
  };
}

export function resolveDeadlineState(
  goal: Pick<
    AuthorizedGoal,
    "deadlineDate" | "status" | "currentAmountCents" | "targetAmountCents"
  >,
  today = new Date()
): GoalDeadlineState {
  if (goal.status === "completed") return "completed";
  if (!goal.deadlineDate) return "none";
  const current = civilKey(today);
  if (goal.deadlineDate === current) return "today";
  if (goal.deadlineDate < current && goal.currentAmountCents < goal.targetAmountCents)
    return "overdue";
  return "future";
}

function civilKey(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
