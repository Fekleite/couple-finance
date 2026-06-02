# Contract: Session States

## States

| State | Meaning | UI behavior |
|-------|---------|-------------|
| `loading` | Initial session check or auth transition is in progress | Show loading state, do not render private content |
| `authenticated` | Valid session exists | Allow private routes and show current user context |
| `unauthenticated` | No valid session exists | Allow public routes and block private routes |
| `ending` | Logout is in progress | Disable logout action and show progress |
| `expired` | Previously valid session is no longer usable | Show calm session-expired feedback and route to login |
| `error` | Temporary auth check or provider failure | Show recoverable error and safe retry/navigation |

## Events

| Event | Expected transition |
|-------|---------------------|
| Initial check returns session | `loading` -> `authenticated` |
| Initial check returns null | `loading` -> `unauthenticated` |
| Sign in succeeds | `unauthenticated` -> `authenticated` |
| Sign up succeeds with immediate session | `unauthenticated` -> `authenticated` |
| Sign up requires confirmation | remain public and show confirmation guidance |
| Sign out starts | `authenticated` -> `ending` |
| Sign out succeeds | `ending` -> `unauthenticated` |
| Token refresh succeeds | remain `authenticated` |
| Session expires | `authenticated` -> `expired` |
| Password recovery event detected | show reset password flow |

## Security invariants

- Private content is never rendered in `loading`, `unauthenticated`, `ending`,
  `expired` or `error`.
- Tokens and sensitive session payloads are never logged.
- The frontend never stores tokens manually outside Supabase Auth behavior.
- Session state must be derived from Supabase Auth, not from visual UI state.

## Accessibility invariants

- Loading and error states must be understandable without color alone.
- Session-expired and logout feedback must be reachable by keyboard.
- Feedback should be announced where the implementation uses live regions.
