# Tasks: F07 - Dashboard financeiro inicial

**Input**: Design documents from `/specs/007-dashboard-financeiro-inicial/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Tests**: Required for this feature because the specification and plan require validation of financial calculations, RLS authorization, revocation, concurrency, safe states, mobile behavior and accessibility-critical dashboard flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps the task to the user story from `spec.md`.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the dashboard feature surface and shared test scaffolding without implementing user story behavior.

- [X] T001 Create dashboard feature barrel with placeholder exports in src/features/dashboard/index.ts
- [X] T002 [P] Create dashboard feature directory README notes for module boundaries in src/features/dashboard/README.md
- [X] T003 [P] Create dashboard test data builders for periods, indicators and recent transactions in src/test/dashboard-test-utils.ts
- [X] T004 [P] Create empty dashboard migration test shell in src/features/dashboard/dashboard-migration.test.ts
- [X] T005 [P] Create dashboard route test shell for private home replacement in src/pages/private-home-page.test.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared contracts, query plumbing and safe state primitives that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 [P] Define dashboard period, indicator, recent transaction, response and failure types in src/features/dashboard/dashboard-types.ts
- [X] T007 [P] Define neutral dashboard copy constants for loading, empty, error, result meanings and labels in src/features/dashboard/dashboard-messages.ts
- [X] T008 [P] Add dashboard message unit tests for safe Brazilian Portuguese copy without inaccessible-data hints in src/features/dashboard/dashboard-messages.test.ts
- [X] T009 Implement dashboard service result mapping and safe failure normalization for public.get_financial_dashboard in src/features/dashboard/dashboard-service.ts
- [X] T010 [P] Add dashboard service contract tests for RPC arguments, recent limit 5 and safe error reasons in src/features/dashboard/dashboard-service.test.ts
- [X] T011 Implement dashboard state reducer with loading, refreshing, ready, empty_month and error transitions in src/features/dashboard/dashboard-state.ts
- [X] T012 [P] Add dashboard state reducer tests for allowed transitions and clearing sensitive retained data in src/features/dashboard/dashboard-state.test.ts
- [X] T013 Implement useDashboard hook skeleton with month input, request id concurrency guard, retry callback and context reset support in src/features/dashboard/use-dashboard.ts
- [X] T014 [P] Add useDashboard hook tests for stale response suppression and retry wiring in src/features/dashboard/use-dashboard.test.tsx
- [X] T015 Export dashboard types, messages, service, state and hook from src/features/dashboard/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order or in parallel by different implementers.

---

## Phase 3: User Story 1 - Ver resumo financeiro do mes (Priority: P1) MVP

**Goal**: Show selected-month income, expenses, balance and savings/deficit readings using only authorized transactions.

**Independent Test**: Seed authorized and inaccessible transactions in the same month, load `/app`, and verify the four indicators reflect only authorized rows and explain positive, negative and zero results without relying only on color.

### Tests for User Story 1

- [X] T016 [P] [US1] Add migration tests for security invoker RPC, authenticated grant, fixed search_path and indicator-only authorization in src/features/dashboard/dashboard-migration.test.ts
- [X] T017 [P] [US1] Add dashboard summary tests for income, expenses, balance, positive, negative, zero and empty authorized month calculations in src/features/dashboard/dashboard-summary.test.ts
- [X] T018 [P] [US1] Add indicator card accessibility tests for labels, values and text result meanings in src/features/dashboard/dashboard-indicator-card.test.tsx
- [X] T019 [P] [US1] Add dashboard view tests for current-month summary rendering and month-change indicator refresh in src/features/dashboard/dashboard-view.test.tsx
- [X] T020 [P] [US1] Add private home route tests for default current month, valid month query and invalid month normalization in src/pages/private-home-page.test.tsx

### Implementation for User Story 1

- [X] T021 [US1] Create public.get_financial_dashboard security invoker RPC with validated month inputs, authenticated grant, fixed search_path and authorized indicator aggregation in supabase/migrations/20260605010000_financial_dashboard_initial.sql
- [X] T022 [P] [US1] Implement dashboard summary helpers for formatted income, expenses, balance and result reading in src/features/dashboard/dashboard-summary.ts
- [X] T023 [P] [US1] Implement dashboard indicator card component with semantic labels and non-color-only result text in src/features/dashboard/dashboard-indicator-card.tsx
- [X] T024 [US1] Complete dashboard service mapping from snake_case RPC indicator response to camelCase dashboard types in src/features/dashboard/dashboard-service.ts
- [X] T025 [US1] Complete useDashboard loading, refreshing and ready states for selected month summary data in src/features/dashboard/use-dashboard.ts
- [X] T026 [US1] Implement dashboard view month selector, summary region and four indicators in src/features/dashboard/dashboard-view.tsx
- [X] T027 [US1] Replace the initial private home content with dashboard coordination while preserving links to transactions, new transaction and categories in src/pages/private-home-page.tsx
- [X] T028 [US1] Update dashboard feature exports for summary, indicator card and view in src/features/dashboard/index.ts

**Checkpoint**: User Story 1 is fully functional and testable as the MVP.

---

## Phase 4: User Story 2 - Consultar ultimas transacoes do periodo (Priority: P2)

**Goal**: Show a concise, ordered list of up to five recent authorized transactions that explain the monthly summary.

**Independent Test**: Seed more than five authorized transactions plus inaccessible rows in the selected month, load the dashboard, and verify only the five most recent authorized items appear with title, amount, type, date, category, responsible person and visibility.

### Tests for User Story 2

- [X] T029 [P] [US2] Add migration tests for recent transaction ordering, limit 5, omitted observation and inaccessible row exclusion in src/features/dashboard/dashboard-migration.test.ts
- [X] T030 [P] [US2] Add recent transaction component tests for title, positive amount, type, date, category, responsible label and visibility in src/features/dashboard/dashboard-recent-transaction.test.tsx
- [X] T031 [P] [US2] Add dashboard service tests for recent transaction response mapping and missing optional creator display in src/features/dashboard/dashboard-service.test.ts
- [X] T032 [P] [US2] Add dashboard view tests for concise recent list, empty recent area and link to full transaction list in src/features/dashboard/dashboard-view.test.tsx

### Implementation for User Story 2

- [X] T033 [US2] Extend public.get_financial_dashboard RPC to return recent_transactions ordered by transaction_date, created_at and id with recent_limit_input capped at 10 in supabase/migrations/20260605010000_financial_dashboard_initial.sql
- [X] T034 [US2] Extend dashboard service mapping for recent_transactions fields and creator/responsible labels in src/features/dashboard/dashboard-service.ts
- [X] T035 [P] [US2] Implement dashboard recent transaction component reusing transaction money/date formatting and visibility labels in src/features/dashboard/dashboard-recent-transaction.tsx
- [X] T036 [US2] Integrate recent transactions section and transaction-list link into dashboard view without pagination, filters or mutations in src/features/dashboard/dashboard-view.tsx
- [X] T037 [US2] Update dashboard test builders with ordered recent transaction fixtures in src/test/dashboard-test-utils.ts

**Checkpoint**: User Stories 1 and 2 both work independently and the dashboard remains concise.

---

## Phase 5: User Story 3 - Lidar com ausencia, falhas e mudancas de acesso (Priority: P3)

**Goal**: Present safe empty, error, retry and access-change states without exposing inaccessible data.

**Independent Test**: Load a month without authorized transactions, force a recoverable RPC failure, and revoke shared access before refresh; verify zeroed indicators, safe messages, retry behavior and removal of previously shared data.

### Tests for User Story 3

- [X] T038 [P] [US3] Add migration tests for empty authorized month, inactive memberships, ended links, pending invites and shared-access revocation in src/features/dashboard/dashboard-migration.test.ts
- [X] T039 [P] [US3] Add dashboard state tests for empty_month, error, retry and sensitive context reset transitions in src/features/dashboard/dashboard-state.test.ts
- [X] T040 [P] [US3] Add useDashboard tests for relationship/session key changes clearing stale shared data before refetch in src/features/dashboard/use-dashboard.test.tsx
- [X] T041 [P] [US3] Add dashboard view tests for loading, refreshing, empty and recoverable error states with safe actions in src/features/dashboard/dashboard-view.test.tsx

### Implementation for User Story 3

- [X] T042 [US3] Harden public.get_financial_dashboard RPC authorization joins so only active budget_members grant shared access in supabase/migrations/20260605010000_financial_dashboard_initial.sql
- [X] T043 [US3] Implement dashboard empty and error state derivation with zeroed indicators and no retained recent transactions in src/features/dashboard/dashboard-state.ts
- [X] T044 [US3] Implement safe loading, refreshing, empty, unavailable and retry messages in src/features/dashboard/dashboard-messages.ts
- [X] T045 [US3] Wire useDashboard context reset for user id and shared budget id changes in src/features/dashboard/use-dashboard.ts
- [X] T046 [US3] Render safe LoadingState, EmptyState and ErrorState flows with retry in src/features/dashboard/dashboard-view.tsx
- [X] T047 [US3] Pass authenticated user and relationship context keys from private home into the dashboard hook/view in src/pages/private-home-page.tsx

**Checkpoint**: User Stories 1, 2 and 3 handle normal, empty, failure and revocation scenarios without leaking data.

---

## Phase 6: User Story 4 - Usar dashboard em telas pequenas e com acessibilidade (Priority: P4)

**Goal**: Make period selection, indicators, recent transactions and state changes usable on small screens, by keyboard and with assistive technologies.

**Independent Test**: Complete dashboard consultation and month selection on a mobile-sized viewport and by keyboard, verifying readable layout, visible focus, logical order, labels and perceivable updates.

### Tests for User Story 4

- [X] T048 [P] [US4] Add dashboard view accessibility tests for named regions, aria-live updates, keyboard month controls and focus order in src/features/dashboard/dashboard-view.test.tsx
- [X] T049 [P] [US4] Add private home accessibility tests for route heading, landmark order and preserved navigation links in src/pages/private-home-page.test.tsx
- [X] T050 [P] [US4] Add indicator and recent transaction responsive class assertions for no horizontal-scroll patterns in src/features/dashboard/dashboard-view.test.tsx
- [X] T051 [P] [US4] Add manual mobile and screen-reader review checklist entries for dashboard flows in specs/007-dashboard-financeiro-inicial/quickstart.md

### Implementation for User Story 4

- [X] T052 [US4] Refine dashboard view responsive layout for mobile, tablet and desktop without horizontal scrolling in src/features/dashboard/dashboard-view.tsx
- [X] T053 [US4] Add accessible month navigation labels, disabled states and perceivable update status in src/features/dashboard/dashboard-view.tsx
- [X] T054 [US4] Refine indicator card focus, heading levels and text descriptions for assistive technologies in src/features/dashboard/dashboard-indicator-card.tsx
- [X] T055 [US4] Refine recent transaction semantics, compact wrapping and creator/responsible clarification in src/features/dashboard/dashboard-recent-transaction.tsx
- [X] T056 [US4] Adjust private home page heading hierarchy and dashboard-first layout for mobile scanability in src/pages/private-home-page.tsx

**Checkpoint**: All user stories are independently functional, accessible and responsive.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete dashboard and clean up cross-story quality concerns.

- [X] T057 [P] Run npm run lint and fix any issues in src/features/dashboard/
- [X] T058 [P] Run npm run format:check and format changed files in src/features/dashboard/
- [X] T059 Run npm run typecheck and fix TypeScript contract issues in src/features/dashboard/
- [X] T060 Run npm run test:run and fix failing dashboard, route, migration and shared helper tests in src/features/dashboard/
- [X] T061 Run npm run build and fix production build issues in src/features/dashboard/
- [X] T062 [P] Perform quickstart privacy, mobile, keyboard and financial clarity review in specs/007-dashboard-financeiro-inicial/quickstart.md
- [X] T063 Audit final scope to confirm no charts, detailed filters, pagination, goals, mutations, exports or predictive alerts were added in src/features/dashboard/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and can be implemented after US1 or in parallel with careful RPC coordination.
- **User Story 3 (Phase 5)**: Depends on Foundational and uses the same RPC, hook and state contracts as US1/US2.
- **User Story 4 (Phase 6)**: Depends on dashboard UI from US1/US2 and state flows from US3.
- **Polish (Phase 7)**: Depends on the desired story scope being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **US2 (P2)**: Starts after Phase 2; integrates with the dashboard response and view from US1.
- **US3 (P3)**: Starts after Phase 2; strengthens authorization, state and retry behavior used by US1 and US2.
- **US4 (P4)**: Starts after Phase 3 for indicator accessibility and after Phase 4 for recent transaction accessibility.

### Dependency Graph

```text
Phase 1 -> Phase 2 -> US1 -> Polish
                    -> US2 -> Polish
                    -> US3 -> Polish
