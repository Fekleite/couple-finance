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
      className={cn("rounded-lg border border-border bg-background p-5", className)}
      aria-labelledby="loading-state-title"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-start gap-3">
        <Loader2 className="mt-1 h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <div>
          <h2 id="loading-state-title" className="text-lg font-semibold">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
        </div>
      </div>
    </section>
  );
}
