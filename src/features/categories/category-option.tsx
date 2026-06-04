import {
  Banknote,
  BookOpen,
  Bus,
  CircleEllipsis,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  ReceiptText,
  ShoppingBag,
  Utensils
} from "lucide-react";
import type { ComponentType } from "react";

import type { StandardFinancialCategory } from "@/features/categories/category-types";
import { cn } from "@/lib/utils";

type CategoryOptionProps = {
  category: StandardFinancialCategory;
  selected?: boolean;
  className?: string;
};

const ICONS: Record<string, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  income: Banknote,
  housing: House,
  food: Utensils,
  transportation: Bus,
  health: HeartPulse,
  bills: ReceiptText,
  education: GraduationCap,
  shopping: ShoppingBag,
  leisure: BookOpen,
  investments: Landmark,
  other: CircleEllipsis
};

export function CategoryOption({ category, selected = false, className }: CategoryOptionProps) {
  const Icon = ICONS[category.code] ?? CircleEllipsis;

  return (
    <span className={cn("flex min-w-0 items-start gap-3", className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden={true} />
      <span className="min-w-0">
        <span className="block font-semibold">{category.displayName}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {category.description}
        </span>
        {selected ? <span className="mt-2 block text-xs font-semibold">Selecionada</span> : null}
      </span>
    </span>
  );
}
