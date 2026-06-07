import { beforeEach, describe, expect, it, vi } from "vitest";

import { clampAuditLimit, listAuditEvents, mapAuditRow } from "./audit-service";
import { createAuditRow } from "@/test/audit-test-utils";

const builders: unknown[] = [];

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => ({
    from: vi.fn((table: string) => {
      const rows =
        table === "budget_members" ? [{ shared_budget_id: "budget-1" }] : [createAuditRow()];
      const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        order: vi.fn(() => builder),
        limit: vi.fn(() => Promise.resolve({ data: rows, error: null }))
      };
      builders.push({ table, builder });
      return builder;
    })
  })
}));

describe("audit service", () => {
  beforeEach(() => builders.splice(0));

  it("maps authorized rows and generated context without totals", async () => {
    const result = await listAuditEvents({ limit: 10 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.items).toHaveLength(1);
    expect(result.data.items[0]).toMatchObject({
      subjectLabel: "Mercado",
      subjectAmountCents: 12345
    });
    expect(result.data.hasActiveSharedBudget).toBe(true);
    expect(result.data).not.toHaveProperty("total");
  });

  it("applies filters and clamps limits", async () => {
    await listAuditEvents({ limit: 500, itemType: "goal", visibility: "shared" });
    const auditBuilder = builders.find(
      (entry) => (entry as { table: string }).table === "financial_audit_events"
    ) as {
      builder: { eq: ReturnType<typeof vi.fn>; limit: ReturnType<typeof vi.fn> };
    };
    expect(auditBuilder.builder.eq).toHaveBeenCalledWith("item_type", "goal");
    expect(auditBuilder.builder.eq).toHaveBeenCalledWith("visibility", "shared");
    expect(auditBuilder.builder.limit).toHaveBeenCalledWith(100);
  });

  it("maps nullable amounts safely", () => {
    expect(
      mapAuditRow(createAuditRow({ subject_amount_cents: null })).subjectAmountCents
    ).toBeNull();
    expect(clampAuditLimit(0)).toBe(50);
  });
});
