import { actorLabel } from "./audit-authorization";
import {
  auditActionLabel,
  auditItemLabel,
  auditVisibilityLabel,
  formatAuditCivilDate,
  formatAuditCurrency,
  formatAuditDateTime
} from "./audit-messages";
import type { AuthorizedAuditEvent } from "./audit-types";

type Props = {
  event: AuthorizedAuditEvent;
  currentUserId?: string | null;
};

export function AuditEventItem({ event, currentUserId }: Props) {
  const amount = formatAuditCurrency(event.subjectAmountCents);
  const subjectDate = formatAuditCivilDate(event.subjectDate);
  const details = [amount, subjectDate, event.subjectStatus].filter(Boolean).join(" - ");

  return (
    <li className="rounded-lg border border-border bg-card p-4 text-sm shadow-xs">
      <article className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-border px-2 py-1 text-xs font-medium">
            {auditVisibilityLabel(event.visibility)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatAuditDateTime(event.occurredAt)}
          </span>
        </div>
        <div className="grid min-w-0 gap-1">
          <h2 className="break-words text-base font-semibold">
            {actorLabel(event, currentUserId)} {auditActionLabel(event.actionType)}{" "}
            {auditItemLabel(event.itemType)}
          </h2>
          <p className="break-words text-sm text-foreground">{event.subjectLabel}</p>
          {details ? <p className="break-words text-sm text-muted-foreground">{details}</p> : null}
        </div>
      </article>
    </li>
  );
}
