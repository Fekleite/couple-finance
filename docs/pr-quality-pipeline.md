# Pull Request quality pipeline

## Purpose

Every Pull Request targeting `main` must pass the automated quality pipeline
before it is considered ready to merge. The pipeline protects the existing
financial application behavior by validating formatting, lint, type safety,
tests, and build output without changing product runtime code.

## Required Pull Request check

The workflow is defined in `.github/workflows/pull-request-quality.yml`.

- Workflow name: `Pull Request Quality`
- Required job/check name: `Pull Request Quality`
- Protected branch: `main`
- Trigger: Pull Requests targeting `main`
- Dependency installation: `npm ci`

GitHub automatically reruns the workflow when a Pull Request receives new
commits. The latest head commit is the only version that should be treated as
ready for merge.

## CI validation order

The Pull Request workflow runs these required categories in order:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Any non-zero exit code fails the job. Failed, cancelled, timed out, skipped,
stale, pending, missing, or incomplete workflow results are not successful
validation and must not be treated as merge-ready.

## Local validation

Run the same commands locally before opening or updating a Pull Request:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Local success helps catch problems early, but it does not replace the Pull
Request workflow result. The remote Pull Request check remains authoritative for
merge readiness.

`npm run build` already executes typecheck as part of the build script. The CI
workflow still keeps `npm run typecheck` as a separate step so type failures are
visible as their own Pull Request failure category instead of being reported
only as build failures.

## Troubleshooting failures

Use the failed step name in the Pull Request check to choose the local command
to rerun:

| Failed step                      | Local command          | What to check                                                       |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Install dependencies with npm ci | `npm ci`               | `package.json` and `package-lock.json` must be in sync.             |
| Check formatting                 | `npm run format:check` | Run the formatter locally and commit formatting changes.            |
| Run lint                         | `npm run lint`         | Fix ESLint errors and warnings; the script uses `--max-warnings=0`. |
| Run typecheck                    | `npm run typecheck`    | Fix TypeScript errors in app and Node/Vite config projects.         |
| Run automated tests              | `npm run test:run`     | Fix failing Vitest tests or broken test setup.                      |
| Build application                | `npm run build`        | Fix typecheck or Vite production build failures.                    |

If dependency installation fails, later validation categories may not run. Treat
that as a failed quality validation, not as a partial success.

## Branch protection setup

Branch protection is a repository setting, so maintainers must configure it
after the workflow exists on the remote repository.

For `main`, enable branch protection with these expectations:

- require status checks before merging;
- require the `Pull Request Quality` check;
- require branches to be up to date before merging when that option is
  available for the repository;
- treat failed, cancelled, pending, stale, missing, or skipped required checks
  as merge blockers;
- keep deployment and preview environment checks out of scope for this feature.

Maintainers need repository admin permissions to apply this setting. If the
project later adopts additional principal integration or release branches,
document them before adding those branches to the workflow and branch protection
policy.

## Security notes

The Pull Request quality workflow does not require production secrets,
deployment credentials, Supabase credentials, monitoring tokens, or production
financial data. It uses repository source files and package metadata only.

Do not add deployment, preview environment, external monitoring, or production
credential steps to this workflow as part of F17.
