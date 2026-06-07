import { AUDIT_MESSAGES } from "./audit-messages";
import type { AuditServiceResult, AuditState } from "./audit-types";

export function startAuditLoad(previous: AuditState | null, contextChanged = false): AuditState {
  if (
    contextChanged ||
    !previous ||
    previous.status === "loading" ||
    previous.status === "error" ||
    previous.status === "blocked"
  ) {
    return { status: "loading", items: [] };
  }
  return {
    status: "refreshing",
    items: previous.items,
    generatedAt: "generatedAt" in previous ? previous.generatedAt : new Date().toISOString(),
    hasActiveSharedBudget:
      "hasActiveSharedBudget" in previous ? previous.hasActiveSharedBudget : false,
    activeSharedBudgetId: "activeSharedBudgetId" in previous ? previous.activeSharedBudgetId : null
  };
}

export function auditStateFromResult(result: AuditServiceResult): AuditState {
  if (!result.ok) {
    return result.reason === "blocked"
      ? { status: "blocked", items: [], message: AUDIT_MESSAGES.blocked }
      : { status: "error", items: [], message: result.message };
  }
  const base = {
    generatedAt: result.data.generatedAt,
    hasActiveSharedBudget: result.data.hasActiveSharedBudget,
    activeSharedBudgetId: result.data.activeSharedBudgetId
  };
  return result.data.items.length
    ? { status: "ready", items: result.data.items, ...base }
    : { status: "empty", items: [], ...base };
}

export function blockedAuditState(): AuditState {
  return { status: "blocked", items: [], message: AUDIT_MESSAGES.blocked };
}
