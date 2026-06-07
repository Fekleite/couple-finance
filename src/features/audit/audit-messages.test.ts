import { describe, expect, it } from "vitest";

import {
  AUDIT_MESSAGES,
  auditActionLabel,
  auditItemLabel,
  auditVisibilityLabel,
  formatAuditCurrency
} from "./audit-messages";

describe("audit messages", () => {
  it("formats neutral action, item, money, visibility, empty, and error copy", () => {
    expect(auditActionLabel("updated")).toBe("atualizou");
    expect(auditItemLabel("goal")).toBe("meta");
    expect(auditVisibilityLabel("individual")).toBe("Individual");
    expect(formatAuditCurrency(12345)).toContain("123,45");
    expect(AUDIT_MESSAGES.empty).not.toMatch(/negado|sql|rls|id/i);
    expect(AUDIT_MESSAGES.error).not.toMatch(/negado|sql|rls|id/i);
  });
});
