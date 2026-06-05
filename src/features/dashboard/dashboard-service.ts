import type { SupabaseClient } from "@supabase/supabase-js";

import { civilMonthFromStartDate } from "./dashboard-state";
import type {
  AuthorizedDashboardResponse,
  DashboardQueryInput,
  DashboardServiceResult
} from "./dashboard-types";
import { getSupabaseClient } from "@/lib/supabase";
import { DASHBOARD_MESSAGES } from "./dashboard-messages";

type RpcResponse = { data: unknown; error: { message?: string } | null };
type AbortableRpc = PromiseLike<RpcResponse> & {
  abortSignal?: (signal: AbortSignal) => AbortableRpc;
};
type DashboardClient = SupabaseClient & {
  rpc: (fn: string, args: Record<string, unknown>) => AbortableRpc;
};

export async function getFinancialDashboard(
  query: DashboardQueryInput,
  signal?: AbortSignal
): Promise<DashboardServiceResult> {
  try {
    let request = client().rpc("get_financial_dashboard", {
      month_start_input: query.monthStart,
      next_month_start_input: query.nextMonthStart,
      recent_limit_input: query.recentLimit
    });
    if (signal && request.abortSignal) request = request.abortSignal(signal);
    const { data, error } = await request;
    if (error) return failureFromMessage(error.message);
    return { ok: true, data: mapDashboardResponse(data) };
  } catch {
    return { ok: false, reason: "temporary_failure", message: DASHBOARD_MESSAGES.error };
  }
}

export function mapDashboardResponse(value: unknown): AuthorizedDashboardResponse {
  const document = (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | null;
  if (!document || !document.indicators || !Array.isArray(document.recent_transactions)) {
    throw new Error("invalid_dashboard_response");
  }
  const indicators = document.indicators as Record<string, unknown>;
  return {
    period: civilMonthFromStartDate(
      String((document.period as Record<string, unknown>).start_date)
    ),
    indicators: {
      incomeCents: Number(indicators.income_cents),
      expenseCents: Number(indicators.expense_cents),
      balanceCents: Number(indicators.balance_cents),
      resultMeaning: indicators.result_meaning as "positive" | "negative" | "zero",
      hasAuthorizedMonthData: Boolean(indicators.has_authorized_month_data)
    },
    recentTransactions: document.recent_transactions.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id),
        title: String(row.title),
        amountCents: Number(row.amount_cents),
        transactionType: row.transaction_type as "income" | "expense",
        transactionDate: String(row.transaction_date),
        createdAt: String(row.created_at),
        categoryCode: String(row.category_code),
        categoryLabel: String(row.category_label),
        createdByUserId: String(row.created_by_user_id),
        creatorLabel: row.creator_label as "Voce" | "Pessoa parceira",
        responsibleUserId: String(row.responsible_user_id),
        responsibleLabel: row.responsible_label as "Voce" | "Pessoa parceira",
        visibility: row.visibility as "individual" | "shared"
      };
    }),
    generatedAt: String(document.generated_at)
  };
}

function client(): DashboardClient {
  return getSupabaseClient() as DashboardClient;
}

function failureFromMessage(message = ""): DashboardServiceResult {
  const invalid = message.includes("financial_dashboard_invalid_query");
  return {
    ok: false,
    reason: invalid ? "invalid_query" : "temporary_failure",
    message: invalid ? DASHBOARD_MESSAGES.invalidQuery : DASHBOARD_MESSAGES.error
  };
}
