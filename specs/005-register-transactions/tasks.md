# Tasks: F05 - Registro de transacoes

**Input**: Design documents from `/specs/005-register-transactions/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md

**Tests**: Test tasks are included because the feature requires exact monetary
handling, transactional idempotency, Supabase RPC/RLS authorization, safe
feedback, and accessible mobile interaction.

**Organization**: Tasks are grouped by user story so each story can be
implemented and tested as an independent increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no
  dependency on an incomplete task
- **[Story]**: Maps the task to a user story from spec.md
- Every task includes the exact file path it changes or validates

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the transaction feature boundary and reusable test support
without changing product behavior.

- [ ] T001 Create the transactions feature public API scaffold in `src/features/transactions/index.ts`
- [ ] T002 [P] Create authorized transaction, relationship, category, and RPC fixtures in `src/test/transaction-test-utils.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the persisted transaction contract, secure creation
operation, and frontend contracts required by every user story.

**CRITICAL**: No user story work begins until this phase is complete.

- [ ] T003 Define persisted rows, canonical submissions, authorized summaries, form context, submission states, and service result unions in `src/features/transactions/transaction-types.ts`
- [ ] T004 [P] Define neutral validation, unavailable-context, conflict, recoverable-failure, loading, and success copy in `src/features/transactions/transaction-messages.ts`
- [ ] T005 Create `public.financial_transactions`, constraints, indexes, explicit grants, SELECT RLS, private privileged creation function, and public idempotent RPC in `supabase/migrations/20260604000000_create_financial_transactions.sql`
- [ ] T006 Validate migration structure, constraints, indexes, function security, grants, RPC-only mutation, idempotency, and RLS contracts in `src/features/transactions/transaction-migration.test.ts`

**Checkpoint**: Secure persistence and shared frontend contracts are ready.

---

## Phase 3: User Story 1 - Registrar transacao individual (Priority: P1) MVP

**Goal**: Let any authenticated person create a private income or expense with
themselves as responsible and receive a clear authorized confirmation.

**Independent Test**: Sign in with no active couple link, open
`/app/transactions/new`, submit a valid individual income or expense, confirm
the summary, and verify the persisted row is readable only by its creator.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [ ] T007 [P] [US1] Test exact `pt-BR` input-to-cents parsing, upper and lower bounds, formatting, and invalid monetary input in `src/features/transactions/transaction-money.test.ts`
- [ ] T008 [P] [US1] Test normalized title and observation, positive amount, explicit type, civil date, category, individual defaults, and creator responsibility in `src/features/transactions/transaction-schemas.test.ts`
- [ ] T009 [P] [US1] Test individual RPC argument mapping, authorized result mapping, creator-derived responsibility, and safe service failures in `src/features/transactions/transaction-service.test.ts`
- [ ] T010 [P] [US1] Test individual defaults, category applicability, valid submission, and success reset behavior in `src/features/transactions/use-transaction-form.test.tsx`
- [ ] T011 [P] [US1] Test individual form fields, validation associations, explicit visibility, confirmation summary, and no list or totals in `src/features/transactions/transaction-form.test.tsx`
- [ ] T012 [P] [US1] Test authenticated `/app/transactions/new` metadata, protected routing, page states, and private-home entry point in `src/app/routes.test.ts`, `src/pages/new-transaction-page.test.tsx`, and `src/pages/private-home-page.test.tsx`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement exact `pt-BR` currency parsing and formatting helpers in `src/features/transactions/transaction-money.ts`
- [ ] T014 [P] [US1] Implement canonical transaction and individual-form Zod schemas with civil-date validation in `src/features/transactions/transaction-schemas.ts`
- [ ] T015 [US1] Implement `createFinancialTransaction` RPC invocation, explicit argument mapping, authorized response mapping, and safe failures in `src/features/transactions/transaction-service.ts`
- [ ] T016 [US1] Implement individual form context loading, safe defaults, applicable-category handling, submit coordination, and new-registration reset in `src/features/transactions/use-transaction-form.ts`
- [ ] T017 [P] [US1] Implement the authorized confirmation card with type, amount, date, category, responsible person, visibility, and new-registration action in `src/features/transactions/transaction-success-summary.tsx`
- [ ] T018 [US1] Implement the controlled individual transaction form with title, amount, type, date, category, visibility, observation, and submit feedback in `src/features/transactions/transaction-form.tsx`
- [ ] T019 [US1] Implement the authenticated new-transaction page and page title in `src/pages/new-transaction-page.tsx`
- [ ] T020 [US1] Register `/app/transactions/new` metadata and protected page routing in `src/app/routes.ts` and `src/app/router.tsx`
- [ ] T021 [US1] Add a clear private-home entry point for registering a transaction in `src/pages/private-home-page.tsx`
- [ ] T022 [US1] Export the individual transaction API from `src/features/transactions/index.ts`

