---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: For 2.0 increments, tests are REQUIRED whenever new code adds logic,
conditional rendering, permissions, validation, formatting, filters, table
columns, hooks, services, repositories, schema/migration behavior, query
configuration, or regression risk. If a story has no meaningful test target,
include an explicit validation task and justify why automated tests do not add
value. Include tests or explicit validation tasks for financial calculations,
authorization/RLS, accessibility-critical flows, mobile behavior, and
chart/list/table/dashboard data clarity.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management
- [ ] T010 Configure Supabase RLS/data isolation validation for financial records
- [ ] T011 Configure accessibility, mobile viewport, and performance validation tooling
- [ ] T012 Verify affected F00-F11 baseline flows and identify regression tests
- [ ] T013 Configure or verify Pull Request pipeline tasks for lint, typecheck, tests, and build
- [ ] T014 Configure TanStack Query defaults or document query-level exceptions when applicable
- [ ] T015 Define backend/server-side boundary before any Prisma usage

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (required when constitution gates require validation) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T017 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T018 [P] [US1] Authorization/RLS test for [financial data access] in tests/integration/test_[name].py
- [ ] T019 [P] [US1] Accessibility/mobile validation for [user journey] in tests/e2e/test_[name].py
- [ ] T020 [P] [US1] Unit test for new business logic, filters, table columns, hooks, services, repositories, or query config
- [ ] T021 [P] [US1] Regression test for affected F00-F11 baseline behavior

### Implementation for User Story 1

- [ ] T022 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T023 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T024 [US1] Implement [Service] in src/services/[service].py (depends on T022, T023)
- [ ] T025 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T026 [US1] Add validation and error handling
- [ ] T027 [US1] Add clear individual/shared financial labels and responsible party display
- [ ] T028 [US1] Add loading, empty, and error states
- [ ] T029 [US1] Preserve TanStack Query invalidation/refetch expectations when server state changes
- [ ] T030 [US1] Keep Prisma, if used, inside backend/server-side repositories or services only

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (include when constitution gates require validation) ⚠️

- [ ] T031 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T032 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T033 [P] [US2] Authorization/RLS test for [financial data access] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T035 [US2] Implement [Service] in src/services/[service].py
- [ ] T036 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T037 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (include when constitution gates require validation) ⚠️

- [ ] T038 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T039 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T040 [P] [US3] Data clarity/performance validation for lists, charts, or dashboards

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T042 [US3] Implement [Service] in src/services/[service].py
- [ ] T043 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests for all new logic and regression risks in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Accessibility audit for keyboard, focus, labels, errors, contrast, and screen-reader semantics
- [ ] TXXX Mobile viewport validation for all affected F00-F11 and incremental flows
- [ ] TXXX Financial data formatting audit for currency, dates, categories, totals, and individual/shared labels
- [ ] TXXX TanStack Query audit for refetchOnWindowFocus exceptions and controlled invalidation
- [ ] TXXX Prisma/server-side boundary audit if schema, migrations, services, or repositories changed
- [ ] TXXX Pull Request pipeline validation for lint, format check when applicable, typecheck, tests, and build
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests or explicit validation tasks required by constitution gates MUST be written and FAIL before implementation
- Regression tests for affected F00-F11 behavior before refactoring or replacing existing implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
