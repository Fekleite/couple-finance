import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { PUBLIC_ROUTES } from "@/app/routes";
import { AuthContext } from "@/features/auth/auth-context-value";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { ProtectedRoute } from "@/features/auth/protected-route";
import type { AuthStatus } from "@/features/auth/auth-types";
import { createAuthContextValue } from "@/test/auth-test-utils";

function renderProtected(status: AuthStatus) {
  render(
    <AuthContext.Provider value={createAuthContextValue({ status })}>
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<p>Conteudo privado</p>} />
          </Route>
          <Route path={PUBLIC_ROUTES.login.path} element={<p>Tela de login</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("ProtectedRoute", () => {
  it("shows loading without private content while auth is unknown", () => {
    renderProtected("loading");

    expect(screen.getByText(AUTH_MESSAGES.sessionLoading)).toBeInTheDocument();
    expect(screen.queryByText("Conteudo privado")).not.toBeInTheDocument();
  });

  it("renders private content only when authenticated", () => {
    renderProtected("authenticated");

    expect(screen.getByText("Conteudo privado")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    renderProtected("unauthenticated");

    expect(screen.getByText("Tela de login")).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: /navegacao privada/i })
    ).not.toBeInTheDocument();
  });

  it("shows expired feedback for expired sessions", () => {
    renderProtected("expired");

    expect(screen.getByText(AUTH_MESSAGES.sessionExpired)).toBeInTheDocument();
  });

  it("offers retry on provider error", () => {
    const refreshSession = vi.fn();
    render(
      <AuthContext.Provider
        value={createAuthContextValue({
          status: "error",
          message: AUTH_MESSAGES.temporaryFailure,
          refreshSession
        })}
      >
        <MemoryRouter initialEntries={["/app"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<p>Conteudo privado</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Nao foi possivel verificar seu acesso")).toBeInTheDocument();
  });
});
