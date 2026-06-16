# Server State Policy

## Current F15 Baseline

Couple Finance does not use `@tanstack/react-query` in F15. Remote financial data is loaded by feature hooks that call existing Supabase-backed services and refresh only through controlled triggers such as initial load, user/couple context changes, filter changes, retry, mutations, or explicit domain events.

The current remote consumers covered by F15 are:

- `useTransactionList`
- `useDashboard`
- `useDashboardCharts`
- `useGoals`
- `useAuditEvents`
- `useCategories`
- `useCoupleRelationship`

## Focus Return Rule

Returning to the browser tab, window, or mobile app must not trigger a global or implicit remote reload. Loaded data, filters, periods, cursors, empty states, and safe error states should remain stable until a controlled trigger occurs.

Feature hooks must not add global `focus`, `visibilitychange`, or equivalent app-resume listeners to reload financial data unless the exception is documented, scoped, privacy-reviewed, and covered by tests.

## Controlled Update Rule

Financial mutations and explicit actions must keep refreshing the affected data through controlled flows. Retry, filter changes, period changes, authorization-context changes, invite acceptance, goal mutations, and audit refresh events remain valid update triggers.

Focus return must never be used as a substitute for updating data after create, edit, delete, invite, or goal actions.

## Future TanStack Query Rule

If `@tanstack/react-query` is introduced later, its central Query Client must set `refetchOnWindowFocus: false` by default. Query-level exceptions must be rare, documented near the query or in this policy, and covered by an objective verification.

Future use of `focusManager` must not re-enable focus-driven refresh globally. Any focus manager customization needs the same exception documentation, privacy review, and test coverage required for query-level exceptions.

TanStack Table is allowed for transaction presentation and must not be treated as TanStack Query.
