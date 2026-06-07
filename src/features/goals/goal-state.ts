import { GOAL_MESSAGES } from "./goal-messages";
import type { AuthorizedGoal, GoalListResult, GoalStatusFilter } from "./goal-types";

export type GoalsState =
  | { status: "loading"; items: AuthorizedGoal[]; statusFilter: GoalStatusFilter }
  | {
      status: "ready" | "empty";
      items: AuthorizedGoal[];
      statusFilter: GoalStatusFilter;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
      message?: string;
    }
  | {
      status: "submitting";
      items: AuthorizedGoal[];
      statusFilter: GoalStatusFilter;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
    }
  | {
      status: "error";
      items: AuthorizedGoal[];
      statusFilter: GoalStatusFilter;
      message: string;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
    };

export function startGoalsLoad(previous: GoalsState, contextChanged: boolean): GoalsState {
  return {
    status: "loading",
    items: contextChanged ? [] : previous.items,
    statusFilter: previous.statusFilter
  };
}

export function goalsStateFromResult(
  statusFilter: GoalStatusFilter,
  result: GoalListResult,
  message?: string
): GoalsState {
  return {
    status: result.items.length ? "ready" : "empty",
    items: result.items,
    statusFilter,
    hasActiveSharedBudget: result.hasActiveSharedBudget,
    activeSharedBudgetId: result.activeSharedBudgetId,
    message
  };
}

export function goalsErrorState(
  previous: GoalsState,
  message: string = GOAL_MESSAGES.temporaryFailure
): GoalsState {
  return {
    status: "error",
    items: [],
    statusFilter: previous.statusFilter,
    hasActiveSharedBudget:
      "hasActiveSharedBudget" in previous ? previous.hasActiveSharedBudget : false,
    activeSharedBudgetId: "activeSharedBudgetId" in previous ? previous.activeSharedBudgetId : null,
    message
  };
}

export function nextRequestGuard() {
  let current = 0;
  return {
    next: () => {
      current += 1;
      return current;
    },
    owns: (id: number) => id === current
  };
}
