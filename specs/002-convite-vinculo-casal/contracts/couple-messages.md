# Contract: Couple Messages

## Tone

- Neutral, welcoming and non-judgmental.
- Clear about roles: quem convidou, pessoa convidada, membro vinculado.
- No raw Supabase errors, SQL details, RLS details or financial values.

## Success Messages

| Event | Message intent |
|-------|----------------|
| Shared space created and invite sent | Confirm pending invitation and next step |
| Invitation accepted | Confirm both users now share the same space |
| Invitation declined | Confirm no link was created |
| Invitation cancelled | Confirm invite can no longer be accepted |

## Validation Messages

| Case | Message intent |
|------|----------------|
| Empty e-mail | Ask for partner e-mail |
| Invalid e-mail | Ask for a valid e-mail |
| Own e-mail | Explain user cannot invite themselves |
| Already linked | Explain MVP allows one active shared budget |

## Unavailable Messages

Use safe unavailable messaging for:

- Invitation does not exist.
- Invitation is expired.
- Invitation is cancelled.
- Invitation is declined.
- Invitation is already accepted.
- Current user is not inviter or invitee.
- Current user already belongs to another active shared budget.

Message must not reveal:

- Balances.
- Transactions.
- Goals.
- Categories.
- Whether an unrelated e-mail has an account.
- Internal policy or database failure details.

## Loading Messages

- Relationship state loading: no private details.
- Creating invite: action in progress.
- Accepting/declining/cancelling: action in progress.

## Error Messages

- Use retry-oriented messages for network or service failures.
- Do not display provider exception text.
- Do not log e-mails, tokens or payloads in user-facing channels.
