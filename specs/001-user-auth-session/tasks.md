---
description: "Task list for F01 - Autenticacao e sessao do usuario"
---

# Tasks: F01 - Autenticacao e sessao do usuario

**Input**: Design documents from `/specs/001-user-auth-session/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required for this feature because the specification mandates validation of route guards, session states, form validation, secure messages, accessibility-critical flows, mobile behavior, and persistent auth behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task
- **[Story]**: User story label from spec.md, used only inside user story phases
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add auth dependencies and shared project configuration required before implementation starts.

- [X] T001 Update auth dependencies in package.json and package-lock.json with @supabase/supabase-js, react-hook-form, zod, and @hookform/resolvers
- [X] T002 [P] Create documented Supabase auth environment placeholders in .env.example
- [X] T003 [P] Add auth redirect URL guidance to specs/001-user-auth-session/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared auth primitives that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Create Supabase client configuration in src/lib/supabase.ts
- [X] T005 [P] Define route metadata for public and private auth routes in src/app/routes.ts
- [X] T006 [P] Define auth domain types and session states in src/features/auth/auth-types.ts
- [X] T007 [P] Define shared Portuguese auth message constants in src/features/auth/auth-messages.ts
- [X] T008 [P] Define Zod schemas for login, signup, forgot password, and reset password in src/features/auth/auth-schemas.ts
- [X] T009 Implement Supabase auth wrapper methods in src/features/auth/auth-service.ts
- [X] T010 Implement AuthProvider session initialization and auth event handling in src/features/auth/auth-context.tsx
- [X] T011 Implement useAuth hook with provider usage guard in src/features/auth/use-auth.ts
- [X] T012 Wrap the app router with AuthProvider in src/app/app.tsx
- [X] T013 [P] Reuse card shell patterns through src/components/ui/card.tsx in auth pages
- [X] T014 [P] Reuse accessible form message patterns through src/components/ui/alert.tsx and src/components/ui/field.tsx
- [X] T015 [P] Reuse password inputs with labels, descriptions and errors through src/components/ui/input.tsx and src/components/ui/field.tsx
- [X] T016 [P] Reuse submit button loading/disabled states through src/components/ui/button.tsx
- [X] T017 [P] Add auth test helpers and Supabase mocks in src/test/auth-test-utils.tsx

**Checkpoint**: Foundation ready; user story implementation can now begin in priority order or in parallel where capacity allows.

---

## Phase 3: User Story 1 - Criar conta privada (Priority: P1) - MVP

**Goal**: A new person can create an account with email and password, receive clear feedback, and either enter the private area or understand the confirmation step.

**Independent Test**: Submit valid signup details and verify account creation feedback plus the correct next route or confirmation guidance; submit weak password or existing email and verify field/global messages.

### Tests for User Story 1

- [X] T018 [P] [US1] Add signup schema validation tests in src/features/auth/auth-schemas.test.ts
- [X] T019 [P] [US1] Add signup service success and normalized error tests in src/features/auth/auth-service.test.ts
- [X] T020 [P] [US1] Add signup page interaction and accessibility tests in src/pages/sign-up-page.test.tsx

### Implementation for User Story 1

- [X] T021 [US1] Implement signup service flow and error mapping in src/features/auth/auth-service.ts
- [X] T022 [US1] Implement signup form page with validation, loading, success, and recoverable error states in src/pages/sign-up-page.tsx
- [X] T023 [US1] Register /sign-up route and authenticated redirect behavior in src/app/router.tsx
- [X] T024 [US1] Add signup navigation links from public home and login contexts in src/components/layout/public-navigation.tsx

**Checkpoint**: User Story 1 is independently functional and testable as the MVP slice.

---

## Phase 4: User Story 2 - Entrar e manter sessao (Priority: P1)

**Goal**: An existing user can log in, keep a valid session across reloads/revisits, and avoid unnecessary re-login while the session remains valid.

**Independent Test**: Log in with valid credentials, reload the app, and verify the authenticated area remains available; submit invalid credentials and verify the secure generic message.

### Tests for User Story 2

- [X] T025 [P] [US2] Add login schema validation tests in src/features/auth/auth-schemas.test.ts
- [X] T026 [P] [US2] Add session provider persistence and auth event tests in src/features/auth/auth-context.test.tsx
- [X] T027 [P] [US2] Add login page interaction and invalid credentials tests in src/pages/login-page.test.tsx

### Implementation for User Story 2

- [X] T028 [US2] Implement login service flow and secure invalid credential mapping in src/features/auth/auth-service.ts
- [X] T029 [US2] Implement login form page with validation, loading, secure error, and signup/recovery links in src/pages/login-page.tsx
- [X] T030 [US2] Implement authenticated private home with user context and no financial feature promises in src/pages/private-home-page.tsx
- [X] T031 [US2] Register /login and /app route metadata in src/app/routes.ts
- [X] T032 [US2] Register /login and initial authenticated /app route entries in src/app/router.tsx

**Checkpoint**: User Story 2 works independently with login and persisted session behavior.

---

## Phase 5: User Story 3 - Proteger acesso privado (Priority: P1)

**Goal**: Unauthenticated users cannot see private content through direct URLs, browser history, loading states, expired sessions, or auth errors.

**Independent Test**: Open /app without a valid session and verify loading appears first, private content never appears, and the app redirects to /login with clear guidance.

### Tests for User Story 3

- [X] T033 [P] [US3] Add ProtectedRoute loading, unauthenticated, expired, and authenticated tests in src/features/auth/protected-route.test.tsx
- [X] T034 [P] [US3] Add PublicAuthRoute redirect and loop-prevention tests in src/features/auth/public-auth-route.test.tsx
- [X] T035 [P] [US3] Add route contract tests for /app, /login, /sign-up, /forgot-password, /reset-password, and * in src/app/routes.test.ts

### Implementation for User Story 3

- [X] T036 [US3] Implement ProtectedRoute guard with loading, expired, error, and login redirect handling in src/features/auth/protected-route.tsx
- [X] T037 [US3] Implement PublicAuthRoute guard for authenticated redirects from public auth pages in src/features/auth/public-auth-route.tsx
- [X] T038 [US3] Implement authenticated layout with private loading, error, and session-expired feedback in src/components/layout/authenticated-layout.tsx
- [X] T039 [US3] Apply ProtectedRoute and PublicAuthRoute wrappers in src/app/router.tsx
- [X] T040 [US3] Update not-found safe navigation for authenticated and unauthenticated users in src/pages/not-found-page.tsx

**Checkpoint**: User Story 3 blocks private content until authentication is confirmed.

---

## Phase 6: User Story 4 - Encerrar sessao (Priority: P2)

**Goal**: An authenticated user can end the current device session and lose access to private routes until logging in again.

**Independent Test**: From /app, trigger logout, verify progress feedback, redirect to a public/login route, and confirm /app is blocked afterward.

### Tests for User Story 4

- [X] T041 [P] [US4] Add logout service and session ending tests in src/features/auth/auth-service.test.ts
- [X] T042 [P] [US4] Add authenticated layout logout interaction tests in src/components/layout/authenticated-layout.test.tsx

### Implementation for User Story 4

- [X] T043 [US4] Implement signOut service flow and safe error mapping in src/features/auth/auth-service.ts
- [X] T044 [US4] Wire logout action, disabled ending state, and post-logout navigation in src/components/layout/authenticated-layout.tsx
- [X] T045 [US4] Add logout success and session-ended feedback handling in src/pages/login-page.tsx

**Checkpoint**: User Story 4 reliably ends access on the current device.

---

## Phase 7: User Story 5 - Recuperar acesso (Priority: P2)

**Goal**: A user can request password recovery by email, receive a neutral confirmation, use a valid recovery flow to set a new password, and handle invalid or expired recovery links.

**Independent Test**: Submit recovery email and verify neutral confirmation; open reset flow, set an accepted password, and verify success or invalid-link recovery guidance.

### Tests for User Story 5

- [X] T046 [P] [US5] Add forgot and reset password schema validation tests in src/features/auth/auth-schemas.test.ts
- [X] T047 [P] [US5] Add password recovery service tests for neutral confirmation, temporary failure, and update password in src/features/auth/auth-service.test.ts
- [X] T048 [P] [US5] Add forgot password page interaction tests in src/pages/forgot-password-page.test.tsx
- [X] T049 [P] [US5] Add reset password page valid, invalid, expired, and success state tests in src/pages/reset-password-page.test.tsx

### Implementation for User Story 5

- [X] T050 [US5] Implement password recovery request and update password service flows in src/features/auth/auth-service.ts
- [X] T051 [US5] Implement forgot password form page with neutral confirmation and retry behavior in src/pages/forgot-password-page.tsx
- [X] T052 [US5] Implement reset password form page with recovery event handling and invalid-link guidance in src/pages/reset-password-page.tsx
- [X] T053 [US5] Register /forgot-password and /reset-password routes with recovery-safe behavior in src/app/router.tsx
- [X] T054 [US5] Add recovery navigation links from login and reset contexts in src/pages/login-page.tsx

**Checkpoint**: User Story 5 completes the recovery and reset flow without revealing account existence.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature across documentation, accessibility, responsiveness, security, and build quality.

- [X] T055 [P] Update implementation notes and manual validation outcomes in specs/001-user-auth-session/quickstart.md
- [X] T056 [P] Review Portuguese auth copy against secure message contract in src/features/auth/auth-messages.ts
- [X] T057 [P] Validate keyboard focus, labels, associated errors, and announced feedback for auth flows in src/pages/login-page.tsx
- [X] T058 [P] Validate mobile layout, keyboard visibility, and 200% text zoom for auth flows in src/styles/globals.css
- [X] T059 [P] Confirm no private content, tokens, passwords, Supabase payloads, or secret keys are logged in src/features/auth/auth-service.ts
- [X] T060 Run npm run lint and fix reported issues in package.json
- [X] T061 Run npm run format:check and fix reported formatting issues in package.json
- [X] T062 Run npm run typecheck and fix reported type issues in tsconfig.json
- [X] T063 Run npm run test:run and fix reported test failures in src/test/setup.ts
- [X] T064 Run npm run build and fix reported production build issues in package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; can start immediately.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2; MVP slice.
- **Phase 4 US2**: Depends on Phase 2; can run alongside US1 after shared auth types/service/provider exist, but final route behavior integrates with US1.
- **Phase 5 US3**: Depends on Phase 2; can run alongside US1/US2, but final route wiring should account for the implemented auth pages.
- **Phase 6 US4**: Depends on US2 and US3 because logout needs authenticated layout and protected routes.
- **Phase 7 US5**: Depends on Phase 2; can run alongside US4 after login navigation exists.
- **Phase 8 Polish**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **US2 (P1)**: Starts after Phase 2; no dependency on US1 for core login, but shares auth service/provider.
- **US3 (P1)**: Starts after Phase 2; no dependency on US1/US2 for guards, but final router wiring references their pages.
- **US4 (P2)**: Depends on US2 authenticated session and US3 protected route behavior.
- **US5 (P2)**: Starts after Phase 2; integrates with US2 login navigation.

### Within Each User Story

- Write story tests first and confirm they fail before implementation.
- Implement schemas and service behavior before page integration.
- Implement pages before final router wiring.
- Complete each story checkpoint before relying on it in later stories.

### Parallel Opportunities

- T002 and T003 can run in parallel after T001 is scheduled.
- T005, T006, T007, T008, T013, T014, T015, T016, and T017 can run in parallel during Phase 2.
- US1 test tasks T018, T019, and T020 can run in parallel.
- US2 test tasks T025, T026, and T027 can run in parallel.
- US3 test tasks T033, T034, and T035 can run in parallel.
- US4 test tasks T041 and T042 can run in parallel.
- US5 test tasks T046, T047, T048, and T049 can run in parallel.
- Polish checks T055, T056, T057, T058, and T059 can run in parallel.

## Parallel Example: User Story 1

```bash
Task: "T018 [P] [US1] Add signup schema validation tests in src/features/auth/auth-schemas.test.ts"
Task: "T019 [P] [US1] Add signup service success and normalized error tests in src/features/auth/auth-service.test.ts"
Task: "T020 [P] [US1] Add signup page interaction and accessibility tests in src/pages/sign-up-page.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T025 [P] [US2] Add login schema validation tests in src/features/auth/auth-schemas.test.ts"
Task: "T026 [P] [US2] Add session provider persistence and auth event tests in src/features/auth/auth-context.test.tsx"
Task: "T027 [P] [US2] Add login page interaction and invalid credentials tests in src/pages/login-page.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T033 [P] [US3] Add ProtectedRoute loading, unauthenticated, expired, and authenticated tests in src/features/auth/protected-route.test.tsx"
Task: "T034 [P] [US3] Add PublicAuthRoute redirect and loop-prevention tests in src/features/auth/public-auth-route.test.tsx"
Task: "T035 [P] [US3] Add route contract tests for /app, /login, /sign-up, /forgot-password, /reset-password, and * in src/app/routes.test.ts"
```

## Implementation Strategy

### MVP First

Complete Phase 1, Phase 2, and Phase 3 to deliver the first independently testable increment: signup with clear validation and success/confirmation feedback.

### P1 Auth Completion

Complete Phase 4 and Phase 5 to deliver login, persisted session recognition, and real protection for `/app` without rendering private content before the session is confirmed.

### P2 Account Control

Complete Phase 6 and Phase 7 to add logout and password recovery/reset flows.

### Final Validation

Complete Phase 8 and run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run`, and `npm run build`.
