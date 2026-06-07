import type { AuthorizedGoal } from "./goal-types";

export type GoalAction = "complete" | "archive";

export function confirmationMessage(action: GoalAction, goal: AuthorizedGoal): string {
  return action === "complete" ? `Concluir a meta ${goal.name}?` : `Arquivar a meta ${goal.name}?`;
}

export function canMutateGoal(goal: AuthorizedGoal): boolean {
  return goal.status === "active";
}
