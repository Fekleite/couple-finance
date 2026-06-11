import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
  const [createOpen, setCreateOpen] = useState(false);
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
      <div className="flex min-w-0 justify-start">
        <Button type="button" className="w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
          Nova meta
        </Button>
      </div>
      <Modal
        open={createOpen}
        title="Nova meta financeira"
        description="Valores manuais, separados das transacoes."
        onClose={() => setCreateOpen(false)}
      >
        <GoalForm
          hasActiveSharedBudget={hasActiveSharedBudget}
          activeSharedBudgetId={activeSharedBudgetId}
          submitting={submitting}
          onCreate={(input) => {
            onCreate(input);
            setCreateOpen(false);
          }}
          onUpdate={onUpdate}
        />
      </Modal>
      <Modal
        open={Boolean(editingGoal)}
        title="Editar meta"
        description="Atualize valores manuais, prazo ou progresso."
        onClose={() => setEditingGoal(null)}
      >
        {editingGoal ? (
          <GoalForm
            hasActiveSharedBudget={hasActiveSharedBudget}
            activeSharedBudgetId={activeSharedBudgetId}
            submitting={submitting}
            editingGoal={editingGoal}
            onCancelEdit={() => setEditingGoal(null)}
            onCreate={(input) => {
              onCreate(input);
              setEditingGoal(null);
            }}
            onUpdate={(goalId, input) => {
              onUpdate(goalId, input);
              setEditingGoal(null);
            }}
          />
        ) : null}
      </Modal>
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
