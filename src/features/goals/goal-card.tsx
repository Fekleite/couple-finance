import { Archive, Check, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import { confirmationMessage } from "./goal-actions";
import { deadlineMessage, progressSummary, statusLabel, visibilityLabel } from "./goal-messages";
import { calculateGoalProgress, resolveDeadlineState } from "./goal-progress";
import type { AuthorizedGoal } from "./goal-types";

type Props = {
  goal: AuthorizedGoal;
  submitting: boolean;
  onEdit: (goal: AuthorizedGoal) => void;
  onComplete: (goalId: string) => void;
  onArchive: (goalId: string) => void;
};

export function GoalCard({ goal, submitting, onEdit, onComplete, onArchive }: Props) {
  const progress = calculateGoalProgress(goal);
  const deadline = resolveDeadlineState(goal);
  const canMutate = goal.status === "active" && !submitting;

  return (
    <li className="list-none">
      <Card size="sm" className="min-w-0">
        <CardHeader className="gap-2">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="break-words text-base">{goal.name}</CardTitle>
              <CardDescription className="break-words">
                {visibilityLabel(goal.visibility)} • {statusLabel(goal.status)}
              </CardDescription>
            </div>
            <p className="text-sm font-semibold break-words text-primary">
              {progress.displayPercent}%
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress.barPercent}%` }}
            />
          </div>
          <p className="sr-only">{progressSummary(goal, progress)}</p>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="break-words">Atual: {formatCurrencyFromCents(goal.currentAmountCents)}</p>
            <p className="break-words">Alvo: {formatCurrencyFromCents(goal.targetAmountCents)}</p>
            <p className="break-words">{progressSummary(goal, progress)}</p>
            <p className="break-words">{deadlineMessage(deadline, goal.deadlineDate)}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!canMutate}
              onClick={() => onEdit(goal)}
            >
              <Pencil aria-hidden="true" />
              Editar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!canMutate}
              aria-label={confirmationMessage("complete", goal)}
              onClick={() => onComplete(goal.id)}
            >
              <Check aria-hidden="true" />
              Concluir
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canMutate}
              aria-label={confirmationMessage("archive", goal)}
              onClick={() => onArchive(goal.id)}
            >
              <Archive aria-hidden="true" />
              Arquivar
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
