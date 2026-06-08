# F11 Essential Flow Audit Checklist

**Feature**: F11 - Responsividade e acessibilidade base
**Review date**: 2026-06-08
**Scope**: Existing MVP flows only; no backend, RLS, ownership, or persistence changes.

## Mobile, Tablet, And Desktop Review

- [x] Auth: login, sign-up, forgot-password, and reset-password containers remain constrained, readable, and free of mandatory horizontal scroll.
- [x] Private home: authenticated shell exposes reachable primary navigation and sign-out on narrow screens.
- [x] Couple invitation: existing safe relationship states remain covered by relationship-state tests and safe messages.
- [x] Permissions: unavailable/empty permission states use neutral messages that do not distinguish missing, removed, or unauthorized data.
- [x] Categories: selector options wrap long category labels and remain keyboard-operable radio controls.
- [x] Transactions: form fields, radio groups, category selector, textarea, submit action, filters, list items, long titles, large values, dates, and visibility labels wrap without losing actions.
- [x] Dashboard: indicators, period controls, recent transactions, chart section, and retry states stack on mobile and preserve text summaries.
- [x] Charts: chart cards keep accessible summaries and authorized-data messaging available without relying only on visual encodings.
- [x] Goals: forms, cards, progress text, large amounts, long names, and actions remain reachable and readable.
- [x] Audit: loading, empty, error, retry, timestamps, event text, values, and financial context wrap and remain safe.

## Keyboard, Focus, Enlarged Text, And Assistive Review

- [x] Skip link targets the main landmark and the main content can receive programmatic focus.
- [x] Private navigation links and sign-out are reachable in logical keyboard order.
- [x] Shared buttons, inputs, fields, form errors, retry actions, and navigation links keep visible focus styles.
- [x] Auth fields expose labels, invalid state, and associated field errors.
- [x] Transaction controls expose labels, fieldsets, radio names, error association, and preserved safe input after validation/recoverable errors.
- [x] Dashboard indicators and charts expose textual summaries and named regions.
- [x] Goals expose textual progress summaries and accessible action names.
- [x] Audit events use semantic articles, readable timestamps, and safe actor/context labels.

## Safe Message Review

- [x] Auth and recovery messages avoid account-existence confirmation and internal detail.
- [x] No-shared-relationship and invitation states avoid hidden financial-data inference.
- [x] Permission-unavailable messages use neutral language for missing, removed, or unauthorized data.
- [x] Category empty/error messages avoid backend details and expose retry guidance.
- [x] Transaction validation and recoverable save failures preserve safe user input.
- [x] Dashboard empty/error/retry messages refer only to authorized available data.
- [x] Goal empty/error/action messages avoid inaccessible goal inference.
- [x] Audit empty/error/retry messages avoid SQL, RLS, IDs, counts, and inaccessible item detail.

## Validation Results

- [x] `npm run typecheck` passed on 2026-06-08.
- [x] `npm run test:run` passed on 2026-06-08.
- [x] `npm run lint` passed on 2026-06-08.
- [x] `npm run format:check` passed on 2026-06-08.
- [x] `npm run build` passed on 2026-06-08.
