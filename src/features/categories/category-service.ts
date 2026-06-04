import type { SupabaseClient } from "@supabase/supabase-js";

import { orderActiveCategories } from "@/features/categories/category-catalog";
import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import type {
  CategoryServiceResult,
  StandardFinancialCategory,
  StandardFinancialCategoryRow
} from "@/features/categories/category-types";
import { getSupabaseClient } from "@/lib/supabase";

const CATEGORY_COLUMNS = "code, display_name, description, applicability, sort_order, is_active";

type QueryResult<T> = { data: T[] | null; error: { message?: string } | null };
type CategoryQuery = PromiseLike<QueryResult<StandardFinancialCategoryRow>> & {
  select: (columns: string) => CategoryQuery;
  eq: (column: string, value: boolean) => CategoryQuery;
  order: (column: string, options: { ascending: boolean }) => CategoryQuery;
};
type CategoryClient = SupabaseClient & {
  from: (table: string) => CategoryQuery;
};

export async function listActiveCategories(): Promise<CategoryServiceResult> {
  try {
    const { data, error } = await client()
      .from("standard_financial_categories")
      .select(CATEGORY_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return temporaryFailure();
    }

    return {
      ok: true,
      data: orderActiveCategories((data ?? []).map(mapCategoryRow))
    };
  } catch {
    return temporaryFailure();
  }
}

export function mapCategoryRow(row: StandardFinancialCategoryRow): StandardFinancialCategory {
  return {
    code: row.code,
    displayName: row.display_name,
    description: row.description,
    applicability: row.applicability,
    sortOrder: row.sort_order,
    isActive: row.is_active
  };
}

function client(): CategoryClient {
  return getSupabaseClient() as CategoryClient;
}

function temporaryFailure(): CategoryServiceResult {
  return {
    ok: false,
    reason: "temporary_failure",
    message: CATEGORY_MESSAGES.errorMessage
  };
}
