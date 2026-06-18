# Contract: Local Validation

## Purpose

Define the local workflow developers must be able to run before opening or
updating a Pull Request.

## Required Local Commands

Developers MUST be able to run:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Expected Outcome

- All commands exit successfully before a Pull Request is considered ready for
  review.
- Local success does not replace CI success; the Pull Request workflow remains
  authoritative for merge readiness.
- Local failure should identify the same category that would fail in CI.

## Documentation Contract

`docs/pr-quality-pipeline.md` MUST:

- List every required local command.
- Explain the order of validation categories.
- Explain that `npm run build` also runs typecheck, while CI keeps typecheck
  explicit for clearer Pull Request feedback.
- Explain that production secrets are not required.
- Link or describe the branch protection requirement for `main`.

## Out of Scope

- Automatically fixing formatting in CI.
- Running development server commands.
- Using production data or remote credentials.
