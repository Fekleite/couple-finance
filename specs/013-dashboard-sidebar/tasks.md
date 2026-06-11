# Tasks: F13 - Layout principal com sidebar de dashboard

**Input**: Design documents from `/specs/013-dashboard-sidebar/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required for this 2.0 increment because the specification requires automated checks for layout rendering, navigation items, active route state, responsive behavior, protected navigation, and keyboard accessibility.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing implementation surface and prepare the layout/navigation files without changing behavior.

- [X] T001 Review current private route tree and route constants in `src/app/router.tsx` and `src/app/routes.ts`
- [X] T002 Review current authenticated layout behavior and tests in `src/components/layout/authenticated-layout.tsx` and `src/components/layout/authenticated-layout.test.tsx`
- [X] T003 [P] Review existing layout primitives and utilities in `src/components/layout/app-layout.tsx`, `src/components/layout/public-navigation.tsx`, and `src/lib/utils.ts`
- [X] T004 [P] Review current auth route guard behavior in `src/features/auth/protected-route.tsx` and `src/features/auth/protected-route.test.tsx`
- [X] T005 Record the implementation inventory and out-of-scope route decisions in `specs/013-dashboard-sidebar/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared navigation model and tests that every story depends on.

**Critical**: No user story work should begin until this phase is complete.

- [X] T006 [P] Add navigation item and route-match tests for dashboard, transactions, transaction creation, categories, goals, audit, and invite routes in `src/components/layout/private-navigation.test.tsx`
- [X] T007 [P] Add availability tests proving Settings and Partner/Invites aggregate routes are hidden while absent from `PRIVATE_ROUTES` in `src/components/layout/private-navigation.test.tsx`
- [X] T008 Create typed private navigation configuration and active-route helpers in `src/components/layout/private-navigation.tsx`
- [X] T009 Wire `PRIVATE_ROUTES` into the private navigation configuration without adding new routes in `src/components/layout/private-navigation.tsx`
- [X] T010 Verify foundational navigation tests fail before implementation and then pass after T008-T009 in `src/components/layout/private-navigation.test.tsx`

**Checkpoint**: Shared navigation model is ready; user story implementation can start.

---

## Phase 3: User Story 1 - Navegar pelos modulos autenticados no desktop (Priority: P1) MVP

**Goal**: Users authenticated on desktop can navigate the main private modules from a clear dashboard sidebar without losing session context.

**Independent Test**: Render the authenticated layout at desktop routes, verify sidebar links, active route state, preserved outlet content, and logout/session behavior.

### Tests for User Story 1

- [X] T011 [P] [US1] Add desktop sidebar rendering tests for authenticated users in `src/components/layout/authenticated-layout.test.tsx`
- [X] T012 [P] [US1] Add active-route tests for `/app`, `/app/transactions`, `/app/categories`, `/app/goals`, and `/app/audit` in `src/components/layout/authenticated-layout.test.tsx`
- [X] T013 [P] [US1] Add session preservation and outlet rendering regression tests in `src/components/layout/authenticated-layout.test.tsx`
- [X] T014 [P] [US1] Add navigation item contract coverage for labels, hrefs, and absence of private counts in `src/components/layout/private-navigation.test.tsx`

### Implementation for User Story 1

- [X] T015 [US1] Refactor `AuthenticatedLayout` into a dashboard shell with sidebar and main content region in `src/components/layout/authenticated-layout.tsx`
- [X] T016 [US1] Replace the horizontal private nav with sidebar navigation using shared navigation items in `src/components/layout/authenticated-layout.tsx`
- [X] T017 [US1] Preserve account summary, logout behavior, session messages, and `Outlet` rendering in `src/components/layout/authenticated-layout.tsx`
- [X] T018 [US1] Apply desktop layout sizing, spacing, and active styles with existing TailwindCSS patterns in `src/components/layout/authenticated-layout.tsx`
- [X] T019 [US1] Confirm no new Settings, Partner, or Configuracoes page route was added in `src/app/routes.ts` and `src/app/router.tsx`

**Checkpoint**: Desktop sidebar MVP is functional and independently testable.

---

## Phase 4: User Story 2 - Usar a navegacao em tablet e mobile (Priority: P2)

**Goal**: Users on tablet and mobile can open a compact navigation, reach the same safe destinations, and return to the selected page content without layout breakage.

**Independent Test**: Render the authenticated layout in compact mode, open/close navigation, activate a module link, and verify the content remains accessible with no hidden financial page content.

