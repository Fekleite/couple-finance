import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { createAuthContextValue, renderWithRouterAndAuth } from "@/test/auth-test-utils";

describe("AuthenticatedLayout", () => {
  it("runs logout, disables duplicate intent through auth state, and navigates safely", async () => {
    const signOut = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithRouterAndAuth(
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/app" element={<p>Area privada</p>} />
        </Route>
        <Route path="/login" element={<p>Login seguro</p>} />
      </Routes>,
      {
        route: "/app",
        auth: createAuthContextValue({
          status: "authenticated",
          user: { id: "user-1", email: "ana@example.com" },
          signOut
        })
      }
    );

    await user.click(screen.getByRole("button", { name: /sair/i }));

    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(await screen.findByText("Login seguro")).toBeInTheDocument();
  });

  it("shows logout progress feedback", () => {
    renderWithRouterAndAuth(
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/app" element={<p>Area privada</p>} />
        </Route>
      </Routes>,
      {
        route: "/app",
        auth: createAuthContextValue({
          status: "ending",
          message: AUTH_MESSAGES.logoutProgress
        })
      }
    );

    expect(screen.getByText(AUTH_MESSAGES.logoutProgress)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /saindo/i })).toBeDisabled();
  });

  it("offers private navigation to financial audit without exposing event data", () => {
    renderWithRouterAndAuth(
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/app" element={<p>Area privada</p>} />
        </Route>
      </Routes>,
      {
        route: "/app",
        auth: createAuthContextValue({
          status: "authenticated",
          user: { id: "user-1", email: "ana@example.com" }
        })
      }
    );

    expect(screen.getByRole("link", { name: /auditoria/i })).toHaveAttribute("href", "/app/audit");
    expect(screen.queryByText(/alteracao recente/i)).not.toBeInTheDocument();
  });
});
