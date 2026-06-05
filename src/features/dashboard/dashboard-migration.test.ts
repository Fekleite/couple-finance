import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260605010000_financial_dashboard_initial.sql?raw";

describe("dashboard migration", () => {
  it("creates a security invoker RPC with fixed search path and authenticated grant", () => {
    expect(migration).toContain("public.get_financial_dashboard");
    expect(migration).toContain("language plpgsql security invoker set search_path = ''");
    expect(migration).toContain("grant execute on function public.get_financial_dashboard");
    expect(migration).not.toContain("security definer");
  });

  it("validates month inputs, aggregates indicators and returns only concise recent items", () => {
    expect(migration).toContain("financial_dashboard_invalid_query");
    expect(migration).toContain("transaction_date >= month_start_input");
    expect(migration).toContain("transaction_date desc, created_at desc, id desc");
    expect(migration).toContain("least(recent_limit_input, 10)");
    expect(migration).toContain("'has_authorized_month_data'");
    expect(migration).not.toContain("'observation'");
  });
});
