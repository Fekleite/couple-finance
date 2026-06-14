import { useEffect } from "react";

import { PRIVATE_ROUTES } from "@/app/routes";
import { AuditView, useAuditEvents } from "@/features/audit";
import { useAuth } from "@/features/auth/use-auth";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { setPageTitle } from "@/lib/page-title";

export function AuditPage() {
  const { user } = useAuth();
  const { relationshipState } = useCoupleRelationship();
  const authorizationContext = `${user?.id ?? "signed-out"}:${relationshipContext(relationshipState)}`;
  const audit = useAuditEvents(user?.id, authorizationContext);

  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.audit.title);
  }, []);

  return (
    <main className="grid w-full min-w-0 gap-5">
      <header className="grid gap-2">
        <p className="text-sm font-semibold uppercase text-primary">Auditoria financeira</p>
        <h1 className="text-2xl font-bold">Auditoria financeira</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Consulte alteracoes recentes autorizadas em transacoes e metas, com linguagem neutra e
          contexto seguro.
        </p>
      </header>
      <AuditView state={audit.state} currentUserId={user?.id} onRetry={audit.retry} />
    </main>
  );
}

function relationshipContext(state: ReturnType<typeof useCoupleRelationship>["relationshipState"]) {
  if (state.status === "couple_linked") return `${state.status}:${state.sharedBudget.id}`;
  return state.status;
}
