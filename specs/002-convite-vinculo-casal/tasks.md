# Tasks: F02 - Convite e vinculo do casal

**Input**: Design documents from `/specs/002-convite-vinculo-casal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required for this feature because it introduces Supabase persistence, RLS authorization, invitation lifecycle rules, keyboard/mobile accessibility, and private relationship-state rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase when files do not overlap
- **[Story]**: User story label for traceability, present only in user story phases
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature area and shared test helpers without changing behavior.

- [ ] T001 Create couple feature directory placeholder in src/features/couple/.gitkeep
- [ ] T002 Create Supabase migrations directory placeholder in supabase/migrations/.gitkeep
- [ ] T003 [P] Create couple test utility scaffold in src/test/couple-test-utils.tsx
- [ ] T004 [P] Create Supabase database validation notes file in specs/002-convite-vinculo-casal/supabase-validation.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared data contracts, database schema, RLS, messages, and operations that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create migration for shared_budgets, budget_members, budget_invitations, constraints, indexes, RLS enablement, policies, and RPC stubs in supabase/migrations/20260602000000_create_couple_linking.sql
- [ ] T006 Add SQL validation scenarios for constraints, one active budget per user, max two active members, and invitation terminal states in specs/002-convite-vinculo-casal/supabase-validation.md
- [ ] T007 [P] Define couple domain types, invitation statuses, member roles, summaries, and service result types in src/features/couple/couple-types.ts
- [ ] T008 [P] Define relationship state union and state priority helpers in src/features/couple/relationship-state.ts
- [ ] T009 [P] Define neutral success, validation, loading, unavailable, and retry messages in src/features/couple/couple-messages.ts
- [ ] T010 [P] Define Zod schemas for invitee e-mail trimming, normalized comparison, and own-email blocking in src/features/couple/couple-schemas.ts
- [ ] T011 [P] Add schema tests for valid e-mail, empty e-mail, invalid e-mail, uppercase/space normalization, and own-email blocking in src/features/couple/couple-schemas.test.ts
- [ ] T012 [P] Add relationship-state priority tests for loading, linked, sent, received, empty, unavailable, and error states in src/features/couple/relationship-state.test.ts
- [ ] T013 Create typed Supabase operation wrapper signatures for getRelationshipState, createSharedBudgetAndInvite, getInvitation, acceptInvitation, declineInvitation, and cancelInvitation in src/features/couple/couple-service.ts
- [ ] T014 Add service tests with mocked Supabase client for safe error mapping and unauthorized rows behaving as absent in src/features/couple/couple-service.test.ts
- [ ] T015 Add route metadata for /app/invites/:invitationId and update future protected areas in src/app/routes.ts
- [ ] T016 Add route metadata tests for private app and invitation routes in src/app/routes.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Criar espaco e enviar convite (Priority: P1) - MVP

**Goal**: Authenticated user without an active shared budget creates one shared space and sends one pending invitation by e-mail.

**Independent Test**: Sign in as a user with no active budget, open `/app`, submit a valid partner e-mail, and verify a pending invitation is visible to the inviter while invalid, own-email, and already-linked attempts are blocked.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add service tests for createSharedBudgetAndInvite success, invalid own-budget precondition, duplicate pending invite handling, and safe Supabase errors in src/features/couple/couple-service.test.ts
- [ ] T018 [P] [US1] Add action tests for invite creation success, validation errors, loading lock, and retryable failure state in src/features/couple/couple-actions.test.ts
- [ ] T019 [P] [US1] Add private home tests for no_shared_budget form, field labels, associated validation, keyboard submit, success message, and invitation_sent state in src/pages/private-home-page.test.tsx
- [ ] T020 [P] [US1] Add RLS validation cases for creator budget creation, own active budget blocking, own-email blocking, and pending invitation visibility in specs/002-convite-vinculo-casal/supabase-validation.md

### Implementation for User Story 1

- [ ] T021 [US1] Implement createSharedBudgetAndInvite SQL function or guarded inserts for budget, creator membership, pending invitation, expiration, and self-invite blocking in supabase/migrations/20260602000000_create_couple_linking.sql
- [ ] T022 [US1] Implement createSharedBudgetAndInvite service call and result mapping in src/features/couple/couple-service.ts
- [ ] T023 [US1] Implement create invitation form actions and state reducer in src/features/couple/couple-actions.ts
- [ ] T024 [US1] Implement no_shared_budget and invitation_sent view models in src/features/couple/relationship-state.ts
- [ ] T025 [US1] Update PrivateHomePage to render invite form, pending sent invitation summary, loading state, validation errors, and success feedback in src/pages/private-home-page.tsx
- [ ] T026 [US1] Wire couple test helpers for authenticated users, mocked relationship states, and form submission utilities in src/test/couple-test-utils.tsx

**Checkpoint**: US1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Aceitar convite recebido (Priority: P1)

**Goal**: Authenticated invitee views an authorized valid invitation and accepts it, linking both users to the same shared budget.

**Independent Test**: Create a pending invitation for user B, sign in as user B, open `/app/invites/:invitationId`, accept it, and verify exactly two active members share one budget and the invitation is accepted.

### Tests for User Story 2

- [ ] T027 [P] [US2] Add RPC/service tests for acceptInvitation success, repeated accept, already-linked invitee blocking, expired invite blocking, and unauthorized invite blocking in src/features/couple/couple-service.test.ts
- [ ] T028 [P] [US2] Add invitation page tests for unauthenticated redirect behavior, authorized invite display, accept button loading lock, success feedback, and unavailable state in src/pages/invitation-page.test.tsx
- [ ] T029 [P] [US2] Add hook tests for invitation_received and couple_linked transitions after accepting an invite in src/features/couple/use-couple-relationship.test.tsx
- [ ] T030 [P] [US2] Add RLS validation cases for invitee-only visibility, unrelated user denial, transactional acceptance, and exactly two active members in specs/002-convite-vinculo-casal/supabase-validation.md

### Implementation for User Story 2

- [ ] T031 [US2] Implement accept_invitation RPC with transactional validation, max-two-member guard, idempotent result handling, and responded_at update in supabase/migrations/20260602000000_create_couple_linking.sql
- [ ] T032 [US2] Implement getInvitation and acceptInvitation service calls with safe unavailable mapping in src/features/couple/couple-service.ts
- [ ] T033 [US2] Implement useCoupleRelationship hook for relationship loading, refetch, invite lookup, accept mutation, and error states in src/features/couple/use-couple-relationship.ts
- [ ] T034 [US2] Create InvitationPage with authorized invite summary, sign-in/create-account instruction state, accept action, loading feedback, and safe unavailable message in src/pages/invitation-page.tsx
- [ ] T035 [US2] Register /app/invites/:invitationId under ProtectedRoute and AuthenticatedLayout in src/app/router.tsx
- [ ] T036 [US2] Update PrivateHomePage to show couple_linked state without balances, transactions, goals, categories, charts, or dashboard data in src/pages/private-home-page.tsx

**Checkpoint**: US2 completes the core couple-linking promise with US1.

---

## Phase 5: User Story 3 - Recusar ou cancelar convite (Priority: P2)

**Goal**: Invitee can decline a pending invitation and inviter can cancel a sent pending invitation without creating a partner membership.

**Independent Test**: With a pending received invite, user B declines and no link is created; with a pending sent invite, user A cancels and future accept attempts show unavailable.

### Tests for User Story 3

- [ ] T037 [P] [US3] Add service tests for declineInvitation and cancelInvitation success, terminal invite retry, expired invite blocking, and unauthorized actor blocking in src/features/couple/couple-service.test.ts
- [ ] T038 [P] [US3] Add invitation page tests for decline action text, loading lock, confirmation message, keyboard behavior, and no membership creation state in src/pages/invitation-page.test.tsx
- [ ] T039 [P] [US3] Add private home tests for cancelling a sent invitation, cancellation confirmation, and unavailable future accept messaging in src/pages/private-home-page.test.tsx
- [ ] T040 [P] [US3] Add RLS validation cases for invitee decline, inviter cancel, unrelated user denial, and terminal invitation immutability in specs/002-convite-vinculo-casal/supabase-validation.md

### Implementation for User Story 3

- [ ] T041 [US3] Implement decline_invitation and cancel_invitation database functions or guarded updates with role checks and responded_at updates in supabase/migrations/20260602000000_create_couple_linking.sql
- [ ] T042 [US3] Implement declineInvitation and cancelInvitation service calls with idempotent terminal-state mapping in src/features/couple/couple-service.ts
- [ ] T043 [US3] Extend couple actions for decline and cancel mutations with loading, success, retryable error, and unavailable states in src/features/couple/couple-actions.ts
- [ ] T044 [US3] Add decline action and confirmation feedback to InvitationPage in src/pages/invitation-page.tsx
- [ ] T045 [US3] Add cancel action and confirmation feedback to invitation_sent state in PrivateHomePage in src/pages/private-home-page.tsx

**Checkpoint**: US3 is independently functional and preserves consent for unresolved invitations.

---

## Phase 6: User Story 4 - Entender estado do vinculo (Priority: P3)

**Goal**: Authenticated user can clearly understand whether they need to create a space, wait, respond, or start from a linked shared context.

**Independent Test**: Simulate no_shared_budget, invitation_sent, invitation_received, couple_linked, invitation_unavailable, loading, and error states and verify `/app` and invitation routes show one clear next action without private-data flicker.

### Tests for User Story 4

- [ ] T046 [P] [US4] Add relationship hook tests for all relationship states, refetch behavior, recoverable errors, and no private details during loading in src/features/couple/use-couple-relationship.test.tsx
- [ ] T047 [P] [US4] Add private home tests for all relationship states, one primary action per state, safe messages, and absence of financial data terms in src/pages/private-home-page.test.tsx
- [ ] T048 [P] [US4] Add route tests to ensure protected invitation route waits for auth resolution and avoids login/app redirect loops in src/app/routes.test.ts
- [ ] T049 [P] [US4] Add message tests for success, loading, validation, unavailable, and retry copy that excludes raw Supabase errors and financial details in src/features/couple/couple-actions.test.ts

### Implementation for User Story 4

- [ ] T050 [US4] Complete getRelationshipState query mapping for active membership, pending sent invite, pending received invite, linked members, unavailable invite, and retryable error in src/features/couple/couple-service.ts
- [ ] T051 [US4] Complete useCoupleRelationship hook integration for /app state loading, mutation refreshes, and privacy-preserving initial render in src/features/couple/use-couple-relationship.ts
- [ ] T052 [US4] Refine PrivateHomePage responsive state sections, accessible headings, focus order, and text-expanded layout for all relationship states in src/pages/private-home-page.tsx
- [ ] T053 [US4] Refine InvitationPage unavailable, already-linked, expired, cancelled, declined, accepted, unauthorized, and error views in src/pages/invitation-page.tsx

**Checkpoint**: US4 provides complete relationship-state clarity across the private area.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full feature, document execution, and tighten accessibility, privacy, and mobile behavior.

- [ ] T054 [P] Update quickstart with final F02 route paths, Supabase migration command used, and manual validation notes in specs/002-convite-vinculo-casal/quickstart.md
- [ ] T055 [P] Add implementation notes about no real e-mail provider and future delivery extension point in specs/002-convite-vinculo-casal/research.md
- [ ] T056 Run Supabase local validation or document skipped database validation with reason and expected command output in specs/002-convite-vinculo-casal/supabase-validation.md
- [ ] T057 Run accessibility review for keyboard, focus, labels, error associations, loading announcements, touch targets, and 200% text on src/pages/private-home-page.tsx and src/pages/invitation-page.tsx
- [ ] T058 Run mobile responsive review for /app and /app/invites/:invitationId at mobile, tablet, and desktop widths in src/pages/private-home-page.tsx and src/pages/invitation-page.tsx
- [ ] T059 Run financial privacy audit confirming no balances, transactions, categories, goals, dashboard values, charts, service_role keys, raw SQL errors, or user_metadata authorization in src/features/couple/couple-service.ts
- [ ] T060 Run full validation suite npm run lint, npm run format:check, npm run typecheck, npm run test:run, and npm run build from package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2 and delivers the MVP invite creation increment.
- **Phase 4 US2**: Depends on Phase 2, uses invitation data created by US1 for end-to-end manual validation, and completes the P1 couple-linking flow.
- **Phase 5 US3**: Depends on Phase 2 and can run after or alongside US1/US2 service foundations.
- **Phase 6 US4**: Depends on Phase 2 and should be finalized after US1-US3 states exist.
- **Phase 7 Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational; no dependency on other stories.
- **US2 (P1)**: Can start after Foundational; independent service and route tests can be mocked, but end-to-end acceptance uses a pending invite from US1.
- **US3 (P2)**: Can start after Foundational; decline and cancel are independent terminal transitions on pending invitations.
- **US4 (P3)**: Can start after Foundational with mocked states; final UI completeness depends on US1-US3 states and actions.

### Within Each User Story

- Write and run story tests first; they should fail before implementation.
- Database constraints/RLS before service mutations that depend on them.
- Types and schemas before services.
- Services before hooks/actions.
- Hooks/actions before pages.
- Pages before route-level integration checks.

---

## Parallel Opportunities

- T003 and T004 can run in parallel after T001-T002.
- T007 through T012 can run in parallel once the couple feature directory exists.
- T015 and T016 can run in parallel with foundational couple type/schema work.
- Test tasks within each story are parallelizable because they target different behavior slices.
- US1, US2, and US3 service tests can be drafted in parallel after T013-T014.
- Page tests for PrivateHomePage and InvitationPage can be drafted in parallel after route metadata exists.
- Polish documentation tasks T054 and T055 can run in parallel.

## Parallel Example: User Story 1

```bash
Task: "T017 [P] [US1] Add service tests for createSharedBudgetAndInvite success, invalid own-budget precondition, duplicate pending invite handling, and safe Supabase errors in src/features/couple/couple-service.test.ts"
Task: "T018 [P] [US1] Add action tests for invite creation success, validation errors, loading lock, and retryable failure state in src/features/couple/couple-actions.test.ts"
Task: "T019 [P] [US1] Add private home tests for no_shared_budget form, field labels, associated validation, keyboard submit, success message, and invitation_sent state in src/pages/private-home-page.test.tsx"
Task: "T020 [P] [US1] Add RLS validation cases for creator budget creation, own active budget blocking, own-email blocking, and pending invitation visibility in specs/002-convite-vinculo-casal/supabase-validation.md"
```

## Parallel Example: User Story 2

```bash
Task: "T027 [P] [US2] Add RPC/service tests for acceptInvitation success, repeated accept, already-linked invitee blocking, expired invite blocking, and unauthorized invite blocking in src/features/couple/couple-service.test.ts"
Task: "T028 [P] [US2] Add invitation page tests for unauthenticated redirect behavior, authorized invite display, accept button loading lock, success feedback, and unavailable state in src/pages/invitation-page.test.tsx"
Task: "T029 [P] [US2] Add hook tests for invitation_received and couple_linked transitions after accepting an invite in src/features/couple/use-couple-relationship.test.tsx"
Task: "T030 [P] [US2] Add RLS validation cases for invitee-only visibility, unrelated user denial, transactional acceptance, and exactly two active members in specs/002-convite-vinculo-casal/supabase-validation.md"
```

## Parallel Example: User Story 3

```bash
Task: "T037 [P] [US3] Add service tests for declineInvitation and cancelInvitation success, terminal invite retry, expired invite blocking, and unauthorized actor blocking in src/features/couple/couple-service.test.ts"
Task: "T038 [P] [US3] Add invitation page tests for decline action text, loading lock, confirmation message, keyboard behavior, and no membership creation state in src/pages/invitation-page.test.tsx"
Task: "T039 [P] [US3] Add private home tests for cancelling a sent invitation, cancellation confirmation, and unavailable future accept messaging in src/pages/private-home-page.test.tsx"
Task: "T040 [P] [US3] Add RLS validation cases for invitee decline, inviter cancel, unrelated user denial, and terminal invitation immutability in specs/002-convite-vinculo-casal/supabase-validation.md"
```

## Parallel Example: User Story 4

```bash
Task: "T046 [P] [US4] Add relationship hook tests for all relationship states, refetch behavior, recoverable errors, and no private details during loading in src/features/couple/use-couple-relationship.test.tsx"
Task: "T047 [P] [US4] Add private home tests for all relationship states, one primary action per state, safe messages, and absence of financial data terms in src/pages/private-home-page.test.tsx"
Task: "T048 [P] [US4] Add route tests to ensure protected invitation route waits for auth resolution and avoids login/app redirect loops in src/app/routes.test.ts"
Task: "T049 [P] [US4] Add message tests for success, loading, validation, unavailable, and retry copy that excludes raw Supabase errors and financial details in src/features/couple/couple-actions.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1 create shared space and send invitation.
4. Stop and validate US1 independently on `/app` with unit tests and RLS notes.

### Core Promise Completion

1. Add Phase 4: US2 accept invitation.
2. Validate users A and B share exactly one active shared budget with two active members.
3. Confirm no financial data is rendered.

### Incremental Delivery

1. Add Phase 5: US3 decline/cancel terminal invitation flows.
2. Add Phase 6: US4 full relationship-state clarity.
3. Complete Phase 7: polish, validation suite, accessibility, mobile, and privacy audits.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. Split after T016: database/RLS owner handles T021/T031/T041, service owner handles T022/T032/T042/T050, UI owner handles T025/T034/T036/T044/T045/T052/T053.
3. Keep story checkpoints independent so each story can be demoed without waiting for the polish phase.

---

## Notes

- [P] tasks use different files or test slices and can run in parallel when their prerequisites are complete.
- US1 and US2 are both P1 in the specification; US1 is the narrow MVP, while US2 completes the central couple-linking flow.
- No task introduces transactions, categories, goals, dashboard values, charts, real e-mail delivery, more than two active members, advanced roles, or service_role client usage.
