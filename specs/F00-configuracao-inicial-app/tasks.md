# Tasks: F00 - Configuracao inicial do app

**Input**: Design documents from `/specs/F00-configuracao-inicial-app/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Automated UI tests are not required by this feature. Tasks include
explicit validation steps for lint, formatting, typecheck, build, accessibility,
keyboard navigation, mobile responsiveness, not-found recovery, and out-of-scope
copy review.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Single frontend SPA at repository root
- Source code in `src/`
- Validation notes in `specs/F00-configuracao-inicial-app/quickstart.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the React, Vite, TypeScript, TailwindCSS, Shadcn/ui, and quality-tooling foundation.

- [ ] T001 Initialize npm package metadata and scripts for dev, build, lint, format:check, typecheck, prepare in package.json
- [ ] T002 Create Vite React TypeScript entry files in index.html, src/main.tsx, and src/app/App.tsx
- [ ] T003 [P] Configure strict TypeScript project settings in tsconfig.json and tsconfig.node.json
- [ ] T004 [P] Configure Vite React build and path aliases in vite.config.ts
- [ ] T005 [P] Configure TailwindCSS and PostCSS in tailwind.config.ts and postcss.config.js
- [ ] T006 [P] Configure global app styles, focus states, and Tailwind layers in src/styles/globals.css
- [ ] T007 [P] Configure ESLint, Prettier, Husky, and lint-staged in eslint.config.js, prettier.config.js, .husky/pre-commit, and package.json
- [ ] T008 [P] Configure Shadcn/ui defaults and utility path aliases in components.json and src/lib/utils.ts
- [ ] T009 [P] Create planned source folders in src/app/, src/pages/, src/components/layout/, src/components/feedback/, src/components/ui/, src/lib/, and src/styles/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T010 Install runtime and development dependencies declared in package.json
- [ ] T011 Implement React Router bootstrap with public route group, future protected route placeholder metadata, and not-found catch-all in src/app/router.tsx
- [ ] T012 Implement application shell rendering the router provider in src/app/App.tsx
- [ ] T013 [P] Add reusable Button component or Shadcn/ui button setup in src/components/ui/button.tsx
- [ ] T014 [P] Add shared route and future-area metadata constants in src/app/routes.ts
- [ ] T015 [P] Add accessibility-friendly document title helper in src/lib/page-title.ts
- [ ] T016 Verify base application startup and document command expectations in specs/F00-configuracao-inicial-app/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Entender o proposito do produto (Priority: P1) MVP

**Goal**: A first-time visitor understands the Couple Finance name, purpose, tone, and honest current scope without registration or financial data.

**Independent Test**: Open `/` on a small viewport and confirm the screen communicates Couple Finance, financial organization for couples, clarity/privacy/simplicity, and does not claim authentication, transactions, dashboard, goals, charts, or persistence are available.

### Validation for User Story 1

- [ ] T017 [P] [US1] Add manual home-page acceptance checklist for product purpose and out-of-scope claims in specs/F00-configuracao-inicial-app/quickstart.md
- [ ] T018 [P] [US1] Add home-page copy review checklist for welcoming Portuguese language in specs/F00-configuracao-inicial-app/quickstart.md

### Implementation for User Story 1

- [ ] T019 [P] [US1] Implement public base layout with header, main landmark, and responsive content container in src/components/layout/AppLayout.tsx
- [ ] T020 [P] [US1] Implement public navigation brand treatment and current-route affordance in src/components/layout/PublicNavigation.tsx
- [ ] T021 [US1] Implement home page hero, purpose sections, and honest future-scope messaging in src/pages/HomePage.tsx
- [ ] T022 [US1] Wire `/` route to HomePage inside AppLayout in src/app/router.tsx
- [ ] T023 [US1] Validate home page against routes contract and remove any premature feature claims in src/pages/HomePage.tsx

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Navegar pela fundacao inicial (Priority: P2)

**Goal**: Users can understand available public navigation, conceptual future protected areas, and recover from invalid routes.

**Independent Test**: Visit `/`, then an invalid URL such as `/rota-inexistente`, confirm the not-found page is understandable, and return to `/` in no more than two actions.

### Validation for User Story 2

