import { describe, expect, it } from "vitest";

import {
  filterCategoriesByApplicability,
  hasValidCatalogInvariants,
  orderActiveCategories
} from "@/features/categories/category-catalog";
import type {
  CategoryUsageContext,
  FutureFinancialMovementCategoryReference
} from "@/features/categories/category-types";
import { category, STANDARD_CATEGORIES } from "@/test/category-test-utils";

describe("category catalog", () => {
  it("enforces stable unique codes, positive order, minimum coverage, and final Outros", () => {
    expect(hasValidCatalogInvariants(STANDARD_CATEGORIES)).toBe(true);
    const ordered = orderActiveCategories(STANDARD_CATEGORIES);
    expect(ordered[ordered.length - 1]?.code).toBe("other");
    expect(
      hasValidCatalogInvariants([
        ...STANDARD_CATEGORIES,
        category({ code: "housing", sortOrder: 999 })
      ])
    ).toBe(false);
  });

  it("applies neutral income and expense compatibility without ownership filtering", () => {
    const income = filterCategoriesByApplicability(STANDARD_CATEGORIES, "income");
    expect(income.map((item) => item.code)).toEqual(["income", "investments", "other"]);

    const contexts: CategoryUsageContext[] = ["individual", "shared"];
    const references: FutureFinancialMovementCategoryReference[] = contexts.map((usageContext) => ({
      usageContext,
      categoryCode: "housing"
    }));
    expect(references.map((reference) => reference.categoryCode)).toEqual(["housing", "housing"]);
  });

  it("contains no ownership, financial records, or usage-count fields", () => {
    expect(JSON.stringify(STANDARD_CATEGORIES)).not.toMatch(
      /user|owner|member|budget|movement|transaction|count|total/i
    );
  });
});
