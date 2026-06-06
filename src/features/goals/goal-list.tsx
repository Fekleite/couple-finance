import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { GoalCard } from "./goal-card";
import { GOAL_MESSAGES } from "./goal-messages";
import type { GoalsState } from "./goal-state";
import type { AuthorizedGoal, GoalStatusFilter } from "./goal-types";

type Props = {
  state: GoalsState;
  submitting: boolean;
  statusFilter: GoalStatusFilter;
  onStatusFilterChange: (status: GoalStatusFilter) => void;
  onRetry: () => void;
  onEdit: (goal: AuthorizedGoal) => void;
  onComplete: (goalId: string) => void;
  onArchive: (goalId: string) => void;
};

export function GoalList({
  state,
  submitting,
  statusFilter,
  onStatusFilterChange,
  onRetry,
  onEdit,
  onComplete,
  onArchive
}: Props) {
  return (
    <section className="grid min-w-0 gap-3" aria-label="Metas financeiras">
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Filtro de metas">
        {(["active", "completed", "archived"] as const).map((status) => (
          <Button
            key={status}
            type="button"
            variant={statusFilter === status ? "default" : "secondary"}
            size="sm"
            onClick={() => onStatusFilterChange(status)}
          >
            {status === "active" ? "Ativas" : status === "completed" ? "Concluidas" : "Arquivadas"}
          </Button>
        ))}
      </div>
      {state.status === "loading" ? (
        <LoadingState title={GOAL_MESSAGES.loadingTitle} message={GOAL_MESSAGES.loading} />
      ) : null}
      {state.status === "error" ? (
        <ErrorState
          title={GOAL_MESSAGES.errorTitle}
          message={state.message}
          actionLabel={GOAL_MESSAGES.retry}
          onAction={onRetry}
        />
      ) : null}
      {state.status === "empty" ? (
        <EmptyState title={GOAL_MESSAGES.emptyTitle} message={GOAL_MESSAGES.empty} />
      ) : null}
      {state.items.length ? (
        <ul className="grid min-w-0 gap-3">
          {state.items.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              submitting={submitting}
              onEdit={onEdit}
              onComplete={onComplete}
              onArchive={onArchive}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
