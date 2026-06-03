# Tasks: F03 - Modelo de permissoes e isolamento de dados

**Input**: Design documents from `/specs/003-data-permissions-isolation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Tests**: Required for this feature. The specification requires automated validation for permission states, RLS isolation, safe messages, visibility classification, F02 integration states, mobile/accessibility behavior, and indirect disclosure prevention.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the permissions feature slice and validation scaffolding without changing behavior yet.

- [ ] T001 Create permissions feature directory and placeholder module in src/features/permissions/.gitkeep
- [ ] T002 [P] Create reusable permissions test fixtures for users, memberships, invitations, and data scopes in src/test/permissions-test-utils.ts
- [ ] T003 [P] Create RLS hardening review document with checklist headings from the contracts in specs/003-data-permissions-isolation/rls-hardening-review.md
- [ ] T004 [P] Add F03 implementation notes and validation commands to specs/003-data-permissions-isolation/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared contracts that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Define PermissionState, DataScope, DataType, PermissionAction, VisibilityScope, PermissionDecision, and SafeMessageKey types in src/features/permissions/permission-types.ts
- [ ] T006 Implement RelationshipState to PermissionState mapping for F02 states in src/features/permissions/permission-state.ts
- [ ] T007 [P] Add exhaustive type coverage tests for permission enums and F02 state mapping in src/features/permissions/permission-state.test.ts
- [ ] T008 Review existing F02 policies, grants, functions, indexes, and constraints against the RLS contract in specs/003-data-permissions-isolation/rls-hardening-review.md
- [ ] T009 Create incremental hardening migration when the review identifies a concrete gap in supabase/migrations/20260603000000_harden_permissions_isolation.sql

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Acessar apenas dados permitidos (Priority: P1) MVP

**Goal**: Authenticated users can access only their own individual data and the active shared couple data they are allowed to see.

**Independent Test**: With users A, B, and C, verify individual ownership, active shared-budget access for A/B, and blocked shared access for C or any user without an active couple link.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add permission matrix tests for individual data, shared budget data, and unrelated authenticated users in src/features/permissions/permission-matrix.test.ts
- [ ] T011 [P] [US1] Add visibility classification tests for individual, shared, inaccessible, and unknown_loading scopes in src/features/permissions/visibility-scope.test.ts
- [ ] T012 [P] [US1] Add static RLS contract tests for shared_budgets and budget_members policies, grants, and indexes in src/features/permissions/rls-patterns.test.ts
- [ ] T013 [P] [US1] Add private home integration tests for loading-before-access, no-link individual mode, active-couple shared mode, and unrelated user blocking in src/pages/private-home-page.test.tsx

### Implementation for User Story 1

- [ ] T014 [US1] Implement canPerformPermissionAction and getPermissionDecision for individual, shared, and inaccessible data in src/features/permissions/permission-matrix.ts
- [ ] T015 [US1] Implement classifyVisibility and visibility label helpers for individual, shared, inaccessible, and unknown_loading scopes in src/features/permissions/visibility-scope.ts
- [ ] T016 [US1] Integrate permission decisions into the private home loading, no-link, and active-couple states in src/pages/private-home-page.tsx
- [ ] T017 [US1] Export the permissions public API used by future financial features in src/features/permissions/index.ts
- [ ] T018 [US1] Record US1 validation scenarios and any RLS hardening result in specs/003-data-permissions-isolation/rls-hardening-review.md

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Bloquear acesso por estado de vinculo (Priority: P1)

**Goal**: Pending, unavailable, inactive, or unrelated invitation/couple states do not grant shared access, while valid accepted invitations map to active shared access.

**Independent Test**: Simulate no link, sent pending invitation, received pending invitation, active couple link, unavailable invitation, inactive couple link, and unrelated authenticated user states, then verify visible information and allowed actions.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add permission matrix tests for sent_pending_invitation, received_pending_invitation, unavailable_invitation, ended_or_inactive_couple_link, and active_couple_link in src/features/permissions/permission-matrix.test.ts
- [ ] T020 [P] [US2] Add F02 relationship-state adapter tests for invitation_sent, invitation_received, couple_linked, invitation_unavailable, error, and loading in src/features/permissions/permission-state.test.ts
- [ ] T021 [P] [US2] Add invitation page integration tests for pending invite response access, unavailable invite blocking, and no shared data before acceptance in src/pages/invitation-page.test.tsx
- [ ] T022 [P] [US2] Add static RPC tests for accept_invitation, decline_invitation, cancel_invitation, and create_shared_budget_and_invite failure privacy in src/features/permissions/rls-patterns.test.ts

### Implementation for User Story 2

- [ ] T023 [US2] Extend getPermissionDecision with invitation-specific inviter, invitee, active member, and unavailable state rules in src/features/permissions/permission-matrix.ts
- [ ] T024 [US2] Apply safe permission state handling to invitation loading, unavailable, accept, decline, and retry flows in src/pages/invitation-page.tsx
- [ ] T025 [US2] Ensure couple action results map unavailable or inactive invitation outcomes to safe permission decisions in src/features/couple/couple-actions.ts
- [ ] T026 [US2] Document allowed actions per relationship state for F02 and future features in specs/003-data-permissions-isolation/contracts/permission-operations.md

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Evitar vazamento indireto (Priority: P2)

**Goal**: Errors, empty states, counters, filters, searches, summaries, and failed access attempts do not reveal unauthorized data.

**Independent Test**: Attempt to access nonexistent, removed, unavailable, expired, unauthorized, and unrelated resources and verify messages and result states never confirm sensitive existence details.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add safe message tests for unavailable, checking, blocked, individual-only, shared-only, empty, and temporary-failure keys in src/features/permissions/permission-messages.test.ts
- [ ] T028 [P] [US3] Add mapPermissionFailure tests for Supabase RLS no rows, RPC unavailable, nonexistent resource, removed resource, unrelated resource, and service failure in src/features/permissions/permission-messages.test.ts
- [ ] T029 [P] [US3] Add query-scope assertion tests for list, search, count, summarize, chart, and empty-state inputs in src/features/permissions/query-scope.test.ts
- [ ] T030 [P] [US3] Add page tests that private home and invitation failures do not render unrelated names, emails, balances, transaction labels, category labels, or raw Supabase errors in src/pages/private-home-page.test.tsx and src/pages/invitation-page.test.tsx

### Implementation for User Story 3

- [ ] T031 [US3] Implement PERMISSION_MESSAGES, getPermissionMessage, and mapPermissionFailure in src/features/permissions/permission-messages.ts
- [ ] T032 [US3] Implement assertAuthorizedQueryScope for individual, shared, aggregate, and inaccessible query scopes in src/features/permissions/query-scope.ts
- [ ] T033 [US3] Replace raw blocked-access and unavailable-copy usage with permission message helpers in src/pages/private-home-page.tsx
- [ ] T034 [US3] Replace raw blocked-access and unavailable-copy usage with permission message helpers in src/pages/invitation-page.tsx
- [ ] T035 [US3] Ensure couple service errors are converted to neutral action results without raw Supabase details in src/features/couple/couple-service.ts

**Checkpoint**: User Stories 1, 2, and 3 are independently functional without indirect disclosure.

---

## Phase 6: User Story 4 - Entender rotulos e limites de visibilidade (Priority: P3)

**Goal**: Users can understand whether visible information is individual, shared, inaccessible, or still being checked through neutral, accessible, mobile-friendly labels and descriptions.

**Independent Test**: Review private-home and invitation states on mobile, tablet, desktop, keyboard, and enlarged text settings to verify labels remain clear and do not rely on color alone.

### Tests for User Story 4

- [ ] T036 [P] [US4] Add visibility label accessibility tests for text content, aria descriptions, and non-color-only labels in src/features/permissions/visibility-scope.test.ts
- [ ] T037 [P] [US4] Add private home responsive and accessibility tests for individual, shared, inaccessible, loading, empty, and error states in src/pages/private-home-page.test.tsx
- [ ] T038 [P] [US4] Add invitation page responsive and accessibility tests for unavailable, checking, received invite, and blocked action states in src/pages/invitation-page.test.tsx

### Implementation for User Story 4

- [ ] T039 [US4] Add a reusable visibility label component for compact individual, shared, inaccessible, and checking states in src/features/permissions/visibility-label.tsx
- [ ] T040 [US4] Render visibility labels in private home relationship states without exposing partner-private data in src/pages/private-home-page.tsx
- [ ] T041 [US4] Render visibility labels and neutral blocked-action feedback in invitation states in src/pages/invitation-page.tsx
- [ ] T042 [US4] Document final visibility label wording and mobile/accessibility review notes in specs/003-data-permissions-isolation/contracts/visibility-scopes.md

**Checkpoint**: All user stories are independently functional and understandable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and quality gates across all stories.

- [ ] T043 [P] Update feature documentation with implemented permission module paths and public API notes in specs/003-data-permissions-isolation/quickstart.md
- [ ] T044 [P] Update product feature index with F03 permissions and data-isolation status in docs/FEATURES.md
- [ ] T045 Run lint validation and fix reported issues in src/features/permissions/permission-types.ts
- [ ] T046 Run formatting validation and fix reported issues in specs/003-data-permissions-isolation/tasks.md
- [ ] T047 Run TypeScript validation and fix reported issues in src/features/permissions/index.ts
- [ ] T048 Run Vitest validation and fix reported failures in src/features/permissions/permission-matrix.test.ts
- [ ] T049 Run production build validation and fix reported issues in src/app/router.tsx
- [ ] T050 Complete quickstart manual validation for three users and record results in specs/003-data-permissions-isolation/rls-hardening-review.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories.
- **User Story 2 (P1)**: Can start after Foundational - independent from US1, but should preserve shared helpers.
- **User Story 3 (P2)**: Can start after Foundational - benefits from US1/US2 helpers but can be implemented through message/query contracts.
- **User Story 4 (P3)**: Can start after Foundational - depends on visibility/message helpers for final UI integration.

### Within Each User Story

- Tests should be written first and fail before implementation.
- Types and fixtures before matrix/message/scope helpers.
- Helper functions before page integration.
- Page integration before manual quickstart validation.
- RLS review before any migration hardening.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T007 and T008 can run in parallel once T005 and T006 are drafted.
- T010 through T013 can run in parallel for US1.
- T019 through T022 can run in parallel for US2.
- T027 through T030 can run in parallel for US3.
- T036 through T038 can run in parallel for US4.
- After Phase 2, US1, US2, US3, and US4 can be staffed in parallel if shared helper changes are coordinated.

---

## Parallel Example: User Story 1

```bash
Task: "T010 [P] [US1] Add permission matrix tests for individual data, shared budget data, and unrelated authenticated users in src/features/permissions/permission-matrix.test.ts"
Task: "T011 [P] [US1] Add visibility classification tests for individual, shared, inaccessible, and unknown_loading scopes in src/features/permissions/visibility-scope.test.ts"
Task: "T012 [P] [US1] Add static RLS contract tests for shared_budgets and budget_members policies, grants, and indexes in src/features/permissions/rls-patterns.test.ts"
Task: "T013 [P] [US1] Add private home integration tests for loading-before-access, no-link individual mode, active-couple shared mode, and unrelated user blocking in src/pages/private-home-page.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T019 [P] [US2] Add permission matrix tests for sent_pending_invitation, received_pending_invitation, unavailable_invitation, ended_or_inactive_couple_link, and active_couple_link in src/features/permissions/permission-matrix.test.ts"
Task: "T020 [P] [US2] Add F02 relationship-state adapter tests for invitation_sent, invitation_received, couple_linked, invitation_unavailable, error, and loading in src/features/permissions/permission-state.test.ts"
Task: "T021 [P] [US2] Add invitation page integration tests for pending invite response access, unavailable invite blocking, and no shared data before acceptance in src/pages/invitation-page.test.tsx"
Task: "T022 [P] [US2] Add static RPC tests for accept_invitation, decline_invitation, cancel_invitation, and create_shared_budget_and_invite failure privacy in src/features/permissions/rls-patterns.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T027 [P] [US3] Add safe message tests for unavailable, checking, blocked, individual-only, shared-only, empty, and temporary-failure keys in src/features/permissions/permission-messages.test.ts"
Task: "T028 [P] [US3] Add mapPermissionFailure tests for Supabase RLS no rows, RPC unavailable, nonexistent resource, removed resource, unrelated resource, and service failure in src/features/permissions/permission-messages.test.ts"
Task: "T029 [P] [US3] Add query-scope assertion tests for list, search, count, summarize, chart, and empty-state inputs in src/features/permissions/query-scope.test.ts"
Task: "T030 [P] [US3] Add page tests that private home and invitation failures do not render unrelated names, emails, balances, transaction labels, category labels, or raw Supabase errors in src/pages/private-home-page.test.tsx and src/pages/invitation-page.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T036 [P] [US4] Add visibility label accessibility tests for text content, aria descriptions, and non-color-only labels in src/features/permissions/visibility-scope.test.ts"
Task: "T037 [P] [US4] Add private home responsive and accessibility tests for individual, shared, inaccessible, loading, empty, and error states in src/pages/private-home-page.test.tsx"
Task: "T038 [P] [US4] Add invitation page responsive and accessibility tests for unavailable, checking, received invite, and blocked action states in src/pages/invitation-page.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate US1 with `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run`, and private-home manual checks.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add US1 access isolation and validate independently.
3. Add US2 relationship-state blocking and validate independently.
4. Add US3 indirect disclosure protections and validate independently.
5. Add US4 labels/accessibility clarity and validate independently.
6. Run final quickstart, Supabase/RLS, accessibility, responsive, and build validations.

### Parallel Team Strategy

1. One developer owns Phase 2 types and adapters.
2. One developer reviews RLS and migration hardening.
3. After Phase 2, separate developers can own US1 matrix/scope, US2 relationship states, US3 messages/query scope, and US4 labels/UI polish.
4. Coordinate shared edits to src/pages/private-home-page.tsx and src/pages/invitation-page.tsx before final validation.
