import { describe, expect, it } from "vitest";

import { createSafeAuditSnapshot, normalizeAuditLabel } from "./audit-safe-snapshot";

describe("audit safe snapshot", () => {
  it("normalizes labels and keeps only allowed safe fields", () => {
    expect(normalizeAuditLabel("  Meta   da casa  ")).toBe("Meta da casa");
    expect(
      createSafeAuditSnapshot({
        label: "  Meta da casa  ",
        amountCents: 5000,
        date: "2026-06-07",
        status: "completed",
        summaryKey: "goal_completed"
      })
    ).toMatchObject({
      subjectLabel: "Meta da casa",
      subjectAmountCents: 5000,
      subjectDate: "2026-06-07",
      subjectStatus: "completed"
    });
  });

  it("drops unsafe status and amount values without diff payloads", () => {
    const snapshot = createSafeAuditSnapshot({
      label: "",
      amountCents: -1,
      status: "private",
      summaryKey: "transaction_created"
    });
    expect(snapshot).toEqual({
      subjectLabel: "Item financeiro",
      subjectAmountCents: null,
      subjectDate: null,
      subjectStatus: null,
      summaryKey: "transaction_created"
    });
    expect(snapshot).not.toHaveProperty("diff");
  });
});
