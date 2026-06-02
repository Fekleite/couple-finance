import { describe, expect, it } from "vitest";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from "@/features/auth/auth-schemas";

describe("auth schemas", () => {
  it("validates signup with email, strong password, and matching confirmation", () => {
    expect(
      signupSchema.safeParse({
        name: "Ana",
        email: "ana@example.com",
        password: "senhaforte",
        confirmPassword: "senhaforte"
      }).success
    ).toBe(true);
  });

  it("rejects weak signup passwords and mismatched confirmation", () => {
    const result = signupSchema.safeParse({
      name: "",
      email: "ana@example.com",
      password: "curta",
      confirmPassword: "diferente"
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Informe seu nome.",
        AUTH_MESSAGES.weakPassword,
        AUTH_MESSAGES.passwordMismatch
      ])
    );
  });

  it("validates login required fields", () => {
    const result = loginSchema.safeParse({ email: "nao-e-email", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([AUTH_MESSAGES.invalidEmail, AUTH_MESSAGES.requiredPassword])
    );
  });

  it("validates forgot password email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "ana@example.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "ana" }).success).toBe(false);
  });

  it("validates reset password strength and confirmation", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "novasenha",
        confirmPassword: "novasenha"
      }).success
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: "curta",
        confirmPassword: "outra"
      }).success
    ).toBe(false);
  });
});
