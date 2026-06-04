import { describe, expect, it } from "vitest";

import migration from "../../../supabase/migrations/20260604000000_create_financial_transactions.sql?raw";

describe("financial transaction migration", () => {
  it("defines exact storage constraints, indexes, grants, and RPC-only mutation", () => {
    expect(migration).toContain(
      "amount_cents bigint not null check (amount_cents between 1 and 99999999999)"
    );
    expect(migration).toContain("unique (created_by_user_id, idempotency_key)");
    expect(migration).toContain("financial_transactions_creator_date_idx");
    expect(migration).toContain("financial_transactions_shared_date_idx");
    expect(migration).toContain("revoke all on table public.financial_transactions");
    expect(migration).toContain(
      "grant select on table public.financial_transactions to authenticated"
    );
    expect(migration).not.toMatch(
      /grant (insert|update|delete) on table public\.financial_transactions/i
    );
  });

  it("revalidates category, active shared membership, idempotency, and RLS safely", () => {
    expect(migration).toContain("categories.is_active");
    expect(migration).toContain("budgets.status = 'active'");
    expect(migration).toContain("members.status = 'active'");
    expect(migration).toContain("transaction_submission_conflict");
    expect(migration).toContain("for update");
    expect(migration).toContain(
      "visibility = 'individual' and created_by_user_id = (select auth.uid())"
    );
    expect(migration).toContain("language plpgsql security definer set search_path = ''");
    expect(migration).toContain("language sql security invoker set search_path = ''");
  });
});
