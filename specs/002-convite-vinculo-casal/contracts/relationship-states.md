# Contract: Relationship States

## State Shape

```ts
type RelationshipState =
  | { status: "loading" }
  | { status: "no_shared_budget" }
  | { status: "invitation_sent"; invitation: SentInvitationSummary }
  | { status: "invitation_received"; invitation: ReceivedInvitationSummary }
  | { status: "couple_linked"; sharedBudget: SharedBudgetSummary }
  | { status: "invitation_unavailable"; reason: UnavailableReason }
  | { status: "error"; message: string };
```

## Required Summaries

`SentInvitationSummary`:

- `id`
- `inviteeEmail`
- `status`
- `expiresAt`
- `createdAt`

`ReceivedInvitationSummary`:

- `id`
- `inviterLabel`
- `sharedBudgetName`
- `status`
- `expiresAt`
- `createdAt`

`SharedBudgetSummary`:

- `id`
- `name`
- `memberCount`
- `currentUserRole`

## State Priority

1. `loading` while session or relationship query is pending.
2. `couple_linked` when two active members exist in the user's budget.
3. `invitation_sent` when user created a budget and has a pending outgoing
   invitation.
4. `invitation_received` when user has no active budget and has a pending
   incoming invitation.
5. `no_shared_budget` when no active budget or pending invitation applies.
6. `invitation_unavailable` for invalid, terminal, expired, unauthorized or
   blocked invite links.
7. `error` for retryable service failures.

## Privacy Rules

- `loading` includes no invitation details.
- `invitation_unavailable` does not expose financial data or unrelated user
  details.
- `couple_linked` confirms shared context only; no balances or future financial
  data.
