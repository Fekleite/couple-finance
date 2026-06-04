# Contract: Transaction Form

## Fields

| Field | Required | Default | Validation |
|-------|----------|---------|------------|
| Title | Yes | Empty | 1-120 after trim |
| Amount | Yes | Empty | R$ 0,01 to R$ 999.999.999,99 |
| Type | Yes | Explicit safe choice | `income` or `expense` |
| Date | Yes | Current civil date | Valid `YYYY-MM-DD` |
| Category | Yes | Empty | Active and applicable |
| Visibility | Yes | `individual` | Shared only when active |
| Responsible | Yes | Current person for individual | Active member for shared |
| Observation | No | Empty | Up to 500 after trim |

## Dynamic Rules

- Type change clears category when applicability no longer matches.
- Category unavailable before submit becomes field error; never use `other`
  automatically.
- Visibility individual sets responsible to current person and clears budget.
- Visibility shared requires active budget and eligible responsible.
- Context changes during submit are handled by database revalidation.

## Feedback

- Field errors stay associated with controls.
- Submission progress is perceptible and prevents duplicate local calls.
- Recoverable failure preserves safe reusable values.
- Authorization failures use safe global guidance and revalidate options.
- Success shows summary and `Registrar outra transacao`.

## Accessibility

- Visible labels and logical focus order.
- Keyboard operation for every field and action.
- Visible focus and touch-safe targets.
- Error/loading/success announcements without color-only meaning.
