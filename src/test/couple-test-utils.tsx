import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthContext } from "@/features/auth/auth-context-value";
import type { AuthContextValue } from "@/features/auth/auth-types";
import { createAuthContextValue } from "@/test/auth-test-utils";

export function createAuthenticatedCoupleAuth(
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue {
  return createAuthContextValue({
    status: "authenticated",
    user: {
      id: "user-a",
      email: "ana@example.com"
    },
    ...overrides
  });
}

export function renderWithCoupleAuth(
  ui: ReactElement,
  {
    route = "/app",
    auth = createAuthenticatedCoupleAuth(),
    ...options
  }: RenderOptions & { route?: string; auth?: AuthContextValue } = {}
) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>,
    options
  );
}

export function renderWithCoupleRoute(
  ui: ReactElement,
  {
    route = "/app",
    path = "/app",
    auth = createAuthenticatedCoupleAuth(),
    ...options
  }: RenderOptions & { route?: string; path?: string; auth?: AuthContextValue } = {}
) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
    options
  );
}
