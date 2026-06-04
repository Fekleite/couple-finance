import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "@/features/auth/use-auth";
import { useCategories } from "@/features/categories";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { category } from "@/test/category-test-utils";
import { USER_ID } from "@/test/transaction-test-utils";
import { createFinancialTransaction } from "./transaction-service";
import { useTransactionForm } from "./use-transaction-form";

vi.mock("@/features/auth/use-auth", () => ({ useAuth: vi.fn() }));
vi.mock("@/features/categories", async (original) => ({
  ...(await original<typeof import("@/features/categories")>()),
  useCategories: vi.fn()
}));
vi.mock("@/features/couple/use-couple-relationship", () => ({ useCoupleRelationship: vi.fn() }));
vi.mock("./transaction-service", async (original) => ({
  ...(await original<typeof import("./transaction-service")>()),
  createFinancialTransaction: vi.fn(),
  listResponsibleOptions: vi.fn().mockResolvedValue([])
}));

describe("useTransactionForm", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "00000000-0000-4000-8000-000000000004") });
    vi.mocked(useAuth).mockReturnValue({ status: "authenticated", user: { id: USER_ID } } as never);
    vi.mocked(useCategories).mockReturnValue({
      catalogState: { status: "ready", categories: [category()] },
      refresh: vi.fn()
    });
    vi.mocked(useCoupleRelationship).mockReturnValue({
      relationshipState: { status: "no_shared_budget" },
      refresh: vi.fn()
    } as never);
    vi.mocked(createFinancialTransaction).mockResolvedValue({
      ok: false,
      reason: "temporary_failure",
      message: "Falha temporaria segura."
    });
  });

  it("starts individual with current-user responsibility and clears category on type change", () => {
    const { result } = renderHook(() => useTransactionForm());
    expect(result.current.values).toMatchObject({
      visibility: "individual",
      responsibleUserId: USER_ID,
      categoryCode: ""
    });
    act(() => result.current.updateValue("categoryCode", "housing"));
    act(() => result.current.updateValue("transactionType", "expense"));
    expect(result.current.values.categoryCode).toBe("");
  });

  it("preserves entered values after a recoverable service failure", async () => {
    const { result } = renderHook(() => useTransactionForm());
    act(() => {
      result.current.updateValue("title", "Mercado");
      result.current.updateValue("amount", "10,00");
      result.current.updateValue("transactionType", "expense");
      result.current.updateValue("categoryCode", "housing");
    });
    await act(async () => result.current.submit());
    await waitFor(() => expect(result.current.state.status).toBe("recoverable_error"));
    expect(result.current.values.title).toBe("Mercado");
  });
});
