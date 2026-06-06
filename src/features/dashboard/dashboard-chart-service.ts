import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import { DASHBOARD_CHART_MESSAGES } from "./dashboard-chart-messages";
import { chartPeriodFromStartDate } from "./dashboard-chart-state";
import type {
  AuthorizedDashboardChartsResponse,
  DashboardChartQueryInput,
  DashboardChartServiceResult
} from "./dashboard-chart-types";

type RpcResponse = { data: unknown; error: { message?: string } | null };
type AbortableRpc = PromiseLike<RpcResponse> & {
  abortSignal?: (signal: AbortSignal) => AbortableRpc;
};
type DashboardChartClient = SupabaseClient & {
  rpc: (fn: string, args: Record<string, unknown>) => AbortableRpc;
};

export async function getFinancialDashboardCharts(
  query: DashboardChartQueryInput,
  signal?: AbortSignal
): Promise<DashboardChartServiceResult> {
  try {
    let request = client().rpc("get_financial_dashboard_charts", {
      month_start_input: query.monthStart,
      next_month_start_input: query.nextMonthStart,
      evolution_month_count_input: query.evolutionMonthCount
    });
    if (signal && request.abortSignal) request = request.abortSignal(signal);
    const { data, error } = await request;
    if (error) return failureFromMessage(error.message);
    return { ok: true, data: mapDashboardChartsResponse(data) };
  } catch {
    return { ok: false, reason: "temporary_failure", message: DASHBOARD_CHART_MESSAGES.error };
  }
}

export function mapDashboardChartsResponse(value: unknown): AuthorizedDashboardChartsResponse {
  const document = (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | null;
  if (
    !document ||
    !document.period ||
    !document.evolution_window ||
    !Array.isArray(document.category_distribution) ||
    !Array.isArray(document.monthly_evolution) ||
    !document.member_comparison
  ) {
    throw new Error("invalid_dashboard_charts_response");
  }
  const period = document.period as Record<string, unknown>;
  const window = document.evolution_window as Record<string, unknown>;
  const comparison = document.member_comparison as Record<string, unknown>;
  return {
    period: chartPeriodFromStartDate(String(period.start_date)),
    evolutionWindow: {
      startMonth: String(window.start_month),
      endMonth: String(window.end_month),
      monthCount: Number(window.month_count)
    },
    categoryDistribution: document.category_distribution.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        categoryCode: String(row.category_code),
        categoryLabel: String(row.category_label),
        expenseCents: Number(row.expense_cents),
        weightBasisPoints: Number(row.weight_basis_points),
        rank: Number(row.rank)
      };
    }),
    monthlyEvolution: document.monthly_evolution.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        monthKey: String(row.month_key),
        monthLabel: String(row.month_label),
        isSelectedMonth: Boolean(row.is_selected_month),
        incomeCents: Number(row.income_cents),
        expenseCents: Number(row.expense_cents),
        balanceCents: Number(row.balance_cents),
        resultMeaning: row.result_meaning as "positive" | "negative" | "zero",
        hasAuthorizedMonthData: Boolean(row.has_authorized_month_data)
      };
    }),
    memberComparison: {
      status: comparison.status as "ready" | "empty" | "unavailable_shared",
      basis: "responsible_user",
      summary: String(comparison.summary ?? ""),
      members: Array.isArray(comparison.members)
        ? comparison.members.map((item) => {
            const row = item as Record<string, unknown>;
            return {
              memberKey: row.member_key as "self" | "partner",
              memberLabel: row.member_label as "Voce" | "Pessoa parceira",
              expenseCents: Number(row.expense_cents),
              weightBasisPoints: Number(row.weight_basis_points)
            };
          })
        : []
    },
    summaries: [],
    generatedAt: String(document.generated_at)
  };
}

function client(): DashboardChartClient {
  return getSupabaseClient() as DashboardChartClient;
}

function failureFromMessage(message = ""): DashboardChartServiceResult {
  const invalid = message.includes("financial_dashboard_charts_invalid_query");
  return {
    ok: false,
    reason: invalid ? "invalid_query" : "temporary_failure",
    message: invalid ? DASHBOARD_CHART_MESSAGES.invalidQuery : DASHBOARD_CHART_MESSAGES.error
  };
}
