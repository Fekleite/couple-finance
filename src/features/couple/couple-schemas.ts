import { z } from "zod";

import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";

export type InviteFormValues = {
  inviteeEmail: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createInviteSchema(currentUserEmail?: string | null) {
  const current = normalizeEmail(currentUserEmail ?? "");

  return z.object({
    inviteeEmail: z
      .string()
      .trim()
      .min(1, COUPLE_MESSAGES.emailRequired)
      .email(COUPLE_MESSAGES.emailInvalid)
      .transform(normalizeEmail)
      .refine((value) => !current || value !== current, {
        message: COUPLE_MESSAGES.ownEmailBlocked
      })
  });
}

export const invitationIdSchema = z.string().uuid("Convite invalido.");
