# Contract: Auth Forms

## Common form behavior

- All forms must have a unique heading, clear description and submit button.
- Fields must have labels and associated error text.
- Required fields must be communicated programmatically and visually.
- Submit buttons must show loading state and prevent duplicate submission.
- Non-sensitive values such as e-mail may remain filled after recoverable
  errors.
- Password values should not be preserved after failed submissions unless needed
  for accessible correction and accepted by the implementation decision.

## Login form

**Fields**

- `email`: required, valid e-mail format.
- `password`: required.

**Success**

- Route to `/app`.

**Errors**

- Invalid credentials use generic message.
- Temporary provider/network failure offers retry.

## Signup form

**Fields**

- `email`: required, valid e-mail format.
- `password`: required, minimum criteria visible before submit.
- `confirmPassword`: required if included by implementation; must match.

**Success**

- If session is immediate, route to `/app`.
- If e-mail confirmation is required, show clear confirmation instructions.

**Errors**

- Existing e-mail offers path to login or recovery.
- Weak password explains criteria.
- Temporary provider/network failure offers retry.

## Forgot password form

**Fields**

- `email`: required, valid e-mail format.

**Success**

- Always show neutral confirmation: if an account exists, instructions will be
  sent.

**Errors**

- Invalid e-mail format is field-level.
- Temporary provider/network failure offers retry without losing e-mail.

## Reset password form

**Fields**

- `password`: required, minimum criteria visible.
- `confirmPassword`: required if included by implementation; must match.

**Success**

- Confirm password update and offer path to private area or login depending on
  resulting session state.

**Errors**

- Invalid or expired recovery link shows path to request a new e-mail.
- Weak password explains criteria.
- Temporary provider/network failure offers retry.

## Keyboard and screen reader behavior

- Focus order follows heading, description, fields, field errors, submit, then
  secondary navigation.
- First invalid field receives focus or is clearly announced after validation.
- Global success/error feedback is announced when practical.
