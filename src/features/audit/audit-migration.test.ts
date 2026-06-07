import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260607000000_create_financial_audit_events.sql?raw";

describe("financial audit migration", () => {
  it("defines audit storage, closed constraints, indexes, RLS, and grants", () => {
    expect(migration).toContain("create table if not exists public.financial_audit_events");
    expect(migration).toContain("item_type in ('transaction', 'goal')");
    expect(migration).toContain(
      "action_type in ('created', 'updated', 'completed', 'archived', 'removed_from_main_flow')"
    );
    expect(migration).toContain("visibility in ('individual', 'shared')");
    expect(migration).toContain("financial_audit_events_owner_recent_idx");
    expect(migration).toContain("financial_audit_events_shared_recent_idx");
    expect(migration).toContain("financial_audit_events_item_recent_idx");
    expect(migration).toContain(
      "alter table public.financial_audit_events enable row level security"
    );
    expect(migration).toContain(
      "grant select on table public.financial_audit_events to authenticated"
    );
    expect(migration).not.toMatch(
      /grant (insert|update|delete) on table public\.financial_audit_events/i
    );
  });

  it("keeps individual and shared read policies authorization scoped", () => {
    expect(migration).toContain("owner_user_id = (select auth.uid())");
    expect(migration).toContain("budgets.status = 'active'");
    expect(migration).toContain("members.status = 'active'");
    expect(migration).toContain("Authorized people can read shared financial audit events");
  });

  it("registers transaction and goal events atomically inside private RPCs", () => {
    expect(migration).toContain("private.record_financial_audit_event");
    expect(migration).toContain("transaction_created");
    expect(migration).toContain("goal_created");
    expect(migration).toContain("goal_updated");
    expect(migration).toContain("goal_completed");
    expect(migration).toContain("goal_archived");
    expect(migration).toContain("security definer");
    expect(migration).toContain("set search_path = ''");
  });

  it("documents privacy boundaries for snapshots and direct writes", () => {
    expect(migration).toContain("summary_key in (");
    expect(migration).toContain("subject_label = btrim(subject_label)");
    expect(migration).toContain("subject_status is null or subject_status in");
    expect(migration).toContain("owner_user_id is not null and shared_budget_id is null");
    expect(migration).toContain("shared_budget_id is not null");
  });
});
