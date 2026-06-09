import { describe, expect, it } from "vitest";

import { COUPLE_MESSAGES, sanitizeCoupleMessage } from "./couple-messages";

describe("couple messages", () => {
  it("keeps invitation and partner copy concise without exposing internal details", () => {
    expect(COUPLE_MESSAGES.loadingRelationship).toBe("Verificando vinculo.");
    expect(COUPLE_MESSAGES.inviteCreated).toBe("Convite criado. Aguarde o aceite.");
    expect(COUPLE_MESSAGES.linkedMessage).toMatch(/dados compartilhados/i);
    expect(Object.values(COUPLE_MESSAGES).join(" ")).not.toMatch(
      /supabase|rls|policy|select|insert|proximas features/i
    );
  });

  it("sanitizes backend-like messages before user display", () => {
    expect(sanitizeCoupleMessage("RLS policy rejected select")).toBe(
      COUPLE_MESSAGES.retryableFailure
    );
    expect(sanitizeCoupleMessage("Convite expirado.")).toBe("Convite expirado.");
  });
});
