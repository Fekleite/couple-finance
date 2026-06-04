import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260605000000_list_filter_financial_transactions.sql?raw";

describe("transaction list migration", () => {
  it("keeps authorization under RLS with stable cursor pagination and minimal grants", () => {
    expect(migration).toContain("language plpgsql security invoker set search_path = ''");
    expect(migration).toContain("transaction_date desc, created_at desc, id desc");
    expect(migration).toContain("limit page_size_input + 1");
    expect(migration).toContain("revoke all on function public.list_financial_transactions");
    expect(migration).not.toContain("security definer");
  });

  it("validates input and derives coordinated authorized output without counts", () => {
    expect(migration).toContain("transaction_list_invalid_query");
    expect(migration).toContain("private.normalize_transaction_search");
    expect(migration).toContain("'has_authorized_month_data'");
    expect(migration).toContain("'category_options'");
    expect(migration).toContain("'responsible_options'");
    expect(migration).not.toMatch(/count\s*\(/i);
  });
});
