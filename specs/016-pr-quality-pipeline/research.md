# Research: F17 - Pipeline de Pull Request com lint, testes, typecheck e build

## Decision: Use GitHub Actions for Pull Request validation

**Rationale**: The repository is a Git project with Pull Request quality as the
feature target. GitHub Actions is the most direct way to publish clear status
checks on Pull Requests and supports branch protection required checks. No
existing workflow directory is present, so adding `.github/workflows/` is an
incremental change.

**Alternatives considered**:
- Manual local validation only: rejected because it does not publish Pull
  Request status or block merge.
- External CI provider: rejected because it adds integration scope and
  monitoring/account complexity outside F17.
- Pre-commit hooks only: rejected because local hooks can be bypassed and do not
  validate Pull Requests after new commits.

## Decision: Target the local principal branch `main`

**Rationale**: `git branch` shows `main` as the principal local branch. The
workflow should run on Pull Requests targeting `main`. The documentation should
explain that additional protected branches can be added if the repository later
adopts release branches.

**Alternatives considered**:
- Run on every branch target: rejected because it may create noise for
  experimental branches and is broader than the spec.
- Target `master`: rejected because no local `master` branch exists.
- Target feature branch names: rejected because PR quality gates should protect
  integration branches, not every temporary branch.

## Decision: Use `npm ci` for dependency installation

**Rationale**: The repository contains `package-lock.json`, so `npm ci` provides
reproducible dependency installation and fails if the lockfile is inconsistent
with `package.json`.

**Alternatives considered**:
- `npm install`: rejected because it may update or resolve dependencies less
  strictly in CI.
- pnpm/yarn: rejected because there is no pnpm or yarn lockfile in the
  repository.

## Decision: Keep validation categories as separate workflow steps

**Rationale**: The spec requires clear Pull Request status and fast diagnosis.
Although `npm run build` already runs `typecheck`, keeping `typecheck` as an
explicit step gives a named failure category and matches local validation
documentation.

**Alternatives considered**:
- Single combined script: rejected because it hides which quality category
  failed unless developers inspect logs deeply.
- Remove explicit `typecheck`: rejected because it makes type failures appear as
  build failures and reduces clarity.
- Parallel jobs for each category: deferred because it adds orchestration
  complexity and repeated installation cost. A single job with named steps is
  enough for F17.

## Decision: Validate formatting with existing `format:check`

**Rationale**: `package.json` includes `format:check`, satisfying the feature's
"when applicable" formatting requirement. The CI should run it as a required
category before lint so style issues fail clearly.

**Alternatives considered**:
- Skip format check: rejected because a script exists and the constitution
  requires formatting when applicable.
- Run `format`: rejected because CI should report problems, not mutate files.

## Decision: Add documentation under `docs/pr-quality-pipeline.md`

**Rationale**: The repository has a `docs/` directory and no root README file in
the current tree. A focused technical document avoids creating a broad README
only for this feature and can be linked from future contribution docs.

**Alternatives considered**:
- Root README update: rejected because no README exists to update.
- Inline comments only in workflow: rejected because developers need local
  commands and branch protection guidance outside CI YAML.

## Decision: Document branch protection as a manual repository setting

**Rationale**: Required status checks and merge blocking are repository settings,
not reliably enforced by versioned application code. The implementation should
name the expected check and document how maintainers configure branch protection
for `main`.

**Alternatives considered**:
- Attempt to configure branch protection in code: rejected because it requires
  repository admin credentials or external API automation outside F17.
- Ignore branch protection: rejected because FR-012 requires the merge policy to
  treat validations as blockers.

## Decision: Do not use secrets, production credentials, deploy, or monitoring

**Rationale**: The required validations are static/tooling checks and test/build
steps. They do not need production data or external services. Avoiding secrets
reduces privacy and security risk for PRs, including fork-like contexts if used
later.

**Alternatives considered**:
- Provide Supabase or production environment secrets: rejected because no F17
  requirement needs remote production access.
- Add deployment or preview environments: rejected as explicitly out of scope.

## Decision: No new dependencies are needed for F17

**Rationale**: The project already has npm scripts and tooling for the required
checks. GitHub Actions workflow files and documentation can be added without
runtime or dev dependency changes.

**Alternatives considered**:
- Add a CI helper package: rejected because no missing capability was found.
- Add E2E tooling: rejected because full E2E is out of scope and not required by
  the current repository state.
