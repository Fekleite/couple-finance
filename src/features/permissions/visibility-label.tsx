import { Eye, EyeOff, Loader2, UsersRound } from "lucide-react";

import { getVisibilityLabel } from "@/features/permissions/visibility-scope";
import type { VisibilityScope } from "@/features/permissions/permission-types";
import { cn } from "@/lib/utils";

type VisibilityLabelProps = {
  scope: VisibilityScope;
  className?: string;
};

const ICONS = {
  individual: Eye,
  shared: UsersRound,
  inaccessible: EyeOff,
  unknown_loading: Loader2
} as const;

export function VisibilityLabel({ scope, className }: VisibilityLabelProps) {
  const label = getVisibilityLabel(scope);
  const Icon = ICONS[scope];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      aria-label={`${label.label}. ${label.description}`}
      title={label.description}
    >
      <Icon
        className={cn("size-3.5 shrink-0", scope === "unknown_loading" ? "animate-spin" : "")}
        aria-hidden="true"
      />
      <span className="min-w-0 whitespace-normal">{label.label}</span>
    </span>
  );
}
