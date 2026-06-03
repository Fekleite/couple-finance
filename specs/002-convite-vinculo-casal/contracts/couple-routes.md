# Contract: Couple Routes

## Private routes

| Route | Purpose | Authenticated behavior | Unauthenticated behavior |
|-------|---------|------------------------|--------------------------|
| `/app` | Relationship state home | Shows current relationship state and one primary action | ProtectedRoute redirects to `/login` after session check |
| `/app/invites/:invitationId` | Invitation detail/response | Shows authorized invitation state or safe unavailable state | Redirects to `/login` with return path if supported safely |

## Route Metadata

- `PRIVATE_ROUTES.app` remains the authenticated home.
- Add route metadata for invitation detail if implemented as a dedicated route.
- Route titles must avoid financial data and identify only the feature context.

## Rendering Rules

- Private content must not render while auth status is unknown.
- Invitation detail must not render inviter, invitee or budget context until
  authorization is confirmed.
- Unrelated users see a safe unavailable message, not raw 404/RLS errors.
- Authenticated users already linked to another active budget see a blocked
  action message when opening a valid invite.

## Redirect Rules

- Unauthenticated invite recipients are told to sign in or create an account
  before accepting or declining.
- Return paths may preserve only internal app paths.
- No redirect should bounce between `/login`, `/app` and invite routes.

## Out of Scope

- Dashboard, transactions, categories, goals and charts routes are not created
  by F02.
