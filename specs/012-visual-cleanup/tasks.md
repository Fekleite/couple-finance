---
description: "Task list for F12 visual cleanup implementation"
---

# Tasks: F12 - Limpeza visual e remocao de informacoes desnecessarias

**Input**: Design documents from `/specs/012-visual-cleanup/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Required for F12 when rendered behavior, conditional states, permissions visibility, actions, accessibility-relevant output, or essential financial information can regress.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline and create the review artifacts used by all stories.

- [ ] T001 Run initial validation commands from `specs/012-visual-cleanup/quickstart.md`
- [ ] T002 Create visual cleanup inventory document in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T003 [P] Create manual responsive and accessibility review checklist in `specs/012-visual-cleanup/checklists/responsive-accessible-review.md`
- [ ] T004 [P] Create safe interface state review checklist in `specs/012-visual-cleanup/checklists/safe-interface-states.md`
- [ ] T005 [P] Review shared UI primitives for F12 candidates in `src/components/ui/card.tsx`
- [ ] T006 [P] Review shared feedback primitives for F12 candidates in `src/components/feedback/empty-state.tsx`
- [ ] T007 [P] Review authenticated layout for F12 candidates in `src/components/layout/authenticated-layout.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define non-negotiable information and state contracts before editing any screen.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [ ] T008 Document dashboard essential information and removable candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T009 Document transactions essential information and removable candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T010 Document goals essential information and removable candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T011 Document categories essential information and removable candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T012 Document invitation and partner essential information and removable candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T013 Document settings availability and cleanup decision in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T014 [P] Capture current shared feedback state behavior in `src/components/feedback/interface-state.test.tsx`
- [ ] T015 [P] Capture current authenticated layout behavior in `src/components/layout/authenticated-layout.test.tsx`
- [ ] T016 [P] Capture current category page behavior in `src/pages/categories-page.test.tsx`
- [ ] T017 [P] Capture current invitation page behavior in `src/pages/invitation-page.test.tsx`
- [ ] T018 Verify no F12 task requires schema, Supabase RLS, Prisma, service, or query changes in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`

**Checkpoint**: Foundation ready; all screens have a baseline review target.

---

## Phase 3: User Story 1 - Consultar dashboard sem ruido visual (Priority: P1) MVP

**Goal**: Dashboard presents only indicators, summaries, and charts that support financial understanding and action.

**Independent Test**: Open the authenticated dashboard and verify every visible block supports decision-making, orientation, security, auditability, or traceability while preserving individual/shared context.

### Tests for User Story 1

- [ ] T019 [P] [US1] Add dashboard indicator regression coverage in `src/features/dashboard/dashboard-indicator-card.test.tsx`
- [ ] T020 [P] [US1] Add dashboard summary essential information coverage in `src/features/dashboard/dashboard-summary.test.ts`
- [ ] T021 [P] [US1] Add dashboard chart section cleanup coverage in `src/features/dashboard/dashboard-charts-section.test.tsx`
- [ ] T022 [P] [US1] Add dashboard view hierarchy coverage in `src/features/dashboard/dashboard-view.test.tsx`

### Implementation for User Story 1

- [ ] T023 [US1] Remove or consolidate redundant dashboard indicator content in `src/features/dashboard/dashboard-indicator-card.tsx`
- [ ] T024 [US1] Simplify dashboard summary copy while preserving totals and context in `src/features/dashboard/dashboard-summary.ts`
- [ ] T025 [US1] Simplify dashboard chart section headings and helper text in `src/features/dashboard/dashboard-charts-section.tsx`
- [ ] T026 [US1] Preserve essential chart text alternatives while reducing visual noise in `src/features/dashboard/accessible-chart-summary.ts`
- [ ] T027 [US1] Simplify recent transaction presentation on dashboard in `src/features/dashboard/dashboard-recent-transaction.tsx`
- [ ] T028 [US1] Update dashboard screen composition and hierarchy in `src/features/dashboard/dashboard-view.tsx`
- [ ] T029 [US1] Record dashboard cleanup decisions and deferred candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`

**Checkpoint**: Dashboard story works independently and can be reviewed as the MVP for F12.

---

## Phase 4: User Story 2 - Revisar transacoes com hierarquia clara (Priority: P1)

**Goal**: Transaction list preserves title, amount, type, category, date, responsible person, visibility, and actions while reducing competing visual noise.

**Independent Test**: Open transactions with varied filters and confirm essential transaction details remain visible and understandable without decorative dependency.

### Tests for User Story 2

- [ ] T030 [P] [US2] Add transaction list item essential information coverage in `src/features/transactions/transaction-list-item.test.tsx`
- [ ] T031 [P] [US2] Add transaction list controls hierarchy coverage in `src/features/transactions/transaction-list-controls.test.tsx`
- [ ] T032 [P] [US2] Add transaction list empty and filtered state coverage in `src/features/transactions/transaction-list.test.tsx`
- [ ] T033 [P] [US2] Add transaction page regression coverage in `src/pages/transactions-page.test.tsx`

