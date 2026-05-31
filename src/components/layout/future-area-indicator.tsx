import { LockKeyhole } from "lucide-react";

import { cn } from "@/lib/utils";

type FutureAreaIndicatorProps = {
  label: string;
  intendedFeature: string;
  className?: string;
};

export function FutureAreaIndicator({
  label,
  intendedFeature,
  className
}: FutureAreaIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground",
        className
      )}
      aria-label={`${label}, area planejada para ${intendedFeature}`}
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
      <span className="font-medium text-primary">Planejado</span>
    </span>
  );
}
