# Tasks: F17 - Pipeline de Pull Request com lint, testes, typecheck e build

**Input**: Design documents from `/specs/016-pr-quality-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: This feature adds CI/documentation behavior, not runtime application logic. Tasks include explicit validation steps for workflow syntax, local commands, PR status behavior, branch protection documentation, and final quality commands instead of adding app unit tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm repository assumptions and create the CI/documentation file targets.

- [x] T001 Verify `package-lock.json` exists as the lockfile required for `npm ci`
- [x] T002 Verify required scripts `format:check`, `lint`, `typecheck`, `test:run`, and `build` exist in `package.json`
- [x] T003 [P] Create workflow directory `.github/workflows/`
- [x] T004 [P] Create documentation placeholder `docs/pr-quality-pipeline.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared workflow and documentation conventions that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Define CI workflow name and job name in `.github/workflows/pull-request-quality.yml` so the future required check is stable and readable
- [x] T006 Configure `pull_request` trigger for branch `main` in `.github/workflows/pull-request-quality.yml`
- [x] T007 Configure Node/npm setup and dependency installation with `npm ci` in `.github/workflows/pull-request-quality.yml`
- [x] T008 Ensure `.github/workflows/pull-request-quality.yml` does not reference production secrets, deployment actions, preview environments, or external monitoring

**Checkpoint**: Workflow skeleton is ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Validar Pull Requests automaticamente (Priority: P1) MVP

**Goal**: Every Pull Request targeting `main` starts automated validation without reviewer action.

**Independent Test**: Inspect `.github/workflows/pull-request-quality.yml` and verify it has a `pull_request` trigger targeting `main`, dependency installation with `npm ci`, and a stable job/check name.

### Explicit Validation for User Story 1

- [x] T009 [P] [US1] Validate workflow trigger and branch target against `specs/016-pr-quality-pipeline/contracts/pull-request-validation.md`
- [x] T010 [P] [US1] Validate dependency installation uses `npm ci` and no alternate package manager in `.github/workflows/pull-request-quality.yml`

### Implementation for User Story 1

- [x] T011 [US1] Add checkout and Node setup steps to `.github/workflows/pull-request-quality.yml`
- [x] T012 [US1] Add dependency installation step `npm ci` to `.github/workflows/pull-request-quality.yml`
- [x] T013 [US1] Confirm the workflow reruns on Pull Request updates through default `pull_request` synchronization behavior documented in `.github/workflows/pull-request-quality.yml`

**Checkpoint**: User Story 1 is independently testable by opening or updating a Pull Request targeting `main`.

---

## Phase 4: User Story 2 - Bloquear merge quando a qualidade falha (Priority: P2)

**Goal**: Required validation failures produce a failed Pull Request check that maintainers can require for merge.

**Independent Test**: Review the workflow to verify each required command is a failing shell step and review docs to verify branch protection requires the workflow check on `main`.

### Explicit Validation for User Story 2

- [x] T014 [P] [US2] Validate `.github/workflows/pull-request-quality.yml` contains required steps for `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build`
- [x] T015 [P] [US2] Validate branch protection instructions in `docs/pr-quality-pipeline.md` match `specs/016-pr-quality-pipeline/contracts/branch-protection.md`

### Implementation for User Story 2

- [x] T016 [US2] Add format check step `npm run format:check` to `.github/workflows/pull-request-quality.yml`
- [x] T017 [US2] Add lint step `npm run lint` to `.github/workflows/pull-request-quality.yml`
- [x] T018 [US2] Add explicit typecheck step `npm run typecheck` to `.github/workflows/pull-request-quality.yml`
- [x] T019 [US2] Add automated test step `npm run test:run` to `.github/workflows/pull-request-quality.yml`
- [x] T020 [US2] Add build step `npm run build` to `.github/workflows/pull-request-quality.yml`
- [x] T021 [US2] Document required status check and merge-blocking branch protection setup for `main` in `docs/pr-quality-pipeline.md`

**Checkpoint**: User Stories 1 and 2 work independently: PR validation runs and every required category can fail the overall check.

---

## Phase 5: User Story 3 - Entender o status de qualidade no Pull Request (Priority: P3)

**Goal**: Developers can identify whether dependency installation, formatting, lint, typecheck, tests, or build failed.

**Independent Test**: Inspect the workflow and confirm each validation category has a clear, human-readable step name visible in Pull Request logs.

### Explicit Validation for User Story 3

- [x] T022 [P] [US3] Validate every required step in `.github/workflows/pull-request-quality.yml` has a distinct readable name
- [x] T023 [P] [US3] Validate failure categories in `docs/pr-quality-pipeline.md` explain how to map CI failures to local commands

### Implementation for User Story 3

