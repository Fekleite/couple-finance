import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { signUpWithEmail } from "@/features/auth/auth-service";
import { SignUpPage } from "@/pages/sign-up-page";
import { renderWithRouterAndAuth } from "@/test/auth-test-utils";

vi.mock("@/features/auth/auth-service", () => ({
  signUpWithEmail: vi.fn()
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates weak password before signup", async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouterAndAuth(<SignUpPage />, { route: "/sign-up" });

    await user.type(screen.getByLabelText("Nome"), "Ana");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    expect(screen.getByText("A senha precisa ter 8 caracteres ou mais.")).toBeInTheDocument();
    expect(container.querySelector("#signup-password-hint")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Senha"), "curta");

    expect(await screen.findByRole("alert")).toHaveTextContent(AUTH_MESSAGES.weakPassword);
    expect(container.querySelector("#signup-password-hint")).not.toBeInTheDocument();
    expect(signUpWithEmail).not.toHaveBeenCalled();
  });

  it("validates email and password confirmation while typing", async () => {
    const user = userEvent.setup();
    renderWithRouterAndAuth(<SignUpPage />, { route: "/sign-up" });

    await user.type(screen.getByLabelText("E-mail"), "ana");
    expect(await screen.findByText(AUTH_MESSAGES.invalidEmail)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Senha"), "senhaforte");
    await user.type(screen.getByLabelText("Confirmar senha"), "diferente");
    expect(await screen.findByText(AUTH_MESSAGES.passwordMismatch)).toBeInTheDocument();
  });

  it("shows existing email recovery guidance without clearing email", async () => {
    vi.mocked(signUpWithEmail).mockResolvedValue({
      ok: false,
      message: AUTH_MESSAGES.existingSignupEmail
    });
    const user = userEvent.setup();
    renderWithRouterAndAuth(<SignUpPage />, { route: "/sign-up" });

    await user.type(screen.getByLabelText("Nome"), "Ana");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.type(screen.getByLabelText("Senha"), "senhaforte");
    await user.type(screen.getByLabelText("Confirmar senha"), "senhaforte");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText(AUTH_MESSAGES.existingSignupEmail)).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.com");
  });

  it("announces confirmation guidance when signup needs email confirmation", async () => {
    vi.mocked(signUpWithEmail).mockResolvedValue({
      ok: true,
      needsConfirmation: true,
      message: AUTH_MESSAGES.signupConfirmation
    });
    const user = userEvent.setup();
    renderWithRouterAndAuth(<SignUpPage />, { route: "/sign-up" });

    await user.type(screen.getByLabelText("Nome"), "Ana");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.type(screen.getByLabelText("Senha"), "senhaforte");
    await user.type(screen.getByLabelText("Confirmar senha"), "senhaforte");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => expect(signUpWithEmail).toHaveBeenCalled());
    expect(await screen.findByText(AUTH_MESSAGES.signupConfirmation)).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toHaveValue("");
    expect(screen.getByLabelText("E-mail")).toHaveValue("");
    expect(screen.getByLabelText("Senha")).toHaveValue("");
    expect(screen.getByLabelText("Confirmar senha")).toHaveValue("");
  });
});