**Checkpoint**: User Story 1 is functional and independently testable as the
MVP, including for a person without an active couple link.

---

## Phase 4: User Story 2 - Registrar transacao compartilhada (Priority: P2)

**Goal**: Let an active couple member create a shared transaction, select an
eligible active member as responsible, and preserve creator, responsibility,
and visibility as distinct concepts.

**Independent Test**: With two active members in one shared budget, create a
shared transaction for either eligible responsible person, verify both members
can read it, and verify pending, inactive, removed, or unrelated people cannot
create or read it.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [ ] T023 [P] [US2] Test shared RPC arguments, creator and responsible distinction, active-budget requirements, and safe unauthorized failures in `src/features/transactions/transaction-service.test.ts`
- [ ] T024 [P] [US2] Test shared visibility eligibility, active responsible options, visibility changes, and stale responsible clearing in `src/features/transactions/use-transaction-form.test.tsx`
- [ ] T025 [P] [US2] Test shared visibility and responsible controls, creator clarification, and safely blocked shared states in `src/features/transactions/transaction-form.test.tsx`
- [ ] T026 [US2] Extend migration contract tests for active creator/responsible membership checks, inactive-budget denial, shared SELECT RLS, and non-disclosing failures in `src/features/transactions/transaction-migration.test.ts`

### Implementation for User Story 2

- [ ] T027 [US2] Extend canonical schemas for shared budget and eligible responsible-person requirements in `src/features/transactions/transaction-schemas.ts`
- [ ] T028 [US2] Load the authorized active shared context and build neutral `Voce` and `Pessoa parceira` responsible options in `src/features/transactions/use-transaction-form.ts`
- [ ] T029 [US2] Implement shared visibility selection, eligible responsible selection, stale-option clearing, and blocked-context guidance in `src/features/transactions/transaction-form.tsx`
- [ ] T030 [US2] Extend service failure mapping for shared context and responsible-person revalidation without exposing private identifiers in `src/features/transactions/transaction-service.ts`
- [ ] T031 [US2] Show shared visibility, distinct creator/responsible labels, and authorized category resolution in `src/features/transactions/transaction-success-summary.tsx`

**Checkpoint**: User Story 2 is independently testable with active members and
denies every inactive or unrelated shared context safely.

---

## Phase 5: User Story 3 - Corrigir dados invalidos e concluir com confianca (Priority: P3)

**Goal**: Provide actionable validation, safe recovery, and at-most-once
creation across repeated confirmation and retries.

**Independent Test**: Submit invalid fields, invalidate a category or shared
context, simulate a recoverable failure, retry the same intended payload, edit
the payload after an attempt, and verify no duplicate or silent fallback is
created.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [ ] T032 [P] [US3] Test attempt-key creation, repeated-submit suppression, same-payload retry, changed-payload key renewal, and new-registration key renewal in `src/features/transactions/transaction-submission.test.ts`
- [ ] T033 [P] [US3] Test unavailable-category rejection without `other` fallback and all field boundary errors in `src/features/transactions/transaction-schemas.test.ts`
- [ ] T034 [P] [US3] Test safe mapping of validation, unavailable category, unavailable shared context, unavailable responsible, conflict, and temporary failures in `src/features/transactions/transaction-service.test.ts`
- [ ] T035 [P] [US3] Test recoverable-data preservation, option revalidation, blocked states, retries, and post-attempt edits in `src/features/transactions/use-transaction-form.test.tsx`
- [ ] T036 [US3] Extend migration contract tests for same-key equivalent payload recovery, different-payload conflict, per-creator key isolation, and atomic revalidation in `src/features/transactions/transaction-migration.test.ts`

