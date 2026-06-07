import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAuditEvents } from "./use-audit-events";
import { createAuditEvent } from "@/test/audit-test-utils";

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
