import { z } from "zod";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";

const email = z
  .string()
  .trim()
  .min(1, AUTH_MESSAGES.requiredEmail)
  .email(AUTH_MESSAGES.invalidEmail);

const password = z.string().min(1, AUTH_MESSAGES.requiredPassword);
const strongPassword = z.string().min(8, AUTH_MESSAGES.weakPassword);
const name = z.string().trim().min(1, "Informe seu nome.");

export const loginSchema = z.object({
  email,
  password
});

export const signupSchema = z
  .object({
    name,
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, AUTH_MESSAGES.requiredPassword)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: AUTH_MESSAGES.passwordMismatch,
    path: ["confirmPassword"]
  });

export const forgotPasswordSchema = z.object({
  email
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, AUTH_MESSAGES.requiredPassword)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: AUTH_MESSAGES.passwordMismatch,
    path: ["confirmPassword"]
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