US1 + US2 + US3 -> US4 -> Polish
```

### Within Each User Story

- Write the tests for the story first and confirm they fail for missing behavior.
- Implement database/RPC behavior before service mapping when a story needs new response fields.
- Implement service and state behavior before rendering components that consume it.
- Complete each story checkpoint before treating the next story as done.

---

## Parallel Opportunities

- T002, T003, T004 and T005 can run in parallel after T001 is started.
- T006, T007, T008, T010, T012 and T014 can run in parallel during Phase 2.
- T016 through T020 can run in parallel before US1 implementation.
- T029 through T032 can run in parallel before US2 implementation.
- T038 through T041 can run in parallel before US3 implementation.
- T048 through T051 can run in parallel before US4 implementation.
- T057, T058 and T062 can run in parallel during polish if the worktree is stable.

## Parallel Example: User Story 1

```bash
Task: "T016 [P] [US1] Add migration tests for security invoker RPC, authenticated grant, fixed search_path and indicator-only authorization in src/features/dashboard/dashboard-migration.test.ts"
Task: "T017 [P] [US1] Add dashboard summary tests for income, expenses, balance, positive, negative, zero and empty authorized month calculations in src/features/dashboard/dashboard-summary.test.ts"
Task: "T018 [P] [US1] Add indicator card accessibility tests for labels, values and text result meanings in src/features/dashboard/dashboard-indicator-card.test.tsx"
Task: "T019 [P] [US1] Add dashboard view tests for current-month summary rendering and month-change indicator refresh in src/features/dashboard/dashboard-view.test.tsx"
Task: "T020 [P] [US1] Add private home route tests for default current month, valid month query and invalid month normalization in src/pages/private-home-page.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T029 [P] [US2] Add migration tests for recent transaction ordering, limit 5, omitted observation and inaccessible row exclusion in src/features/dashboard/dashboard-migration.test.ts"
Task: "T030 [P] [US2] Add recent transaction component tests for title, positive amount, type, date, category, responsible label and visibility in src/features/dashboard/dashboard-recent-transaction.test.tsx"
Task: "T031 [P] [US2] Add dashboard service tests for recent transaction response mapping and missing optional creator display in src/features/dashboard/dashboard-service.test.ts"
Task: "T032 [P] [US2] Add dashboard view tests for concise recent list, empty recent area and link to full transaction list in src/features/dashboard/dashboard-view.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T038 [P] [US3] Add migration tests for empty authorized month, inactive memberships, ended links, pending invites and shared-access revocation in src/features/dashboard/dashboard-migration.test.ts"
Task: "T039 [P] [US3] Add dashboard state tests for empty_month, error, retry and sensitive context reset transitions in src/features/dashboard/dashboard-state.test.ts"
Task: "T040 [P] [US3] Add useDashboard tests for relationship/session key changes clearing stale shared data before refetch in src/features/dashboard/use-dashboard.test.tsx"
Task: "T041 [P] [US3] Add dashboard view tests for loading, refreshing, empty and recoverable error states with safe actions in src/features/dashboard/dashboard-view.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T048 [P] [US4] Add dashboard view accessibility tests for named regions, aria-live updates, keyboard month controls and focus order in src/features/dashboard/dashboard-view.test.tsx"
Task: "T049 [P] [US4] Add private home accessibility tests for route heading, landmark order and preserved navigation links in src/pages/private-home-page.test.tsx"
Task: "T050 [P] [US4] Add indicator and recent transaction responsive class assertions for no horizontal-scroll patterns in src/features/dashboard/dashboard-view.test.tsx"
Task: "T051 [P] [US4] Add manual mobile and screen-reader review checklist entries for dashboard flows in specs/007-dashboard-financeiro-inicial/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate US1 independently with indicator, authorization, month-change and route tests.
5. Demo the dashboard summary before adding recent transactions or advanced states.

### Incremental Delivery

1. Add US1 for monthly financial indicators.
2. Add US2 for recent authorized transactions.
3. Add US3 for empty, failure and access-change safety.
4. Add US4 for mobile and accessibility hardening.
5. Run Phase 7 validation before considering F07 complete.

### Parallel Team Strategy

1. Complete Setup and Foundational tasks together.
2. Assign US1 database/service work and US1 UI work separately after tests are written.
3. Assign US2 recent transaction component work while another implementer extends RPC/service mapping.
4. Assign US3 state/hook safety work separately from US4 responsive/accessibility review once the view exists.

---

## Notes

- [P] tasks touch different files or are validation tasks that can be prepared independently.
- Story labels map directly to `spec.md`: US1 summary, US2 recent transactions, US3 safe states, US4 mobile and accessibility.
- The RPC must remain `security invoker`; RLS is the authorization boundary for indicators and recent transactions.
- The feature scope explicitly excludes charts, detailed filters, full listing, pagination, goals, mutations, exports and predictive alerts.
