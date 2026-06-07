import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalForm } from "./goal-form";
import { GoalList } from "./goal-list";
import { GOAL_MESSAGES } from "./goal-messages";
import type { GoalsState } from "./goal-state";
import type {
  AuthorizedGoal,
  GoalMutation,
  GoalStatusFilter,
  GoalUpdateMutation
} from "./goal-types";

type Props = {
  state: GoalsState;
  statusFilter: GoalStatusFilter;
  onStatusFilterChange: (status: GoalStatusFilter) => void;
  onRetry: () => void;
  onCreate: (input: GoalMutation) => void;
  onUpdate: (goalId: string, input: GoalUpdateMutation) => void;
  onComplete: (goalId: string) => void;
  onArchive: (goalId: string) => void;
};

export function GoalView({
  state,
  statusFilter,
  onStatusFilterChange,
  onRetry,
  onCreate,
  onUpdate,
  onComplete,
  onArchive
}: Props) {
  const [editingGoal, setEditingGoal] = useState<AuthorizedGoal | null>(null);
  const submitting = state.status === "submitting";
  const hasActiveSharedBudget =
    "hasActiveSharedBudget" in state ? state.hasActiveSharedBudget : false;
  const activeSharedBudgetId = "activeSharedBudgetId" in state ? state.activeSharedBudgetId : null;

  return (
    <div className="grid min-w-0 gap-5">
      {"message" in state && state.message && state.status !== "error" ? (
        <Alert>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      {!hasActiveSharedBudget ? (
        <Alert>
          <AlertDescription>{GOAL_MESSAGES.sharedBlocked}</AlertDescription>
        </Alert>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>{editingGoal ? "Editar meta" : "Nova meta financeira"}</CardTitle>
          <CardDescription>
            Informe valores manuais. Metas nao sao vinculadas automaticamente a transacoes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalForm
            hasActiveSharedBudget={hasActiveSharedBudget}
            activeSharedBudgetId={activeSharedBudgetId}
            submitting={submitting}
            editingGoal={editingGoal}
            onCancelEdit={() => setEditingGoal(null)}
            onCreate={onCreate}
            onUpdate={(goalId, input) => {
              onUpdate(goalId, input);
              setEditingGoal(null);
            }}
          />
        </CardContent>
      </Card>
      <GoalList
        state={state}
        submitting={submitting}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        onRetry={onRetry}
        onEdit={setEditingGoal}
        onComplete={onComplete}
        onArchive={onArchive}
      />
    </div>
  );
}
