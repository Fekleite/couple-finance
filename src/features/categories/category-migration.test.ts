import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260603000000_create_standard_financial_categories.sql?raw";

describe("standard financial categories migration", () => {
  it("defines constraints and an idempotent eleven-category seed", () => {
    expect(migration).toContain("code text primary key");
    expect(migration).toContain("sort_order smallint not null unique check (sort_order > 0)");
    expect(migration).toContain("applicability in ('income', 'expense', 'both')");
    expect(migration).toContain("on conflict (code) do update");
    for (const code of [
      "income",
      "housing",
      "food",
      "transportation",
      "health",
      "bills",
      "education",
      "shopping",
      "leisure",
      "investments",
      "other"
    ]) {
      expect(migration).toContain(`('${code}',`);
    }
  });

  it("allows authenticated reads and denies client mutations", () => {
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("for select");
    expect(migration).toContain("to authenticated");
    expect(migration).toContain(
      "revoke all on table public.standard_financial_categories from public, anon, authenticated"
    );
    expect(migration).toContain(
      "grant select on table public.standard_financial_categories to authenticated"
    );
    expect(migration).not.toMatch(/grant (insert|update|delete)/i);
  });
});
