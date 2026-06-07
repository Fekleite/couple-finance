import { Alert, AlertDescription } from "@/components/ui/alert";
import { AUDIT_MESSAGES } from "./audit-messages";
import { AuditList } from "./audit-list";
import type { AuditState } from "./audit-types";

type Props = {
  state: AuditState;
  currentUserId?: string | null;
  onRetry: () => void;
};

export function AuditView({ state, currentUserId, onRetry }: Props) {
  const hasActiveSharedBudget =
    "hasActiveSharedBudget" in state ? state.hasActiveSharedBudget : false;

  return (
    <section className="grid min-w-0 gap-4" aria-labelledby="audit-view-title">
      <div className="grid gap-1">
        <h2 id="audit-view-title" className="text-lg font-semibold">
          Alteracoes recentes
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Cada item mostra somente contexto autorizado e seguro.
        </p>
      </div>
      {!hasActiveSharedBudget && state.status !== "loading" ? (
        <Alert>
          <AlertDescription>{AUDIT_MESSAGES.sharedUnavailable}</AlertDescription>
        </Alert>
      ) : null}
      <AuditList state={state} currentUserId={currentUserId} onRetry={onRetry} />
    </section>
  );
}
