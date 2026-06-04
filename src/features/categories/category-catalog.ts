import type {
  CategoryApplicability,
  StandardFinancialCategory
} from "@/features/categories/category-types";

export function orderActiveCategories(
  categories: StandardFinancialCategory[]
): StandardFinancialCategory[] {
  return [...categories].filter((category) => category.isActive).sort(compareCategories);
}

export function filterCategoriesByApplicability(
  categories: StandardFinancialCategory[],
  applicability?: CategoryApplicability
): StandardFinancialCategory[] {
  return orderActiveCategories(categories).filter(
    (category) =>
      !applicability ||
      category.applicability === applicability ||
      category.applicability === "both"
  );
}

export function hasValidCatalogInvariants(categories: StandardFinancialCategory[]): boolean {
  const ordered = orderActiveCategories(categories);
  const codes = new Set(ordered.map((category) => category.code));
  const orders = new Set(ordered.map((category) => category.sortOrder));

  return (
    ordered.length >= 10 &&
    codes.size === ordered.length &&
    orders.size === ordered.length &&
    ordered.every(
      (category) =>
        category.code.length > 0 &&
        category.displayName.trim().length > 0 &&
        category.description.trim().length > 0 &&
        category.sortOrder > 0
    ) &&
    ordered[ordered.length - 1]?.code === "other"
  );
}

function compareCategories(a: StandardFinancialCategory, b: StandardFinancialCategory): number {
  if (a.code === "other") return 1;
  if (b.code === "other") return -1;
  return a.sortOrder - b.sortOrder;
}
