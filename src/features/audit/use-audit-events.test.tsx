import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dispatchFocusReturnEvents } from "@/test/server-state-focus-test-utils";
import { useAuditEvents } from "./use-audit-events";
import { createAuditEvent } from "@/test/audit-test-utils";
import { AUDIT_REFRESH_EVENT } from "./audit-refresh-signal";
import { listAuditEvents } from "./audit-service";

vi.mock("./audit-service", () => ({
  listAuditEvents: vi.fn(() =>
    Promise.resolve({
      ok: true,
      data: {
        items: [createAuditEvent()],
        hasActiveSharedBudget: true,
        activeSharedBudgetId: "budget-1",
        generatedAt: "now"
      }
    })
  )
}));

describe("useAuditEvents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not refetch audit events when browser focus returns", async () => {
    const { result } = renderHook(() => useAuditEvents("user-1", "ctx"));

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();

    expect(result.current.state.status).toBe("ready");
    expect(listAuditEvents).toHaveBeenCalledTimes(1);
  });

  it("refreshes audit events only through the explicit audit refresh event", async () => {
    const { result } = renderHook(() => useAuditEvents("user-1", "ctx"));

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();
    expect(listAuditEvents).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event(AUDIT_REFRESH_EVENT));
    await waitFor(() => expect(listAuditEvents).toHaveBeenCalledTimes(2));
  });

  it("keeps an audit error visible until retry or explicit refresh", async () => {
    vi.mocked(listAuditEvents)
      .mockResolvedValueOnce({
        ok: false,
        reason: "temporary_failure",
        message: "Nao foi possivel carregar auditoria."
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          items: [createAuditEvent()],
          hasActiveSharedBudget: true,
          activeSharedBudgetId: "budget-1",
          generatedAt: "now"
        }
      });
    const { result } = renderHook(() => useAuditEvents("user-1", "ctx"));

    await waitFor(() => expect(result.current.state.status).toBe("error"));
    dispatchFocusReturnEvents();

    expect(result.current.state.status).toBe("error");
    expect(listAuditEvents).toHaveBeenCalledTimes(1);

    result.current.retry();
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    expect(listAuditEvents).toHaveBeenCalledTimes(2);
  });

  it("loads, retries, and blocks when the session is absent", async () => {
    const { result, rerender } = renderHook(({ userId }) => useAuditEvents(userId, "ctx"), {
      initialProps: { userId: "user-1" as string | null }
    });
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    result.current.retry();
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    rerender({ userId: null });
    await waitFor(() => expect(result.current.state.status).toBe("blocked"));
  });
});