### Implementation for User Story 2

- [ ] T034 [US2] Simplify transaction list item visual hierarchy in `src/features/transactions/transaction-list-item.tsx`
- [ ] T035 [US2] Reduce redundant transaction filter and helper copy in `src/features/transactions/transaction-list-controls.tsx`
- [ ] T036 [US2] Preserve safe empty and filtered list messages in `src/features/transactions/transaction-list-messages.ts`
- [ ] T037 [US2] Simplify transaction list state composition in `src/features/transactions/transaction-list.tsx`
- [ ] T038 [US2] Verify transaction visibility and responsible labels remain clear in `src/features/permissions/visibility-label.tsx`
- [ ] T039 [US2] Record transaction cleanup decisions and deferred candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`

**Checkpoint**: Transaction review remains independently usable and testable.

---

## Phase 5: User Story 3 - Entender metas sem blocos redundantes (Priority: P2)

**Goal**: Goals display progress, target value, current value, status, responsibility, and next action without repeated cards or labels.

**Independent Test**: Open goals with empty, active, completed, and overdue-like states and verify the primary reading remains immediate.

### Tests for User Story 3

- [ ] T040 [P] [US3] Add goal card cleanup regression coverage in `src/features/goals/goal-card.test.tsx`
- [ ] T041 [P] [US3] Add goal progress essential information coverage in `src/features/goals/goal-progress.test.ts`
- [ ] T042 [P] [US3] Add goal view state coverage in `src/features/goals/goal-view.test.tsx`

### Implementation for User Story 3

- [ ] T043 [US3] Consolidate repeated goal metadata in `src/features/goals/goal-card.tsx`
- [ ] T044 [US3] Preserve progress meaning while reducing redundant labels in `src/features/goals/goal-progress.ts`
- [ ] T045 [US3] Simplify goal list empty and populated composition in `src/features/goals/goal-list.tsx`
- [ ] T046 [US3] Simplify goal view headings and support copy in `src/features/goals/goal-view.tsx`
- [ ] T047 [US3] Record goals cleanup decisions and deferred candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`

**Checkpoint**: Goals remain understandable independently after cleanup.

---

## Phase 6: User Story 4 - Navegar por estados de interface claros (Priority: P2)

**Goal**: Empty, loading, error, success, permission unavailable, no shared relationship, and session-related states remain objective, actionable when possible, and private.

**Independent Test**: Simulate no data, loading, and error states and verify messages are clear, safe, and not generic or excessive.

### Tests for User Story 4

- [ ] T048 [P] [US4] Add shared empty state safe-copy coverage in `src/components/feedback/interface-state.test.tsx`
- [ ] T049 [P] [US4] Add category message cleanup coverage in `src/features/categories/category-messages.test.ts`
- [ ] T050 [P] [US4] Add couple message cleanup coverage in `src/features/couple/couple-messages.test.ts`
- [ ] T051 [P] [US4] Add audit message safety regression coverage in `src/features/audit/audit-messages.test.ts`

### Implementation for User Story 4

- [ ] T052 [US4] Simplify shared empty state copy and action hierarchy in `src/components/feedback/empty-state.tsx`
- [ ] T053 [US4] Simplify shared loading state copy without implying real data in `src/components/feedback/loading-state.tsx`
- [ ] T054 [US4] Simplify shared error state copy and retry hierarchy in `src/components/feedback/error-state.tsx`
- [ ] T055 [US4] Remove redundant category empty or helper messaging in `src/features/categories/category-messages.ts`
- [ ] T056 [US4] Simplify invitation and partner safe messages in `src/features/couple/couple-messages.ts`
- [ ] T057 [US4] Preserve audit safe messages while reducing excess wording in `src/features/audit/audit-messages.ts`
- [ ] T058 [US4] Record state cleanup decisions and deferred candidates in `specs/012-visual-cleanup/checklists/safe-interface-states.md`

**Checkpoint**: Interface states remain clear and safe across affected screens.

---

## Phase 7: User Story 5 - Usar telas revisadas em mobile e por teclado (Priority: P3)

**Goal**: Revised screens preserve mobile usability, focus order, visible focus, readable content, and accessibility semantics.

**Independent Test**: Navigate revised screens on mobile, tablet, desktop, and keyboard and verify there is no mandatory horizontal scrolling or loss of essential information.

### Tests for User Story 5

- [ ] T059 [P] [US5] Add button/icon accessibility regression coverage in `src/components/ui/button.test.tsx`
- [ ] T060 [P] [US5] Add authenticated layout focus and landmark coverage in `src/components/layout/authenticated-layout.test.tsx`
- [ ] T061 [P] [US5] Add dashboard responsive accessibility assertions in `src/features/dashboard/dashboard-view.test.tsx`
- [ ] T062 [P] [US5] Add transaction responsive accessibility assertions in `src/features/transactions/transaction-list.test.tsx`
- [ ] T063 [P] [US5] Add goals responsive accessibility assertions in `src/features/goals/goal-view.test.tsx`

### Implementation for User Story 5