### Tests for User Story 2

- [X] T020 [P] [US2] Add compact navigation open and close interaction tests in `src/components/layout/authenticated-layout.test.tsx`
- [X] T021 [P] [US2] Add compact navigation link activation tests for transactions and goals in `src/components/layout/authenticated-layout.test.tsx`
- [X] T022 [P] [US2] Add responsive class and long-label regression coverage for compact navigation in `src/components/layout/authenticated-layout.test.tsx`

### Implementation for User Story 2

- [X] T023 [US2] Add compact navigation state and open/close controls with accessible labels in `src/components/layout/authenticated-layout.tsx`
- [X] T024 [US2] Render the private navigation in a mobile/tablet compact surface using existing layout primitives in `src/components/layout/authenticated-layout.tsx`
- [X] T025 [US2] Ensure compact navigation closes after selecting a destination while preserving route content in `src/components/layout/authenticated-layout.tsx`
- [X] T026 [US2] Add stable responsive dimensions and wrapping for sidebar, compact trigger, labels, and main content in `src/components/layout/authenticated-layout.tsx`
- [X] T027 [US2] Document the manual mobile/tablet validation path in `specs/013-dashboard-sidebar/quickstart.md`

**Checkpoint**: Mobile/tablet navigation works independently after the desktop MVP.

---

## Phase 5: User Story 3 - Navegar com teclado e tecnologias assistivas (Priority: P3)

**Goal**: Keyboard and assistive technology users can understand and operate the private navigation predictably.

**Independent Test**: Use keyboard-focused component tests to tab through logout, compact controls, and links; verify accessible names and current-page semantics.

### Tests for User Story 3

- [X] T028 [P] [US3] Add keyboard tab order tests for logout, compact trigger, sidebar links, and main content in `src/components/layout/authenticated-layout.test.tsx`
- [X] T029 [P] [US3] Add accessible-name tests for navigation landmarks, compact controls, and icon-backed links in `src/components/layout/authenticated-layout.test.tsx`
- [X] T030 [P] [US3] Add current-page semantic tests for active navigation links in `src/components/layout/authenticated-layout.test.tsx`
- [X] T031 [P] [US3] Add focus return tests after closing compact navigation in `src/components/layout/authenticated-layout.test.tsx`

### Implementation for User Story 3

- [X] T032 [US3] Add semantic navigation landmarks, current-page state, and accessible labels in `src/components/layout/authenticated-layout.tsx`
- [X] T033 [US3] Ensure icon usage is decorative or paired with text and accessible names in `src/components/layout/authenticated-layout.tsx`
- [X] T034 [US3] Implement predictable keyboard open/close behavior and focus return for compact navigation in `src/components/layout/authenticated-layout.tsx`
- [X] T035 [US3] Preserve the skip-link and main content relationship from `src/components/layout/app-layout.tsx` while nesting the authenticated shell in `src/components/layout/authenticated-layout.tsx`

**Checkpoint**: Navigation is operable and understandable by keyboard and assistive technologies.

---

## Phase 6: User Story 4 - Ver apenas navegacao aplicavel ao estado da conta (Priority: P4)

**Goal**: Users see only safe, applicable private navigation for their session and available modules.

**Independent Test**: Validate unauthenticated access stays protected, absent modules are hidden, session-loading or logout states do not leak private information, and dynamic invite routes remain safe.

### Tests for User Story 4

- [X] T036 [P] [US4] Add protected-route regression tests proving unauthenticated users do not render private navigation in `src/features/auth/protected-route.test.tsx`
- [X] T037 [P] [US4] Add hidden unavailable module tests for Settings and Partner/Invites aggregate navigation in `src/components/layout/private-navigation.test.tsx`
- [X] T038 [P] [US4] Add logout progress and safe session message tests for the new layout structure in `src/components/layout/authenticated-layout.test.tsx`
- [X] T039 [P] [US4] Add dynamic invite route active-state fallback tests in `src/components/layout/private-navigation.test.tsx`

### Implementation for User Story 4

- [X] T040 [US4] Ensure private navigation is only rendered inside the protected authenticated layout in `src/components/layout/authenticated-layout.tsx`
- [X] T041 [US4] Keep unavailable modules hidden without disabled labels that imply private data in `src/components/layout/private-navigation.tsx`
- [X] T042 [US4] Preserve safe logout progress and session message behavior in `src/components/layout/authenticated-layout.tsx`
- [X] T043 [US4] Preserve dynamic invite route accessibility without adding a false aggregate Partner/Invites destination in `src/app/router.tsx` and `src/components/layout/private-navigation.tsx`

