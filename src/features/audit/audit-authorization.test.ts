import { describe, expect, it } from "vitest";

import { actorLabel, canShowSharedContext, visibilityLabel } from "./audit-authorization";
import { createAuditEvent } from "@/test/audit-test-utils";

describe("audit authorization helpers", () => {
  it("labels current, partner, unavailable actor, and visibility safely", () => {
    expect(actorLabel(createAuditEvent(), "22222222-2222-4222-8222-222222222222")).toBe("Voce");
    expect(actorLabel(createAuditEvent({ visibility: "shared" }), "other")).toBe("Pessoa parceira");
    expect(actorLabel(createAuditEvent({ actorUserId: null }), "other")).toBe(
      "Autoria indisponivel"
    );
    expect(visibilityLabel("shared")).toBe("Compartilhado");
    expect(canShowSharedContext(false)).toBe(false);
  });
});
