# Tasks: F08 - Graficos basicos

**Input**: Design documents from `/specs/008-graficos-basicos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Tests**: Required for this feature because the specification requires validation of financial calculations, authorization/RLS isolation, accessible chart summaries, safe states, route integration, and mobile dashboard usability.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed foundation tasks
- **[Story]**: User story label for story-specific tasks only
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing dashboard feature area for chart-specific implementation without adding a chart dependency.

- [ ] T001 Review F08 implementation constraints and source layout in specs/008-graficos-basicos/plan.md
- [ ] T002 Review current F07 dashboard service, hook, state, and view patterns in src/features/dashboard/dashboard-service.ts
- [ ] T003 [P] Confirm no chart library dependency is added for F08 in package.json
- [ ] T004 [P] Add chart test fixture scaffolding exports to src/test/dashboard-chart-test-utils.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared RPC contract, types, state helpers, service, hook, messages, and shell integration that all chart stories need.

**Critical**: No user story implementation can begin until this phase is complete.

- [ ] T005 Create migration file for public.get_financial_dashboard_charts RPC in supabase/migrations/20260605020000_basic_financial_charts.sql
- [ ] T006 Add migration tests for security invoker, fixed search_path, authenticated grant, invalid query handling, and absence of raw transaction details in src/features/dashboard/dashboard-chart-migration.test.ts
- [ ] T007 [P] Define chart period, query, response, distribution, evolution, comparison, summary, and state types in src/features/dashboard/dashboard-chart-types.ts
- [ ] T008 [P] Implement safe chart copy, labels, retry text, empty states, unavailable shared state, and neutral member-comparison wording in src/features/dashboard/dashboard-chart-messages.ts
- [ ] T009 [P] Add unit tests for safe chart copy and neutral/private wording in src/features/dashboard/dashboard-chart-messages.test.ts
- [ ] T010 Implement chart query normalization, six-month evolution window helpers, stale-data sanitization, and state transitions in src/features/dashboard/dashboard-chart-state.ts
- [ ] T011 Add unit tests for month boundaries, evolution window, request states, error states, and sensitive-context clearing in src/features/dashboard/dashboard-chart-state.test.ts
- [ ] T012 Implement Supabase RPC client and response mapper for get_financial_dashboard_charts in src/features/dashboard/dashboard-chart-service.ts
- [ ] T013 Add service tests for RPC arguments, abort signal handling, invalid query mapping, safe error mapping, and response mapping in src/features/dashboard/dashboard-chart-service.test.ts
- [ ] T014 Implement useDashboardCharts with monotonic request id, abort handling, retry, period reload, and authorization-context clearing in src/features/dashboard/use-dashboard-charts.ts
- [ ] T015 Add hook tests for initial load, retry, rapid month changes, stale response rejection, and context change clearing in src/features/dashboard/use-dashboard-charts.test.tsx
- [ ] T016 Export chart types, service helpers, state helpers, hook, and messages from src/features/dashboard/index.ts

**Checkpoint**: Chart data can be queried, mapped, tested, and represented safely before any visual chart is added.

---

## Phase 3: User Story 1 - Ver gastos por categoria do mes (Priority: P1) MVP

**Goal**: Authenticated users can identify authorized expenses grouped by category for the selected calendar month, including deterministic ties and a safe empty state.

**Independent Test**: Seed authorized expenses in multiple categories for one month and verify that only authorized expense values appear, the highest category is identifiable, ties are deterministic, and a month without expenses shows a neutral empty state.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add RPC migration assertions for category grouping, expense-only aggregation, basis-point weights, and deterministic ordering in src/features/dashboard/dashboard-chart-migration.test.ts
- [ ] T018 [P] [US1] Add service mapper tests for categoryDistribution fields, category labels, rank, and empty distribution handling in src/features/dashboard/dashboard-chart-service.test.ts
- [ ] T019 [P] [US1] Add component tests for category labels, monetary totals, relative weights, highest category identification, tie order, and empty state in src/features/dashboard/category-expense-chart.test.tsx

### Implementation for User Story 1

- [ ] T020 [US1] Implement category_distribution SQL in public.get_financial_dashboard_charts using authorized selected-month expenses in supabase/migrations/20260605020000_basic_financial_charts.sql
- [ ] T021 [P] [US1] Implement category accessible-summary builder for highest category, totals, empty month, and privacy note in src/features/dashboard/accessible-chart-summary.ts
- [ ] T022 [P] [US1] Add tests for category accessible-summary text and privacy-safe empty wording in src/features/dashboard/accessible-chart-summary.test.ts
- [ ] T023 [US1] Implement native responsive category expense chart with persistent labels, values, weights, and no color-only meaning in src/features/dashboard/category-expense-chart.tsx
- [ ] T024 [US1] Add category chart fixtures for multiple categories, one category, tied categories, historical category labels, and empty month in src/test/dashboard-chart-test-utils.ts

**Checkpoint**: US1 is fully functional and testable as the MVP chart increment.

---

## Phase 4: User Story 2 - Acompanhar evolucao mensal recente (Priority: P2)

**Goal**: Users can understand recent authorized income, expenses, and balance across a short six-month window ending at the selected month.

**Independent Test**: Seed a six-month authorized window with income-only, expense-only, empty, positive-balance, negative-balance, zero-balance, and selected-month cases, then verify every month is shown and understood without color-only meaning.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add RPC migration assertions for six-month window generation, empty months, income totals, expense totals, balances, and selected-month marker in src/features/dashboard/dashboard-chart-migration.test.ts
- [ ] T026 [P] [US2] Add service mapper tests for monthlyEvolution fields, resultMeaning, hasAuthorizedMonthData, and positive income/expense presentation values in src/features/dashboard/dashboard-chart-service.test.ts
- [ ] T027 [P] [US2] Add component tests for monthly labels, selected month, income, expense, positive balance, negative balance, zero balance, and empty month wording in src/features/dashboard/monthly-evolution-chart.test.tsx

### Implementation for User Story 2

- [ ] T028 [US2] Implement monthly_evolution SQL in public.get_financial_dashboard_charts with six civil months and authorized income, expense, and balance in supabase/migrations/20260605020000_basic_financial_charts.sql
- [ ] T029 [P] [US2] Extend accessible-summary builder for monthly evolution headline, month details, selected-month context, and empty-month meaning in src/features/dashboard/accessible-chart-summary.ts
- [ ] T030 [US2] Implement native responsive monthly evolution chart with persistent income, expense, balance, selected-month, and result-meaning text in src/features/dashboard/monthly-evolution-chart.tsx
- [ ] T031 [US2] Add monthly evolution fixtures for six-month windows, empty months, selected month, and balance meanings in src/test/dashboard-chart-test-utils.ts

**Checkpoint**: US2 can be delivered independently after foundation and does not require member comparison.

---

## Phase 5: User Story 3 - Comparar responsabilidades de forma neutra (Priority: P3)

**Goal**: Users with an active shared financial space can see a neutral comparison of authorized shared expense responsibilities without exposing partner individual data or judgmental language.

**Independent Test**: Seed active shared expenses assigned to each member plus partner individual expenses and inactive relationship states, then verify only authorized shared expenses affect comparison values, wording remains neutral, and no-partner contexts are unavailable without implying hidden data.

### Tests for User Story 3

- [ ] T032 [P] [US3] Add RPC migration assertions for active shared membership, inactive relationship exclusion, responsible_user grouping, partner individual exclusion, and unavailable_shared status in src/features/dashboard/dashboard-chart-migration.test.ts
- [ ] T033 [P] [US3] Add service mapper tests for memberComparison status, basis, self/partner labels, weights, empty comparison, and unavailable_shared mapping in src/features/dashboard/dashboard-chart-service.test.ts
- [ ] T034 [P] [US3] Add component tests for neutral labels, shared-only values, empty comparison, unavailable shared state, and creator/responsible distinction text in src/features/dashboard/member-comparison-chart.test.tsx

### Implementation for User Story 3

- [ ] T035 [US3] Implement member_comparison SQL in public.get_financial_dashboard_charts using only authorized shared expenses from the active shared budget in supabase/migrations/20260605020000_basic_financial_charts.sql
- [ ] T036 [P] [US3] Extend accessible-summary builder for neutral member comparison, shared-only privacy note, and creator/responsible distinction in src/features/dashboard/accessible-chart-summary.ts
- [ ] T037 [US3] Implement native responsive member comparison chart with neutral labels, safe unavailable state, shared-only empty state, and persistent values in src/features/dashboard/member-comparison-chart.tsx
- [ ] T038 [US3] Add member comparison fixtures for active couple, no active couple, partner individual transactions, and responsible-person split in src/test/dashboard-chart-test-utils.ts

**Checkpoint**: US3 is independently testable and preserves privacy boundaries for shared data.

---

## Phase 6: User Story 4 - Usar graficos com acessibilidade e seguranca (Priority: P4)

**Goal**: Users on mobile, keyboard, enlarged text, or assistive technology can understand chart values, states, summaries, and retry actions safely.

**Independent Test**: Render the dashboard chart section in small viewport-like layouts and keyboard flows, then verify titles, regions, summaries, focusable retry, safe state messages, no horizontal-scroll assumptions, and no stale shared data after refresh.

### Tests for User Story 4

- [ ] T039 [P] [US4] Add chart section tests for semantic regions, headings, aria-live update, keyboard-reachable retry, loading, refreshing, ready, empty, unavailable_shared, and error states in src/features/dashboard/dashboard-charts-section.test.tsx
- [ ] T040 [P] [US4] Add dashboard integration tests for selected-month propagation, chart refresh on month change, and sensitive data clearing on authorization-context change in src/features/dashboard/dashboard-view.test.tsx
- [ ] T041 [P] [US4] Add private home page integration tests for chart hook wiring, dashboard route rendering, retry propagation, and period URL consistency in src/pages/private-home-page.test.tsx

### Implementation for User Story 4

- [ ] T042 [US4] Implement dashboard charts section composition with chart-level states, accessible summaries, retry action, and responsive layout in src/features/dashboard/dashboard-charts-section.tsx
- [ ] T043 [US4] Integrate useDashboardCharts and DashboardChartsSection into the dashboard screen without changing transaction indicators in src/features/dashboard/dashboard-view.tsx
- [ ] T044 [US4] Wire chart authorization context, selected period, retry, and page-level rendering through the private home page in src/pages/private-home-page.tsx
- [ ] T045 [US4] Add or update route smoke coverage so the private dashboard keeps rendering after chart integration in src/app/routes.test.ts

**Checkpoint**: All chart stories are usable together in the private dashboard with accessible and safe states.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across security, performance, documentation, formatting, and quickstart.

- [ ] T046 [P] Update dashboard README with F08 RPC, hook, chart component, accessibility, and privacy boundaries in src/features/dashboard/README.md
- [ ] T047 [P] Document generated tasks and validation notes for F08 in specs/008-graficos-basicos/quickstart.md
- [ ] T048 Audit Supabase migration SQL for redundant indexes and add only needed period/type/category/responsible indexes in supabase/migrations/20260605020000_basic_financial_charts.sql
- [ ] T049 Run lint validation and fix issues reported for chart files using package.json
- [ ] T050 Run format check and fix formatting issues reported for chart files using package.json
- [ ] T051 Run typecheck and test suite validation for F08 using package.json
- [ ] T052 Run production build validation for F08 using package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; can start immediately.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2 and is the MVP scope.
- **Phase 4 US2**: Depends on Phase 2; can run in parallel with US1 after foundation if capacity allows.
- **Phase 5 US3**: Depends on Phase 2; can run in parallel with US1/US2 after foundation, but copy/privacy review should happen before polish.
- **Phase 6 US4**: Depends on the chart components from US1-US3 for full integration.
- **Phase 7 Polish**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories after foundation.
- **US2 (P2)**: No dependency on US1 after foundation, but shares the RPC response and summary helpers.
- **US3 (P3)**: No dependency on US1/US2 after foundation, but shares the RPC response and summary helpers.
- **US4 (P4)**: Integrates US1-US3 into the dashboard and validates accessibility/security states across the complete chart section.

### Within Each User Story

- Tests are written before implementation and should fail before the corresponding implementation task is completed.
- Migration/RPC assertions come before SQL changes.
- Service mapper tests come before service mapping changes when a response block is added.
- Component tests come before visual component implementation.
- Fixtures can be expanded in parallel with implementation when the fixture file is independent of production code.

---

## Parallel Opportunities

- T003 and T004 can run in parallel during setup.
- T007, T008, and T009 can run in parallel once T005-T006 are understood.
- T010-T015 are mostly sequential because state, service, and hook contracts depend on each other.
- US1 test tasks T017-T019 can run in parallel.
- US2 test tasks T025-T027 can run in parallel.
- US3 test tasks T032-T034 can run in parallel.
- US4 test tasks T039-T041 can run in parallel.
- The component implementations for US1, US2, and US3 can run in parallel after the foundational RPC response shape is stable.
- Polish documentation tasks T046 and T047 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T017 [P] [US1] Add RPC migration assertions for category grouping, expense-only aggregation, basis-point weights, and deterministic ordering in src/features/dashboard/dashboard-chart-migration.test.ts"
Task: "T018 [P] [US1] Add service mapper tests for categoryDistribution fields, category labels, rank, and empty distribution handling in src/features/dashboard/dashboard-chart-service.test.ts"
Task: "T019 [P] [US1] Add component tests for category labels, monetary totals, relative weights, highest category identification, tie order, and empty state in src/features/dashboard/category-expense-chart.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T025 [P] [US2] Add RPC migration assertions for six-month window generation, empty months, income totals, expense totals, balances, and selected-month marker in src/features/dashboard/dashboard-chart-migration.test.ts"
Task: "T026 [P] [US2] Add service mapper tests for monthlyEvolution fields, resultMeaning, hasAuthorizedMonthData, and positive income/expense presentation values in src/features/dashboard/dashboard-chart-service.test.ts"
Task: "T027 [P] [US2] Add component tests for monthly labels, selected month, income, expense, positive balance, negative balance, zero balance, and empty month wording in src/features/dashboard/monthly-evolution-chart.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T032 [P] [US3] Add RPC migration assertions for active shared membership, inactive relationship exclusion, responsible_user grouping, partner individual exclusion, and unavailable_shared status in src/features/dashboard/dashboard-chart-migration.test.ts"
Task: "T033 [P] [US3] Add service mapper tests for memberComparison status, basis, self/partner labels, weights, empty comparison, and unavailable_shared mapping in src/features/dashboard/dashboard-chart-service.test.ts"
Task: "T034 [P] [US3] Add component tests for neutral labels, shared-only values, empty comparison, unavailable shared state, and creator/responsible distinction text in src/features/dashboard/member-comparison-chart.test.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational RPC, types, service, state, hook, and exports.
3. Complete Phase 3 US1 category distribution tasks.
4. Stop and validate US1 independently with migration tests, mapper tests, component tests, and manual dashboard review.

### Incremental Delivery

1. Deliver US1 for category distribution as the MVP.
2. Add US2 monthly evolution without changing US1 behavior.
3. Add US3 member responsibility comparison with shared-only privacy review.
4. Add US4 dashboard integration and accessibility/security states across all charts.
5. Complete Phase 7 quality commands and documentation.

### Parallel Team Strategy

1. One developer completes the shared foundation and RPC response shape.
2. After foundation, separate developers can implement US1, US2, and US3 chart blocks in parallel.
3. US4 should integrate after the chart blocks exist, then polish validates the complete dashboard experience.
