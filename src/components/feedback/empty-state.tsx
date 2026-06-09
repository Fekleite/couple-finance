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
    <section
      className={cn("rounded-lg border border-border bg-background p-4 sm:p-5", className)}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold break-words">{title}</h2>
        <p className="mt-1 text-sm leading-6 break-words text-muted-foreground">{message}</p>
        {action}
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
      <Button asChild variant="secondary" size="sm" className="mt-4 max-w-full">
        <a href={actionHref}>{actionLabel}</a>
      </Button>
    );
  }

  if (onAction) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-4 max-w-full"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    );
  }

  return null;
}
