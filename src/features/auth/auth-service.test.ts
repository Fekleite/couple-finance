import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import {
  sendPasswordRecovery,
  signInWithEmail,
  signOutCurrentSession,
  signUpWithEmail,
  updatePassword
} from "@/features/auth/auth-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: vi.fn()
}));

const auth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn()
};

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSupabaseClient).mockReturnValue({ auth } as never);
  });

  it("returns immediate signup success when Supabase creates a session", async () => {
    auth.signUp.mockResolvedValue({ data: { session: { user: {} } }, error: null });

    await expect(
      signUpWithEmail({ name: "Ana", email: "ana@example.com", password: "senhaforte" })
    ).resolves.toMatchObject({
      ok: true,
      needsConfirmation: false,
      message: AUTH_MESSAGES.signupSuccess
    });
    expect(auth.signUp).toHaveBeenCalledWith({
      email: "ana@example.com",
      password: "senhaforte",
      options: {
        data: {
          full_name: "Ana"
        }
      }
    });
  });

  it("maps existing signup email to a safe action-oriented message", async () => {
    auth.signUp.mockResolvedValue({
      data: { session: null },
      error: { message: "User already registered" }
    });

    await expect(
      signUpWithEmail({ name: "Ana", email: "ana@example.com", password: "senhaforte" })
    ).resolves.toEqual({
      ok: false,
      message: AUTH_MESSAGES.existingSignupEmail
    });
  });

  it("uses a generic message for invalid login", async () => {
    auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" }
    });

    await expect(
      signInWithEmail({ email: "ana@example.com", password: "errada" })
    ).resolves.toEqual({
      ok: false,
      message: AUTH_MESSAGES.invalidLogin
    });
  });

  it("signs out with a safe success message", async () => {
    auth.signOut.mockResolvedValue({ error: null });

    await expect(signOutCurrentSession()).resolves.toEqual({
      ok: true,
      message: AUTH_MESSAGES.logoutSuccess
    });
  });

  it("returns neutral recovery confirmation regardless of account existence", async () => {
    auth.resetPasswordForEmail.mockResolvedValue({ error: null });

    await expect(sendPasswordRecovery("ana@example.com")).resolves.toEqual({
      ok: true,
      message: AUTH_MESSAGES.recoveryRequested
    });
  });

  it("updates password and maps invalid recovery failures", async () => {
    auth.updateUser.mockResolvedValueOnce({ error: null });
    await expect(updatePassword("novasenha")).resolves.toEqual({
      ok: true,
      message: AUTH_MESSAGES.passwordUpdated
    });

    auth.updateUser.mockResolvedValueOnce({ error: { message: "expired token" } });
    await expect(updatePassword("novasenha")).resolves.toEqual({
      ok: false,
      message: AUTH_MESSAGES.recoveryLinkInvalid
    });
  });
});
