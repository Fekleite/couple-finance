import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { updatePassword } from "@/features/auth/auth-service";
import { ResetPasswordPage } from "@/pages/reset-password-page";
import { createAuthContextValue, renderWithRouterAndAuth } from "@/test/auth-test-utils";

vi.mock("@/features/auth/auth-service", () => ({
  updatePassword: vi.fn()
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows invalid recovery link guidance when no recovery session exists", () => {
    renderWithRouterAndAuth(<ResetPasswordPage />, {
      route: "/reset-password",
      auth: createAuthContextValue({ status: "unauthenticated" })
    });

    expect(screen.getByText(AUTH_MESSAGES.recoveryLinkInvalid)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "recuperar acesso" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });

  it("shows validation loading before recovery status is known", () => {
    renderWithRouterAndAuth(<ResetPasswordPage />, {
      route: "/reset-password",
      auth: createAuthContextValue({ status: "loading" })
    });

    expect(screen.getByText("Validando link de recuperacao")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Atualizar senha" })).not.toBeInTheDocument();
  });

  it("validates password confirmation before updating", async () => {
    const user = userEvent.setup();
    renderWithRouterAndAuth(<ResetPasswordPage />, {
      route: "/reset-password",
      auth: createAuthContextValue({ status: "authenticated" })
    });

    await user.type(screen.getByLabelText("Nova senha"), "novasenha");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "diferente");
    await user.click(screen.getByRole("button", { name: "Atualizar senha" }));

    expect(await screen.findByText(AUTH_MESSAGES.passwordMismatch)).toBeInTheDocument();
    expect(updatePassword).not.toHaveBeenCalled();
  });

  it("submits a valid new password", async () => {
    vi.mocked(updatePassword).mockResolvedValue({
      ok: true,
      message: AUTH_MESSAGES.passwordUpdated
    });
    const user = userEvent.setup();
    renderWithRouterAndAuth(<ResetPasswordPage />, {
      route: "/reset-password",
      auth: createAuthContextValue({ status: "authenticated" })
    });

    await user.type(screen.getByLabelText("Nova senha"), "novasenha");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "novasenha");
    await user.click(screen.getByRole("button", { name: "Atualizar senha" }));

    expect(await screen.findByText(AUTH_MESSAGES.passwordUpdated)).toBeInTheDocument();
  });
});
