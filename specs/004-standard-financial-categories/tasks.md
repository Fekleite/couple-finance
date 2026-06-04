# Tasks: F04 - Categorias financeiras padrao

**Input**: Design documents from `/specs/004-standard-financial-categories/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are included because the feature requires validation of
Supabase RLS, stable financial reference data, authenticated access, safe
feedback states, mobile behavior, and accessible keyboard selection.

**Organization**: Tasks are grouped by user story so each story can be
implemented and tested as an independent increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no
  dependency on an incomplete task
- **[Story]**: Maps the task to a user story from spec.md
- Every task includes the exact file path it changes or validates

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature module and reusable test support without
changing product behavior.

- [ ] T001 Create the categories feature public API scaffold in `src/features/categories/index.ts`
- [ ] T002 [P] Create reusable standard-category fixtures and Supabase row builders in `src/test/category-test-utils.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the canonical read-only catalog and shared contracts
required by every user story.

**CRITICAL**: No user story work begins until this phase is complete.

- [ ] T003 Create `public.standard_financial_categories` with constraints, idempotent eleven-category seed, RLS, authenticated SELECT grant, and revoked client mutations in `supabase/migrations/20260603000000_create_standard_financial_categories.sql`
- [ ] T004 [P] Define `CategoryApplicability`, persisted row shape, frontend category shape, service result, and catalog state unions in `src/features/categories/category-types.ts`
- [ ] T005 [P] Define neutral loading, empty, unavailable, and retry copy in `src/features/categories/category-messages.ts`
- [ ] T006 Validate seed idempotency, constraints, authenticated SELECT, anonymous denial, and authenticated mutation denial against `supabase/migrations/20260603000000_create_standard_financial_categories.sql`

**Checkpoint**: The canonical catalog and shared frontend contracts are ready.

---

## Phase 3: User Story 1 - Consultar categorias padrao (Priority: P1) MVP

**Goal**: Let an authenticated person open a real catalog page and understand
all active standard categories in canonical order.

**Independent Test**: Sign in, open `/app/categories`, and confirm the eleven
active categories appear in order with stable identities, clear names and
descriptions, while loading, empty, error, and retry states remain safe.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [ ] T007 [P] [US1] Test active-only ordered Supabase querying, snake-case mapping, and safe failure handling in `src/features/categories/category-service.test.ts`
- [ ] T008 [P] [US1] Test loading, ready, empty, error, retry, and session-change behavior in `src/features/categories/use-categories.test.tsx`
- [ ] T009 [P] [US1] Test the authenticated catalog page content, canonical order, feedback states, and absence of financial counters or movements in `src/pages/categories-page.test.tsx`
- [ ] T010 [P] [US1] Test `/app/categories` metadata and protected route registration in `src/app/routes.test.ts`

### Implementation for User Story 1

- [ ] T011 [US1] Implement `listActiveCategories` with explicit columns, active filtering, ascending order, row mapping, and safe errors in `src/features/categories/category-service.ts`
- [ ] T012 [US1] Implement catalog loading state and refresh behavior that invalidates stale results on auth-session changes in `src/features/categories/use-categories.ts`
- [ ] T013 [P] [US1] Implement a responsive, semantic read-only category option presentation with decorative code-to-icon mapping in `src/features/categories/category-option.tsx`
- [ ] T014 [US1] Implement the authenticated catalog page using the category hook and shared feedback components in `src/pages/categories-page.tsx`
- [ ] T015 [US1] Register `/app/categories` metadata and protected page routing in `src/app/routes.ts` and `src/app/router.tsx`
- [ ] T016 [US1] Add a clear authenticated entry point to the catalog without implying financial activity in `src/pages/private-home-page.tsx`

**Checkpoint**: User Story 1 is functional and independently testable as the
MVP.

---

## Phase 4: User Story 2 - Escolher categoria com clareza em mobile (Priority: P2)

**Goal**: Provide a reusable category selector that is fast, legible, and
accessible on small screens without persisting a movement.

**Independent Test**: Render the selector at a mobile viewport, operate it only
with the keyboard, and confirm labels, descriptions, focus, selected state,
applicability filtering, and `Outros` as the final fallback.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [ ] T017 [P] [US2] Test keyboard operation, accessible labels and descriptions, visible selected state, disabled state, applicability filtering, unknown values, empty input, and final `Outros` ordering in `src/features/categories/category-selector.test.tsx`

### Implementation for User Story 2

- [ ] T018 [US2] Implement the pure controlled category selector with native or equivalent selection semantics and mobile-first layout in `src/features/categories/category-selector.tsx`
- [ ] T019 [US2] Reuse the semantic category option presentation for selectable and selected states without color-only meaning in `src/features/categories/category-option.tsx`
- [ ] T020 [US2] Export the reusable selector and its prop types from `src/features/categories/index.ts`

**Checkpoint**: User Story 2 is independently usable by future movement flows
without introducing persistence.

---

## Phase 5: User Story 3 - Usar categorias em contextos individuais e compartilhados (Priority: P3)

**Goal**: Keep one neutral global category vocabulary reusable by both future
individual and shared movements without exposing or implying inaccessible
financial data.