**Checkpoint**: Navigation availability is safe and does not expand product scope.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish validation, clean up implementation details, and document any intentional scope decisions.

- [X] T044 [P] Update implementation notes for desktop, mobile, keyboard, and protected-route validation in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T045 [P] Review visual density and remove redundant navigation text, badges, or decorative icons in `src/components/layout/authenticated-layout.tsx`
- [X] T046 [P] Review route labels and titles for consistency with final navigation labels in `src/app/routes.ts`
- [X] T047 Run `npm run lint` and record any required fixes in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T048 Run `npm run format:check` and record any required fixes in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T049 Run `npm run typecheck` and record any required fixes in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T050 Run `npm run test:run` and record any required fixes in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T051 Run `npm run build` and record any required fixes in `specs/013-dashboard-sidebar/quickstart.md`
- [X] T052 Perform manual quickstart validation for desktop, tablet, mobile, keyboard, and unauthenticated access in `specs/013-dashboard-sidebar/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **US1 Desktop Sidebar (Phase 3)**: Depends on Foundational and is the MVP.
- **US2 Mobile/Tablet Compact Navigation (Phase 4)**: Depends on Foundational and benefits from US1 shared shell, but remains independently testable.
- **US3 Keyboard/Assistive Navigation (Phase 5)**: Depends on Foundational and can run alongside US2 after US1 shell structure is stable.
- **US4 Applicable/Safe Navigation (Phase 6)**: Depends on Foundational and can run alongside US2/US3 after shared navigation exists.
- **Polish (Phase 7)**: Depends on desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: Required MVP; establishes desktop dashboard sidebar.
- **US2 (P2)**: Builds compact navigation on the same layout shell.
- **US3 (P3)**: Hardens keyboard and assistive semantics across desktop and compact modes.
- **US4 (P4)**: Hardens protected/session/module availability states.

### Parallel Opportunities

- T003 and T004 can run in parallel during setup.
- T006 and T007 can run in parallel before shared navigation implementation.
- US1 tests T011-T014 can run in parallel before implementation.
- US2 tests T020-T022 can run in parallel after foundational navigation exists.
- US3 tests T028-T031 can run in parallel after the layout shell exists.
- US4 tests T036-T039 can run in parallel after private navigation helpers exist.
- Polish review tasks T044-T046 can run in parallel before final validation commands.

---

## Parallel Example: User Story 1

```bash
Task: "T011 [P] [US1] Add desktop sidebar rendering tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T012 [P] [US1] Add active-route tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T014 [P] [US1] Add navigation item contract coverage in src/components/layout/private-navigation.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T020 [P] [US2] Add compact navigation open and close interaction tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T021 [P] [US2] Add compact navigation link activation tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T022 [P] [US2] Add responsive class and long-label regression coverage in src/components/layout/authenticated-layout.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T028 [P] [US3] Add keyboard tab order tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T029 [P] [US3] Add accessible-name tests in src/components/layout/authenticated-layout.test.tsx"
Task: "T030 [P] [US3] Add current-page semantic tests in src/components/layout/authenticated-layout.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T036 [P] [US4] Add protected-route regression tests in src/features/auth/protected-route.test.tsx"
Task: "T037 [P] [US4] Add hidden unavailable module tests in src/components/layout/private-navigation.test.tsx"
Task: "T039 [P] [US4] Add dynamic invite route active-state fallback tests in src/components/layout/private-navigation.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for US1.
3. Validate desktop authenticated navigation independently.
4. Stop and review before compact/mobile behavior.

### Incremental Delivery

1. Deliver US1 to replace the private horizontal menu with desktop sidebar.
2. Add US2 compact navigation for mobile/tablet.
3. Add US3 keyboard and assistive technology hardening.
4. Add US4 safe availability/session-state hardening.
5. Run Phase 7 validation commands and manual quickstart.

### Scope Guardrails

- Do not add new Settings, Partner, or Configuracoes pages in `src/app/router.tsx`.
- Do not add new dependencies to `package.json`.
- Do not change Supabase Auth, RLS, migrations, services, repositories, financial rules, or dashboard internals.
- Do not expose values, counts, partner status, or permission details in navigation items.