### Implementation for User Story 3

- [ ] T037 [P] [US3] Implement canonical payload comparison, UUID attempt lifecycle, in-flight suppression, and retry rules in `src/features/transactions/transaction-submission.ts`
- [ ] T038 [US3] Integrate idempotent submission, recoverable-data preservation, context refresh, and changed-payload key renewal in `src/features/transactions/use-transaction-form.ts`
- [ ] T039 [US3] Associate actionable field errors, announce recoverable/global failures, disable repeated confirmation, and preserve safe values in `src/features/transactions/transaction-form.tsx`
- [ ] T040 [US3] Map RPC validation and conflict outcomes to typed safe results while excluding raw errors and private values in `src/features/transactions/transaction-service.ts`
- [ ] T041 [US3] Export submission helpers and resilient form contracts from `src/features/transactions/index.ts`

**Checkpoint**: User Story 3 is independently testable and every intended
submission creates at most one transaction.

---

## Phase 6: User Story 4 - Registrar transacao em mobile e com acessibilidade (Priority: P4)

**Goal**: Make the complete registration flow understandable and operable on
small screens, by keyboard, and with assistive technology.

**Independent Test**: Complete individual and shared registration at a mobile
viewport and 200% text zoom using only the keyboard, confirming logical focus,
labels, errors, loading, blocked, and success states without color-only meaning
or horizontal scrolling.

### Tests for User Story 4

> Write these tests first and confirm they fail before implementation.

- [ ] T042 [P] [US4] Test keyboard operation, logical field order, labels, descriptions, error references, focus movement, and status announcements in `src/features/transactions/transaction-form.test.tsx`
- [ ] T043 [P] [US4] Test perceivable success content, creator clarification, and keyboard-operable new-registration action in `src/features/transactions/transaction-form.test.tsx`
- [ ] T044 [P] [US4] Test mobile-first page structure, feedback states, and absence of horizontal-layout assumptions in `src/pages/new-transaction-page.test.tsx`

### Implementation for User Story 4

- [ ] T045 [US4] Apply semantic field grouping, visible labels, error associations, live status feedback, focus management, touch-safe controls, and responsive layout in `src/features/transactions/transaction-form.tsx`
- [ ] T046 [US4] Apply semantic success announcement, non-color-only labels, responsive content, and focus restoration in `src/features/transactions/transaction-success-summary.tsx`
- [ ] T047 [US4] Apply mobile-first page spacing, readable width, and perceivable loading, error, blocked, and success transitions in `src/pages/new-transaction-page.tsx`

**Checkpoint**: All four user stories are functional and the complete
registration journey is accessible and mobile-first.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the integrated feature against database, technical,
privacy, accessibility, responsive, performance, and scope requirements.

- [ ] T048 [P] Update implementation and validation notes with final commands and observed results in `specs/005-register-transactions/quickstart.md`
- [ ] T049 Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run`, and `npm run build` and resolve failures in affected files under `src/features/transactions/`, `src/pages/`, and `src/app/`
- [ ] T050 Validate local migration reset, grants, RPC exposure, private function security, constraints, indexes, idempotency, and RLS using `supabase/migrations/20260604000000_create_financial_transactions.sql`
- [ ] T051 Perform individual/shared authorization and privacy review confirming no raw errors, private IDs, unauthorized people, transactions, budgets, or relationship states leak from `src/features/transactions/` and `src/pages/new-transaction-page.tsx`
- [ ] T052 Perform mobile, 200% text zoom, no-horizontal-scroll, keyboard-only, focus-visible, and screen-reader semantics review against `src/pages/new-transaction-page.tsx` and `src/features/transactions/transaction-form.tsx`
- [ ] T053 Verify currency, civil-date, category, creator, responsible-person, and visibility clarity in `src/features/transactions/transaction-form.tsx` and `src/features/transactions/transaction-success-summary.tsx`
- [ ] T054 Confirm F05 introduces no transaction list, filter, search, edit, delete, totals, balance, dashboard, chart, custom category, recurrence, attachment, import, or audit-history behavior in `src/features/transactions/`, `src/pages/`, and `src/app/`
- [ ] T055 Verify all manual acceptance scenarios and record final validation results in `specs/005-register-transactions/quickstart.md`
- [ ] T056 Run `git diff --check`, resolve whitespace errors in all F05 files, and record the result in `specs/005-register-transactions/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; integrates shared
  behavior into the transaction feature after the individual path is stable.
