import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { createAuthContextValue, renderWithRouterAndAuth } from "@/test/auth-test-utils";

describe("AuthenticatedLayout", () => {
  it("renders a dashboard sidebar with safe private navigation", () => {
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

    const navigation = screen.getByRole("navigation", { name: "Navegacao privada" });

    expect(within(navigation).getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/app"
    );
    expect(within(navigation).getByRole("link", { name: /^transacoes$/i })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
    expect(within(navigation).getByRole("link", { name: /categorias/i })).toHaveAttribute(
      "href",
      "/app/categories"
    );
    expect(within(navigation).getByRole("link", { name: /metas/i })).toHaveAttribute(
      "href",
      "/app/goals"
    );
    expect(within(navigation).getByRole("link", { name: /auditoria/i })).toHaveAttribute(
      "href",
      "/app/audit"
    );
    expect(within(navigation).queryByRole("link", { name: /configuracoes|settings/i })).toBeNull();
    expect(within(navigation).queryByRole("link", { name: /parceiro|convites/i })).toBeNull();
    expect(within(navigation).queryByRole("link", { name: /registrar|nova/i })).toBeNull();
    expect(screen.getByText("Area privada")).toBeInTheDocument();
  });

  it("marks the current desktop route semantically", () => {
    renderWithRouterAndAuth(
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/app/transactions" element={<p>Transacoes privadas</p>} />
        </Route>
      </Routes>,
      {
        route: "/app/transactions",
        auth: createAuthContextValue({
          status: "authenticated",
          user: { id: "user-1", email: "ana@example.com", name: "Ana Financeira" }
        })
      }
    );

    expect(screen.getByRole("link", { name: /^transacoes$/i, current: "page" })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
  });

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

    await user.click(screen.getAllByRole("button", { name: /sair/i })[0]);

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
    expect(screen.getAllByRole("button", { name: /saindo/i })[0]).toBeDisabled();
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

    expect(screen.getAllByText("Ana Financeira")[0]).toBeInTheDocument();
    expect(screen.getAllByText("ana@example.com")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /avatar de ana financeira/i })[0]).toHaveTextContent(
      "AF"
    );
    expect(screen.queryByRole("heading", { name: /couple finance/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/app");
    expect(screen.getByRole("link", { name: /categorias/i })).toHaveAttribute(
      "href",
      "/app/categories"
    );
    expect(screen.getByRole("link", { name: /^transacoes$/i })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
    expect(screen.getByRole("link", { name: /metas/i })).toHaveAttribute("href", "/app/goals");
    expect(screen.getByRole("link", { name: /auditoria/i })).toHaveAttribute("href", "/app/audit");
    expect(screen.queryByText(/alteracao recente/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/conta autenticada/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/nenhum dado financeiro/i)).not.toBeInTheDocument();
  });

  it("opens compact navigation, follows links, and closes after selection", async () => {
    const user = userEvent.setup();
    renderWithRouterAndAuth(
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/app" element={<p>Area privada</p>} />
          <Route path="/app/goals" element={<p>Metas privadas</p>} />
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

    expect(screen.queryByRole("navigation", { name: /compacta/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /abrir menu/i }));

    const compactNavigation = screen.getByRole("navigation", {
      name: "Navegacao privada compacta"
    });
    expect(within(compactNavigation).getByRole("link", { name: /metas/i })).toHaveAttribute(
      "href",
      "/app/goals"
    );

    await user.click(within(compactNavigation).getByRole("link", { name: /metas/i }));

    expect(screen.getByText("Metas privadas")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /compacta/i })).not.toBeInTheDocument();
  });

  it("closes compact navigation and returns focus to the trigger", async () => {
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

    const trigger = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /fechar navegacao/i }));

    expect(trigger).toHaveFocus();
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

    expect(screen.getAllByRole("img", { name: /avatar de ana financeira/i })[0]).toHaveAttribute(
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
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: /^transacoes$/i })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: /categorias/i })).toHaveFocus();
  });
});
