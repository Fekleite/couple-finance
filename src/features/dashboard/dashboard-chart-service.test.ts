import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseClient } from "@/lib/supabase";
import { dashboardChartsResponse } from "@/test/dashboard-chart-test-utils";
import { getFinancialDashboardCharts, mapDashboardChartsResponse } from "./dashboard-chart-service";

vi.mock("@/lib/supabase", () => ({ getSupabaseClient: vi.fn() }));

describe("dashboard chart service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls the chart RPC with civil month arguments and abort signal", async () => {
    const abortSignal = vi.fn().mockReturnThis();
    const rpc = vi.fn().mockReturnValue({
      abortSignal,
      then: (resolve: (value: unknown) => void) =>
        resolve({ data: rawDashboardChartsResponse(), error: null })
    });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    const signal = new AbortController().signal;
    const result = await getFinancialDashboardCharts(
      {
        monthStart: "2026-06-01",
        nextMonthStart: "2026-07-01",
        evolutionMonthCount: 6
      },
      signal
    );
    expect(rpc).toHaveBeenCalledWith("get_financial_dashboard_charts", {
      month_start_input: "2026-06-01",
      next_month_start_input: "2026-07-01",
      evolution_month_count_input: 6
    });
    expect(abortSignal).toHaveBeenCalledWith(signal);
    expect(result).toMatchObject({ ok: true });
  });

  it("maps category, evolution and member comparison fields", () => {
    const mapped = mapDashboardChartsResponse(rawDashboardChartsResponse());
    expect(mapped.period.key).toBe("2026-06");
    expect(mapped.categoryDistribution[0]).toMatchObject({ categoryLabel: "Moradia", rank: 1 });
    expect(mapped.monthlyEvolution[0]).toMatchObject({ monthKey: "2026-01" });
    expect(mapped.memberComparison).toMatchObject({ status: "ready" });
    expect(mapped.memberComparison.members[0]).toMatchObject({
      memberLabel: "Voce",
      weightBasisPoints: 6000
    });
  });

  it("maps invalid query and temporary errors to safe messages", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "financial_dashboard_charts_invalid_query private sql detail" }
    });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    const result = await getFinancialDashboardCharts({
      monthStart: "bad",
      nextMonthStart: "bad",
      evolutionMonthCount: 6
    });
    expect(result).toMatchObject({ ok: false, reason: "invalid_query" });
    expect(JSON.stringify(result)).not.toContain("private sql detail");
  });
});

function rawDashboardChartsResponse() {
  const response = dashboardChartsResponse();
  return {
    period: {
      start_date: response.period.startDate,
      next_start_date: response.period.nextStartDate
    },
    evolution_window: {
      start_month: response.evolutionWindow.startMonth,
      end_month: response.evolutionWindow.endMonth,
      month_count: response.evolutionWindow.monthCount
    },
    category_distribution: response.categoryDistribution.map((item) => ({
      category_code: item.categoryCode,
      category_label: item.categoryLabel,
      expense_cents: item.expenseCents,
      weight_basis_points: item.weightBasisPoints,
      rank: item.rank
    })),
    monthly_evolution: response.monthlyEvolution.map((item) => ({
      month_key: item.monthKey,
      month_label: item.monthLabel,
      is_selected_month: item.isSelectedMonth,
      income_cents: item.incomeCents,
      expense_cents: item.expenseCents,
      balance_cents: item.balanceCents,
      result_meaning: item.resultMeaning,
      has_authorized_month_data: item.hasAuthorizedMonthData
    })),
    member_comparison: {
      status: response.memberComparison.status,
      basis: response.memberComparison.basis,
      summary: response.memberComparison.summary,
      members: response.memberComparison.members.map((item) => ({
        member_key: item.memberKey,
        member_label: item.memberLabel,
        expense_cents: item.expenseCents,
        weight_basis_points: item.weightBasisPoints
      }))
    },
    summaries: [],
    generated_at: response.generatedAt
  };
}
