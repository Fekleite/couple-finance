export type CategoryApplicability = "income" | "expense" | "both";

export type CategoryUsageContext = "individual" | "shared";

export type StandardFinancialCategoryRow = {
  code: string;
  display_name: string;
  description: string;
  applicability: CategoryApplicability;
  sort_order: number;
  is_active: boolean;
};

export type StandardFinancialCategory = {
  code: string;
  displayName: string;
  description: string;
  applicability: CategoryApplicability;
  sortOrder: number;
  isActive: boolean;
};

export type CategoryServiceResult =
  | { ok: true; data: StandardFinancialCategory[] }
  | { ok: false; reason: "temporary_failure"; message: string };

export type CategoryCatalogState =
  | { status: "loading" }
  | { status: "ready"; categories: StandardFinancialCategory[] }
  | { status: "empty"; message: string }
  | { status: "error"; message: string };

export type FutureFinancialMovementCategoryReference = {
  categoryCode: StandardFinancialCategory["code"];
  usageContext: CategoryUsageContext;
};
