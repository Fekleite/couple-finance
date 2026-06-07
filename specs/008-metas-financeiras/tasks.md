# Tasks: F09 - Metas financeiras

**Input**: Design documents from `/specs/008-metas-financeiras/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Tests**: Required for this feature by the specification and implementation plan. Write tests before implementation for SQL/RLS, authorization, progress math, form validation, hook state, route integration, accessibility-critical UI states, and lifecycle mutations.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature files and route touch points without implementing behavior.

- [X] T001 Create empty goals feature barrel in src/features/goals/index.ts
- [X] T002 [P] Create goals page placeholder exporting GoalsPage in src/pages/goals-page.tsx
- [X] T003 [P] Create goals test utility fixture file in src/test/goal-test-utils.ts
- [X] T004 [P] Create financial goals migration file in supabase/migrations/20260606000000_create_financial_goals.sql

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core contracts, schema, RLS, and route registration that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 [P] Add migration structure test for financial_goals table, constraints, RLS, grants, indexes, triggers, and RPC names in src/features/goals/goal-migration.test.ts
- [X] T006 [P] Add route registration tests for PRIVATE_ROUTES.goals and protected /app/goals rendering in src/app/routes.test.ts
- [X] T007 Implement public.financial_goals table, constraints, set_updated_at trigger, RLS enablement, grants, and indexes in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T008 Implement private and public create/update/complete/archive goal RPC skeletons with safe errors and fixed search_path in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T009 [P] Define goal domain types, filters, RPC payloads, result types, and Supabase row types in src/features/goals/goal-types.ts
- [X] T010 [P] Define neutral public copy for loading, empty, blocked, validation, success, and safe error states in src/features/goals/goal-messages.ts
- [X] T011 [P] Add goal schema tests for money, name, date, visibility, immutable visibility, and status payloads in src/features/goals/goal-schemas.test.ts
- [X] T012 Implement goal create/update schemas using React Hook Form compatible Zod contracts in src/features/goals/goal-schemas.ts
- [X] T013 Register PRIVATE_ROUTES.goals metadata in src/app/routes.ts
- [X] T014 Register protected /app/goals route and GoalsPage import in src/app/router.tsx
- [X] T015 Export goals types, schemas, messages, and placeholders from src/features/goals/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Criar e acompanhar meta individual (Priority: P1) MVP

**Goal**: A signed-in person can create an individual goal, see only authorized individual goals, and understand progress, remaining value, deadline state, and status without exposing it to anyone else.

**Independent Test**: With an authenticated user and no shared budget, create a valid individual goal, list it, verify progress and deadline copy, and confirm another user cannot list, count, infer, or mutate it.

### Tests for User Story 1

- [X] T016 [P] [US1] Add RLS and RPC tests for creating, listing, and isolating individual goals in src/features/goals/goal-migration.test.ts
- [X] T017 [P] [US1] Add progress calculation tests for zero current value, reached value, exceeded value, no deadline, today, future, overdue, and completed states in src/features/goals/goal-progress.test.ts
- [X] T018 [P] [US1] Add service tests for authorized active goal select, individual create RPC, row mapping, ordering, safe empty state, and sanitized errors in src/features/goals/goal-service.test.ts
- [X] T019 [P] [US1] Add hook state tests for initial load, latest request wins, individual create, retry, and context reset in src/features/goals/use-goals.test.tsx
- [X] T020 [P] [US1] Add form tests for individual visibility, field labels, validation messages, cent value conversion, optional deadline, submit disabled state, and focusable errors in src/features/goals/goal-form.test.tsx
- [X] T021 [P] [US1] Add card and list tests for authorized individual metadata, progress summary text, empty state, loading state, and no inaccessible counts in src/features/goals/goal-card.test.tsx
- [X] T022 [P] [US1] Add page integration test for /app/goals title, loading, empty, create flow, and mobile-safe layout classes in src/pages/goals-page.test.tsx

### Implementation for User Story 1

- [X] T023 [US1] Complete individual create RPC validation and RLS policies for owner-only read and mutation in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T024 [P] [US1] Implement pure goal progress and deadline calculation helpers in src/features/goals/goal-progress.ts
- [X] T025 [P] [US1] Implement goal presentation state reducer and latest-request guard helpers in src/features/goals/goal-state.ts
- [X] T026 [P] [US1] Implement public message helpers for progress, deadline, empty, blocked, success, and sanitized errors in src/features/goals/goal-messages.ts
- [X] T027 [US1] Implement goal Supabase service for authorized active select, individual create RPC, row mapping, ordering params, and safe error mapping in src/features/goals/goal-service.ts
- [X] T028 [US1] Implement useGoals hook for load, retry, individual create, request cancellation guard, and context clearing in src/features/goals/use-goals.ts
- [X] T029 [US1] Implement accessible goal form for individual create with name, target, current, optional deadline, visibility, and associated errors in src/features/goals/goal-form.tsx
- [X] T030 [US1] Implement goal card with visibility label, values, deadline state, status text, progress bar capped at 100%, and screen-reader progress summary in src/features/goals/goal-card.tsx
- [X] T031 [US1] Implement goal list with loading, empty, error, retry, and authorized item rendering in src/features/goals/goal-list.tsx
- [X] T032 [US1] Implement GoalView composition for create form, list, success/error alerts, and no shared-budget-safe copy in src/features/goals/goal-view.tsx
- [X] T033 [US1] Implement GoalsPage with page title, authenticated user context, relationship context, and GoalView wiring in src/pages/goals-page.tsx
- [X] T034 [US1] Add a private-area link to goals without adding dashboard summaries or goal charts in src/pages/private-home-page.tsx

**Checkpoint**: User Story 1 is fully functional and testable as the MVP.

---

## Phase 4: User Story 2 - Criar e acompanhar meta compartilhada do casal (Priority: P2)

**Goal**: A user with an active shared budget can create a shared goal that both active members can see, while users without active membership are blocked safely.

**Independent Test**: With an active shared budget, create a shared goal and verify both active members can list it; without active membership, shared creation is blocked and no inaccessible goal can be inferred.

### Tests for User Story 2

- [X] T035 [P] [US2] Add RLS and RPC tests for shared goal creation, active member visibility, inactive membership revocation, and pending invite denial in src/features/goals/goal-migration.test.ts
- [X] T036 [P] [US2] Add service tests for active budget lookup, shared create RPC payload, shared authorization failures, and safe unavailable messages in src/features/goals/goal-service.test.ts
- [X] T037 [P] [US2] Add hook tests for shared create availability, blocked shared action without budget, and clearing shared goals after context changes in src/features/goals/use-goals.test.tsx
- [X] T038 [P] [US2] Add form and view tests for shared visibility option, blocked explanation, active shared label, and no inference from empty/error states in src/features/goals/goal-form.test.tsx

### Implementation for User Story 2

- [X] T039 [US2] Complete shared goal create RPC checks for active shared_budgets and budget_members membership in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T040 [US2] Complete shared goal RLS policies for read and mutation by active budget members only in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T041 [US2] Extend goal service to resolve active shared budget context and create shared goals with safe shared_context_unavailable handling in src/features/goals/goal-service.ts
- [X] T042 [US2] Extend useGoals hook to expose hasActiveSharedBudget, block unavailable shared creation, and clear shared data on relationship context changes in src/features/goals/use-goals.ts
- [X] T043 [US2] Extend goal form with shared visibility controls, disabled shared option when blocked, and accessible blocked description in src/features/goals/goal-form.tsx
- [X] T044 [US2] Extend goal cards and lists to clearly label shared goals without revealing unauthorized membership details in src/features/goals/goal-card.tsx
- [X] T045 [US2] Update GoalView to support shared creation, shared empty state, and relationship-aware copy in src/features/goals/goal-view.tsx

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Editar, concluir e arquivar metas autorizadas (Priority: P3)

**Goal**: A user can edit values and deadline for an authorized active goal, then complete or archive it so it leaves the active list while retaining essential context.

**Independent Test**: Edit an authorized active goal and verify recalculated progress, complete a goal and confirm it is separated from active goals, archive another goal and confirm it is not treated as deletion or completion.

### Tests for User Story 3

- [X] T046 [P] [US3] Add RLS and RPC tests for authorized update, immutable visibility/shared_budget_id, completed_at, archived_at, and unavailable transitions in src/features/goals/goal-migration.test.ts
- [X] T047 [P] [US3] Add action tests for edit, complete, archive, confirmation copy, optimistic submitting state, and safe failure handling in src/features/goals/goal-actions.test.ts
- [X] T048 [P] [US3] Add service tests for updateGoal, completeGoal, archiveGoal, active/completed/archived filters, revalidation, and sanitized goal_unavailable errors in src/features/goals/goal-service.test.ts
- [X] T049 [P] [US3] Add hook tests for edit, complete, archive, status filters, revalidation after mutation, and no stale mutation response overwrite in src/features/goals/use-goals.test.tsx
- [X] T050 [P] [US3] Add UI tests for edit mode, complete/archive buttons, completed and archived filters, retained context, and keyboard-confirmable actions in src/features/goals/goal-view.test.tsx

### Implementation for User Story 3

- [X] T051 [US3] Complete update, complete, and archive RPC implementations with active-only mutation, immutable visibility/shared_budget_id, timestamps, and safe errors in supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T052 [P] [US3] Implement goal action state and confirmation helpers for edit, complete, and archive in src/features/goals/goal-actions.ts
- [X] T053 [US3] Extend goal service with updateGoal, completeGoal, archiveGoal, status filters, and result mapping in src/features/goals/goal-service.ts
- [X] T054 [US3] Extend useGoals hook with edit, complete, archive, status filter state, mutation serialization, and post-mutation revalidation in src/features/goals/use-goals.ts
- [X] T055 [US3] Extend goal form to support edit mode while preventing visibility and shared_budget_id changes in src/features/goals/goal-form.tsx
- [X] T056 [US3] Add complete and archive controls with accessible confirmation and submitting states in src/features/goals/goal-card.tsx
- [X] T057 [US3] Add active, completed, and archived sections or tabs with retained context and no mixing of archived goals into active goals in src/features/goals/goal-list.tsx
- [X] T058 [US3] Update GoalView to wire edit, complete, archive, status filters, success messages, and safe failure retry in src/features/goals/goal-view.tsx

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, accessibility, documentation, and final consistency across all goals flows.

- [X] T059 [P] Add goal messages privacy and non-judgmental language tests in src/features/goals/goal-messages.test.ts
- [X] T060 [P] Add route and private home navigation regression tests for goals links and protected route behavior in src/pages/private-home-page.test.tsx
- [X] T061 [P] Add accessibility regression coverage for labels, focus order, progress summaries, status text, and keyboard actions in src/features/goals/goal-view.test.tsx
- [X] T062 [P] Add mobile viewport and text expansion class checks for goals page, list, cards, and form in src/pages/goals-page.test.tsx
- [X] T063 [P] Add financial formatting audit tests for currency, dates, percentages, visibility, and status consistency in src/features/goals/goal-progress.test.ts
- [X] T064 Update feature exports and README-style notes for reusable goals domain boundaries in src/features/goals/index.ts
- [X] T065 Run quickstart validation commands and record any required fixes in specs/008-metas-financeiras/quickstart.md
- [X] T066 Run npm run lint and fix reported issues in src/features/goals/index.ts, src/features/goals/goal-service.ts, src/features/goals/use-goals.ts, and src/features/goals/goal-view.tsx
- [X] T067 Run npm run format:check and fix formatting in src/features/goals/index.ts, src/pages/goals-page.tsx, src/app/routes.ts, src/app/router.tsx, and supabase/migrations/20260606000000_create_financial_goals.sql
- [X] T068 Run npm run typecheck and fix strict TypeScript issues in src/features/goals/goal-types.ts, src/features/goals/goal-service.ts, src/features/goals/use-goals.ts, and src/pages/goals-page.tsx
- [X] T069 Run npm run test:run and fix failing tests in src/features/goals/goal-migration.test.ts, src/features/goals/use-goals.test.tsx, src/features/goals/goal-view.test.tsx, and src/pages/goals-page.test.tsx
- [X] T070 Run npm run build and fix production build issues in src/app/router.tsx, src/pages/goals-page.tsx, and src/features/goals/goal-view.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundation and delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundation; can be implemented after US1 for product priority or in parallel once shared contracts are stable.
- **User Story 3 (Phase 5)**: Depends on Foundation; benefits from US1/US2 UI and service primitives but remains independently testable against authorized goals.
- **Polish (Phase 6)**: Depends on all selected stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational phase; no dependency on US2 or US3.
- **US2 (P2)**: Starts after Foundational phase; uses the same goal entity and service boundary as US1.
- **US3 (P3)**: Starts after Foundational phase; uses authorized active goals from US1/US2 and adds lifecycle mutation behavior.

### Within Each User Story

- Tests must be written first and fail before implementation.
- Migration/RLS behavior must be implemented before service and hook mutation behavior can pass.
- Types and schemas precede services.
- Services precede hooks.
- Hooks precede page/view wiring.
- Components can be built in parallel when their props are defined.

## Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T005, T006, T009, T010, and T011 can run in parallel during Foundation.
- US1 tests T016-T022 can run in parallel once Foundation is complete.
- US1 pure/domain work T024-T026 can run in parallel before service/hook wiring.
- US2 tests T035-T038 can run in parallel.
- US3 tests T046-T050 can run in parallel.
- Polish audit tests T059-T063 can run in parallel.

## Parallel Example: User Story 1

```bash
Task: "T017 [P] [US1] Add progress calculation tests for zero current value, reached value, exceeded value, no deadline, today, future, overdue, and completed states in src/features/goals/goal-progress.test.ts"
Task: "T018 [P] [US1] Add service tests for authorized active goal select, individual create RPC, row mapping, ordering, safe empty state, and sanitized errors in src/features/goals/goal-service.test.ts"
Task: "T020 [P] [US1] Add form tests for individual visibility, field labels, validation messages, cent value conversion, optional deadline, submit disabled state, and focusable errors in src/features/goals/goal-form.test.tsx"
Task: "T021 [P] [US1] Add card and list tests for authorized individual metadata, progress summary text, empty state, loading state, and no inaccessible counts in src/features/goals/goal-card.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T035 [P] [US2] Add RLS and RPC tests for shared goal creation, active member visibility, inactive membership revocation, and pending invite denial in src/features/goals/goal-migration.test.ts"
Task: "T036 [P] [US2] Add service tests for active budget lookup, shared create RPC payload, shared authorization failures, and safe unavailable messages in src/features/goals/goal-service.test.ts"
Task: "T038 [P] [US2] Add form and view tests for shared visibility option, blocked explanation, active shared label, and no inference from empty/error states in src/features/goals/goal-form.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T046 [P] [US3] Add RLS and RPC tests for authorized update, immutable visibility/shared_budget_id, completed_at, archived_at, and unavailable transitions in src/features/goals/goal-migration.test.ts"
Task: "T047 [P] [US3] Add action tests for edit, complete, archive, confirmation copy, optimistic submitting state, and safe failure handling in src/features/goals/goal-actions.test.ts"
Task: "T050 [P] [US3] Add UI tests for edit mode, complete/archive buttons, completed and archived filters, retained context, and keyboard-confirmable actions in src/features/goals/goal-view.test.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate US1 independently with individual goal creation, listing, progress, privacy, accessibility, and mobile checks.

### Incremental Delivery

1. Deliver Setup + Foundation.
2. Deliver US1 for individual goals MVP.
3. Deliver US2 for shared couple goals.
4. Deliver US3 for edit, complete, and archive lifecycle.
5. Finish Polish validation and run all quickstart commands.

### Parallel Team Strategy

1. Complete Setup + Foundation together.
2. After Foundation, split domain/UI/test work by story or by file boundary.
3. Merge in priority order: US1, US2, US3, then Polish.

## Notes

- [P] tasks use different files or can be safely handled in parallel after their prerequisites.
- [US1], [US2], and [US3] labels map directly to the user stories in spec.md.
- All database tasks must preserve no-inference behavior for inaccessible goals.
- Do not add goal transaction linking, goal recommendations, charts, comments, attachments, external sharing, or gamification in this feature.
