import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { signInWithEmail } from "@/features/auth/auth-service";
import { LoginPage } from "@/pages/login-page";
import { renderWithRouterAndAuth } from "@/test/auth-test-utils";

vi.mock("@/features/auth/auth-service", () => ({
  signInWithEmail: vi.fn()
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates required password", async () => {
    const user = userEvent.setup();
    renderWithRouterAndAuth(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(AUTH_MESSAGES.requiredPassword)).toBeInTheDocument();
    expect(signInWithEmail).not.toHaveBeenCalled();
  });

  it("shows generic invalid credential feedback", async () => {
    vi.mocked(signInWithEmail).mockResolvedValue({
      ok: false,
      message: AUTH_MESSAGES.invalidLogin
    });
    const user = userEvent.setup();
    renderWithRouterAndAuth(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.type(screen.getByLabelText("Senha"), "errada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(AUTH_MESSAGES.invalidLogin)).toBeInTheDocument();
  });

  it("offers signup and recovery navigation", () => {
    renderWithRouterAndAuth(<LoginPage />, { route: "/login" });

    expect(screen.getByRole("link", { name: "Criar conta" })).toHaveAttribute("href", "/sign-up");
    expect(screen.getByRole("link", { name: "Recuperar acesso" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });
});
