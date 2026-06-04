import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "@/features/auth/auth-context-value";
import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import { listActiveCategories } from "@/features/categories/category-service";
import { useCategories } from "@/features/categories/use-categories";
import { createAuthContextValue } from "@/test/auth-test-utils";
import { category } from "@/test/category-test-utils";

vi.mock("@/features/categories/category-service", () => ({
  listActiveCategories: vi.fn()
}));

const auth = createAuthContextValue({
  status: "authenticated",
  user: { id: "user-a", email: "ana@example.com" }
});

function wrapper({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listActiveCategories).mockResolvedValue({ ok: true, data: [category()] });
  });

  it("loads ready and empty states", async () => {
    const ready = renderHook(() => useCategories(), { wrapper });
    await waitFor(() => expect(ready.result.current.catalogState.status).toBe("ready"));
    ready.unmount();

    vi.mocked(listActiveCategories).mockResolvedValue({ ok: true, data: [] });
    const empty = renderHook(() => useCategories(), { wrapper });
    await waitFor(() =>
      expect(empty.result.current.catalogState).toEqual({
        status: "empty",
        message: CATEGORY_MESSAGES.emptyMessage
      })
    );
  });

  it("keeps loading before resolution and supports retry after a safe error", async () => {
    vi.mocked(listActiveCategories).mockReturnValueOnce(new Promise(() => undefined));
    const pending = renderHook(() => useCategories(), { wrapper });
    expect(pending.result.current.catalogState).toEqual({ status: "loading" });
    pending.unmount();

    vi.mocked(listActiveCategories)
      .mockResolvedValueOnce({
        ok: false,
        reason: "temporary_failure",
        message: CATEGORY_MESSAGES.errorMessage
      })
      .mockResolvedValueOnce({ ok: true, data: [category()] });
    const retry = renderHook(() => useCategories(), { wrapper });
    await waitFor(() => expect(retry.result.current.catalogState.status).toBe("error"));
    await act(async () => retry.result.current.refresh());
    expect(retry.result.current.catalogState.status).toBe("ready");
  });

  it("invalidates stale results when the authenticated user changes", async () => {
    let resolveFirst:
      | ((value: Awaited<ReturnType<typeof listActiveCategories>>) => void)
      | undefined;
    let currentAuth = auth;
    vi.mocked(listActiveCategories)
      .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce({ ok: true, data: [category({ code: "food" })] });

    const { result, rerender } = renderHook(() => useCategories(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={currentAuth}>{children}</AuthContext.Provider>
      )
    });
    currentAuth = createAuthContextValue({
      status: "authenticated",
      user: { id: "user-b", email: "bia@example.com" }
    });
    rerender();

    await waitFor(() =>
      expect(result.current.catalogState).toEqual({
        status: "ready",
        categories: [category({ code: "food" })]
      })
    );
    resolveFirst?.({ ok: true, data: [category({ code: "housing" })] });
    await act(async () => undefined);
    expect(result.current.catalogState).toEqual({
      status: "ready",
      categories: [category({ code: "food" })]
    });
  });
});
