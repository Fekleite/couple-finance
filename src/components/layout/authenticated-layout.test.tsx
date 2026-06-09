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
          user: { id: "user-1", email: "ana@example.com", name: "Ana Financeira" },
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

  it("offers reachable private navigation for MVP areas without exposing event data", () => {
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
          user: { id: "user-1", email: "ana@example.com", name: "Ana Financeira" }
        })
      }
    );

    expect(screen.getByText("Ana Financeira")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /avatar de ana financeira/i })).toHaveTextContent("AF");
    expect(screen.queryByRole("heading", { name: /couple finance/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /inicio privado/i })).toHaveAttribute("href", "/app");
    expect(screen.getByRole("link", { name: /categorias/i })).toHaveAttribute(
      "href",
      "/app/categories"
    );
    expect(screen.getByRole("link", { name: /^transacoes$/i })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
    expect(screen.getByRole("link", { name: /registrar transacao/i })).toHaveAttribute(
      "href",
      "/app/transactions/new"
    );
    expect(screen.getByRole("link", { name: /metas/i })).toHaveAttribute("href", "/app/goals");
    expect(screen.getByRole("link", { name: /auditoria/i })).toHaveAttribute("href", "/app/audit");
    expect(screen.queryByText(/alteracao recente/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/conta autenticada/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/nenhum dado financeiro/i)).not.toBeInTheDocument();
  });

  it("shows image avatar when auth metadata provides one", () => {
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
          user: {
            id: "user-1",
            email: "ana@example.com",
            name: "Ana Financeira",
            avatarUrl: "https://example.com/avatar.png"
          }
        })
      }
    );

    expect(screen.getByRole("img", { name: /avatar de ana financeira/i })).toHaveAttribute(
      "src",
      "https://example.com/avatar.png"
    );
  });

  it("keeps private controls keyboard reachable in logical order", async () => {
    const user = userEvent.setup();
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
          user: { id: "user-1", email: "ana@example.com", name: "Ana Financeira" }
        })
      }
    );

    await user.tab();
    expect(screen.getByRole("button", { name: /sair da conta/i })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: /inicio privado/i })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: /categorias/i })).toHaveFocus();
  });
});
