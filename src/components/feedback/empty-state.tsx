import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
  className
}: EmptyStateProps) {
  const action = renderAction(actionLabel, actionHref, onAction);

  return (
    <section className={cn("rounded-lg border border-border bg-background p-5", className)}>
      <div className="flex items-start gap-3">
        <Inbox className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
          {action}
        </div>
      </div>
    </section>
  );
}

function renderAction(
  actionLabel: string | undefined,
  actionHref: string | undefined,
  onAction: (() => void) | undefined
): ReactNode {
  if (!actionLabel) {
    return null;
  }

  if (actionHref) {
    return (
      <Button asChild variant="secondary" size="sm" className="mt-4">
        <a href={actionHref}>{actionLabel}</a>
      </Button>
    );
  }

  if (onAction) {
    return (
      <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    );
  }

  return null;
}
