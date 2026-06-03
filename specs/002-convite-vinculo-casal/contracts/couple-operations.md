# Contract: Couple Operations

## `getRelationshipState()`

Purpose:

- Resolve current authenticated user's relationship state for `/app`.

Authorization:

- Requires authenticated session.
- Reads only rows allowed by RLS.

Returns:

- `RelationshipState`.

Failure:

- Retryable service errors map to `error`.
- Unauthorized rows must behave as absent/unavailable.

## `createSharedBudgetAndInvite(inviteeEmail)`

Purpose:

- Create active shared budget, creator membership and pending invitation.

Preconditions:

- Current user is authenticated.
- Current user has no active membership.
- `inviteeEmail` is valid and not current user's e-mail.
- Current user has no existing active shared budget.

Postconditions:

- One active `shared_budgets` row.
- One active creator `budget_members` row.
- One pending `budget_invitations` row with `expires_at = created_at + 7 days`.

Failure:

- Existing active membership blocks creation.
- Duplicate pending invite blocks or reuses existing pending state according to
  implementation decision.

## `getInvitation(invitationId)`

Purpose:

- Resolve a specific invitation URL for the current user.

Authorization:

- Inviter can view sent invite.
- Invitee can view invite addressed to authenticated e-mail.
- Unrelated users receive `invitation_unavailable`.

Privacy:

- No financial data is returned.

## `acceptInvitation(invitationId)`

Purpose:

- Atomically link invitee to inviter's shared budget.

Preconditions:

- Current user is authenticated.
- Invitation is pending and not expired.
- Current user's normalized e-mail equals `invitee_email_normalized`.
- Current user has no active membership.
- Shared budget has fewer than two active members.

Postconditions:

- Partner active membership exists exactly once.
- Invitation status is `accepted`.
- `responded_at` is set.
- Relationship state becomes `couple_linked`.

Consistency:

- Repeated attempts do not create duplicate members.
- Concurrent attempts produce one accepted result or safe unavailable/blocked
  result.

## `declineInvitation(invitationId)`

Purpose:

- Let invitee refuse a pending invitation.

Preconditions:

- Current user is authenticated invitee.
- Invitation is pending and not expired.

Postconditions:

- Invitation status is `declined`.
- `responded_at` is set.
- No member row is created.

## `cancelInvitation(invitationId)`

Purpose:

- Let inviter cancel a pending sent invitation.

Preconditions:

- Current user is authenticated inviter.
- Invitation is pending and not expired.

Postconditions:

- Invitation status is `cancelled`.
- `responded_at` is set.
- No partner member row is created.

## RLS and RPC Notes

- Direct table operations must be protected by RLS.
- Multi-table operations should use database functions/RPC where atomicity is
  required.
- If `security definer` is required, set explicit `search_path`, revoke broad
  execution and document why `security invoker` was insufficient.
