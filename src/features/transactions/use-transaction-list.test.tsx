import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { transactionQueryResult } from "@/test/transaction-list-test-utils";
import { listFinancialTransactions } from "./transaction-list-service";
import { parseTransactionFilters } from "./transaction-query";
import { useTransactionList } from "./use-transaction-list";

vi.mock("./transaction-list-service", () => ({ listFinancialTransactions: vi.fn() }));

describe("useTransactionList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads the selected month and resets results when filters change", async () => {
    vi.mocked(listFinancialTransactions).mockResolvedValue({
      ok: true,
      data: transactionQueryResult()
    });
    const { result, rerender } = renderHook(
      ({ query }) => useTransactionList(parseTransactionFilters(query), "user-a:active"),
      { initialProps: { query: "?month=2026-06" } }
    );
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    rerender({ query: "?month=2026-07&type=expense" });
    expect(result.current.state.status).toBe("loading");
    await waitFor(() => expect(listFinancialTransactions).toHaveBeenCalledTimes(2));
    expect(vi.mocked(listFinancialTransactions).mock.calls[1][0]).toMatchObject({
      monthStart: "2026-07-01",
      transactionType: "expense"
    });
  });

  it("blocks duplicate load-more requests while continuation is pending", async () => {
    let resolveMore:
      | ((value: Awaited<ReturnType<typeof listFinancialTransactions>>) => void)
      | undefined;
    vi.mocked(listFinancialTransactions)
      .mockResolvedValueOnce({
        ok: true,
        data: transactionQueryResult({
          hasMore: true,
          nextCursor: {
            transactionDate: "2026-06-04",
            createdAt: "2026-06-04T12:00:00Z",
            id: "00000000-0000-4000-8000-000000000001"
          }
        })
      })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveMore = resolve;
          })
      );
    const { result } = renderHook(() =>
      useTransactionList(parseTransactionFilters("?month=2026-06"), "user-a:active")
    );
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    act(() => {
      result.current.loadMore();
      result.current.loadMore();
    });
    expect(listFinancialTransactions).toHaveBeenCalledTimes(2);
    await act(async () =>
      resolveMore?.({ ok: true, data: transactionQueryResult({ hasMore: false }) })
    );
  });
});
