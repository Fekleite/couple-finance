# Tasks: F14 - Tabela de transacoes com TanStack Table

**Input**: Design documents from `/specs/014-transactions-table/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required. The specification and constitution require automated coverage for table columns, displayed financial information, filters, sorting, permission-sensitive actions, responsive rendering, accessibility-critical controls, and list states.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependency and shared test scaffolding used by all stories.

- [ ] T001 Add `@tanstack/react-table` dependency to package.json and package-lock.json
- [ ] T002 [P] Create transaction table fixture builders in src/test/transaction-table-test-utils.ts
- [ ] T003 Verify `@tanstack/react-table` is present in package-lock.json after dependency installation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and regression locks that MUST be in place before story implementation.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Add TransactionSortState, TransactionColumnKey, and TransactionActionAvailability types to src/features/transactions/transaction-list-types.ts
- [ ] T005 [P] Add regression tests for existing loading, error, empty_month, no_matches, ready, and loading_more list states in src/features/transactions/transaction-list.test.tsx
- [ ] T006 [P] Add regression tests proving existing filter parsing, serialization, and clear-additional behavior remain unchanged in src/features/transactions/transaction-query.test.ts
- [ ] T007 [P] Add regression tests proving the transactions page keeps filter URL canonicalization and registration modal behavior in src/pages/transactions-page.test.tsx
- [ ] T008 Document in src/features/transactions/transaction-list-service.ts comments or tests that F14 does not change the `list_financial_transactions` RPC contract

**Checkpoint**: Foundation ready - user story implementation can now start.

---

## Phase 3: User Story 1 - Revisar transacoes em uma tabela clara (Priority: P1) MVP

**Goal**: Users can review authorized transactions in a clear structured table with title, value, type, category, date, responsible person, visibility/sharing context, and applicable actions.

**Independent Test**: Render the list with authorized transactions of different types, categories, dates, responsible people, and visibilities; every essential field is visible without opening details.

### Tests for User Story 1

- [ ] T009 [P] [US1] Add failing column contract tests for required columns, headers, cell content, and sortable amount/date flags in src/features/transactions/transaction-table-columns.test.tsx
- [ ] T010 [P] [US1] Add failing table render tests for title, amount, type, category, date, responsible, visibility, shared creator, and populated rows in src/features/transactions/transaction-table.test.tsx
- [ ] T011 [P] [US1] Add failing accessibility tests for table role, column headers, row content, and non-decorative essential labels in src/features/transactions/transaction-table.test.tsx

### Implementation for User Story 1

- [ ] T012 [US1] Implement essential TanStack Table column definitions in src/features/transactions/transaction-table-columns.tsx
- [ ] T013 [US1] Implement TransactionTable desktop/tablet table shell with headers, rows, cells, and empty action slot in src/features/transactions/transaction-table.tsx
- [ ] T014 [US1] Replace ready/loading_more card list rendering with TransactionTable in src/features/transactions/transaction-list.tsx
- [ ] T015 [US1] Preserve LoadingState, ErrorState, EmptyState, no_matches, aria-busy, aria-live, and Load More behavior in src/features/transactions/transaction-list.tsx
- [ ] T016 [US1] Remove or limit TransactionListItem usage so it no longer owns the primary populated desktop presentation in src/features/transactions/transaction-list-item.tsx
- [ ] T017 [US1] Export TransactionTable and table column helpers from src/features/transactions/index.ts

**Checkpoint**: US1 is independently functional as the MVP table view.

---

## Phase 4: User Story 2 - Filtrar e ordenar sem perder contexto (Priority: P2)

**Goal**: Users can combine existing filters with sorting by date and amount without losing context or changing authorized result sets.

**Independent Test**: Apply filters for month, category, responsible person, type, and text, then sort by date and amount; only filtered transactions remain visible and active sort is perceivable.

### Tests for User Story 2

- [ ] T018 [P] [US2] Add failing unit tests for date and amount sort transitions, default recent-first order, and stable row preservation in src/features/transactions/transaction-table-sort.test.ts
- [ ] T019 [P] [US2] Add failing component tests for clicking date and amount headers, visible active sort state, and accessible sort state in src/features/transactions/transaction-table.test.tsx
- [ ] T020 [P] [US2] Add failing regression tests proving filters remain serialized in URL and unchanged after sorting in src/pages/transactions-page.test.tsx
- [ ] T021 [P] [US2] Add failing no_matches and clear-filters tests with sorted filtered data in src/features/transactions/transaction-list.test.tsx

### Implementation for User Story 2

- [ ] T022 [US2] Implement TransactionSortState helpers and comparators for transactionDate and amountCents in src/features/transactions/transaction-table-sort.ts
- [ ] T023 [US2] Integrate TanStack Table sorting state for date and amount columns in src/features/transactions/transaction-table.tsx
- [ ] T024 [US2] Add accessible sort buttons, aria-sort semantics, and Lucide sort icons with text alternatives in src/features/transactions/transaction-table-columns.tsx
- [ ] T025 [US2] Ensure sorting operates only on authorized loaded rows and does not trigger new service calls in src/features/transactions/transaction-table.tsx
- [ ] T026 [US2] Preserve existing filter URL ownership and avoid adding sort parameters to TransactionFilterSet in src/features/transactions/transaction-query.ts
- [ ] T027 [US2] Keep Load More append behavior compatible with current sorted row set in src/features/transactions/transaction-list.tsx

**Checkpoint**: US1 and US2 work independently: table review plus filter/sort interaction.

---

## Phase 5: User Story 3 - Usar a listagem em telas pequenas (Priority: P3)

**Goal**: Mobile and tablet users can review every essential transaction field without mandatory horizontal scrolling.

**Independent Test**: Render the transaction list in compact mode with long titles, categories, responsible labels, filters, sorting, and actions; all essential fields remain readable and operable.

### Tests for User Story 3

- [ ] T028 [P] [US3] Add failing component tests for compact presentation fields and labels in src/features/transactions/transaction-table.test.tsx
- [ ] T029 [P] [US3] Add failing long-content tests for title, category, responsible, visibility, and high amount wrapping in src/features/transactions/transaction-table.test.tsx
- [ ] T030 [P] [US3] Add failing keyboard/focus tests for compact sort controls, rows, Load More, and row actions in src/features/transactions/transaction-table.test.tsx
- [ ] T031 [P] [US3] Add responsive regression assertions for TransactionsPage layout with the F13 authenticated layout constraints in src/pages/transactions-page.test.tsx

### Implementation for User Story 3

- [ ] T032 [US3] Implement compact mobile row presentation with labeled fields in src/features/transactions/transaction-table.tsx
- [ ] T033 [US3] Add responsive TailwindCSS classes that hide wide table layout and show compact layout without mandatory horizontal scrolling in src/features/transactions/transaction-table.tsx
- [ ] T034 [US3] Add stable sizing, wrapping, and tabular numeric styles for long content and values in src/features/transactions/transaction-table.tsx
- [ ] T035 [US3] Ensure filters, sort controls, compact rows, Load More, and actions keep visible focus and predictable keyboard order in src/features/transactions/transaction-table.tsx
- [ ] T036 [US3] Adjust TransactionsPage container width only if needed to fit the F13 layout without reducing financial content in src/pages/transactions-page.tsx

**Checkpoint**: US3 preserves the table experience on mobile and tablet.

---

## Phase 6: User Story 4 - Executar acoes respeitando permissoes (Priority: P4)

**Goal**: Edit and delete actions are visible and executable only when existing permissions and flows allow them.

**Independent Test**: Render transactions under different action availability contexts; allowed actions have specific accessible names and restricted actions cannot be executed.

### Tests for User Story 4

- [ ] T037 [P] [US4] Add failing unit tests for action availability mapping without creating new permission rules in src/features/transactions/transaction-table-actions.test.ts
- [ ] T038 [P] [US4] Add failing component tests for allowed edit/delete actions and omitted or disabled restricted actions in src/features/transactions/transaction-table.test.tsx
- [ ] T039 [P] [US4] Add failing accessibility tests for action names that include transaction context in src/features/transactions/transaction-table.test.tsx
- [ ] T040 [P] [US4] Add regression tests that existing transaction registration, validation, and audit-adjacent flows still render from the transactions page in src/pages/transactions-page.test.tsx

### Implementation for User Story 4

- [ ] T041 [US4] Implement transaction action availability helper based on existing transaction/user context in src/features/transactions/transaction-table-actions.ts
- [ ] T042 [US4] Add action column rendering for edit/delete when callbacks and permissions are available in src/features/transactions/transaction-table-columns.tsx
- [ ] T043 [US4] Thread optional onEditTransaction and onDeleteTransaction callbacks through TransactionList props without requiring new flows in src/features/transactions/transaction-list.tsx
- [ ] T044 [US4] Keep TransactionsPage behavior unchanged when edit/delete callbacks are not yet provided by existing flows in src/pages/transactions-page.tsx
- [ ] T045 [US4] Use safe disabled or omitted action states that do not reveal inaccessible data in src/features/transactions/transaction-table.tsx

**Checkpoint**: US4 adds action availability without weakening permissions or inventing new financial flows.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and non-regression checks across all stories.

- [ ] T046 [P] Update src/features/transactions/transaction-list-messages.ts only if table states need clearer non-redundant wording
- [ ] T047 [P] Remove obsolete card-list-only tests or assertions that conflict with the new table contract in src/features/transactions/transaction-list-item.test.tsx
- [ ] T048 [P] Verify no schema, migration, RLS, Prisma, TanStack Query, or RPC changes were introduced in supabase/migrations/
- [ ] T049 [P] Run quickstart validation scenarios from specs/014-transactions-table/quickstart.md
- [ ] T050 Run `npm run lint` from package.json
- [ ] T051 Run `npm run format:check` from package.json
- [ ] T052 Run `npm run typecheck` from package.json
- [ ] T053 Run `npm run test:run` from package.json
- [ ] T054 Run `npm run build` from package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **US1 (Phase 3)**: Depends on Foundational and is the MVP.
- **US2 (Phase 4)**: Depends on Foundational; integrates naturally after US1 because sort controls live in table headers.
- **US3 (Phase 5)**: Depends on Foundational; can start after US1 table structure exists.
- **US4 (Phase 6)**: Depends on Foundational; can start after US1 action column slot exists.
- **Polish (Phase 7)**: Depends on all implemented stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories.
- **US2 (P2)**: Can be tested independently with table rows and filters; easiest after US1.
- **US3 (P3)**: Can be tested independently with compact rendering; easiest after US1.
- **US4 (P4)**: Can be tested independently with action availability fixtures; easiest after US1.

### Parallel Opportunities

- T002 and T003 can run after T001 because they touch different files.
- T005, T006, T007, and T008 can run in parallel after T004 when needed.
- US1 tests T009, T010, and T011 can run in parallel.
- US2 tests T018, T019, T020, and T021 can run in parallel.
- US3 tests T028, T029, T030, and T031 can run in parallel.
- US4 tests T037, T038, T039, and T040 can run in parallel.
- Polish checks T046, T047, T048, and T049 can run in parallel before final validation commands.

---

## Parallel Example: User Story 1

```bash
Task: "Add failing column contract tests for required columns, headers, cell content, and sortable amount/date flags in src/features/transactions/transaction-table-columns.test.tsx"
Task: "Add failing table render tests for title, amount, type, category, date, responsible, visibility, shared creator, and populated rows in src/features/transactions/transaction-table.test.tsx"
Task: "Add failing accessibility tests for table role, column headers, row content, and non-decorative essential labels in src/features/transactions/transaction-table.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add failing unit tests for date and amount sort transitions, default recent-first order, and stable row preservation in src/features/transactions/transaction-table-sort.test.ts"
Task: "Add failing regression tests proving filters remain serialized in URL and unchanged after sorting in src/pages/transactions-page.test.tsx"
Task: "Add failing no_matches and clear-filters tests with sorted filtered data in src/features/transactions/transaction-list.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "Add failing component tests for compact presentation fields and labels in src/features/transactions/transaction-table.test.tsx"
Task: "Add failing long-content tests for title, category, responsible, visibility, and high amount wrapping in src/features/transactions/transaction-table.test.tsx"
Task: "Add responsive regression assertions for TransactionsPage layout with the F13 authenticated layout constraints in src/pages/transactions-page.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "Add failing unit tests for action availability mapping without creating new permission rules in src/features/transactions/transaction-table-actions.test.ts"
Task: "Add failing component tests for allowed edit/delete actions and omitted or disabled restricted actions in src/features/transactions/transaction-table.test.tsx"
Task: "Add failing accessibility tests for action names that include transaction context in src/features/transactions/transaction-table.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational regression locks.
3. Complete Phase 3 US1.
4. Stop and validate that authorized transactions render as a clear table with all essential financial fields.

### Incremental Delivery

1. US1 delivers the new table presentation.
2. US2 adds safe sort behavior while preserving filters.
3. US3 completes mobile/tablet behavior without mandatory horizontal scrolling.
4. US4 adds permission-aware action availability without creating new financial flows.
5. Polish validates quickstart, pipeline commands, and non-regression constraints.

### Validation Gates

- Tests must be written before implementation tasks in each story.
- No task may introduce schema, migration, RLS, Prisma, TanStack Query, or RPC changes for F14.
- Every completed story must be independently demonstrable through its Independent Test.
- Final validation requires lint, format check, typecheck, tests, and build.
