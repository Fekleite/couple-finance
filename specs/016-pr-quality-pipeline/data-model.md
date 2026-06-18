# Data Model: F17 - Pipeline de Pull Request com lint, testes, typecheck e build

This feature does not add application persistence. The model below is
conceptual and describes CI/repository entities used by the implementation and
documentation.

## Pull Request

**Represents**: A proposed change submitted for review before merging into a
principal branch.

**Fields**:
- `target_branch`: branch the PR wants to merge into.
- `head_commit`: current commit SHA being validated.
- `validation_status`: pending, success, failure, cancelled, or skipped.
- `merge_readiness`: ready only when all required validations pass.

**Relationships**:
- Targets one Principal Branch.
- Has zero or more Quality Validation Runs over time.

**Validation Rules**:
- PRs targeting `main` must trigger a Quality Validation Run.
- A new commit invalidates previous readiness and requires a new run.
- Failed, cancelled, expired, incomplete, or skipped required checks must not be
  treated as merge-ready.

## Principal Branch

**Represents**: A protected branch used as a stable integration target.

**Fields**:
- `name`: `main` for the first implementation.
- `required_checks`: required validation checks that must pass before merge.
- `protection_status`: configured or pending manual repository setup.

**Relationships**:
- Receives Pull Requests.
- Is governed by a Branch Protection Rule.

**Validation Rules**:
- `main` must require the Pull Request quality check after maintainers configure
  repository settings.
- Additional principal branches may be added later if documented.

## Quality Validation Run

**Represents**: One automated CI evaluation for a specific Pull Request commit.

**Fields**:
- `trigger`: Pull Request opened, reopened, synchronized, or ready for review.
- `commit`: commit SHA being evaluated.
- `status`: queued, in progress, success, failure, cancelled, or timed out.
- `categories`: ordered Validation Categories.

**Relationships**:
- Belongs to one Pull Request commit.
- Contains multiple Validation Categories.

**Validation Rules**:
- Overall success requires every required category to pass.
- Installation/preparation failure fails the run.
- Cancellation or timeout is not success.

## Validation Category

**Represents**: A named quality gate executed locally and in CI.

**Fields**:
- `name`: dependency installation, format check, lint, typecheck, tests, or
  build.
- `local_command`: command developers run locally.
- `ci_step_name`: human-readable workflow step name.
- `required`: true for all F17 categories.
- `result`: success, failure, skipped, cancelled, or not run.

**Validation Rules**:
- `format:check` is required because the project has a formatting script.
- `typecheck` remains explicit even though build also runs it, because the PR
  status must identify type failures clearly.
- Any required category failure fails the Quality Validation Run.

## Workflow Configuration

**Represents**: The versioned CI workflow file.

**Fields**:
- `path`: `.github/workflows/pull-request-quality.yml`.
- `event`: Pull Request targeting `main`.
- `node_setup`: Node/npm setup compatible with the project lockfile.
- `install_command`: `npm ci`.
- `validation_commands`: project scripts for required categories.

**Validation Rules**:
- Must not require secrets or production credentials.
- Must not deploy.
- Must use commands available in `package.json`.
- Must make step names clear in Pull Request logs.

## Branch Protection Rule

**Represents**: Repository setting that turns successful CI into a merge gate.

**Fields**:
- `branch_pattern`: `main`.
- `required_status_check`: the CI job/check produced by the workflow.
- `merge_blocking`: enabled once configured by maintainers.

**Validation Rules**:
- The required check name must match the workflow job/check name.
- The setup is documented because it is a remote repository setting.

## Local Validation Guide

**Represents**: Developer-facing documentation for reproducing required checks.

**Fields**:
- `path`: `docs/pr-quality-pipeline.md`.
- `commands`: ordered list of local commands.
- `expected_outcome`: all commands exit successfully before PR review.
- `troubleshooting`: notes for common failure categories.

**Validation Rules**:
- Must cover 100% of CI validation categories.
- Must explain that CI is authoritative for merge readiness.
- Must not require production credentials.
