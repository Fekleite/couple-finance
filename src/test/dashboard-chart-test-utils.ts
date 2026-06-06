import type {
  AuthorizedDashboardChartsResponse,
  CategoryExpenseDistributionItem,
  MemberResponsibilityComparison,
  MonthlyEvolutionPoint
} from "@/features/dashboard";
import { dashboardPeriod } from "./dashboard-test-utils";

export function categoryDistributionFixture(
  overrides: Partial<CategoryExpenseDistributionItem>[] = []
): CategoryExpenseDistributionItem[] {
  const defaults: CategoryExpenseDistributionItem[] = [
    {
      categoryCode: "housing",
      categoryLabel: "Moradia",
      expenseCents: 200000,
      weightBasisPoints: 5000,
      rank: 1
    },
    {
      categoryCode: "food",
      categoryLabel: "Alimentacao",
      expenseCents: 120000,
      weightBasisPoints: 3000,
      rank: 2
    },
    {
      categoryCode: "transport",
      categoryLabel: "Transporte",
      expenseCents: 80000,
      weightBasisPoints: 2000,
      rank: 3
    }
  ];
  return defaults.map((item, index) => ({ ...item, ...overrides[index] }));
}

export function tiedCategoryDistributionFixture(): CategoryExpenseDistributionItem[] {
  return categoryDistributionFixture([
    { categoryCode: "food", categoryLabel: "Alimentacao", expenseCents: 100000, rank: 1 },
    { categoryCode: "health", categoryLabel: "Saude", expenseCents: 100000, rank: 2 },
    { categoryCode: "transport", categoryLabel: "Transporte", expenseCents: 50000, rank: 3 }
  ]);
}

export function monthlyEvolutionFixture(
  overrides: Partial<MonthlyEvolutionPoint>[] = []
): MonthlyEvolutionPoint[] {
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const labels = ["jan. 2026", "fev. 2026", "mar. 2026", "abr. 2026", "mai. 2026", "jun. 2026"];
  return months.map((monthKey, index) => ({
    monthKey,
    monthLabel: labels[index],
    isSelectedMonth: index === 5,
    incomeCents: index === 1 ? 0 : 500000,
    expenseCents: index === 2 ? 0 : 320000,
    balanceCents: index === 3 ? -20000 : index === 4 ? 0 : 180000,
    resultMeaning: index === 3 ? "negative" : index === 4 ? "zero" : "positive",
    hasAuthorizedMonthData: index !== 1,
    ...overrides[index]
  }));
}

export function memberComparisonFixture(
  overrides: Partial<MemberResponsibilityComparison> = {}
): MemberResponsibilityComparison {
  return {
    status: "ready",
    basis: "responsible_user",
    summary: "Comparativo neutro por pessoa responsavel.",
    members: [
      {
        memberKey: "self",
        memberLabel: "Voce",
        expenseCents: 180000,
        weightBasisPoints: 6000
      },
      {
        memberKey: "partner",
        memberLabel: "Pessoa parceira",
        expenseCents: 120000,
        weightBasisPoints: 4000
      }
    ],
    ...overrides
  };
}

export function dashboardChartsResponse(
  overrides: Partial<AuthorizedDashboardChartsResponse> = {}
): AuthorizedDashboardChartsResponse {
  const period = overrides.period ?? dashboardPeriod();
  return {
    period,
    evolutionWindow: {
      startMonth: "2026-01",
      endMonth: "2026-06",
      monthCount: 6
    },
    categoryDistribution: categoryDistributionFixture(),
    monthlyEvolution: monthlyEvolutionFixture(),
    memberComparison: memberComparisonFixture(),
    summaries: [],
    generatedAt: "2026-06-05T12:00:00Z",
    ...overrides
  };
}