- **User Story 3 (Phase 5)**: Depends on the creation paths from User Stories 1
  and 2 so it can harden their validation, retry, and idempotency behavior.
- **User Story 4 (Phase 6)**: Depends on the complete form states from User
  Stories 1-3 so accessibility and responsive validation cover the full flow.
- **Polish (Phase 7)**: Depends on all stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story after Foundational.
- **US2 (P2)**: Uses the shared transaction contracts from Foundational and
  extends the US1 form/service surfaces; it remains independently testable with
  active and inactive shared contexts.
- **US3 (P3)**: Hardens the submission paths delivered by US1 and US2 and is
  independently testable through invalid, retry, conflict, and duplicate
  scenarios.
- **US4 (P4)**: Applies to the complete form state machine from US1-US3 and is
  independently testable through mobile and assistive-technology scenarios.

### Within Each User Story

- Write story tests first and confirm they fail.
- Implement pure helpers and schemas before their service and UI consumers.
- Implement service behavior before controller integration.
- Implement controller behavior before form and page integration.
- Complete the story checkpoint before treating the increment as delivered.

### Parallel Opportunities

- T002 can run in parallel with T001.
- T004 can run in parallel with T003 and T005.
- T007-T012 can be written in parallel after Foundational.
- T013 and T014 can run in parallel; T017 can run in parallel with controller
  implementation.
- T023-T025 can be written in parallel before shared implementation.
- T032-T035 can be written in parallel before resilience implementation.
- T042-T044 can be written in parallel before accessibility implementation.
- T048 and the manual review tasks can proceed in parallel with separate
  reviewers after implementation is complete.

---

## Parallel Example: User Story 1

```text
Task T007: Test exact currency conversion in src/features/transactions/transaction-money.test.ts
Task T008: Test individual schemas in src/features/transactions/transaction-schemas.test.ts
Task T009: Test individual RPC mapping in src/features/transactions/transaction-service.test.ts
Task T010: Test individual controller defaults in src/features/transactions/use-transaction-form.test.tsx
Task T011: Test individual form behavior in src/features/transactions/transaction-form.test.tsx
Task T012: Test route, page, and entry-point integration
```

## Parallel Example: User Story 2

```text
Task T023: Test shared service behavior
Task T024: Test shared controller eligibility and visibility changes
Task T025: Test shared form controls and blocked states
```

## Parallel Example: User Story 3

```text
Task T032: Test idempotent attempt lifecycle
Task T033: Test unavailable category and field boundaries
Task T034: Test safe service failure mapping
Task T035: Test recoverable controller states and retries
```

## Parallel Example: User Story 4

```text
Task T042: Test form keyboard and assistive-technology semantics
Task T043: Test accessible success and new-registration behavior
Task T044: Test mobile-first page structure
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational, including the secure migration and RPC.
3. Complete User Story 1 tests and implementation.
4. Stop and validate individual registration without an active couple link.
5. Deliver the private individual registration flow as the MVP.

### Incremental Delivery

1. Setup + Foundational establish secure transaction persistence.
2. US1 delivers individual transaction registration.
3. US2 adds active-couple shared registration and responsibility selection.
4. US3 hardens validation, retries, and at-most-once creation.
5. US4 completes mobile and accessibility behavior.
6. Polish validates the integrated feature and scope boundaries.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. After Foundational, one developer can write US1 frontend tests while another
   implements pure money/schema helpers and another reviews the migration.
3. For each later story, split service/controller tests from form/page tests,
   then integrate through the story implementation tasks.
4. Run database, privacy, accessibility, and responsive reviews in parallel
   once all selected stories are integrated.

---

## Notes

- `[P]` tasks touch different files or are independent validation work.
- `[US1]` through `[US4]` provide traceability to spec.md.
- The RPC is the only client creation path; do not add direct client inserts.
- Persist money as integer cents and transaction dates as civil `date` values.
- Do not silently replace an unavailable category with `other`.
- Keep creator, responsible person, and visibility distinct.
- Do not create transaction lists, totals, dashboards, edits, or deletion in
  F05.
- Commit after each task or logical task group.
