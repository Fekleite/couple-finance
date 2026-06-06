import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createGoal, archiveGoal, completeGoal, listGoals, updateGoal } from "./goal-service";
import {
  goalsErrorState,
  goalsStateFromResult,
  startGoalsLoad,
  type GoalsState
} from "./goal-state";
import type { GoalMutation, GoalStatusFilter, GoalUpdateMutation } from "./goal-types";

export function useGoals(authorizationContext = "") {
  const [statusFilter, setStatusFilter] = useState<GoalStatusFilter>("active");
  const [state, setState] = useState<GoalsState>({ status: "loading", items: [], statusFilter });
  const requestId = useRef(0);
  const previousContext = useRef(authorizationContext);
  const queryKey = useMemo(
    () => `${statusFilter}|${authorizationContext}`,
    [authorizationContext, statusFilter]
  );

  const load = useCallback(
    async (contextChanged = false, successMessage?: string) => {
      const ownedRequest = ++requestId.current;
      setState((previous) => startGoalsLoad(previous, contextChanged));
      const result = await listGoals({ status: statusFilter });
      if (ownedRequest !== requestId.current) return;
      setState((previous) =>
        result.ok
          ? goalsStateFromResult(statusFilter, result.data, successMessage)
          : goalsErrorState(previous, result.message)
      );
    },
    [statusFilter]
  );

  useEffect(() => {
    void queryKey;
    const contextChanged = previousContext.current !== authorizationContext;
    previousContext.current = authorizationContext;
    void load(contextChanged);
    // queryKey owns reloads for filter/context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const runMutation = useCallback(
    async (operation: () => Promise<{ ok: boolean; message?: string }>) => {
      setState((previous) => ({
        status: "submitting",
        items: previous.items,
        statusFilter: previous.statusFilter,
        hasActiveSharedBudget:
          "hasActiveSharedBudget" in previous ? previous.hasActiveSharedBudget : false,
        activeSharedBudgetId:
          "activeSharedBudgetId" in previous ? previous.activeSharedBudgetId : null
      }));
      const result = await operation();
      if (!result.ok) {
        setState((previous) => goalsErrorState(previous, result.message));
        return result;
      }
      await load(false, result.message);
      return result;
    },
    [load]
  );

  return {
    state,
    statusFilter,
    setStatusFilter,
    retry: () => void load(false),
    create: (input: GoalMutation) => runMutation(() => createGoal(input)),
    update: (goalId: string, input: GoalUpdateMutation) =>
      runMutation(() => updateGoal(goalId, input)),
    complete: (goalId: string) => runMutation(() => completeGoal(goalId)),
    archive: (goalId: string) => runMutation(() => archiveGoal(goalId))
  };
}