**Independent Test**: Verify that the same category codes and options can be
used for individual and shared contexts, and that category queries, types,
pages, and messages contain no ownership, membership, movement, usage-count,
or unauthorized-scope data.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [ ] T021 [P] [US3] Test catalog invariants, stable codes, unique positive order, required minimum categories, applicability, final `Outros`, and absence of ownership or usage fields in `src/features/categories/category-catalog.test.ts`
- [ ] T022 [P] [US3] Test that category query construction never requests users, memberships, budgets, movements, or counters in `src/features/categories/category-service.test.ts`
- [ ] T023 [P] [US3] Test that catalog presentation and messages do not reveal or imply individual, shared, or inaccessible financial records in `src/pages/categories-page.test.tsx`

### Implementation for User Story 3

- [ ] T024 [US3] Implement reusable catalog invariant and applicability helpers that never filter by ownership context in `src/features/categories/category-catalog.ts`
- [ ] T025 [US3] Add neutral `CategoryUsageContext` and future `categoryCode` reference contracts without creating movement persistence in `src/features/categories/category-types.ts`
- [ ] T026 [US3] Apply shared catalog helpers to the service, page, and selector exports in `src/features/categories/category-service.ts`, `src/pages/categories-page.tsx`, and `src/features/categories/index.ts`

**Checkpoint**: All stories are independently functional and the category
vocabulary remains privacy-neutral.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature against technical, accessibility,
privacy, responsive, and scope requirements.

- [ ] T027 [P] Update implementation and validation notes with final commands and observed results in `specs/004-standard-financial-categories/quickstart.md`
- [ ] T028 Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run`, and `npm run build` and resolve failures in affected files under `src/features/categories/`, `src/pages/categories-page.tsx`, and `src/app/`
- [ ] T029 Validate migration reset, local migration listing, RLS, grants, seed order, and mutation denial using `supabase/migrations/20260603000000_create_standard_financial_categories.sql`
- [ ] T030 Perform mobile, 200% text zoom, no-horizontal-scroll, keyboard-only, focus-visible, and screen-reader semantics review against `src/pages/categories-page.tsx` and `src/features/categories/category-selector.tsx`
- [ ] T031 Perform privacy and out-of-scope review confirming no raw Supabase errors, ownership leakage, movements, totals, counters, filters, dashboards, or automatic categorization in `src/features/categories/` and `src/pages/categories-page.tsx`
- [ ] T032 Verify all manual acceptance scenarios and record final validation results in `specs/004-standard-financial-categories/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; may proceed in parallel
  with User Story 1 by using the shared fixtures and contracts.
- **User Story 3 (Phase 5)**: Depends on Foundational; its final integration
  task T026 follows the relevant User Story 1 and User Story 2 implementations.
- **Polish (Phase 6)**: Depends on all stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story after Foundational.
- **US2 (P2)**: No dependency on another story after Foundational; it consumes
  category arrays through props and does not require the page or service.
- **US3 (P3)**: Invariant and privacy tests can start after Foundational; T026
  integrates the completed catalog helper with US1 and US2 surfaces.

### Within Each User Story

- Write story tests first and confirm they fail.
- Implement types and pure helpers before consumers.
- Implement service before hook and hook before page.
- Implement core behavior before route or export integration.
- Complete the story checkpoint before treating the increment as delivered.

### Parallel Opportunities

- T002 can run in parallel with T001.
- T004 and T005 can run in parallel after T001.
- T007-T010 can be written in parallel after Foundational.
- T013 can run in parallel with T011 and T012.
- US1 and US2 can proceed in parallel after Foundational.
- T021-T023 can be written in parallel after Foundational.
- T027 can run in parallel with code-focused polish work.

---

## Parallel Example: User Story 1

```text
Task T007: Test the category service in src/features/categories/category-service.test.ts
Task T008: Test the category hook in src/features/categories/use-categories.test.tsx
Task T009: Test the catalog page in src/pages/categories-page.test.tsx
Task T010: Test route metadata and protection in src/app/routes.test.ts
```

## Parallel Example: User Story 2

```text
Task T017: Write selector accessibility and mobile behavior tests
Task T018: Implement the controlled selector after T017 is failing
```

## Parallel Example: User Story 3

```text
Task T021: Test catalog invariants and neutral data shape
Task T022: Test privacy-safe category query construction
Task T023: Test privacy-neutral catalog presentation and messages
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational, including migration and RLS validation.
3. Complete User Story 1 tests and implementation.
4. Stop and validate `/app/categories` independently.
5. Deliver the authenticated read-only catalog as the MVP.

### Incremental Delivery

1. Setup + Foundational establish the canonical secure catalog.
2. US1 delivers authenticated catalog consultation.
3. US2 adds a reusable accessible selector without movement persistence.
4. US3 confirms neutral reuse across future individual and shared contexts.
5. Polish validates the complete feature and its scope boundaries.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. After Foundational, one developer can deliver US1 while another delivers
   US2 and a third writes US3 invariant/privacy tests.
3. Complete T026 after the relevant US1 and US2 surfaces exist.
4. Run cross-cutting validation once all selected stories are integrated.

---

## Notes

- `[P]` tasks touch different files or are independent validation work.
- `[US1]`, `[US2]`, and `[US3]` provide traceability to spec.md.
- The persisted Supabase catalog remains the only complete source of truth.
- Do not duplicate the eleven-category catalog as a frontend constant.
- Do not create movements, custom categories, counters, totals, filters,
  dashboards, charts, or automatic categorization in F04.
- Commit after each task or logical task group.