- [ ] T024 [P] [US2] Add manual route navigation and invalid-route recovery checklist in specs/F00-configuracao-inicial-app/quickstart.md
- [ ] T025 [P] [US2] Add future protected area copy review checklist in specs/F00-configuracao-inicial-app/quickstart.md

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement planned-area indicator component for future authenticated sections in src/components/layout/FutureAreaIndicator.tsx
- [ ] T027 [US2] Integrate public links and planned-area indicator into navigation without functional protected routes in src/components/layout/PublicNavigation.tsx
- [ ] T028 [P] [US2] Implement accessible not-found page with return action to `/` in src/pages/NotFoundPage.tsx
- [ ] T029 [US2] Wire catch-all route to NotFoundPage in src/app/router.tsx
- [ ] T030 [US2] Validate route behavior against contracts/routes.md and update navigation copy in src/components/layout/PublicNavigation.tsx

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Receber feedback de estados basicos (Priority: P3)

**Goal**: Loading, empty, and error states clearly communicate what is happening and provide appropriate guidance for future screens.

**Independent Test**: Render examples or usages of loading, empty, and error states and confirm each has a title, message, accessible text, hierarchy, and an action when recovery is possible.

### Validation for User Story 3

- [ ] T031 [P] [US3] Add manual feedback-state identification checklist in specs/F00-configuracao-inicial-app/quickstart.md
- [ ] T032 [P] [US3] Add feedback-state accessibility and no-financial-data checklist in specs/F00-configuracao-inicial-app/quickstart.md

### Implementation for User Story 3

- [ ] T033 [P] [US3] Implement reusable loading state with accessible text in src/components/feedback/LoadingState.tsx
- [ ] T034 [P] [US3] Implement reusable empty state with optional action in src/components/feedback/EmptyState.tsx
- [ ] T035 [P] [US3] Implement reusable error state with recovery action support in src/components/feedback/ErrorState.tsx
- [ ] T036 [US3] Add feedback-state preview section using loading, empty, and error components in src/pages/HomePage.tsx
- [ ] T037 [US3] Validate feedback states against contracts/ui-states.md and adjust component props in src/components/feedback/LoadingState.tsx, src/components/feedback/EmptyState.tsx, and src/components/feedback/ErrorState.tsx

**Checkpoint**: User Stories 1, 2, and 3 should work independently.

---

## Phase 6: User Story 4 - Usar a aplicacao em mobile e com acessibilidade basica (Priority: P3)

**Goal**: The initial foundation is usable on mobile, with keyboard navigation, visible focus, accessible names, readable hierarchy, and no clipped essential content.

**Independent Test**: Validate `/`, feedback states, and a not-found route on mobile, tablet, and desktop; navigate all interactive elements using only keyboard and confirm visible focus and accessible names.

### Validation for User Story 4

- [ ] T038 [P] [US4] Add mobile, tablet, and desktop viewport checklist in specs/F00-configuracao-inicial-app/quickstart.md
- [ ] T039 [P] [US4] Add keyboard, focus-visible, accessible-name, and semantic-region checklist in specs/F00-configuracao-inicial-app/quickstart.md

### Implementation for User Story 4

- [ ] T040 [US4] Audit and adjust responsive layout constraints for home, navigation, feedback states, and not-found page in src/styles/globals.css
- [ ] T041 [US4] Audit and adjust semantic landmarks and heading order in src/components/layout/AppLayout.tsx, src/pages/HomePage.tsx, and src/pages/NotFoundPage.tsx
- [ ] T042 [US4] Audit and adjust accessible names and focus-visible behavior for links and buttons in src/components/layout/PublicNavigation.tsx, src/components/ui/button.tsx, and src/pages/NotFoundPage.tsx
- [ ] T043 [US4] Validate text scaling and essential-content readability in src/pages/HomePage.tsx and src/components/feedback/EmptyState.tsx

**Checkpoint**: All user stories should now be independently functional and accessible for the F00 scope.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and documentation alignment across the feature.

