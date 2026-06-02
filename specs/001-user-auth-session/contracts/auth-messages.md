# Contract: Auth Messages

## Principles

- Use Portuguese, plain language and calm tone.
- Explain the next useful action.
- Do not expose tokens, provider internals or stack traces.
- Avoid revealing whether an e-mail exists except where the signup flow
  intentionally offers login/recovery for an already used e-mail.

## Required message categories

| Situation | Message intent |
|-----------|----------------|
| Missing required field | Tell the user what to fill in |
| Invalid e-mail format | Ask for a valid e-mail address |
| Weak password | Explain minimum password criteria |
| Password mismatch | Ask the user to repeat the same password |
| Invalid login | Say the e-mail or password is invalid without identifying which |
| Existing signup e-mail | Explain there is already an account and offer login/recovery |
| Signup success | Confirm account creation or required e-mail confirmation |
| Login success | Move to private area without unnecessary noise |
| Logout progress | Communicate that the app is ending the session |
| Logout success | Confirm private access ended |
| Session loading | Explain that private access is being checked |
| Session expired | Explain that the user needs to enter again |
| Recovery requested | Say instructions will be sent if an account exists |
| Recovery link invalid | Explain the link is invalid or expired and offer new request |
| Password updated | Confirm update and offer next step |
| Temporary failure | Ask user to retry soon without losing context |

## Forbidden message patterns

- "This e-mail does not exist" in password recovery.
- Raw Supabase or network exception text.
- Messages that imply transactions, dashboard, goals or shared budget are ready.
- Alarmist language for session expiration or recoverable failures.

## Accessibility requirements

- Field-level messages must be associated with the field.
- Global messages must be placed near the form heading or submit result area.
- Loading messages must not rely on spinner-only feedback.
