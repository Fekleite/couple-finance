import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseClient } from "@/lib/supabase";
import { dashboardResponse } from "@/test/dashboard-test-utils";
import { getFinancialDashboard, mapDashboardResponse } from "./dashboard-service";

vi.mock("@/lib/supabase", () => ({ getSupabaseClient: vi.fn() }));

describe("dashboard service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls the dashboard RPC with civil month arguments and limit 5", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: rawDashboardResponse(), error: null });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    const result = await getFinancialDashboard({
      monthStart: "2026-06-01",
      nextMonthStart: "2026-07-01",
      recentLimit: 5
    });
    expect(rpc).toHaveBeenCalledWith("get_financial_dashboard", {
      month_start_input: "2026-06-01",
      next_month_start_input: "2026-07-01",
      recent_limit_input: 5
    });
    expect(result).toMatchObject({ ok: true });
  });

  it("maps recent transactions and hides raw failure details", async () => {
    expect(mapDashboardResponse(rawDashboardResponse())).toMatchObject({
      indicators: { incomeCents: 500000 },
      recentTransactions: [{ title: "Mercado", creatorLabel: "Pessoa parceira" }]
    });
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "financial_dashboard_invalid_query private sql detail" }
    });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    const result = await getFinancialDashboard({
      monthStart: "bad",
      nextMonthStart: "bad",
      recentLimit: 5
    });
    expect(result).toMatchObject({ ok: false, reason: "invalid_query" });
    expect(JSON.stringify(result)).not.toContain("private sql detail");
  });
});

function rawDashboardResponse() {
  const response = dashboardResponse({
    recentTransactions: [
      {
        ...dashboardResponse().recentTransactions[0],
        createdByUserId: "creator",
        creatorLabel: "Pessoa parceira"
      }
    ]
  });
  return {
    period: { start_date: response.period.startDate },
    indicators: {
      income_cents: response.indicators.incomeCents,
      expense_cents: response.indicators.expenseCents,
      balance_cents: response.indicators.balanceCents,
      result_meaning: response.indicators.resultMeaning,
      has_authorized_month_data: response.indicators.hasAuthorizedMonthData
    },
    recent_transactions: response.recentTransactions.map((item) => ({
      id: item.id,
      title: item.title,
      amount_cents: item.amountCents,
      transaction_type: item.transactionType,
      transaction_date: item.transactionDate,
      created_at: item.createdAt,
      category_code: item.categoryCode,
      category_label: item.categoryLabel,
      created_by_user_id: item.createdByUserId,
      creator_label: item.creatorLabel,
      responsible_user_id: item.responsibleUserId,
      responsible_label: item.responsibleLabel,
      visibility: item.visibility
    })),
    generated_at: response.generatedAt
  };
}
