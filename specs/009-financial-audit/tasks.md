# Tasks: F10 - Auditoria simples de alteracoes financeiras

**Input**: Design documents from `/specs/009-financial-audit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by this feature because it touches financial authorization, RLS, privacy-preserving states, mobile behavior, and accessibility-critical audit content.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is ready.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks
- **[Story]**: User story label for traceability
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature surface and shared test utilities without changing behavior.

- [X] T001 Create audit feature barrel exporting placeholders in src/features/audit/index.ts
- [X] T002 [P] Create audit test data builders for rows, events, actors, and Supabase client mocks in src/test/audit-test-utils.ts
- [X] T003 [P] Create the audit page shell with route-level heading placeholder in src/pages/audit-page.tsx
- [X] T004 [P] Create the audit migration test file that loads the planned SQL migration text in src/features/audit/audit-migration.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the durable domain, database contract, and route entry points that all stories depend on.

**CRITICAL**: No user story implementation can begin until this phase is complete.

- [X] T005 [P] Define audit domain types for rows, action types, visibility, summaries, query options, results, and presentation states in src/features/audit/audit-types.ts
- [X] T006 [P] Add route metadata for `/app/audit` with private title and description in src/app/routes.ts
- [X] T007 [P] Add failing route tests for the private audit route and unknown-route behavior in src/app/routes.test.ts
- [X] T008 Create the financial audit migration file with table, constraints, indexes, RLS enabled, and explicit grants in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T009 Add migration tests for table fields, closed check constraints, RLS enablement, grants, and indexes in src/features/audit/audit-migration.test.ts
- [X] T010 Add private audit route wiring to render AuditPage under AuthenticatedLayout in src/app/router.tsx
- [X] T011 Add route tests proving `/app/audit` is protected and renders through the authenticated tree in src/app/routes.test.ts
- [X] T012 Add navigation entry tests for the audit route inside the authenticated layout in src/components/layout/authenticated-layout.test.tsx
- [X] T013 Add a private navigation link to `/app/audit` without exposing audit data in src/components/layout/authenticated-layout.tsx

**Checkpoint**: Database and route foundation are ready for story work.

---

## Phase 3: User Story 1 - Consultar alteracoes autorizadas recentes (Priority: P1) MVP

**Goal**: An authenticated person can open audit history and see only authorized recent transaction and goal events with action, item, author, moment, visibility, and safe context.

**Independent Test**: Create or seed authorized individual transaction and goal events, open `/app/audit`, and verify the list, empty state, retryable error state, ordering, and safe fields without needing shared-couple behavior.

### Tests for User Story 1

- [X] T014 [P] [US1] Add SQL tests for individual event read policy, no direct client writes, deterministic recent ordering, and limit behavior in src/features/audit/audit-migration.test.ts
- [X] T015 [P] [US1] Add service tests for successful direct RLS query, query filters, max limit clamping, generic failures, and row mapping in src/features/audit/audit-service.test.ts
- [X] T016 [P] [US1] Add state-machine tests for loading, ready, empty, refreshing, error, blocked, and stale-response discard states in src/features/audit/audit-state.test.ts
- [X] T017 [P] [US1] Add hook tests for initial load, retry, latest-request-wins behavior, and clearing data when session changes in src/features/audit/use-audit-events.test.tsx
- [X] T018 [P] [US1] Add message tests for action labels, item labels, date/time text, currency text, visibility labels, empty text, and retryable error text in src/features/audit/audit-messages.test.ts
- [X] T019 [P] [US1] Add component tests for authorized list rendering, loading, empty, error, retry, and no total count exposure in src/features/audit/audit-list.test.tsx
- [X] T020 [P] [US1] Add page tests proving AuditPage renders the audit view and private route title copy in src/pages/audit-page.test.tsx

### Implementation for User Story 1

- [X] T021 [US1] Implement private SQL helper `private.record_financial_audit_event` with safe validation and `search_path = ''` in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T022 [US1] Update `create_financial_transaction` to register `transaction_created` audit events atomically in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T023 [US1] Update `create_individual_goal` and `create_shared_goal` to register `goal_created` audit events atomically in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T024 [US1] Implement audit row mapping, query construction, limit clamping, generatedAt, and safe failure handling in src/features/audit/audit-service.ts
- [X] T025 [US1] Implement pure audit presentation state transitions and stale-response guards in src/features/audit/audit-state.ts
- [X] T026 [US1] Implement useAuditEvents with initial fetch, retry, refresh, session/context clearing, and latest-request-wins logic in src/features/audit/use-audit-events.ts
- [X] T027 [US1] Implement action, item, currency, date/time, visibility, empty, loading, and error messages in src/features/audit/audit-messages.ts
- [X] T028 [US1] Implement AuditEventItem with textual action, item, author, moment, visibility, and snapshot summary in src/features/audit/audit-event-item.tsx
- [X] T029 [US1] Implement AuditList with semantic list structure, loading, empty, error, retry, and no global count in src/features/audit/audit-list.tsx
- [X] T030 [US1] Implement AuditView to compose the hook and list while preserving safe blocked/error states in src/features/audit/audit-view.tsx
- [X] T031 [US1] Replace the audit page placeholder with AuditView and route-level title in src/pages/audit-page.tsx
- [X] T032 [US1] Export the implemented audit modules from src/features/audit/index.ts

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Rastrear alteracoes compartilhadas do casal (Priority: P2)

**Goal**: Active members of the same shared financial space can see shared transaction and goal audit events, and removed or inactive members stop seeing them on the next query.

**Independent Test**: Seed two active users in the same shared budget, create shared transaction and goal events by each user, verify both can see authorized shared events plus their own individual events, then inactivate one membership and verify shared events disappear without inference.

### Tests for User Story 2

- [X] T033 [P] [US2] Add SQL tests for shared event read policy, active membership checks, inactive membership denial, and revocation on next query in src/features/audit/audit-migration.test.ts
- [X] T034 [P] [US2] Add authorization helper tests for current user, authorized partner, unavailable actor, active shared budget, and inactive shared access in src/features/audit/audit-authorization.test.ts
- [X] T035 [P] [US2] Add service tests for mixed individual/shared results, hasActiveSharedBudget mapping, and no shared inference in failures or empty results in src/features/audit/audit-service.test.ts
- [X] T036 [P] [US2] Add hook tests proving shared events are cleared and revalidated when the active shared budget context changes in src/features/audit/use-audit-events.test.tsx

### Implementation for User Story 2

- [X] T037 [US2] Add shared-event RLS policy using active `budget_members` membership in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T038 [US2] Update goal RPC audit registration for `update_goal`, `complete_goal`, and `archive_goal` shared and individual events in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T039 [US2] Implement audit authorization helpers for actor label, shared access context, and visibility display in src/features/audit/audit-authorization.ts
- [X] T040 [US2] Integrate audit authorization helpers into AuditEventItem author and visibility rendering in src/features/audit/audit-event-item.tsx
- [X] T041 [US2] Extend audit service to resolve active shared budget context safely without total event counts in src/features/audit/audit-service.ts
- [X] T042 [US2] Refresh audit events after successful goal mutations by adding a stable audit refresh signal in src/features/goals/use-goals.ts

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - Preservar privacidade de eventos individuais (Priority: P3)

**Goal**: Individual audit events remain visible only to their owner and never appear, count, or get suggested to a partner or unauthorized person.

**Independent Test**: Seed individual transaction and goal events for user A, query as user B and as an unauthenticated or unrelated user, and verify no events, counts, gap messages, item details, or author details are exposed.

### Tests for User Story 3

- [X] T043 [P] [US3] Add SQL tests for individual owner-only policies, anonymous denial, partner denial, no direct insert/update/delete, and no owner/shared scope ambiguity in src/features/audit/audit-migration.test.ts
- [X] T044 [P] [US3] Add snapshot safety tests for allowed fields, excluded private fields, label normalization, status validation, and no diff payload in src/features/audit/audit-safe-snapshot.test.ts
- [X] T045 [P] [US3] Add UI tests proving empty, loading, error, and blocked states do not reveal inaccessible individual events in src/features/audit/audit-view.test.tsx

### Implementation for User Story 3

- [X] T046 [US3] Tighten migration constraints for individual/shared exclusivity, safe subject labels, allowed statuses, allowed summary keys, and amount bounds in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T047 [US3] Implement safe snapshot helpers for transaction and goal audit data in src/features/audit/audit-safe-snapshot.ts
- [X] T048 [US3] Mirror safe snapshot rules inside audit registration SQL for transaction and goal events in supabase/migrations/20260607000000_create_financial_audit_events.sql
- [X] T049 [US3] Remove all UI count, permission-denied-detail, SQL, RLS, id, and inaccessible-item wording from audit messages in src/features/audit/audit-messages.ts
- [X] T050 [US3] Ensure AuditView clears retained data for blocked session, changed user, and changed shared context states in src/features/audit/audit-view.tsx

**Checkpoint**: User Stories 1, 2, and 3 preserve authorization and privacy boundaries.

---

## Phase 6: User Story 4 - Entender eventos com acessibilidade e linguagem neutra (Priority: P4)

**Goal**: The audit experience remains understandable on mobile, keyboard, text zoom, and assistive technology paths, using neutral and non-accusatory language.

**Independent Test**: Open the audit page on a narrow viewport, navigate by keyboard, inspect accessible names and reading order, and verify every event communicates action, item, author, moment, and visibility without relying on icon, color, or desktop layout.

### Tests for User Story 4

- [X] T051 [P] [US4] Add accessibility and neutral-language tests for event text, prohibited wording, semantic list structure, and actor labels in src/features/audit/audit-event-item.test.tsx
- [X] T052 [P] [US4] Add responsive rendering tests for mobile width, text wrapping, no horizontal-scroll assumptions, and visible retry action in src/features/audit/audit-list.test.tsx
- [X] T053 [P] [US4] Add full view tests for keyboard-focusable retry, perceptible states, and readable ordering of action, item, author, moment, and visibility in src/features/audit/audit-view.test.tsx

### Implementation for User Story 4

- [X] T054 [US4] Refine AuditEventItem markup for semantic reading order, non-color-only badges, visible focus, and mobile text wrapping in src/features/audit/audit-event-item.tsx
- [X] T055 [US4] Refine AuditList layout for mobile-first spacing, stable state dimensions, readable empty/error/loading text, and accessible retry button in src/features/audit/audit-list.tsx
- [X] T056 [US4] Refine AuditView and AuditPage composition so headings, landmarks, loading, empty, and error states are announced clearly in src/features/audit/audit-view.tsx
- [X] T057 [US4] Audit and update neutral Portuguese copy for transparency without blame, ranking, surveillance, or comparison in src/features/audit/audit-messages.ts

**Checkpoint**: All user stories are independently functional and accessible.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation alignment, and feature-wide cleanup.

- [X] T058 [P] Add quickstart validation coverage notes for SQL, RLS, UI states, and manual accessibility checks in specs/009-financial-audit/quickstart.md
- [X] T059 [P] Add feature README notes for audit module responsibilities and privacy boundaries in src/features/audit/README.md
- [X] T060 [P] Run and fix `npm run lint` findings across src/features/audit and src/pages/audit-page.tsx
- [X] T061 [P] Run and fix `npm run format:check` findings across src/features/audit and specs/009-financial-audit/tasks.md
- [X] T062 [P] Run and fix `npm run typecheck` findings across src/features/audit and src/app/router.tsx
- [X] T063 [P] Run and fix `npm run test:run` findings across src/features/audit, src/pages/audit-page.test.tsx, and src/app/routes.test.ts
- [X] T064 Run and fix `npm run build` findings for the complete application in package.json
- [X] T065 Perform manual quickstart scenarios for individual events, shared events, revocation, privacy inference, mobile layout, keyboard navigation, and neutral language in specs/009-financial-audit/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and can reuse US1 list/service surfaces; shared behavior is independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational and hardens privacy for individual events; can be tested independently with seeded data.
- **User Story 4 (Phase 6)**: Depends on the visible audit UI from US1 and copy/authorization helpers from US2-US3.
- **Polish (Phase 7)**: Depends on the desired story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Start after Phase 2; no dependency on other stories.
- **US2 (P2)**: Start after Phase 2; benefits from US1 components but must pass its own shared authorization tests.
- **US3 (P3)**: Start after Phase 2; can run alongside US2 because it mainly verifies and tightens privacy constraints.
- **US4 (P4)**: Best after US1 visible UI exists; final wording should include US2 and US3 states.

### Within Each User Story

- Write or update tests before implementation tasks in the same story.
- SQL/RLS changes precede service and UI integration.
- Types and pure helpers precede hooks and components.
- Hook and service behavior precede page integration.
- Story checkpoint validation precedes the next priority story in sequential delivery.

---

## Parallel Opportunities

- Phase 1 tasks T002, T003, and T004 can run in parallel after T001 is understood.
- Phase 2 tests and route metadata tasks T005, T006, T007, T009, T012 can run in parallel while the migration is drafted in T008.
- US1 test tasks T014 through T020 can run in parallel because they target SQL, service, state, hook, messages, components, and page files separately.
- US1 implementation tasks can split between SQL (T021-T023), service/state/hook (T024-T026), and UI/messages/page (T027-T032).
- US2 test tasks T033 through T036 can run in parallel; implementation can split between SQL (T037-T038), authorization UI (T039-T040), and service/hook refresh behavior (T041-T042).
- US3 test tasks T043 through T045 can run in parallel; implementation can split between migration constraints (T046, T048), snapshot helpers (T047), and safe UI states/messages (T049-T050).
- US4 test tasks T051 through T053 can run in parallel; implementation can split between item, list, view, and messages files.
- Polish validation commands T060 through T064 can be run after implementation, with fixes applied to the files each command reports.

---

## Parallel Example: User Story 1

```bash
Task: "T014 [P] [US1] Add SQL tests for individual event read policy, no direct client writes, deterministic recent ordering, and limit behavior in src/features/audit/audit-migration.test.ts"
Task: "T015 [P] [US1] Add service tests for successful direct RLS query, query filters, max limit clamping, generic failures, and row mapping in src/features/audit/audit-service.test.ts"
Task: "T016 [P] [US1] Add state-machine tests for loading, ready, empty, refreshing, error, blocked, and stale-response discard states in src/features/audit/audit-state.test.ts"
Task: "T019 [P] [US1] Add component tests for authorized list rendering, loading, empty, error, retry, and no total count exposure in src/features/audit/audit-list.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T033 [P] [US2] Add SQL tests for shared event read policy, active membership checks, inactive membership denial, and revocation on next query in src/features/audit/audit-migration.test.ts"
Task: "T034 [P] [US2] Add authorization helper tests for current user, authorized partner, unavailable actor, active shared budget, and inactive shared access in src/features/audit/audit-authorization.test.ts"
Task: "T035 [P] [US2] Add service tests for mixed individual/shared results, hasActiveSharedBudget mapping, and no shared inference in failures or empty results in src/features/audit/audit-service.test.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T043 [P] [US3] Add SQL tests for individual owner-only policies, anonymous denial, partner denial, no direct insert/update/delete, and no owner/shared scope ambiguity in src/features/audit/audit-migration.test.ts"
Task: "T044 [P] [US3] Add snapshot safety tests for allowed fields, excluded private fields, label normalization, status validation, and no diff payload in src/features/audit/audit-safe-snapshot.test.ts"
Task: "T045 [P] [US3] Add UI tests proving empty, loading, error, and blocked states do not reveal inaccessible individual events in src/features/audit/audit-view.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T051 [P] [US4] Add accessibility and neutral-language tests for event text, prohibited wording, semantic list structure, and actor labels in src/features/audit/audit-event-item.test.tsx"
Task: "T052 [P] [US4] Add responsive rendering tests for mobile width, text wrapping, no horizontal-scroll assumptions, and visible retry action in src/features/audit/audit-list.test.tsx"
Task: "T053 [P] [US4] Add full view tests for keyboard-focusable retry, perceptible states, and readable ordering of action, item, author, moment, and visibility in src/features/audit/audit-view.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate US1 independently with `npm run test:run`, route rendering, and quickstart individual-event scenarios.
5. Demo `/app/audit` with authorized recent individual events, empty state, and retryable error state.

### Incremental Delivery

1. Setup + Foundational -> route, schema, and domain foundation ready.
2. US1 -> recent authorized audit list MVP.
3. US2 -> shared-couple audit visibility and revocation.
4. US3 -> privacy hardening for individual events and snapshots.
5. US4 -> mobile, keyboard, assistive technology, and neutral-language polish.
6. Polish -> full quickstart and command validation.

### Parallel Team Strategy

1. One engineer owns SQL/RLS migration tasks.
2. One engineer owns service, hook, and state tasks.
3. One engineer owns components, page, route, accessibility, and copy tasks.
4. Merge by story checkpoint so each increment remains independently testable.

---

## Notes

- RLS is the final authorization boundary; frontend filters are convenience only.
- Do not add advanced reports, export, realtime, diff viewers, global counters, or compliance wording.
- Do not expose SQL, RLS details, technical IDs, inaccessible-item details, or permission-denied event details in user-facing audit states.
- Keep audit snapshots minimal and typed; do not persist arbitrary JSON or full before/after diffs.
