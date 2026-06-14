import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import type {
  AuthorizedTransactionQueryResult,
  TransactionListServiceResult,
  TransactionQueryInput
} from "./transaction-list-types";

const TEMPORARY_FAILURE_MESSAGE =
  "Nao foi possivel consultar as transacoes agora. Tente novamente.";
const INVALID_QUERY_MESSAGE = "Nao foi possivel usar os filtros informados.";

type RpcResponse = { data: unknown; error: { message?: string } | null };
type AbortableRpc = PromiseLike<RpcResponse> & {
  abortSignal?: (signal: AbortSignal) => AbortableRpc;
};
type TransactionListClient = SupabaseClient & {
  rpc: (fn: string, args: Record<string, unknown>) => AbortableRpc;
};

export async function listFinancialTransactions(
  query: TransactionQueryInput,
  signal?: AbortSignal
): Promise<TransactionListServiceResult> {
  try {
    // F14 keeps this authorized RPC contract unchanged; table sorting is local over loaded rows.
    let request = client().rpc("list_financial_transactions", {
      month_start_input: query.monthStart,
      next_month_start_input: query.nextMonthStart,
      category_code_input: query.categoryCode,
      responsible_user_id_input: query.responsibleUserId,
      transaction_type_input: query.transactionType,
      search_text_input: query.searchText,
      cursor_transaction_date_input: query.cursor?.transactionDate ?? null,
      cursor_created_at_input: query.cursor?.createdAt ?? null,
      cursor_id_input: query.cursor?.id ?? null,
      page_size_input: query.pageSize
    });
    if (signal && request.abortSignal) request = request.abortSignal(signal);
    const { data, error } = await request;
    if (error) return failureFromMessage(error.message);
    return { ok: true, data: mapQueryResult(data) };
  } catch {
    return { ok: false, reason: "temporary_failure", message: TEMPORARY_FAILURE_MESSAGE };
  }
}

export function mapQueryResult(value: unknown): AuthorizedTransactionQueryResult {
  const document = (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | null;
  if (!document || !Array.isArray(document.items)) throw new Error("invalid_query_response");
  return {
    items: document.items.map((item) => {
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
    nextCursor: document.next_cursor
      ? {
          transactionDate: String(
            (document.next_cursor as Record<string, unknown>).transaction_date
          ),
          createdAt: String((document.next_cursor as Record<string, unknown>).created_at),
          id: String((document.next_cursor as Record<string, unknown>).id)
        }
      : null,
    hasMore: Boolean(document.has_more),
    hasAuthorizedMonthData: Boolean(document.has_authorized_month_data),
    categoryOptions: ((document.category_options as Record<string, unknown>[]) ?? []).map(
      (option) => ({
        code: String(option.code),
        label: String(option.label),
        isActive: Boolean(option.is_active)
      })
    ),
    responsibleOptions: ((document.responsible_options as Record<string, unknown>[]) ?? []).map(
      (option) => ({
        userId: String(option.user_id),
        label: option.label as "Voce" | "Pessoa parceira"
      })
    )
  };
}

function client(): TransactionListClient {
  return getSupabaseClient() as TransactionListClient;
}

function failureFromMessage(message = ""): TransactionListServiceResult {
  const invalid = message.includes("transaction_list_invalid_query");
  return {
    ok: false,
    reason: invalid ? "invalid_query" : "temporary_failure",
    message: invalid ? INVALID_QUERY_MESSAGE : TEMPORARY_FAILURE_MESSAGE
  };
}
