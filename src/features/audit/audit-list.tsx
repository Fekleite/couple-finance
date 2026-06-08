import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { AUDIT_MESSAGES } from "./audit-messages";
import { AuditEventItem } from "./audit-event-item";
import type { AuditState } from "./audit-types";

type Props = {
  state: AuditState;
  currentUserId?: string | null;
  onRetry: () => void;
};

export function AuditList({ state, currentUserId, onRetry }: Props) {
  if (state.status === "loading") {
    return <LoadingState title={AUDIT_MESSAGES.loadingTitle} message={AUDIT_MESSAGES.loading} />;
  }

  if (state.status === "blocked" || state.status === "error") {
    if (state.status === "blocked") {
      return <ErrorState title={AUDIT_MESSAGES.blockedTitle} message={state.message} />;
    }

    return (
      <ErrorState
        title={AUDIT_MESSAGES.errorTitle}
        message={state.message}
        actionLabel={AUDIT_MESSAGES.retry}
        onAction={onRetry}
      />
    );
  }

  if (state.status === "empty") {
    return <EmptyState title={AUDIT_MESSAGES.emptyTitle} message={AUDIT_MESSAGES.empty} />;
  }

  return (
    <section className="grid gap-3" aria-busy={state.status === "refreshing"}>
      {state.status === "refreshing" ? (
        <p className="text-sm break-words text-muted-foreground" role="status">
          {AUDIT_MESSAGES.loading}
        </p>
      ) : null}
      <ul className="grid gap-3" aria-label="Alteracoes financeiras recentes">
        {state.items.map((event) => (
          <AuditEventItem key={event.id} event={event} currentUserId={currentUserId} />
        ))}
      </ul>
    </section>
  );
}
