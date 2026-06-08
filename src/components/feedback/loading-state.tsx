import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  title: string;
  message: string;
  className?: string;
};

export function LoadingState({ title, message, className }: LoadingStateProps) {
  return (
    <section
      className={cn("rounded-lg border border-border bg-background p-4 sm:p-5", className)}
      aria-labelledby="loading-state-title"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex min-w-0 items-start gap-3">
        <Loader2 className="mt-1 h-5 w-5 shrink-0 animate-spin text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="loading-state-title" className="text-lg font-semibold break-words">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 break-words text-muted-foreground">{message}</p>
        </div>
      </div>
    </section>
  );
}
