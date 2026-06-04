import type {
  StandardFinancialCategory,
  StandardFinancialCategoryRow
} from "@/features/categories/category-types";

export function categoryRow(
  overrides: Partial<StandardFinancialCategoryRow> = {}
): StandardFinancialCategoryRow {
  return {
    code: "housing",
    display_name: "Moradia",
    description: "Aluguel, condominio e manutencao da residencia.",
    applicability: "expense",
    sort_order: 20,
    is_active: true,
    ...overrides
  };
}

export function category(
  overrides: Partial<StandardFinancialCategory> = {}
): StandardFinancialCategory {
  return {
    code: "housing",
    displayName: "Moradia",
    description: "Aluguel, condominio e manutencao da residencia.",
    applicability: "expense",
    sortOrder: 20,
    isActive: true,
    ...overrides
  };
}

export const STANDARD_CATEGORIES: StandardFinancialCategory[] = [
  category({ code: "income", displayName: "Renda", applicability: "income", sortOrder: 10 }),
  category(),
  category({ code: "food", displayName: "Alimentacao", sortOrder: 30 }),
  category({ code: "transportation", displayName: "Transporte", sortOrder: 40 }),
  category({ code: "health", displayName: "Saude", sortOrder: 50 }),
  category({ code: "bills", displayName: "Contas", sortOrder: 60 }),
  category({ code: "education", displayName: "Educacao", sortOrder: 70 }),
  category({ code: "shopping", displayName: "Compras", sortOrder: 80 }),
  category({ code: "leisure", displayName: "Lazer", sortOrder: 90 }),
  category({
    code: "investments",
    displayName: "Investimentos",
    applicability: "both",
    sortOrder: 100
  }),
  category({ code: "other", displayName: "Outros", applicability: "both", sortOrder: 110 })
];
