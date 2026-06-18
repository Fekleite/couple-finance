# Quickstart: F17 - Pipeline de Pull Request com lint, testes, typecheck e build

## 1. Confirm Repository Baseline

```bash
git branch --show-current
test -f package-lock.json
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Expected result: current branch is the feature branch, `package-lock.json`
exists, and all quality commands pass locally.

## 2. Inspect Planned Workflow

After implementation, verify the workflow file exists:

```bash
test -f .github/workflows/pull-request-quality.yml
```

Check that it:

- runs on Pull Requests targeting `main`;
- installs dependencies with `npm ci`;
- has clearly named steps for format check, lint, typecheck, tests, and build;
- does not reference production secrets;
- does not deploy.

## 3. Validate Local Documentation

After implementation, verify documentation exists:

```bash
test -f docs/pr-quality-pipeline.md
```

Confirm it documents:

- local commands for every required validation category;
- expected Pull Request workflow behavior;
- branch protection setup for `main`;
- no requirement for production credentials.

## 4. Validate Failure Behavior

Use code review or a temporary local change to confirm each category would fail
clearly:

- formatting issue fails `npm run format:check`;
- lint issue fails `npm run lint`;
- type issue fails `npm run typecheck`;
- failing test fails `npm run test:run`;
- build issue fails `npm run build`.

Do not commit intentional failures.

## 5. Pull Request Verification

Open or update a Pull Request targeting `main` and verify:

- the Pull Request quality workflow starts automatically;
- step names are understandable;
- the overall check fails if any required step fails;
- the overall check passes only when all required steps pass.

## 6. Branch Protection Setup

After the workflow exists on the remote repository, a maintainer with repository
admin permission should configure branch protection for `main`:

- require status checks before merging;
- require the Pull Request quality workflow check;
- require a fresh check after new commits when available;
- keep deployment checks out of scope for F17.

## 7. Final Local Validation

Run the final local validation before marking implementation complete:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```