- [ ] T044 [P] Run lint validation and resolve issues in package.json and src/
- [ ] T045 [P] Run format check and resolve formatting issues in prettier.config.js and src/
- [ ] T046 [P] Run TypeScript typecheck and resolve strict-mode issues in tsconfig.json and src/
- [ ] T047 Run production build and resolve Vite build issues in vite.config.ts and src/
- [ ] T048 [P] Review all user-facing Portuguese copy for clarity, warmth, and no premature financial feature claims in src/pages/HomePage.tsx, src/pages/NotFoundPage.tsx, and src/components/feedback/
- [ ] T049 [P] Update implementation notes and final validation results in specs/F00-configuracao-inicial-app/quickstart.md
- [ ] T050 Confirm generated tasks remain aligned with plan, spec, contracts, and data model in specs/F00-configuracao-inicial-app/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational - uses shared route metadata and layout, but remains independently testable.
- **User Story 3 (P3)**: Can start after Foundational - reusable components can be built independently and previewed on the home page.
- **User Story 4 (P3)**: Can start after Foundational and should audit whichever user stories are included in the increment.

### Within Each User Story

- Validation checklist tasks should be written before implementation tasks.
- Shared components and metadata should be completed before route/page integration.
- Core implementation should be validated against contracts before moving to the next priority.

### Parallel Opportunities

- Setup tasks T003-T009 can run in parallel after T001-T002 are understood.
- Foundational tasks T013-T015 can run in parallel after dependency installation.
- US1 validation tasks T017-T018 can run in parallel with layout/navigation component work T019-T020.
- US2 validation tasks T024-T025 can run in parallel with NotFoundPage work T028.
- US3 component tasks T033-T035 can run in parallel because each component is isolated.
- US4 validation tasks T038-T039 can run in parallel before the final accessibility and responsive audits.
- Polish tasks T044-T046 and T048-T049 can run in parallel before the final build task T047 and alignment task T050.

---

## Parallel Example: User Story 1

```bash
Task: "T017 [P] [US1] Add manual home-page acceptance checklist for product purpose and out-of-scope claims in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T018 [P] [US1] Add home-page copy review checklist for welcoming Portuguese language in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T019 [P] [US1] Implement public base layout with header, main landmark, and responsive content container in src/components/layout/AppLayout.tsx"
Task: "T020 [P] [US1] Implement public navigation brand treatment and current-route affordance in src/components/layout/PublicNavigation.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T024 [P] [US2] Add manual route navigation and invalid-route recovery checklist in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T025 [P] [US2] Add future protected area copy review checklist in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T026 [P] [US2] Implement planned-area indicator component for future authenticated sections in src/components/layout/FutureAreaIndicator.tsx"
Task: "T028 [P] [US2] Implement accessible not-found page with return action to `/` in src/pages/NotFoundPage.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T031 [P] [US3] Add manual feedback-state identification checklist in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T032 [P] [US3] Add feedback-state accessibility and no-financial-data checklist in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T033 [P] [US3] Implement reusable loading state with accessible text in src/components/feedback/LoadingState.tsx"
Task: "T034 [P] [US3] Implement reusable empty state with optional action in src/components/feedback/EmptyState.tsx"
Task: "T035 [P] [US3] Implement reusable error state with recovery action support in src/components/feedback/ErrorState.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T038 [P] [US4] Add mobile, tablet, and desktop viewport checklist in specs/F00-configuracao-inicial-app/quickstart.md"
Task: "T039 [P] [US4] Add keyboard, focus-visible, accessible-name, and semantic-region checklist in specs/F00-configuracao-inicial-app/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the home page independently on mobile.
5. Demo the MVP foundation once lint, format, typecheck, and build pass.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 and validate the first public experience.
3. Add User Story 2 and validate navigation plus not-found recovery.
4. Add User Story 3 and validate reusable feedback states.
5. Add User Story 4 and validate mobile/accessibility gates across included screens.

### Parallel Team Strategy

1. Team completes Setup and Foundational together.
2. Once Foundational is done, one developer can own US1, one can own US2, one can own US3, and one can audit US4.
3. Integrate by running the Phase 7 quality checks before demo or handoff.

---

## Notes

- [P] tasks = different files, no dependency on another incomplete task.
- [US1], [US2], [US3], and [US4] labels map to user stories from spec.md.
- F00 must not implement Supabase, authentication, dashboard, transactions, goals, charts, or persisted financial data.
