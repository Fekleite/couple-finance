import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { sendPasswordRecovery } from "@/features/auth/auth-service";
import { ForgotPasswordPage } from "@/pages/forgot-password-page";
import { renderWithRouterAndAuth } from "@/test/auth-test-utils";

vi.mock("@/features/auth/auth-service", () => ({
  sendPasswordRecovery: vi.fn()
}));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows neutral recovery confirmation and preserves email", async () => {
    vi.mocked(sendPasswordRecovery).mockResolvedValue({
      ok: true,
      message: AUTH_MESSAGES.recoveryRequested
    });
    const user = userEvent.setup();
    renderWithRouterAndAuth(<ForgotPasswordPage />, { route: "/forgot-password" });

    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar instrucoes" }));

    expect(await screen.findByText(AUTH_MESSAGES.recoveryRequested)).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.com");
  });

  it("validates invalid email format", async () => {
    const user = userEvent.setup();
    renderWithRouterAndAuth(<ForgotPasswordPage />, { route: "/forgot-password" });

    await user.type(screen.getByLabelText("E-mail"), "ana");
    await user.click(screen.getByRole("button", { name: "Enviar instrucoes" }));

    expect(await screen.findByText(AUTH_MESSAGES.invalidEmail)).toBeInTheDocument();
    expect(sendPasswordRecovery).not.toHaveBeenCalled();
  });
});
