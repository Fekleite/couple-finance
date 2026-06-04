# Tasks: F06 - Lista e filtros de transacoes

**Input**: Design documents from `/specs/006-list-filter-transactions/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are required because this feature handles financial-data
authorization, RLS, concurrency, accessibility-critical controls, responsive
list behavior, and safe empty/error states.

**Organization**: Tasks are grouped by user story so each story can be
implemented and validated as an independent increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes different files and does not depend on an incomplete task
- **[Story]**: Maps the task to a user story from spec.md
- Every task includes the exact file path it changes

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare reusable fixtures and feature entry points for F06 without
changing existing transaction-creation behavior.

- [ ] T001 Create the shared F06 test utility module scaffold in src/test/transaction-list-test-utils.ts
- [ ] T002 [P] Create the transaction list contract module scaffold in src/features/transactions/transaction-list-types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the canonical query contracts and authorized database RPC
required by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Foundational Contracts

- [ ] T003 [P] Add civil-month tests for current month, adjacent months, year boundaries, and timezone-free date limits in src/features/transactions/transaction-month.test.ts
- [ ] T004 [P] Add canonical URL parsing, serialization, invalid-value cleanup, search normalization, and filter-clearing tests in src/features/transactions/transaction-query.test.ts
- [ ] T005 [P] Add migration contract tests for security invoker, grants, parameter validation, normalized literal search, stable cursor ordering, authorized options, RLS, and revocation behavior in src/features/transactions/transaction-list-migration.test.ts
- [ ] T006 [P] Add coordinated RPC response mapping, invalid-query, and temporary-failure tests in src/features/transactions/transaction-list-service.test.ts

### Implementation for Foundational Contracts

- [ ] T007 Define transaction filters, civil month, query input/result, pagination cursor, list state, and safe service error types in src/features/transactions/transaction-list-types.ts
- [ ] T008 [P] Implement timezone-free civil-month parsing, navigation, limits, and pt-BR labels in src/features/transactions/transaction-month.ts
- [ ] T009 Implement canonical filter parsing, URL serialization, text normalization, individual clearing, and clear-all behavior in src/features/transactions/transaction-query.ts
- [ ] T010 Implement the private immutable search normalizer, composite indexes, security-invoker list_financial_transactions RPC, parameter validation, authorized options, and minimal grants in supabase/migrations/20260605000000_list_filter_financial_transactions.sql
- [ ] T011 Implement the typed Supabase RPC adapter, coordinated response mapping, abort-signal support, and safe failure conversion in src/features/transactions/transaction-list-service.ts

**Checkpoint**: Canonical filters and the authorized paginated query are ready
for all user-story increments.

---

## Phase 3: User Story 1 - Consultar transacoes autorizadas do mes (Priority: P1) MVP

**Goal**: Show the authenticated person's authorized transactions for the
selected civil month in stable newest-first order with complete financial
context.

**Independent Test**: Load a month containing own individual, active shared, and
inaccessible transactions; verify only authorized items appear in stable order,
then switch months and verify the period changes.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add initial monthly load, month change, stable pagination, and authorized-result hook tests in src/features/transactions/use-transaction-list.test.tsx
- [ ] T013 [P] [US1] Add semantic item tests for title, positive currency, type, date, category, responsible person, visibility, and conditional creator label in src/features/transactions/transaction-list-item.test.tsx
- [ ] T014 [P] [US1] Add populated monthly list, stable order, and load-more interaction tests in src/features/transactions/transaction-list.test.tsx
- [ ] T015 [P] [US1] Add authenticated transactions route and monthly consultation page tests in src/pages/transactions-page.test.tsx
- [ ] T016 [P] [US1] Add /app/transactions route metadata and protection assertions in src/app/routes.test.ts

### Implementation for User Story 1

- [ ] T017 [US1] Implement current-request monthly loading, page accumulation, cursor handling, and duplicate load-more prevention in src/features/transactions/use-transaction-list.ts
- [ ] T018 [P] [US1] Implement the semantic financial transaction list item without IDs, observation, totals, or mutation actions in src/features/transactions/transaction-list-item.tsx
- [ ] T019 [US1] Implement the populated transaction list and explicit Carregar mais control in src/features/transactions/transaction-list.tsx
- [ ] T020 [US1] Create the monthly transactions consultation page with title and feature composition in src/pages/transactions-page.tsx
- [ ] T021 [US1] Add /app/transactions route metadata while preserving /app/transactions/new in src/app/routes.ts
- [ ] T022 [US1] Register TransactionsPage inside the authenticated layout in src/app/router.tsx

**Checkpoint**: User Story 1 is independently usable as the MVP monthly
authorized transaction list.

---

## Phase 4: User Story 2 - Localizar transacoes com filtros combinados (Priority: P2)

**Goal**: Let the person combine category, responsible person, type, and
normalized text filters within the selected month, then remove one or all
additional filters.

**Independent Test**: Apply every filter alone and in combination against an
authorized month; verify all returned items satisfy every active criterion and
that clearing filters preserves the selected month.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add active-filter derivation, authorized option mapping, individual removal, and clear-all tests in src/features/transactions/transaction-filters.test.ts
- [ ] T024 [P] [US2] Add keyboard-operable month, category, responsible, type, search, active-filter, and clear-all control tests in src/features/transactions/transaction-list-controls.test.tsx
- [ ] T025 [P] [US2] Extend coordinated RPC service tests for combined filters, normalized text, authorized historical options, and cursor reset in src/features/transactions/transaction-list-service.test.ts
- [ ] T026 [P] [US2] Add filtered page URL/back-forward and combined-filter journey tests in src/pages/transactions-page.test.tsx

### Implementation for User Story 2

- [ ] T027 [US2] Implement authorized option mapping and removable active-filter presentation models in src/features/transactions/transaction-filters.ts
- [ ] T028 [US2] Implement month navigation, filter controls, text search, active filters, individual clearing, and clear-all controls in src/features/transactions/transaction-list-controls.tsx
- [ ] T029 [US2] Connect canonical URL filters to controls and reset loaded pages whenever filters change in src/features/transactions/use-transaction-list.ts
- [ ] T030 [US2] Integrate filter controls and authorized options into the consultation page in src/pages/transactions-page.tsx

**Checkpoint**: User Story 2 can locate authorized transactions using combined
filters without exposing unrelated options or changing the selected month.

---

## Phase 5: User Story 3 - Compreender ausencia, carregamento e falhas (Priority: P3)

**Goal**: Present safe, distinct, actionable loading, empty-month, no-match,
loading-more, and recoverable-error states while preventing stale responses
from replacing the latest selection.

**Independent Test**: Exercise an empty authorized month, filters with no
matches, recoverable failure, retry, rapid filter changes, and access revocation;
verify each state is safe and only the newest response becomes visible.

### Tests for User Story 3

- [ ] T031 [P] [US3] Add neutral private-by-default loading, empty-month, no-match, loading-more, and error message tests in src/features/transactions/transaction-list.test.tsx
- [ ] T032 [P] [US3] Add stale-response suppression, abort, retry, filter reset, session/context reset, and revoked-access clearing tests in src/features/transactions/use-transaction-list.test.tsx
- [ ] T033 [P] [US3] Add safe public-copy checks that reject raw SQL, RLS, Supabase, IDs, inaccessible-data hints, and judgmental wording in src/features/transactions/transaction-list-messages.test.ts

### Implementation for User Story 3

- [ ] T034 [US3] Define neutral pt-BR copy and safe retry/clear-filter actions for every transaction list state in src/features/transactions/transaction-list-messages.ts
- [ ] T035 [US3] Implement monotonic request ownership, abort handling, stale-response suppression, retry, and immediate clearing on query/session/context changes in src/features/transactions/use-transaction-list.ts
- [ ] T036 [US3] Render distinct loading, empty-month, no-match, loading-more, and recoverable-error states with appropriate actions in src/features/transactions/transaction-list.tsx

**Checkpoint**: User Story 3 independently explains every consultation outcome
without retaining or implying inaccessible financial data.

---

## Phase 6: User Story 4 - Consultar com acessibilidade em telas pequenas (Priority: P4)

**Goal**: Keep month navigation, filtering, results, statuses, retry, and
pagination usable on small screens, by keyboard, and with assistive technology.

**Independent Test**: Complete monthly consultation and filtering at a
mobile-sized viewport, with keyboard-only interaction and semantic queries;
verify no essential action depends only on color, icon, or horizontal scrolling.

### Tests for User Story 4

- [ ] T037 [P] [US4] Add accessible names, focus order, perceivable updates, non-color meaning, and keyboard-operation tests in src/features/transactions/transaction-list-controls.test.tsx
- [ ] T038 [P] [US4] Add semantic status announcements, keyboard load-more/retry, and mobile-friendly list structure tests in src/features/transactions/transaction-list.test.tsx
- [ ] T039 [P] [US4] Add mobile composition, text-content clarity, and absence-of-horizontal-overflow assertions in src/pages/transactions-page.test.tsx

### Implementation for User Story 4

- [ ] T040 [US4] Add responsive filter layout, visible focus, complete labels, and accessible active-filter removal behavior in src/features/transactions/transaction-list-controls.tsx
- [ ] T041 [US4] Add responsive item layout and explicit text labels for type, responsible person, creator, and visibility in src/features/transactions/transaction-list-item.tsx
- [ ] T042 [US4] Add semantic list/status regions, moderated live announcements, and stable focus behavior in src/features/transactions/transaction-list.tsx
- [ ] T043 [US4] Finalize the mobile-first page composition without horizontal scrolling in src/pages/transactions-page.tsx

**Checkpoint**: User Story 4 makes the complete consultation journey usable
across viewport sizes and interaction modes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate security, performance, scope, and project-wide quality
after the desired user stories are complete.

- [ ] T044 [P] Add a discreet transactions-list entry to the authenticated home without replacing the existing creation entry in src/pages/private-home-page.tsx
- [ ] T045 [P] Add authenticated-home navigation coverage for the transactions-list entry in src/pages/private-home-page.test.tsx
- [ ] T046 Audit transaction list exports and remove accidental cross-feature exposure in src/features/transactions/index.ts
- [ ] T047 Validate the local Supabase migration, query plan, grants, RLS matrix, revocation, cursor behavior, and 1,000-row monthly performance using specs/006-list-filter-transactions/quickstart.md
- [ ] T048 Validate mobile, 200% text zoom, keyboard-only operation, focus behavior, screen-reader announcements, and neutral financial labels using specs/006-list-filter-transactions/quickstart.md
- [ ] T049 Run npm run lint, npm run format:check, npm run typecheck, npm run test:run, npm run build, and git diff --check; record any required follow-up in specs/006-list-filter-transactions/quickstart.md
- [ ] T050 Confirm F06 introduces no totals, balances, counts, details, mutations, dashboards, charts, exports, or new dependencies by reviewing specs/006-list-filter-transactions/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks every user story.
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and integrates its controls with the US1 list/page.
- **User Story 3 (Phase 5)**: Depends on Foundational and integrates safe states with the US1 hook/list.
- **User Story 4 (Phase 6)**: Depends on the desired US1-US3 interface surfaces being present.
- **Polish (Phase 7)**: Depends on all user stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story after Foundational.
- **US2 (P2)**: Uses the monthly list/page delivered by US1, but its combined-filter behavior is independently testable.
- **US3 (P3)**: Uses the list/hook delivered by US1, but each safe state and concurrency rule is independently testable.
- **US4 (P4)**: Validates and refines the controls, list, item, and page produced by US1-US3.

### Within Each User Story

- Write the story's tests first and confirm they fail before implementation.
- Implement pure presentation/data models before components that consume them.
- Implement service/hook state before page integration.
- Complete the independent test before moving to the next priority.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T003-T006 can run in parallel before T007-T011 implement the contracts.
- T012-T016 can run in parallel; T017 and T018 can then run in parallel.
- T023-T026 can run in parallel before US2 implementation.
- T031-T033 can run in parallel before US3 implementation.
- T037-T039 can run in parallel before US4 implementation.
- T044 and T045 can run in parallel with the final audits.

---

## Parallel Example: User Story 1

```text
Task T012: Add monthly load and pagination hook tests in src/features/transactions/use-transaction-list.test.tsx
Task T013: Add semantic item tests in src/features/transactions/transaction-list-item.test.tsx
Task T014: Add populated list tests in src/features/transactions/transaction-list.test.tsx
Task T015: Add page tests in src/pages/transactions-page.test.tsx
Task T016: Add route metadata tests in src/app/routes.test.ts
```

## Parallel Example: User Story 2

```text
Task T023: Add active-filter model tests in src/features/transactions/transaction-filters.test.ts
Task T024: Add filter control tests in src/features/transactions/transaction-list-controls.test.tsx
Task T025: Extend service tests for combined filters in src/features/transactions/transaction-list-service.test.ts
Task T026: Add filtered URL journey tests in src/pages/transactions-page.test.tsx
```

## Parallel Example: User Story 3

```text
Task T031: Add safe state rendering tests in src/features/transactions/transaction-list.test.tsx
Task T032: Add concurrency and revocation tests in src/features/transactions/use-transaction-list.test.tsx
Task T033: Add safe-copy tests in src/features/transactions/transaction-list-messages.test.ts
```

## Parallel Example: User Story 4

```text
Task T037: Add accessible control tests in src/features/transactions/transaction-list-controls.test.tsx
Task T038: Add semantic list/status tests in src/features/transactions/transaction-list.test.tsx
Task T039: Add mobile page composition tests in src/pages/transactions-page.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational.
2. Complete User Story 1.
3. Validate authorized monthly results, stable order, pagination, route protection, and financial context independently.
4. Demo or deploy the monthly consultation before adding optional filters and richer state handling.

### Incremental Delivery

1. Setup + Foundational establish one authorized coordinated query.
2. US1 delivers monthly consultation.
3. US2 adds combined filters and URL navigation.
4. US3 adds safe outcomes, retry, revocation clearing, and concurrency protection.
5. US4 completes mobile and accessibility refinement.
6. Polish validates performance, privacy, scope, and all project quality gates.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. After Foundational, assign US1 core list, US2 filter models/controls, and US3 safe-copy/concurrency tests in parallel where files do not overlap.
3. Integrate in priority order, then complete US4 and cross-cutting validation.

## Notes

- `[P]` tasks change different files or can be completed without an incomplete dependency.
- `[US1]` through `[US4]` provide traceability to the specification.
- Tests precede implementation in every risk-bearing phase.
- Database outputs, options, states, and failures must remain derived only from authorized rows.
- Stop at any checkpoint to validate that story independently.
