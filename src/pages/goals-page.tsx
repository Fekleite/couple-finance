import { useEffect } from "react";

import { PRIVATE_ROUTES } from "@/app/routes";
import { GoalView, useGoals } from "@/features/goals";
import { useAuth } from "@/features/auth/use-auth";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { setPageTitle } from "@/lib/page-title";

export function GoalsPage() {
  const { user } = useAuth();
  const { relationshipState } = useCoupleRelationship();
  const authorizationContext = `${user?.id ?? "signed-out"}:${relationshipContext(relationshipState)}`;
  const goals = useGoals(authorizationContext);

  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.goals.title);
  }, []);

  return (
    <main className="grid w-full min-w-0 gap-5">
      <header className="grid gap-2">
        <h1 className="text-2xl font-bold">Metas financeiras</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Objetivos individuais ou compartilhados com progresso manual.
        </p>
      </header>
      <GoalView
        state={goals.state}
        statusFilter={goals.statusFilter}
        onStatusFilterChange={goals.setStatusFilter}
        onRetry={goals.retry}
        onCreate={(input) => void goals.create(input)}
        onUpdate={(goalId, input) => void goals.update(goalId, input)}
        onComplete={(goalId) => void goals.complete(goalId)}
        onArchive={(goalId) => void goals.archive(goalId)}
      />
    </main>
  );
}

function relationshipContext(state: ReturnType<typeof useCoupleRelationship>["relationshipState"]) {
  if (state.status === "couple_linked") return `${state.status}:${state.sharedBudget.id}`;
  return state.status;
}
