import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseClient } from "@/lib/supabase";
import { transactionQueryResult } from "@/test/transaction-list-test-utils";
import { listFinancialTransactions, mapQueryResult } from "./transaction-list-service";
import { toTransactionQueryInput, parseTransactionFilters } from "./transaction-query";

vi.mock("@/lib/supabase", () => ({ getSupabaseClient: vi.fn() }));

describe("transaction list service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps a coordinated authorized response", () => {
    const result = transactionQueryResult();
    expect(
      mapQueryResult({
        items: result.items.map((item) => ({
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
        next_cursor: null,
        has_more: false,
        has_authorized_month_data: true,
        category_options: [{ code: "food", label: "Alimentacao", is_active: true }],
        responsible_options: [{ user_id: result.responsibleOptions[0].userId, label: "Voce" }]
      })
    ).toMatchObject({ hasAuthorizedMonthData: true, items: [{ title: "Mercado" }] });
  });

  it("sends all filters and converts raw failures to safe reasons", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "transaction_list_invalid_query private detail" }
    });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    const query = toTransactionQueryInput(
      parseTransactionFilters("?month=2026-06&category=food&type=expense&q=mercado")
    );
    const result = await listFinancialTransactions(query);
    expect(rpc).toHaveBeenCalledWith(
      "list_financial_transactions",
      expect.objectContaining({
        category_code_input: "food",
        transaction_type_input: "expense",
        search_text_input: "mercado"
      })
    );
    expect(result).toMatchObject({ ok: false, reason: "invalid_query" });
    expect(JSON.stringify(result)).not.toContain("private detail");
  });
});
