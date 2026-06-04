import { useId } from "react";

import { filterCategoriesByApplicability } from "@/features/categories/category-catalog";
import { CategoryOption } from "@/features/categories/category-option";
import type {
  CategoryApplicability,
  StandardFinancialCategory
} from "@/features/categories/category-types";
import { cn } from "@/lib/utils";

export type CategorySelectorProps = {
  categories: StandardFinancialCategory[];
  value?: string;
  applicability?: CategoryApplicability;
  onValueChange: (code: string) => void;
  disabled?: boolean;
  label: string;
  description?: string;
};

export function CategorySelector({
  categories,
  value,
  applicability,
  onValueChange,
  disabled = false,
  label,
  description
}: CategorySelectorProps) {
  const options = filterCategoriesByApplicability(categories, applicability);
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;

  return (
    <fieldset
      className="min-w-0"
      disabled={disabled}
      aria-describedby={descriptionId}
      data-testid="category-selector"
    >
      <legend className="text-base font-semibold">{label}</legend>
      {description ? (
        <p id={descriptionId} className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {options.length > 0 ? (
        <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
          {options.map((category) => {
            const selected = value === category.code;
            return (
              <label
                key={category.code}
                className={cn(
                  "min-w-0 cursor-pointer rounded-xl border border-border bg-background p-4 outline-none transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  selected && "border-primary ring-2 ring-primary/20",
                  disabled && "cursor-not-allowed opacity-60"
                )}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name={groupId}
                  value={category.code}
                  checked={selected}
                  onChange={() => onValueChange(category.code)}
                />
                <CategoryOption category={category} selected={selected} />
              </label>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Nenhuma categoria disponivel.</p>
      )}
    </fieldset>
  );
}
