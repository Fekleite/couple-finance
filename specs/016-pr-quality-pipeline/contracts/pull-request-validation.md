# Contract: Pull Request Validation

## Purpose

Define the required behavior of the automated Pull Request quality workflow.

## Trigger Contract

- The workflow MUST run for Pull Requests targeting `main`.
- The workflow MUST rerun when a Pull Request receives new commits.
- The workflow MAY be extended to additional principal branches when those
  branches are documented as protected integration targets.

## Required Categories

The workflow MUST expose clear, named steps for:

1. Dependency installation with `npm ci`.
2. Format check with `npm run format:check`.
3. Lint with `npm run lint`.
4. Typecheck with `npm run typecheck`.
5. Automated tests with `npm run test:run`.
6. Build with `npm run build`.

## Result Contract

- A successful run means every required category completed successfully for the
  current Pull Request commit.
- A failed category MUST fail the overall run.
- A cancelled, timed out, skipped, or incomplete required category MUST NOT be
  treated as success.
- The Pull Request status MUST make the failing category identifiable from the
  check summary or logs.

## Security Contract

- The workflow MUST NOT require production secrets.
- The workflow MUST NOT deploy artifacts.
- The workflow MUST NOT print private credentials or financial data.
- The workflow MUST use repository code and package metadata only.

## Non-Goals

- No production deployment.
- No preview environment.
- No external monitoring integration.
- No full E2E test suite unless one already exists and is explicitly added in a
  later feature.
