# Contract: Branch Protection

## Purpose

Define how the repository merge policy should treat the Pull Request quality
workflow after it is added.

## Protected Branch

- Initial protected branch: `main`.
- Additional protected branches may be added later if they become principal
  integration or release branches.

## Required Check

- The required status check MUST correspond to the Pull Request quality workflow
  job/check created by `.github/workflows/pull-request-quality.yml`.
- Maintainers MUST ensure the check name configured in repository settings
  matches the check published by the workflow.

## Merge Blocking Rules

- Pull Requests to `main` MUST require the Pull Request quality check to pass
  before merge.
- Failed, cancelled, pending, stale, or missing required checks MUST block merge.
- New commits MUST require a fresh successful check before merge.

## Documentation Requirement

Because branch protection is a repository setting rather than application code,
`docs/pr-quality-pipeline.md` MUST document:

- Which branch should be protected.
- Which check should be required.
- That maintainers need repository admin permissions to configure it.
- That local validation helps developers but does not replace required remote
  checks.
