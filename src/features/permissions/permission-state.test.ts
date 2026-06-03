import { describe, expect, it } from "vitest";

import { mapRelationshipToPermissionState } from "@/features/permissions/permission-state";
import { PERMISSION_STATES } from "@/features/permissions/permission-types";

describe("permission state", () => {
  it("exposes the complete F03 permission state set", () => {
    expect(PERMISSION_STATES).toEqual([
      "unauthenticated",
      "no_couple_link",
      "sent_pending_invitation",
      "received_pending_invitation",
      "active_couple_link",
      "unavailable_invitation",
      "ended_or_inactive_couple_link",
      "unrelated_authenticated_user"
    ]);
  });

  it("maps F02 relationship states into permission states", () => {
    expect(mapRelationshipToPermissionState({ status: "loading" })).toBe("unauthenticated");
    expect(mapRelationshipToPermissionState({ status: "no_shared_budget" })).toBe("no_couple_link");
    expect(
      mapRelationshipToPermissionState({
        status: "invitation_sent",
        invitation: {
          id: "invite-1",
          inviteeEmail: "bia@example.com",
          status: "pending",
          expiresAt: "2026-06-09T00:00:00.000Z",
          createdAt: "2026-06-02T00:00:00.000Z"
        }
      })
    ).toBe("sent_pending_invitation");
    expect(
      mapRelationshipToPermissionState({
        status: "invitation_received",
        invitation: {
          id: "invite-1",
          inviterLabel: "Pessoa que convidou",
          sharedBudgetName: "Espaco compartilhado",
          status: "pending",
          expiresAt: "2026-06-09T00:00:00.000Z",
          createdAt: "2026-06-02T00:00:00.000Z"
        }
      })
    ).toBe("received_pending_invitation");
    expect(
      mapRelationshipToPermissionState({
        status: "couple_linked",
        sharedBudget: {
          id: "budget-1",
          name: "Espaco compartilhado",
          memberCount: 2,
          currentUserRole: "creator"
        }
      })
    ).toBe("active_couple_link");
    expect(
      mapRelationshipToPermissionState({
        status: "invitation_unavailable",
        reason: "expired"
      })
    ).toBe("unavailable_invitation");
    expect(mapRelationshipToPermissionState({ status: "error", message: "Falha segura" })).toBe(
      "ended_or_inactive_couple_link"
    );
  });
});
