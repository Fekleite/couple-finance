import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260605020000_basic_financial_charts.sql?raw";
import fixMigration from "../../../supabase/migrations/20260605195349_fix_dashboard_charts_budget_member_order.sql?raw";

describe("dashboard chart migration", () => {
  it("creates a security invoker RPC with fixed search path and authenticated grant", () => {
    expect(migration).toContain("public.get_financial_dashboard_charts");
    expect(migration).toContain("language plpgsql security invoker set search_path = ''");
    expect(migration).toContain("grant execute on function public.get_financial_dashboard_charts");
    expect(migration).not.toContain("security definer");
  });

  it("validates query inputs and returns no raw transaction details", () => {
    expect(migration).toContain("financial_dashboard_charts_invalid_query");
    expect(migration).toContain("evolution_month_count_input not between 1 and 12");
    expect(migration).not.toContain("'title'");
    expect(migration).not.toContain("'observation'");
  });

  it("aggregates category expenses with basis-point weights and deterministic ordering", () => {
    expect(migration).toContain("'category_distribution'");
    expect(migration).toContain("where transaction_type = 'expense'");
    expect(migration).toContain("'weight_basis_points'");
    expect(migration).toContain(
      "order by sum(amount_cents) desc, category_label asc, category_code asc"
    );
  });

  it("generates a six-month evolution window including empty months and selected-month marker", () => {
    expect(migration).toContain("generate_series(evolution_start, month_start_input");
    expect(migration).toContain("'monthly_evolution'");
    expect(migration).toContain("'is_selected_month'");
    expect(migration).toContain("'has_authorized_month_data'");
  });

  it("keeps member comparison shared-only and unavailable without an active shared budget", () => {
    expect(migration).toContain("'member_comparison'");
    expect(migration).toContain("transactions.visibility = 'shared'");
    expect(migration).toContain("transactions.shared_budget_id = active_shared_budget_id");
    expect(migration).toContain("'unavailable_shared'");
    expect(migration).toContain("responsible_user_id");
    expect(migration).not.toContain("joined_at");
  });

  it("keeps the applied-RPC fix on existing budget_members columns", () => {
    expect(fixMigration).toContain("public.get_financial_dashboard_charts");
    expect(fixMigration).toContain("order by members.created_at desc, members.id desc");
    expect(fixMigration).not.toContain("joined_at");
  });
});
