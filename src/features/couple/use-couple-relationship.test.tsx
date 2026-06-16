import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "@/features/auth/auth-context-value";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import {
  acceptInvitation,
  createSharedBudgetAndInvite,
  getInvitation,
  getRelationshipState
} from "@/features/couple/couple-service";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { createAuthenticatedCoupleAuth } from "@/test/couple-test-utils";
import { dispatchFocusReturnEvents } from "@/test/server-state-focus-test-utils";

vi.mock("@/features/couple/couple-service", () => ({
  getRelationshipState: vi.fn(),
  getInvitation: vi.fn(),
  createSharedBudgetAndInvite: vi.fn(),
  acceptInvitation: vi.fn(),
  declineInvitation: vi.fn(),
  cancelInvitation: vi.fn()
}));

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={createAuthenticatedCoupleAuth()}>{children}</AuthContext.Provider>
  );
}

describe("useCoupleRelationship", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRelationshipState).mockResolvedValue({
      ok: true,
      data: { status: "no_shared_budget" }
    });
    vi.mocked(getInvitation).mockResolvedValue({
      ok: false,
      reason: "not_found",
      message: COUPLE_MESSAGES.unavailable
    });
  });

  it("does not refetch relationship data when browser focus returns", async () => {
    const { result } = renderHook(() => useCoupleRelationship(), { wrapper });

    await waitFor(() => expect(result.current.relationshipState.status).toBe("no_shared_budget"));
    dispatchFocusReturnEvents();

    expect(result.current.relationshipState.status).toBe("no_shared_budget");
    expect(getRelationshipState).toHaveBeenCalledTimes(1);
    expect(getInvitation).not.toHaveBeenCalled();
  });

  it("loads all relationship states from service", async () => {
    vi.mocked(getRelationshipState).mockResolvedValueOnce({
      ok: true,
      data: {
        status: "couple_linked",
        sharedBudget: { id: "b", name: "Espaco", memberCount: 2, currentUserRole: "creator" }
      }
    });
    const { result } = renderHook(() => useCoupleRelationship(), { wrapper });

    await waitFor(() => expect(result.current.relationshipState.status).toBe("couple_linked"));
  });

  it("refreshes relationship state through create and accept mutations without focus return", async () => {
    vi.mocked(getInvitation).mockResolvedValue({
      ok: true,
      data: {
        id: "invite-1",
        inviterLabel: "Pessoa que convidou",
        inviteeEmail: "ana@example.com",
        sharedBudgetName: "Espaco",
        status: "pending",
        expiresAt: "2026-06-09T00:00:00.000Z",
        createdAt: "2026-06-02T00:00:00.000Z",
        currentUserRole: "invitee"
      }
    });
    vi.mocked(createSharedBudgetAndInvite).mockResolvedValue({
      ok: true,
      data: {
        id: "invite-created",
        inviteeEmail: "bia@example.com",
        status: "pending",
        expiresAt: "2026-06-09T00:00:00.000Z",
        createdAt: "2026-06-02T00:00:00.000Z"
      },
      message: COUPLE_MESSAGES.inviteCreated
    });
    vi.mocked(acceptInvitation).mockResolvedValue({
      ok: true,
      data: {
        status: "couple_linked",
        sharedBudget: { id: "b", name: "Espaco", memberCount: 2, currentUserRole: "partner" }
      },
      message: COUPLE_MESSAGES.inviteAccepted
    });
    const { result } = renderHook(() => useCoupleRelationship("invite-1"), { wrapper });

    await waitFor(() => expect(result.current.invitation?.id).toBe("invite-1"));
    await act(async () => {
      await result.current.createInvite({ inviteeEmail: "bia@example.com" });
      await result.current.accept();
    });

    expect(createSharedBudgetAndInvite).toHaveBeenCalled();
    expect(acceptInvitation).toHaveBeenCalled();
    expect(getRelationshipState).toHaveBeenCalledTimes(3);
    dispatchFocusReturnEvents();
    expect(getRelationshipState).toHaveBeenCalledTimes(3);
  });

  it("keeps loading state before service resolves", () => {
    vi.mocked(getRelationshipState).mockReturnValue(new Promise(() => undefined));
    const { result } = renderHook(() => useCoupleRelationship(), { wrapper });

    expect(result.current.relationshipState).toEqual({ status: "loading" });
  });

  it("refreshes after create invite mutation", async () => {
    vi.mocked(createSharedBudgetAndInvite).mockResolvedValue({
      ok: true,
      data: {
        id: "invite-1",
        inviteeEmail: "bia@example.com",
        status: "pending",
        expiresAt: "2026-06-09T00:00:00.000Z",
        createdAt: "2026-06-02T00:00:00.000Z"
      },
      message: COUPLE_MESSAGES.inviteCreated
    });
    const { result } = renderHook(() => useCoupleRelationship(), { wrapper });

    await act(async () => {
      await result.current.createInvite({ inviteeEmail: "bia@example.com" });
    });

    expect(createSharedBudgetAndInvite).toHaveBeenCalled();
    expect(result.current.mutationState.status).toBe("success");
  });

  it("loads invitation and accepts it", async () => {
    vi.mocked(getInvitation).mockResolvedValue({
      ok: true,
      data: {
        id: "invite-1",
        inviterLabel: "Pessoa que convidou",
        inviteeEmail: "ana@example.com",
        sharedBudgetName: "Espaco",
        status: "pending",
        expiresAt: "2026-06-09T00:00:00.000Z",
        createdAt: "2026-06-02T00:00:00.000Z",
        currentUserRole: "invitee"
      }
    });
    vi.mocked(acceptInvitation).mockResolvedValue({
      ok: true,
      data: {
        status: "couple_linked",
        sharedBudget: { id: "b", name: "Espaco", memberCount: 2, currentUserRole: "partner" }
      },
      message: COUPLE_MESSAGES.inviteAccepted
    });

    const { result } = renderHook(() => useCoupleRelationship("invite-1"), { wrapper });
    await waitFor(() => expect(result.current.invitation?.id).toBe("invite-1"));

    await act(async () => {
      await result.current.accept();
    });

    expect(acceptInvitation).toHaveBeenCalledWith(expect.any(Object), "invite-1");
  });
});
