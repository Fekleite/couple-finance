import { describe, expect, it } from "vitest";

import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { createInviteSchema, normalizeEmail } from "@/features/couple/couple-schemas";

describe("couple invite schema", () => {
  it("accepts and normalizes a valid partner e-mail", () => {
    expect(
      createInviteSchema("ana@example.com").parse({ inviteeEmail: " BIA@Example.COM " })
    ).toEqual({
      inviteeEmail: "bia@example.com"
    });
  });

  it("normalizes e-mail consistently", () => {
    expect(normalizeEmail(" Parceira@Example.COM ")).toBe("parceira@example.com");
  });

  it("rejects empty e-mail", () => {
    expect(() => createInviteSchema().parse({ inviteeEmail: "" })).toThrow(
      COUPLE_MESSAGES.emailRequired
    );
  });

  it("rejects invalid e-mail", () => {
    expect(() => createInviteSchema().parse({ inviteeEmail: "invalido" })).toThrow(
      COUPLE_MESSAGES.emailInvalid
    );
  });

  it("blocks own e-mail after normalization", () => {
    expect(() =>
      createInviteSchema("ana@example.com").parse({ inviteeEmail: " ANA@example.com " })
    ).toThrow(COUPLE_MESSAGES.ownEmailBlocked);
  });
});
