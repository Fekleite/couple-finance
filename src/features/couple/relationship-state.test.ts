import { describe, expect, it } from "vitest";

import {
  resolveRelationshipState,
  unavailableRelationshipState
} from "@/features/couple/relationship-state";
import type { RawRelationshipData } from "@/features/couple/couple-types";

const sentInvitation = {
  id: "invite-1",
  inviteeEmail: "bia@example.com",
  status: "pending",
  expiresAt: "2026-06-09T00:00:00.000Z",
  createdAt: "2026-06-02T00:00:00.000Z"
} as const;

const sharedBudget = {
  id: "budget-1",
  name: "Espaco compartilhado",
  memberCount: 2,
  currentUserRole: "creator"
} as const;

describe("relationship state priority", () => {
  it("returns linked before pending sent invitation when two members exist", () => {
    const state = resolveRelationshipState({
      activeMembership: {
        sharedBudget,
        pendingInvitation: sentInvitation
      }
    });

    expect(state.status).toBe("couple_linked");
  });

  it("returns sent invitation for creator waiting for partner", () => {
    const state = resolveRelationshipState({
      activeMembership: {
        sharedBudget: { ...sharedBudget, memberCount: 1 },
        pendingInvitation: sentInvitation
      }
    });

    expect(state.status).toBe("invitation_sent");
  });

  it("returns received invitation for invitee without active membership", () => {
    const data: RawRelationshipData = {
      receivedInvitation: {
        id: "invite-2",
        inviterLabel: "Pessoa que convidou",
        sharedBudgetName: "Espaco compartilhado",
        status: "pending",
        expiresAt: sentInvitation.expiresAt,
        createdAt: sentInvitation.createdAt
      }
    };

    expect(resolveRelationshipState(data).status).toBe("invitation_received");
  });

  it("returns empty state when no relationship exists", () => {
    expect(resolveRelationshipState({}).status).toBe("no_shared_budget");
  });

  it("creates unavailable states with reason", () => {
    expect(unavailableRelationshipState("expired")).toEqual({
      status: "invitation_unavailable",
      reason: "expired"
    });
  });
});
