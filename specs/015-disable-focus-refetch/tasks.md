# Tasks: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

**Input**: Design documents from `/specs/015-disable-focus-refetch/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by the F15 specification and constitution because this feature protects server-state behavior, mutation refresh behavior, privacy boundaries, and regression-prone hooks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current server-state baseline and prepare shared test utilities.

- [ ] T001 Verify `@tanstack/react-query`, `QueryClient`, `QueryClientProvider`, `useQuery`, `useMutation`, `invalidateQueries`, `focusManager`, and `refetchOnWindowFocus` are absent from `package.json`, `package-lock.json`, and `src/`
- [ ] T002 [P] Add focus-return event helpers for hook tests in `src/test/server-state-focus-test-utils.ts`
- [ ] T003 [P] Add server-state fixture notes for current remote consumers in `src/test/server-state-focus-test-utils.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared policy and guardrails that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Create a tracked server-state policy document covering current local hooks and future TanStack Query defaults in `src/lib/server-state-policy.md`
- [ ] T005 [P] Add a package-level regression test that asserts `@tanstack/react-query` is not declared for F15 in `src/lib/server-state-policy.test.ts`
- [ ] T006 [P] Add a source scan regression test that fails if `refetchOnWindowFocus` or `focusManager` appears without updating the F15 policy in `src/lib/server-state-policy.test.ts`
- [ ] T007 [P] Add source scan coverage for forbidden global `focus` or `visibilitychange` reload listeners in `src/lib/server-state-policy.test.ts`
- [ ] T008 Review existing remote-data hook tests and record missing coverage targets in `specs/015-disable-focus-refetch/quickstart.md`
- [ ] T009 Confirm `supabase/migrations/` and `src/lib/supabase.ts` remain unchanged for F15 in `specs/015-disable-focus-refetch/quickstart.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order or in parallel where marked.

---

## Phase 3: User Story 1 - Retornar a aplicacao sem recarregamento visual indevido (Priority: P1) MVP

**Goal**: Returning to the app from another tab/window keeps already loaded financial screens stable and does not call remote services only because focus returned.

**Independent Test**: Render each covered remote hook with loaded data, dispatch focus/visibility events, and verify service call counts and ready states stay unchanged.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add no-refetch-on-focus regression test for transaction list service calls in `src/features/transactions/use-transaction-list.test.tsx`
- [ ] T011 [P] [US1] Add no-refetch-on-focus regression test for dashboard summary service calls in `src/features/dashboard/use-dashboard.test.tsx`
- [ ] T012 [P] [US1] Add no-refetch-on-focus regression test for dashboard charts service calls in `src/features/dashboard/use-dashboard-charts.test.tsx`
- [ ] T013 [P] [US1] Add no-refetch-on-focus regression test for categories service calls in `src/features/categories/use-categories.test.tsx`
- [ ] T014 [P] [US1] Add no-refetch-on-focus regression test for couple relationship service calls in `src/features/couple/use-couple-relationship.test.tsx`
- [ ] T015 [P] [US1] Add no-refetch-on-focus regression test for audit service calls in `src/features/audit/use-audit-events.test.tsx`

### Implementation for User Story 1

- [ ] T016 [US1] Update any hook that fails US1 focus tests to ignore focus-only events in `src/features/transactions/use-transaction-list.ts`
- [ ] T017 [US1] Update any dashboard hook that fails US1 focus tests to ignore focus-only events in `src/features/dashboard/use-dashboard.ts`
- [ ] T018 [US1] Update any chart hook that fails US1 focus tests to ignore focus-only events in `src/features/dashboard/use-dashboard-charts.ts`
- [ ] T019 [US1] Update any catalog or relationship hook that fails US1 focus tests to ignore focus-only events in `src/features/categories/use-categories.ts` or `src/features/couple/use-couple-relationship.ts`
- [ ] T020 [US1] Update any audit hook that fails US1 focus tests to keep explicit audit refresh behavior without focus refetch in `src/features/audit/use-audit-events.ts`

**Checkpoint**: US1 is complete when all covered hooks keep loaded data stable and remote service mocks are not called again after focus/visibility events.

---

## Phase 4: User Story 2 - Atualizar dados apos acoes financeiras explicitas (Priority: P2)

**Goal**: Explicit financial actions still refresh affected data through controlled triggers, without depending on tab/window focus.

**Independent Test**: Execute existing mutation, retry, filter, and explicit refresh flows and verify services are called by those actions, not by focus return.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add regression test proving goal create/update/complete/archive still reload through controlled mutation flow in `src/features/goals/use-goals.test.tsx`
- [ ] T022 [P] [US2] Add regression test proving audit refresh still happens only through `AUDIT_REFRESH_EVENT` and not focus events in `src/features/audit/use-audit-events.test.tsx`
- [ ] T023 [P] [US2] Add regression test proving category retry remains an explicit refresh trigger after safe errors in `src/features/categories/use-categories.test.tsx`
- [ ] T024 [P] [US2] Add regression test proving couple invite accept/create still refreshes relationship state through explicit mutation flow in `src/features/couple/use-couple-relationship.test.tsx`

### Implementation for User Story 2

- [ ] T025 [US2] Preserve or repair goal mutation reload behavior if US2 tests fail in `src/features/goals/use-goals.ts`
- [ ] T026 [US2] Preserve or repair explicit audit refresh behavior if US2 tests fail in `src/features/audit/use-audit-events.ts`
- [ ] T027 [US2] Preserve or repair category retry behavior if US2 tests fail in `src/features/categories/use-categories.ts`
- [ ] T028 [US2] Preserve or repair couple mutation refresh behavior if US2 tests fail in `src/features/couple/use-couple-relationship.ts`

**Checkpoint**: US2 is complete when explicit mutation/retry/domain-event updates still work and none require switching browser tabs to refresh data.

---

## Phase 5: User Story 3 - Preservar contexto de filtros e navegacao ao alternar abas (Priority: P3)

**Goal**: Filters, ordering, loaded page context, selected periods, and visible state remain intact when the user returns from another tab/window.

**Independent Test**: Apply filters or periods, reach a ready state, dispatch focus/visibility events, and verify context and service calls remain stable.

### Tests for User Story 3

- [ ] T029 [P] [US3] Add focus-return test preserving transaction filters and current service call count in `src/features/transactions/use-transaction-list.test.tsx`
- [ ] T030 [P] [US3] Add focus-return test preserving dashboard period and current service call count in `src/features/dashboard/use-dashboard.test.tsx`
- [ ] T031 [P] [US3] Add focus-return test preserving dashboard chart period and current service call count in `src/features/dashboard/use-dashboard-charts.test.tsx`
- [ ] T032 [P] [US3] Add focus-return test preserving goal status filter and current service call count in `src/features/goals/use-goals.test.tsx`

### Implementation for User Story 3

- [ ] T033 [US3] Repair transaction filter/context preservation if US3 tests fail in `src/features/transactions/use-transaction-list.ts`
- [ ] T034 [US3] Repair dashboard period/context preservation if US3 tests fail in `src/features/dashboard/use-dashboard.ts`
- [ ] T035 [US3] Repair chart period/context preservation if US3 tests fail in `src/features/dashboard/use-dashboard-charts.ts`
- [ ] T036 [US3] Repair goal status/context preservation if US3 tests fail in `src/features/goals/use-goals.ts`

**Checkpoint**: US3 is complete when focus return does not reset filters, periods, status filters, loaded state, or service call counts.

---

## Phase 6: User Story 4 - Entender falhas de atualizacao explicita (Priority: P4)

**Goal**: Explicit update failures remain visible, safe, and recoverable; focus return must not hide errors or retry automatically.

**Independent Test**: Force safe service failures, dispatch focus/visibility events, and verify error states remain stable until retry or another controlled trigger.

### Tests for User Story 4

- [ ] T037 [P] [US4] Add focus-return test preserving transaction list error state until retry in `src/features/transactions/use-transaction-list.test.tsx`
- [ ] T038 [P] [US4] Add focus-return test preserving dashboard error state until retry in `src/features/dashboard/use-dashboard.test.tsx`
- [ ] T039 [P] [US4] Add focus-return test preserving categories error state until explicit refresh in `src/features/categories/use-categories.test.tsx`
- [ ] T040 [P] [US4] Add focus-return test preserving audit error state or blocked state until retry/valid user context in `src/features/audit/use-audit-events.test.tsx`

### Implementation for User Story 4

- [ ] T041 [US4] Repair transaction list error preservation if US4 tests fail in `src/features/transactions/use-transaction-list.ts`
- [ ] T042 [US4] Repair dashboard error preservation if US4 tests fail in `src/features/dashboard/use-dashboard.ts`
- [ ] T043 [US4] Repair category error preservation if US4 tests fail in `src/features/categories/use-categories.ts`
- [ ] T044 [US4] Repair audit error or blocked-state preservation if US4 tests fail in `src/features/audit/use-audit-events.ts`

**Checkpoint**: US4 is complete when focus return does not hide safe errors, retry remains explicit, and no inaccessible data is revealed.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate policy, documentation, quality gates, and non-regression across the F15 scope.

- [ ] T045 [P] Update F15 implementation notes in `specs/015-disable-focus-refetch/quickstart.md`
- [ ] T046 [P] Run the no React Query source scan from `specs/015-disable-focus-refetch/quickstart.md`
- [ ] T047 [P] Verify no schema, migration, RLS, Prisma, Supabase Auth, or persistence changes were introduced in `supabase/migrations/`
- [ ] T048 [P] Run `npm run lint` and fix any F15 issues in affected `src/` and `specs/015-disable-focus-refetch/` files
- [ ] T049 [P] Run `npm run format:check` and fix any F15 formatting issues in `src/`, `package.json`, and `specs/015-disable-focus-refetch/`
- [ ] T050 [P] Run `npm run typecheck` and fix any F15 type errors in affected `src/` files
- [ ] T051 [P] Run `npm run test:run` and fix any F15 regression failures in affected `src/**/*.test.ts` and `src/**/*.test.tsx` files
- [ ] T052 Run `npm run build` and fix any F15 build failures in affected `src/`, `index.html`, or `package.json` files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: MVP. Can start after Foundational and does not depend on other stories.
- **User Story 2 (P2)**: Can start after Foundational. Independent from US1 but validates complementary controlled-update behavior.
- **User Story 3 (P3)**: Can start after Foundational. Uses the same focus utility as US1 and can run in parallel after T002.
- **User Story 4 (P4)**: Can start after Foundational. Uses the same focus utility and error mocks.

### Within Each User Story

- Write or update tests first and confirm they fail if focus-driven reload behavior is introduced.
- Apply implementation changes only where a test reveals behavior that violates the F15 contracts.
- Keep source changes scoped to the hook file named by the failing test.
- Re-run the story-specific tests before moving to the checkpoint.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T005, T006, T007, T008, and T009 can run in parallel after T004 is drafted.
- US1 test tasks T010-T015 can run in parallel because they touch different test files.
- US2 test tasks T021-T024 can run in parallel because they touch different test files.
- US3 test tasks T029-T032 can run in parallel because they touch different test files.
- US4 test tasks T037-T040 can run in parallel because they touch different test files.
- Polish validation tasks T046-T051 can run in parallel after story work is complete.

## Parallel Example: User Story 1

```bash
Task: "T010 Add no-refetch-on-focus regression test for transaction list service calls in src/features/transactions/use-transaction-list.test.tsx"
Task: "T011 Add no-refetch-on-focus regression test for dashboard summary service calls in src/features/dashboard/use-dashboard.test.tsx"
Task: "T012 Add no-refetch-on-focus regression test for dashboard charts service calls in src/features/dashboard/use-dashboard-charts.test.tsx"
Task: "T013 Add no-refetch-on-focus regression test for categories service calls in src/features/categories/use-categories.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T021 Add regression test proving goal create/update/complete/archive still reload through controlled mutation flow in src/features/goals/use-goals.test.tsx"
Task: "T022 Add regression test proving audit refresh still happens only through AUDIT_REFRESH_EVENT and not focus events in src/features/audit/use-audit-events.test.tsx"
Task: "T023 Add regression test proving category retry remains an explicit refresh trigger after safe errors in src/features/categories/use-categories.test.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests for no refetch on focus across the highest-risk remote hooks.
3. Fix only hooks that fail the US1 tests.
4. Validate US1 independently with focused Vitest runs before broader checks.

### Incremental Delivery

1. Deliver US1 to prevent focus-only reloads.
2. Deliver US2 to prove explicit updates still work.
3. Deliver US3 to preserve filters/periods/context across focus return.
4. Deliver US4 to keep explicit update failures visible and recoverable.
5. Finish with quickstart and full quality validation.

### Notes

- Do not install `@tanstack/react-query` in this F15 implementation unless the plan is explicitly revised.
- Do not create a Query Client provider with no real consumers.
- Do not alter `supabase/migrations/`, RLS, schema, Supabase Auth, Prisma, or financial permissions for this feature.
- Keep tests close to the hook that owns the behavior.
- Every task line above follows the required checkbox, task ID, optional `[P]`, optional story label, and file path format.
