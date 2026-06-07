import { describe, expect, it } from "vitest";

import { auditStateFromResult, blockedAuditState, startAuditLoad } from "./audit-state";
import { createAuditEvent } from "@/test/audit-test-utils";

describe("audit state", () => {
  it("uses loading for first loads and refreshing for retained authorized data", () => {
    expect(startAuditLoad(null)).toEqual({ status: "loading", items: [] });
    expect(
      startAuditLoad({
        status: "ready",
        items: [createAuditEvent()],
        generatedAt: "now",
        hasActiveSharedBudget: true,
        activeSharedBudgetId: "budget-1"
      })
    ).toMatchObject({ status: "refreshing", items: [createAuditEvent()] });
  });

  it("creates ready, empty, error, and blocked states", () => {
    expect(
      auditStateFromResult({
        ok: true,
        data: {
          items: [createAuditEvent()],
          hasActiveSharedBudget: false,
          activeSharedBudgetId: null,
          generatedAt: "now"
        }
      })
    ).toMatchObject({ status: "ready" });
    expect(
      auditStateFromResult({
        ok: true,
        data: {
          items: [],
          hasActiveSharedBudget: false,
          activeSharedBudgetId: null,
          generatedAt: "now"
        }
      })
    ).toMatchObject({ status: "empty", items: [] });
    expect(
      auditStateFromResult({ ok: false, reason: "temporary_failure", message: "Falha" })
    ).toMatchObject({
      status: "error",
      items: []
    });
    expect(blockedAuditState()).toMatchObject({ status: "blocked", items: [] });
  });
});
