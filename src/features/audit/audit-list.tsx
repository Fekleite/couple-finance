import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    return <p className="rounded-lg border border-border p-4 text-sm">{AUDIT_MESSAGES.loading}</p>;
  }

  if (state.status === "blocked" || state.status === "error") {
    return (
      <div className="grid gap-3 rounded-lg border border-border p-4 text-sm" role="status">
        <p>{state.message}</p>
        {state.status === "error" ? (
          <Button type="button" variant="secondary" className="w-fit" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            {AUDIT_MESSAGES.retry}
          </Button>
        ) : null}
      </div>
    );
  }

  if (state.status === "empty") {
    return <p className="rounded-lg border border-border p-4 text-sm">{AUDIT_MESSAGES.empty}</p>;
  }

  return (
    <section className="grid gap-3" aria-busy={state.status === "refreshing"}>
      {state.status === "refreshing" ? (
        <p className="text-sm text-muted-foreground">{AUDIT_MESSAGES.loading}</p>
      ) : null}
      <ul className="grid gap-3" aria-label="Alteracoes financeiras recentes">
        {state.items.map((event) => (
          <AuditEventItem key={event.id} event={event} currentUserId={currentUserId} />
        ))}
      </ul>
    </section>
  );
}