- [ ] T064 [US5] Remove decorative or unlabeled icon-only noise from shared buttons in `src/components/ui/button.tsx`
- [ ] T065 [US5] Preserve card spacing and readable wrapping after cleanup in `src/components/ui/card.tsx`
- [ ] T066 [US5] Preserve authenticated layout scan order after cleanup in `src/components/layout/authenticated-layout.tsx`
- [ ] T067 [US5] Validate revised dashboard, transactions, goals, categories, and invitation screens in `specs/012-visual-cleanup/checklists/responsive-accessible-review.md`
- [ ] T068 [US5] Record keyboard, focus, mobile, tablet, desktop, and long-content review results in `specs/012-visual-cleanup/checklists/responsive-accessible-review.md`

**Checkpoint**: Revised screens remain responsive and accessible.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation after selected stories are complete.

- [ ] T069 [P] Reconcile deferred cleanup candidates in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T070 [P] Update F12 quickstart notes with implementation-specific validation findings in `specs/012-visual-cleanup/quickstart.md`
- [ ] T071 Run final lint check with `npm run lint` and record result in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T072 Run final format check with `npm run format:check` and record result in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T073 Run final typecheck with `npm run typecheck` and record result in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T074 Run final test suite with `npm run test:run` and record result in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`
- [ ] T075 Run final build with `npm run build` and record result in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks user stories.
- **US1 Dashboard (Phase 3)**: Depends on Foundational; MVP scope.
- **US2 Transactions (Phase 4)**: Depends on Foundational; can run in parallel with US1 after shared feedback decisions are stable.
- **US3 Goals (Phase 5)**: Depends on Foundational; can run in parallel with US1/US2.
- **US4 Interface States (Phase 6)**: Depends on Foundational; should coordinate with US1-US3 where shared states are touched.
- **US5 Responsive and Keyboard (Phase 7)**: Depends on completed UI cleanup for screens being validated.
- **Polish (Phase 8)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: Independent MVP after Foundation.
- **US2 (P1)**: Independent after Foundation, except shared state components must not conflict with US4.
- **US3 (P2)**: Independent after Foundation.
- **US4 (P2)**: Cross-cuts shared states and can be implemented after Foundation, with coordination on touched files.
- **US5 (P3)**: Validates and adjusts revised screens after their cleanup tasks land.

### Within Each User Story

- Write or update tests before implementation tasks.
- Preserve essential financial information before removing visual elements.
- Update inventory or review checklist after code changes.
- Validate each story independently before starting dependent polish tasks.

---

## Parallel Opportunities

- Setup review tasks T003-T007 can run in parallel.
- Foundational baseline tests T014-T017 can run in parallel.
- US1 tests T019-T022 can run in parallel.
- US2 tests T030-T033 can run in parallel.
- US3 tests T040-T042 can run in parallel.
- US4 tests T048-T051 can run in parallel.
- US5 tests T059-T063 can run in parallel.
- Documentation-only polish tasks T069-T070 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T019 [P] [US1] Add dashboard indicator regression coverage in src/features/dashboard/dashboard-indicator-card.test.tsx"
Task: "T020 [P] [US1] Add dashboard summary essential information coverage in src/features/dashboard/dashboard-summary.test.ts"
Task: "T021 [P] [US1] Add dashboard chart section cleanup coverage in src/features/dashboard/dashboard-charts-section.test.tsx"
Task: "T022 [P] [US1] Add dashboard view hierarchy coverage in src/features/dashboard/dashboard-view.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T030 [P] [US2] Add transaction list item essential information coverage in src/features/transactions/transaction-list-item.test.tsx"
Task: "T031 [P] [US2] Add transaction list controls hierarchy coverage in src/features/transactions/transaction-list-controls.test.tsx"
Task: "T032 [P] [US2] Add transaction list empty and filtered state coverage in src/features/transactions/transaction-list.test.tsx"
Task: "T033 [P] [US2] Add transaction page regression coverage in src/pages/transactions-page.test.tsx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for dashboard cleanup.
3. Validate dashboard independently with tests and manual review.
4. Stop and review before changing additional screens.

### Incremental Delivery

1. Setup + Foundation establish inventory and baseline.
2. Deliver US1 dashboard cleanup as MVP.
3. Deliver US2 transactions cleanup.
4. Deliver US3 goals cleanup.
5. Deliver US4 shared interface state cleanup.
6. Deliver US5 responsive and keyboard validation.
7. Run final polish and checks.

### Parallel Team Strategy

After Phase 2, separate contributors can work on dashboard, transactions, goals,
and shared state tests in parallel, coordinating only on shared files under
`src/components/feedback/`, `src/components/ui/`, and `src/components/layout/`.

---

## Notes

- F12 should not add dependencies, migrations, Prisma, new routes, new modules, or global query behavior changes.
- Every removal or consolidation must be recorded in `specs/012-visual-cleanup/checklists/visual-cleanup-inventory.md`.
- Any discovered need for data, permission, RLS, schema, service, or query changes should pause implementation and be documented as out of scope for F12.
