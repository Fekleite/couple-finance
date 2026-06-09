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
      <div className="min-w-0">
        <h2 id="loading-state-title" className="text-base font-semibold break-words">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 break-words text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
