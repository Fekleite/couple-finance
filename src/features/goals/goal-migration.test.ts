import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260606000000_create_financial_goals.sql?raw";

describe("financial goals migration", () => {
  it("defines storage, privacy constraints, indexes, RLS, grants, and RPC names", () => {
    expect(migration).toContain("create table if not exists public.financial_goals");
    expect(migration).toContain("target_amount_cents bigint not null check");
    expect(migration).toContain("current_amount_cents bigint not null check");
    expect(migration).toContain("visibility in ('individual', 'shared')");
    expect(migration).toContain("status in ('active', 'completed', 'archived')");
    expect(migration).toContain("financial_goals_creator_status_updated_idx");
    expect(migration).toContain("financial_goals_shared_status_updated_idx");
    expect(migration).toContain("alter table public.financial_goals enable row level security");
    expect(migration).toContain("grant select on table public.financial_goals to authenticated");
    expect(migration).not.toMatch(/grant (insert|update|delete) on table public\.financial_goals/i);
  });

  it("keeps individual and shared authorization no-inference safe", () => {
    expect(migration).toContain(
      "visibility = 'individual' and created_by_user_id = (select auth.uid())"
    );
    expect(migration).toContain("budgets.status = 'active'");
    expect(migration).toContain("members.status = 'active'");
    expect(migration).toContain("goal_shared_context_unavailable");
    expect(migration).toContain("goal_unavailable");
    expect(migration).toContain("for update");
    expect(migration).toContain("language plpgsql");
    expect(migration).toContain("security definer");
    expect(migration).toContain("security invoker");
    expect(migration).toContain("public.create_individual_goal");
    expect(migration).toContain("public.create_shared_goal");
    expect(migration).toContain("public.update_goal");
    expect(migration).toContain("public.complete_goal");
    expect(migration).toContain("public.archive_goal");
  });
});
