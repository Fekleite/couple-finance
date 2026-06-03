import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InvitationPage } from "@/pages/invitation-page";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { getPermissionMessage } from "@/features/permissions";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { renderWithCoupleRoute } from "@/test/couple-test-utils";

vi.mock("@/features/couple/use-couple-relationship", () => ({
  useCoupleRelationship: vi.fn()
}));

function mockInvitation(overrides: Partial<ReturnType<typeof useCoupleRelationship>> = {}) {
  vi.mocked(useCoupleRelationship).mockReturnValue({
    relationshipState: {
      status: "invitation_received",
      invitation: {
        id: "invite-1",
        inviterLabel: "Pessoa que convidou",
        sharedBudgetName: "Espaco compartilhado",
        status: "pending",
        expiresAt: "2026-06-09T00:00:00.000Z",
        createdAt: "2026-06-02T00:00:00.000Z"
      }
    },
    invitation: {
      id: "invite-1",
      inviterLabel: "Pessoa que convidou",
      inviteeEmail: "ana@example.com",
      sharedBudgetName: "Espaco compartilhado",
      status: "pending",
      expiresAt: "2026-06-09T00:00:00.000Z",
      createdAt: "2026-06-02T00:00:00.000Z",
      currentUserRole: "invitee"
    },
    mutationState: { status: "idle", message: null },
    refresh: vi.fn(),
    createInvite: vi.fn(),
    accept: vi.fn(),
    decline: vi.fn(),
    cancel: vi.fn(),
    ...overrides
  });
}

describe("InvitationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInvitation();
  });

  it("shows authorized invite display and actions", () => {
    renderWithCoupleRoute(<InvitationPage />, {
      route: "/app/invites/invite-1",
      path: "/app/invites/:invitationId"
    });

    expect(screen.getByText(COUPLE_MESSAGES.receivedTitle)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /aceitar convite/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recusar convite/i })).toBeInTheDocument();
  });

  it("locks accept button while loading", () => {
    mockInvitation({
      mutationState: { status: "loading", message: COUPLE_MESSAGES.acceptingInvite }
    });
    renderWithCoupleRoute(<InvitationPage />, {
      route: "/app/invites/invite-1",
      path: "/app/invites/:invitationId"
    });

    expect(screen.getByRole("button", { name: /aceitar convite/i })).toBeDisabled();
  });

  it("calls accept and decline actions by keyboard/click", async () => {
    const user = userEvent.setup();
    const accept = vi.fn();
    const decline = vi.fn();
    mockInvitation({ accept, decline });
    renderWithCoupleRoute(<InvitationPage />, {
      route: "/app/invites/invite-1",
      path: "/app/invites/:invitationId"
    });

    await user.click(screen.getByRole("button", { name: /aceitar convite/i }));
    await user.click(screen.getByRole("button", { name: /recusar convite/i }));

    expect(accept).toHaveBeenCalled();
    expect(decline).toHaveBeenCalled();
  });

  it("shows unavailable state safely", () => {
    mockInvitation({
      invitation: null,
      relationshipState: { status: "invitation_unavailable", reason: "unauthorized" }
    });
    renderWithCoupleRoute(<InvitationPage />, {
      route: "/app/invites/invite-1",
      path: "/app/invites/:invitationId"
    });

    expect(screen.getByText(getPermissionMessage("permissionUnavailable"))).toBeInTheDocument();
  });
});
