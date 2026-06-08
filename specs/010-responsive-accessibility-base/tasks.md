---
description: "Task list for F11 responsive and accessibility baseline"
---

# Tasks: F11 - Responsividade e acessibilidade base

**Input**: Design documents from `/specs/010-responsive-accessibility-base/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Tests**: Include focused Vitest and Testing Library coverage because the spec requires validation for mobile usability, keyboard operability, field errors, safe messages, privacy, financial labels, and text equivalents for visual financial information. No new test dependency or heavy E2E suite is planned.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after shared foundations.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks
- **[Story]**: User story label, used only inside story phases
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature audit surface and reusable acceptance baseline before code changes.

- [X] T001 Create the F11 essential-flow audit checklist covering auth, account recovery, private home, couple invitation, permissions, categories, transactions, dashboard, charts, goals, and audit in specs/010-responsive-accessibility-base/checklists/f11-essential-flows.md
- [X] T002 [P] Document the no-new-dependency testing approach and required validation commands for F11 in specs/010-responsive-accessibility-base/quickstart.md
- [X] T003 [P] Add a future-feature responsive and accessibility acceptance baseline checklist to specs/010-responsive-accessibility-base/checklists/requirements.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared primitives that must be ready before story-specific flow work.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 Add global viewport overflow, focus visibility, long-word wrapping, and reduced-motion baseline styles in src/styles/globals.css
- [X] T005 [P] Add responsive and focus regression tests for shared buttons and links in src/components/ui/button.test.tsx
- [X] T006 [P] Add field label, aria-describedby, aria-invalid, and role=alert regression tests in src/components/ui/field.test.tsx
- [X] T007 [P] Add input focus, disabled, invalid, and long-value regression tests in src/components/ui/input.test.tsx
- [X] T008 Harden Button touch target, icon-only accessible-name expectations, disabled/loading layout stability, and text wrapping in src/components/ui/button.tsx
- [X] T009 Harden Field and FieldError semantics, stable ids support, error association, and long text wrapping in src/components/ui/field.tsx
- [X] T010 Harden Input responsive width, focus ring visibility, invalid state, and text overflow behavior in src/components/ui/input.tsx
- [X] T011 [P] Add interface-state component tests for loading, empty, error, retry, and assistive announcements in src/components/feedback/interface-state.test.tsx
- [X] T012 Harden LoadingState, EmptyState, and ErrorState responsive layout, status semantics, retry action naming, and safe-message constraints in src/components/feedback/loading-state.tsx
- [X] T013 Harden EmptyState responsive layout, status semantics, retry/action naming, and safe-message constraints in src/components/feedback/empty-state.tsx
- [X] T014 Harden ErrorState responsive layout, status semantics, retry action naming, and safe-message constraints in src/components/feedback/error-state.tsx

**Checkpoint**: Shared UI, feedback, and CSS baseline are ready for user stories.

---

## Phase 3: User Story 1 - Usar fluxos essenciais em tela pequena (Priority: P1)

**Goal**: Users can complete essential MVP flows on small screens without mandatory horizontal scroll, hidden financial information, or unreachable primary actions.

**Independent Test**: Review auth, private navigation, invitation, categories, transaction form/list, filters, dashboard, charts, goals, and audit at small viewport sizes with long text, large money values, long dates, and enlarged text; confirm content and actions remain readable and reachable.

### Tests for User Story 1

> Write or update these tests before implementation and confirm they fail for missing behavior where practical.

- [X] T015 [P] [US1] Add responsive layout tests for public auth and recovery pages in src/pages/login-page.test.tsx
- [X] T016 [P] [US1] Add responsive layout tests for sign-up, forgot-password, and reset-password pages in src/pages/sign-up-page.test.tsx, src/pages/forgot-password-page.test.tsx, and src/pages/reset-password-page.test.tsx
- [X] T017 [P] [US1] Add responsive private navigation tests for wrapping links and reachable sign-out in src/components/layout/authenticated-layout.test.tsx
- [X] T018 [P] [US1] Add responsive transaction form tests for long labels, keyboard-safe actions, and no lost inputs in src/features/transactions/transaction-form.test.tsx
- [X] T019 [P] [US1] Add responsive transaction list and filter tests for long category names, large amounts, and mobile stacking in src/features/transactions/transaction-list.test.tsx
- [X] T020 [P] [US1] Add responsive dashboard and chart section tests for long periods, large values, and mobile stacking in src/features/dashboard/dashboard-view.test.tsx
- [X] T021 [P] [US1] Add responsive goals and audit tests for long names, long status text, and reachable actions in src/features/goals/goal-view.test.tsx and src/features/audit/audit-view.test.tsx

### Implementation for User Story 1

- [X] T022 [US1] Harden AppLayout to prevent page-level horizontal overflow and keep main content constrained on narrow screens in src/components/layout/app-layout.tsx
- [X] T023 [US1] Expand AuthenticatedLayout private navigation to expose essential MVP routes with wrapping, min-width constraints, and mobile-reachable actions in src/components/layout/authenticated-layout.tsx
- [X] T024 [US1] Harden PublicNavigation wrapping, skip-link behavior, and small-screen link targets in src/components/layout/public-navigation.tsx
- [X] T025 [US1] Harden login, sign-up, forgot-password, and reset-password page containers for small screens and enlarged text in src/pages/login-page.tsx, src/pages/sign-up-page.tsx, src/pages/forgot-password-page.tsx, and src/pages/reset-password-page.tsx
- [X] T026 [US1] Harden transaction form layout, radio groups, category selector container, textarea, and submit action for narrow screens in src/features/transactions/transaction-form.tsx
- [X] T027 [US1] Harden transaction list controls and filters for stacking, long option labels, and reachable actions in src/features/transactions/transaction-list-controls.tsx
- [X] T028 [US1] Harden transaction list items for long titles, large values, dates, visibility labels, and no horizontal overflow in src/features/transactions/transaction-list-item.tsx
- [X] T029 [US1] Harden dashboard indicators, period controls, recent transactions, and chart section layout for mobile stacking in src/features/dashboard/dashboard-view.tsx
- [X] T030 [US1] Harden chart cards and chart containers to preserve summaries and avoid clipping at narrow widths in src/features/dashboard/dashboard-charts-section.tsx
- [X] T031 [US1] Harden goal cards, progress blocks, and goal forms for long names, large amounts, and mobile stacking in src/features/goals/goal-view.tsx
- [X] T032 [US1] Harden audit list and audit event items for long event text, timestamps, and mobile wrapping in src/features/audit/audit-list.tsx
- [X] T033 [US1] Record completed mobile/tablet/desktop manual review results for all essential flows in specs/010-responsive-accessibility-base/checklists/f11-essential-flows.md

**Checkpoint**: User Story 1 is independently usable and testable as the MVP scope.

---

## Phase 4: User Story 2 - Navegar e operar por teclado ou tecnologia assistiva (Priority: P2)

**Goal**: Essential controls, forms, dialogs, states, and visual financial information are operable and understandable by keyboard and assistive technology.

**Independent Test**: Navigate each essential flow with Tab and Shift+Tab; activate controls by keyboard; verify visible focus, logical order, accessible names, associated form errors, state announcements, and text equivalents for charts/indicators.

### Tests for User Story 2

- [X] T034 [P] [US2] Add keyboard navigation tests for private layout links, sign-out, and route reachability in src/components/layout/authenticated-layout.test.tsx
- [X] T035 [P] [US2] Add accessible label and validation association tests for auth forms in src/pages/login-page.test.tsx
- [X] T036 [P] [US2] Add accessible label, field error, and keyboard tests for transaction form controls in src/features/transactions/transaction-form.test.tsx
- [X] T037 [P] [US2] Add accessible label and keyboard tests for category selector and category options in src/features/categories/category-selector.test.tsx
- [X] T038 [P] [US2] Add text-equivalent and role/name tests for dashboard indicators and charts in src/features/dashboard/dashboard-charts-section.test.tsx
- [X] T039 [P] [US2] Add accessible progress and keyboard action tests for goals in src/features/goals/goal-card.test.tsx
- [X] T040 [P] [US2] Add audit event semantic structure and screen-reader text tests in src/features/audit/audit-event-item.test.tsx

### Implementation for User Story 2

- [X] T041 [US2] Add or repair skip-link target, main landmark, page heading semantics, and focus-visible behavior in src/components/layout/app-layout.tsx
- [X] T042 [US2] Add complete accessible names for icon buttons, nav links, sign-out, and private route controls in src/components/layout/authenticated-layout.tsx
- [X] T043 [US2] Add accessible names, descriptions, invalid states, and error associations for auth form fields in src/pages/login-page.tsx
- [X] T044 [US2] Add accessible names, descriptions, invalid states, and error associations for sign-up and account recovery fields in src/pages/sign-up-page.tsx, src/pages/forgot-password-page.tsx, and src/pages/reset-password-page.tsx
- [X] T045 [US2] Add accessible names, fieldset descriptions, disabled reasons, and error associations for transaction form radio groups and category selection in src/features/transactions/transaction-form.tsx
- [X] T046 [US2] Add semantic labels and keyboard-operable controls to transaction filters in src/features/transactions/transaction-list-controls.tsx
- [X] T047 [US2] Add textual summaries, headings, and accessible descriptions for dashboard indicators and charts in src/features/dashboard/dashboard-charts-section.tsx
- [X] T048 [US2] Add accessible progress text and keyboard-operable actions for goal cards and goal forms in src/features/goals/goal-card.tsx
- [X] T049 [US2] Add semantic event structure, accessible timestamps, and readable financial context to audit items in src/features/audit/audit-event-item.tsx
- [X] T050 [US2] Record keyboard, focus, enlarged text, and assistive technology manual review results in specs/010-responsive-accessibility-base/checklists/f11-essential-flows.md

**Checkpoint**: User Story 2 is independently keyboard-operable and understandable by assistive technology.

---

## Phase 5: User Story 3 - Corrigir erros e entender estados com seguranca (Priority: P3)

**Goal**: Users receive clear, associated, recoverable, privacy-preserving messages for validation errors, temporary failures, empty states, unavailable permissions, missing shared relationship, and expired sessions.

**Independent Test**: Trigger invalid fields, empty results, no shared relationship, unavailable permission, temporary failures, expired sessions, and retry flows; verify messages are clear, associated with the correct context, preserve safe input, and do not reveal inaccessible financial data.

### Tests for User Story 3

- [X] T051 [P] [US3] Add safe auth and session-expired message tests in src/features/auth/auth-context.test.tsx
- [X] T052 [P] [US3] Add safe no-shared-relationship and invitation state tests in src/features/couple/relationship-state.test.ts
- [X] T053 [P] [US3] Add safe permission-unavailable message tests in src/features/permissions/permission-messages.test.ts
- [X] T054 [P] [US3] Add safe category empty/error message tests in src/features/categories/category-service.test.ts
- [X] T055 [P] [US3] Add transaction validation, submission failure, retry, and input preservation tests in src/features/transactions/use-transaction-form.test.tsx
- [X] T056 [P] [US3] Add dashboard empty/error/retry privacy tests in src/features/dashboard/dashboard-state.test.ts
- [X] T057 [P] [US3] Add goals empty/error/retry privacy tests in src/features/goals/goal-messages.test.ts
- [X] T058 [P] [US3] Add audit empty/error/retry privacy tests in src/features/audit/audit-messages.test.ts

### Implementation for User Story 3

- [X] T059 [US3] Standardize neutral safe auth, recovery, logout, and session-expired messages in src/features/auth/auth-messages.ts
- [X] T060 [US3] Standardize no-shared-relationship, invitation, and relationship loss messages without data inference in src/features/couple/couple-messages.ts
- [X] T061 [US3] Standardize permission-unavailable messages that do not distinguish missing, removed, or unauthorized data in src/features/permissions/permission-messages.ts
- [X] T062 [US3] Standardize category empty/error messages and retry guidance without hidden-data inference in src/features/categories/category-messages.ts
- [X] T063 [US3] Standardize transaction validation, empty list, save failure, retry, and destructive-action messages in src/features/transactions/transaction-messages.ts
- [X] T064 [US3] Standardize dashboard empty, partial-data, chart error, retry, and authorized-data messages in src/features/dashboard/dashboard-messages.ts
- [X] T065 [US3] Standardize goal empty, progress, archive/complete, error, and retry messages in src/features/goals/goal-messages.ts
- [X] T066 [US3] Standardize audit empty, load failure, retry, and event-context messages in src/features/audit/audit-messages.ts
- [X] T067 [US3] Ensure transaction form preserves safe user-entered data after validation and recoverable submit errors in src/features/transactions/use-transaction-form.ts
- [X] T068 [US3] Ensure recoverable errors expose retry actions and retrying feedback in dashboard, goals, transactions, and audit state hooks in src/features/dashboard/use-dashboard.ts, src/features/goals/use-goals.ts, src/features/transactions/use-transaction-list.ts, and src/features/audit/use-audit-events.ts
- [X] T069 [US3] Record safe-message manual review results for empty, error, permission, no-shared-relationship, and session-expired scenarios in specs/010-responsive-accessibility-base/checklists/f11-essential-flows.md

**Checkpoint**: User Story 3 is independently recoverable, understandable, and privacy-preserving.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and regression hardening across all stories.

- [X] T070 [P] Update feature README notes with responsive, accessibility, and safe-message conventions in src/features/dashboard/README.md
- [X] T071 [P] Update audit feature README notes with safe event text and privacy-preserving state conventions in src/features/audit/README.md
- [X] T072 Run npm run lint and fix any F11 issues in src/styles/globals.css
- [X] T073 Run npm run format:check and fix any F11 formatting issues in specs/010-responsive-accessibility-base/tasks.md
- [X] T074 Run npm run typecheck and fix any F11 typing issues in src/components/ui/field.tsx
- [X] T075 Run npm run test:run and fix any F11 regression failures in src/test/setup.ts
- [X] T076 Run npm run build and fix any F11 production build issues in src/app/router.tsx
- [X] T077 Complete the quickstart acceptance gate with command results and manual review notes in specs/010-responsive-accessibility-base/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user story implementation.
- **User Story 1 (Phase 3)**: Depends on Foundational; recommended MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; can run after or alongside US1 once shared primitives are stable.
- **User Story 3 (Phase 5)**: Depends on Foundational; can run after or alongside US1/US2, but message changes should be regression-tested against visible UI.
- **Polish (Phase 6)**: Depends on the desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on US2 or US3 after foundation.
- **US2 (P2)**: No dependency on US1 implementation, but benefits from the same shared responsive primitives.
- **US3 (P3)**: No dependency on US1 or US2, but final message review should include the UI surfaces touched by US1/US2.

### Within Each User Story

- Write or update tests before implementation where practical.
- Shared components and styles precede feature screens.
- Responsive layout fixes precede manual viewport review.
- Semantics and labels precede keyboard/manual assistive review.
- Safe message catalogs precede state and retry UI validation.

---

## Parallel Opportunities

- Phase 1 tasks T002 and T003 can run in parallel after T001 starts.
- Phase 2 tests T005, T006, T007, and T011 can run in parallel before their paired component changes.
- US1 test tasks T015-T021 can run in parallel, and implementation tasks can split by feature area after shared layout tasks T022-T024.
- US2 test tasks T034-T040 can run in parallel, and implementation tasks can split by feature area after T041-T042.
- US3 test tasks T051-T058 can run in parallel, and message implementation tasks T059-T066 can split by feature area.

## Parallel Example: User Story 1

```bash
Task: "T015 [P] [US1] Add responsive layout tests for public auth and recovery pages in src/pages/login-page.test.tsx"
Task: "T018 [P] [US1] Add responsive transaction form tests for long labels, keyboard-safe actions, and no lost inputs in src/features/transactions/transaction-form.test.tsx"
Task: "T020 [P] [US1] Add responsive dashboard and chart section tests for long periods, large values, and mobile stacking in src/features/dashboard/dashboard-view.test.tsx"
Task: "T021 [P] [US1] Add responsive goals and audit tests for long names, long status text, and reachable actions in src/features/goals/goal-view.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T034 [P] [US2] Add keyboard navigation tests for private layout links, sign-out, and route reachability in src/components/layout/authenticated-layout.test.tsx"
Task: "T036 [P] [US2] Add accessible label, field error, and keyboard tests for transaction form controls in src/features/transactions/transaction-form.test.tsx"
Task: "T038 [P] [US2] Add text-equivalent and role/name tests for dashboard indicators and charts in src/features/dashboard/dashboard-charts-section.test.tsx"
Task: "T040 [P] [US2] Add audit event semantic structure and screen-reader text tests in src/features/audit/audit-event-item.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T051 [P] [US3] Add safe auth and session-expired message tests in src/features/auth/auth-context.test.tsx"
Task: "T053 [P] [US3] Add safe permission-unavailable message tests in src/features/permissions/permission-messages.test.ts"
Task: "T055 [P] [US3] Add transaction validation, submission failure, retry, and input preservation tests in src/features/transactions/use-transaction-form.test.tsx"
Task: "T058 [P] [US3] Add audit empty/error/retry privacy tests in src/features/audit/audit-messages.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational shared components and CSS.
3. Complete Phase 3: User Story 1.
4. Stop and validate mobile/tablet/desktop essential flows using quickstart.md.
5. Demo the MVP responsive baseline before expanding to US2 and US3.

### Incremental Delivery

1. Setup + Foundational: reusable baseline for CSS, UI, feedback states, and tests.
2. US1: mobile-first essential flows.
3. US2: keyboard, focus, names, labels, and text equivalents.
4. US3: safe validation, state, retry, and privacy-preserving messages.
5. Polish: commands, docs, acceptance gate, and manual review notes.

### Parallel Team Strategy

1. One developer owns shared UI/CSS foundation.
2. One developer owns auth/layout/couple/permissions surfaces.
3. One developer owns transactions/dashboard/goals/audit surfaces.
4. Feature-area owners merge through the same checklist and validation commands.

## Notes

- [P] tasks are parallelizable only when dependencies listed above are already satisfied.
- Story tasks are independently testable and map directly to US1, US2, or US3 from spec.md.
- Do not add Supabase migrations, RLS changes, authorization changes, or new runtime dependencies for F11.
- Stop at each checkpoint to validate the story before continuing.
