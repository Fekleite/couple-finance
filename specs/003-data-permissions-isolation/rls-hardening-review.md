# RLS Hardening Review: F03

## Review Checklist

- [x] `shared_budgets`, `budget_members` and `budget_invitations` have RLS enabled.
- [x] Current SELECT policies are limited to `authenticated` users.
- [x] Shared budget visibility depends on active membership.
- [x] Member visibility is limited to own membership or active shared-budget membership.
- [x] Invitation visibility is limited to inviter or authenticated invitee email.
- [x] Invitation states do not grant shared financial access before acceptance.
- [x] Security definer functions use explicit `search_path`.
- [x] RPC execute grants are revoked from `public` and granted to `authenticated`.
- [x] Policies and future query contracts do not use `user_metadata`.
- [x] Columns used by membership and invitation filters have indexes.

## Result

Existing F02 migrations already cover the F03 contract after the prior recursion
and RPC grant fixes. No incremental SQL hardening migration was required for
this implementation pass.

## US1 Validation Notes

- Individual records are represented by the `user_id = auth.uid()` future-table
  pattern and by frontend matrix tests that require `isOwner`.
- Shared budget access is represented by active `budget_members` membership and
  blocked for unrelated authenticated users.
- Loading states classify visibility as `unknown_loading` and do not render
  private resource details.

## Final Manual Validation Notes

Manual Supabase validation should be performed with three real users before
shipping a hosted environment:

- User A creates the shared space and sees only the pending invitation context
  before acceptance.
- User B sees only the invitation addressed to their authenticated e-mail before
  acceptance.
- Users A and B see the active shared context only after acceptance.
- User C receives unavailable-state guidance for unrelated invitation or shared
  budget attempts.

