import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseClient } from "@/lib/supabase";
import { transactionRow, transactionSubmission } from "@/test/transaction-test-utils";
import { createFinancialTransaction } from "./transaction-service";

vi.mock("@/lib/supabase", () => ({ getSupabaseClient: vi.fn() }));

describe("transaction service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps explicit RPC arguments and authorized rows", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [transactionRow()], error: null });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    await expect(createFinancialTransaction(transactionSubmission())).resolves.toMatchObject({
      ok: true,
      data: { title: "Mercado", amountCents: 12345 }
    });
    expect(rpc).toHaveBeenCalledWith(
      "create_financial_transaction",
      expect.objectContaining({
        amount_cents_input: 12345,
        idempotency_key_input: expect.any(String)
      })
    );
    expect(rpc.mock.calls[0][1]).not.toHaveProperty("created_by_user_id");
  });

  it("maps known failures safely and never returns raw details", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "transaction_shared_context_unavailable private-id" }
      })
    } as never);
    const result = await createFinancialTransaction(transactionSubmission());
    expect(result).toMatchObject({ ok: false, reason: "shared_context_unavailable" });
    expect(JSON.stringify(result)).not.toContain("private-id");
  });
});
