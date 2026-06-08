import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function ErrorState({
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
  className
}: ErrorStateProps) {
  const action = renderAction(actionLabel, actionHref, onAction);

  return (
    <section
      className={cn("rounded-lg border border-border bg-background p-4 sm:p-5", className)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex min-w-0 items-start gap-3">
        <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold break-words">{title}</h2>
          <p className="mt-1 text-sm leading-6 break-words text-muted-foreground">{message}</p>
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
