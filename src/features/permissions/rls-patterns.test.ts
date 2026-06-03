import { describe, expect, it } from "vitest";

import createCoupleLinkingMigration from "../../../supabase/migrations/20260602000000_create_couple_linking.sql?raw";
import fixRecursionMigration from "../../../supabase/migrations/20260602015325_fix_budget_members_rls_recursion.sql?raw";
import fixInviteRpcMigration from "../../../supabase/migrations/20260602015822_fix_create_invite_status_ambiguity.sql?raw";

const migration = [createCoupleLinkingMigration, fixRecursionMigration, fixInviteRpcMigration].join(
  "\n"
);

describe("rls patterns", () => {
  it("enables RLS for current F02 tables", () => {
    expect(migration).toMatch(/alter table public\.shared_budgets enable row level security/i);
    expect(migration).toMatch(/alter table public\.budget_members enable row level security/i);
    expect(migration).toMatch(/alter table public\.budget_invitations enable row level security/i);
  });

  it("limits policies to authenticated users and active memberships", () => {
    expect(migration).toMatch(/to authenticated/i);
    expect(migration).toMatch(/current_user_has_active_budget_membership/i);
    expect(migration).not.toMatch(/user_metadata/i);
  });

  it("covers invitation RPCs with restricted grants", () => {
    for (const fn of [
      "accept_invitation",
      "decline_invitation",
      "cancel_invitation",
      "create_shared_budget_and_invite"
    ]) {
      expect(migration).toMatch(new RegExp(`revoke all on function public\\.${fn}`, "i"));
      expect(migration).toMatch(new RegExp(`grant execute on function public\\.${fn}`, "i"));
    }
  });

  it("indexes policy and lookup columns", () => {
    expect(migration).toMatch(/budget_members_budget_status_idx/i);
    expect(migration).toMatch(/budget_invitations_invitee_status_expires_idx/i);
    expect(migration).toMatch(/budget_invitations_inviter_status_idx/i);
  });
});