- [x] T024 [US3] Refine step names in `.github/workflows/pull-request-quality.yml` for dependency installation, format check, lint, typecheck, tests, and build
- [x] T025 [US3] Add troubleshooting guidance for each validation category in `docs/pr-quality-pipeline.md`
- [x] T026 [US3] Document that cancelled, timed out, skipped, or incomplete workflow results are not successful validation in `docs/pr-quality-pipeline.md`

**Checkpoint**: User Story 3 is independently testable by reviewing a successful and a failed workflow run or by inspecting the workflow step names.

---

## Phase 6: User Story 4 - Reproduzir localmente as validacoes obrigatorias (Priority: P4)

**Goal**: Developers can run the same validation categories locally before opening or updating a Pull Request.

**Independent Test**: Follow `docs/pr-quality-pipeline.md` from a clean checkout and confirm it covers `npm ci`, `format:check`, `lint`, `typecheck`, `test:run`, and `build`.

### Explicit Validation for User Story 4

- [x] T027 [P] [US4] Validate local command list in `docs/pr-quality-pipeline.md` matches `specs/016-pr-quality-pipeline/contracts/local-validation.md`
- [x] T028 [P] [US4] Validate `docs/pr-quality-pipeline.md` explains that local success does not replace the Pull Request workflow check

### Implementation for User Story 4

- [x] T029 [US4] Add local validation command sequence to `docs/pr-quality-pipeline.md`
- [x] T030 [US4] Explain why CI keeps `npm run typecheck` explicit even though `npm run build` also runs typecheck in `docs/pr-quality-pipeline.md`
- [x] T031 [US4] Document that production secrets and deployment credentials are not required for local or CI validation in `docs/pr-quality-pipeline.md`

**Checkpoint**: All user stories are independently covered by workflow behavior and developer documentation.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across the workflow, docs, and Spec Kit artifacts.

- [x] T032 [P] Run workflow/documentation path checks for `.github/workflows/pull-request-quality.yml` and `docs/pr-quality-pipeline.md`
- [x] T033 [P] Review `.github/workflows/pull-request-quality.yml` for no secrets, no deploy, no production credentials, and no external monitoring
- [x] T034 [P] Review `docs/pr-quality-pipeline.md` against `specs/016-pr-quality-pipeline/quickstart.md`
- [x] T035 Run `npm ci` using `package-lock.json`
- [x] T036 Run `npm run format:check` using scripts from `package.json`
- [x] T037 Run `npm run lint` using scripts from `package.json`
- [x] T038 Run `npm run typecheck` using scripts from `package.json`
- [x] T039 Run `npm run test:run` using scripts from `package.json`
- [x] T040 Run `npm run build` using scripts from `package.json`
- [x] T041 Update `specs/016-pr-quality-pipeline/quickstart.md` only if implementation reveals a verified command or check name mismatch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and benefits from US1 workflow skeleton.
- **User Story 3 (Phase 5)**: Depends on workflow steps from US1 and US2.
- **User Story 4 (Phase 6)**: Depends on known workflow commands from US1 and US2.
- **Polish (Phase 7)**: Depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational; no dependency on other stories.
- **US2 (P2)**: Can start after Foundational, but final branch protection docs should reference the check created by US1.
- **US3 (P3)**: Depends on US1 and US2 step names existing.
- **US4 (P4)**: Depends on US2 validation command list.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001-T002.
- T009 and T010 can run in parallel for US1 validation.
- T014 and T015 can run in parallel for US2 validation.
- T022 and T023 can run in parallel for US3 validation.
- T027 and T028 can run in parallel for US4 validation.
- T032, T033, and T034 can run in parallel during polish.

---

## Parallel Example: User Story 2

```bash
Task: "T014 [US2] Validate .github/workflows/pull-request-quality.yml contains required steps"
Task: "T015 [US2] Validate branch protection instructions in docs/pr-quality-pipeline.md"
```

---

## Parallel Example: User Story 4

```bash
Task: "T027 [US4] Validate local command list in docs/pr-quality-pipeline.md"
Task: "T028 [US4] Validate docs explain local success does not replace CI"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 workflow foundation.
3. Complete Phase 3 so Pull Requests to `main` start validation.
4. Stop and validate workflow trigger, branch target, and dependency installation.

### Incremental Delivery

1. Add US1 to trigger PR validation.
2. Add US2 to make all required categories fail the PR check when broken.
3. Add US3 to improve PR status readability and troubleshooting.
4. Add US4 to document local reproduction.
5. Run final polish commands and update quickstart only for verified mismatches.

### Notes

- [P] tasks use different files or are validation-only and can run without blocking each other.
- User story labels map to the four user stories in `specs/016-pr-quality-pipeline/spec.md`.
- Branch protection cannot be fully enforced by files alone; document the remote repository setting and verify it after the workflow exists on the remote.
- Do not add production secrets, deploy steps, monitoring integrations, E2E tooling, runtime app changes, schema changes, Supabase changes, or Prisma changes for F17.
