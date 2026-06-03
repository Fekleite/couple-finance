import { describe, expect, it } from "vitest";

import {
  canPerformPermissionAction,
  getPermissionDecision
} from "@/features/permissions/permission-matrix";
import { PERMISSION_ACTIONS } from "@/features/permissions/permission-types";
import { permissionInput } from "@/test/permissions-test-utils";

describe("permission matrix", () => {
  it("allows all own individual operations and blocks partner ownership assumptions", () => {
    for (const action of PERMISSION_ACTIONS) {
      expect(canPerformPermissionAction(permissionInput({ action }))).toBe(true);
      expect(canPerformPermissionAction(permissionInput({ action, isOwner: false }))).toBe(false);
    }
  });

  it("allows active shared budget members and blocks unrelated authenticated users", () => {
    expect(
      canPerformPermissionAction(
        permissionInput({
          state: "active_couple_link",
          dataScope: "shared",
          dataType: "shared_budget",
          action: "view",
          isActiveMember: true
        })
      )
    ).toBe(true);
    expect(
      canPerformPermissionAction(
        permissionInput({
          state: "unrelated_authenticated_user",
          dataScope: "shared",
          dataType: "shared_budget",
          action: "view",
          isActiveMember: false
        })
      )
    ).toBe(false);
  });

  it("does not grant shared financial access from pending or unavailable relationship states", () => {
    for (const state of [
      "sent_pending_invitation",
      "received_pending_invitation",
      "unavailable_invitation",
      "ended_or_inactive_couple_link"
    ] as const) {
      expect(
        canPerformPermissionAction(
          permissionInput({
            state,
            dataScope: "shared",
            dataType: "future_transaction",
            action: "list",
            isActiveMember: false
          })
        )
      ).toBe(false);
    }
  });

  it("allows invitation-specific actions only to the related inviter or invitee", () => {
    expect(
      canPerformPermissionAction(
        permissionInput({
          state: "sent_pending_invitation",
          dataScope: "shared",
          dataType: "invitation",
          action: "delete",
          isInviter: true
        })
      )
    ).toBe(true);
    expect(
      canPerformPermissionAction(
        permissionInput({
          state: "received_pending_invitation",
          dataScope: "shared",
          dataType: "invitation",
          action: "update",
          isInvitee: true
        })
      )
    ).toBe(true);
    expect(
      canPerformPermissionAction(
        permissionInput({
          state: "unrelated_authenticated_user",
          dataScope: "shared",
          dataType: "invitation",
          action: "view"
        })
      )
    ).toBe(false);
  });

  it("returns safe blocked decisions for inaccessible data", () => {
    expect(
      getPermissionDecision(
        permissionInput({
          dataScope: "inaccessible",
          dataType: "future_balance",
          action: "summarize"
        })
      )
    ).toEqual({
      allowed: false,
      scope: "inaccessible",
      messageKey: "permissionBlocked"
    });
  });
});
