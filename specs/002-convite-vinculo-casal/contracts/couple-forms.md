# Contract: Couple Forms

## Create Shared Budget and Invite

Fields:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `inviteeEmail` | email string | Yes | Trim, lowercase for comparison, valid e-mail, not current user's e-mail |

Behavior:

- Submit creates shared budget, creator membership and pending invitation.
- Submit is disabled while loading.
- Recoverable failures preserve the typed e-mail.
- Success transitions to `invitation_sent`.

Accessibility:

- E-mail field has visible label.
- Validation message is associated with the field.
- Submit loading state is announced or perceivable.
- Keyboard submit works.

## Accept Invitation

Inputs:

- No user-entered fields.
- Action requires authenticated user and authorized pending invitation.

Behavior:

- Submit calls accept operation/RPC.
- Success transitions to `couple_linked`.
- Repeated submit returns existing final state or safe unavailable message.

Accessibility:

- Button text identifies acceptance clearly.
- Loading state prevents duplicate action.
- Focus remains predictable after result.

## Decline Invitation

Inputs:

- No user-entered fields.

Behavior:

- Submit marks pending authorized invitation as `declined`.
- No membership is created.
- Success returns user to `no_shared_budget` or safe confirmation state.

Accessibility:

- Button text identifies refusal clearly.
- Action is distinguishable without relying only on color.

## Cancel Sent Invitation

Inputs:

- No user-entered fields.

Behavior:

- Submit marks pending invitation sent by current user as `cancelled`.
- No partner membership is created.
- Future attempts to accept show unavailable state.

Accessibility:

- Button text identifies cancellation clearly.
- Loading and result feedback are perceivable.
