import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "@/features/auth/auth-context-value";
import type { AuthContextValue, AuthStatus } from "@/features/auth/auth-types";

export function createAuthContextValue(
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue {
  const status: AuthStatus = overrides.status ?? "unauthenticated";

  return {
    status,
    user: overrides.user ?? null,
    session: overrides.session ?? null,
    message: overrides.message ?? null,
    signOut: overrides.signOut ?? vi.fn(),
    refreshSession: overrides.refreshSession ?? vi.fn()
  };
}

export function renderWithRouterAndAuth(
  ui: ReactElement,
  {
    route = "/",
    auth = createAuthContextValue(),
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
