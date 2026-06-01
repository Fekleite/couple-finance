# Contract: Auth Routes

## Public routes

| Route | Purpose | Authenticated behavior | Unauthenticated behavior |
|-------|---------|------------------------|--------------------------|
| `/` | Public product home | May show path to private area | Shows public home |
| `/login` | Login with e-mail and password | Redirect to private home | Shows login form |
| `/sign-up` | Account creation | Redirect to private home | Shows signup form |
| `/forgot-password` | Request recovery e-mail | Redirect to private home unless explicitly signing out first | Shows recovery request form |
| `/reset-password` | Define new password from valid recovery flow | Shows reset form when recovery session/link is valid | Shows invalid/expired recovery state |
| `*` | Not-found | Shows not-found with safe navigation | Shows not-found with safe navigation |

## Private routes

| Route | Purpose | Authenticated behavior | Unauthenticated behavior |
|-------|---------|------------------------|--------------------------|
| `/app` | Initial private area | Shows private home and logout | Redirects to `/login` after session check |

## Redirect rules

- Private routes must render a loading state while auth status is unknown.
- Private content must render only after status is `authenticated`.
- Unauthenticated access to private routes redirects to `/login`.
- Authenticated access to `/login` and `/sign-up` redirects to `/app`.
- Logout redirects to `/login` or public home after session is ended.
- Recovery links that are invalid or expired show a clear error and path to
  request a new recovery e-mail.

## Loop prevention

- Redirects must not bounce between public auth routes and private routes while
  session status is `loading`.
- Intended destination may be preserved for private routes, but only paths
  inside the app should be accepted.

## Copy constraints

- `/app` must not present dashboard, transactions, goals, charts or shared
  budget as available.
- Auth routes must use calm, action-oriented messages.
