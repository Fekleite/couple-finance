export {
  filterCategoriesByApplicability,
  hasValidCatalogInvariants,
  orderActiveCategories
} from "@/features/categories/category-catalog";
export { CategoryOption } from "@/features/categories/category-option";
export {
  CategorySelector,
  type CategorySelectorProps
} from "@/features/categories/category-selector";
export { listActiveCategories } from "@/features/categories/category-service";
export type {
  CategoryApplicability,
  CategoryCatalogState,
  CategoryServiceResult,
  CategoryUsageContext,
  FutureFinancialMovementCategoryReference,
  StandardFinancialCategory,
  StandardFinancialCategoryRow
} from "@/features/categories/category-types";
export { useCategories } from "@/features/categories/use-categories";
