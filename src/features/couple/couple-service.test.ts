import { beforeEach, describe, expect, it, vi } from "vitest";

import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import {
  acceptInvitation,
  cancelInvitation,
  createSharedBudgetAndInvite,
  declineInvitation,
  getInvitation,
  getRelationshipState
} from "@/features/couple/couple-service";
import { getSupabaseClient } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: vi.fn()
}));

const context = {
  user: {
    id: "user-a",
    email: "ana@example.com"
  }
};

function query(result: unknown) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    gt: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    maybeSingle: vi.fn(() => Promise.resolve(result))
  };
  return builder;
}

describe("couple service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates shared budget invitation through RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: "invite-1",
        invitee_email: "bia@example.com",
        status: "pending",
        expires_at: "2026-06-09T00:00:00.000Z",
        created_at: "2026-06-02T00:00:00.000Z"
      },
      error: null
    });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);

    await expect(
      createSharedBudgetAndInvite(context, { inviteeEmail: " BIA@example.com " })
    ).resolves.toMatchObject({
      ok: true,
      message: COUPLE_MESSAGES.inviteCreated,
      data: {
        inviteeEmail: "bia@example.com"
      }
    });
    expect(rpc).toHaveBeenCalledWith("create_shared_budget_and_invite", {
      invitee_email_input: "bia@example.com"
    });
  });

  it("maps active membership failures to already-linked copy", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "active membership already exists" }
      })
    } as never);

    await expect(
      createSharedBudgetAndInvite(context, { inviteeEmail: "bia@example.com" })
    ).resolves.toEqual({
      ok: false,
      reason: "validation",
      message: COUPLE_MESSAGES.alreadyLinked
    });
  });

  it("maps unauthorized or missing invitation rows as unavailable", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => query({ data: null, error: null }))
    } as never);

    await expect(getInvitation(context, "invite-1")).resolves.toEqual({
      ok: false,
      reason: "not_found",
      message: COUPLE_MESSAGES.unavailable
    });
  });

  it("loads empty relationship state when no rows are visible", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi
        .fn()
        .mockReturnValueOnce(query({ data: null, error: null }))
        .mockReturnValueOnce(query({ data: null, error: null }))
    } as never);

    await expect(getRelationshipState(context)).resolves.toEqual({
      ok: true,
      data: { status: "no_shared_budget" }
    });
  });

  it("runs accept, decline and cancel invitation RPCs", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: null });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);

    await expect(acceptInvitation(context, "invite-1")).resolves.toMatchObject({
      ok: true,
      message: COUPLE_MESSAGES.inviteAccepted
    });
    await declineInvitation(context, "invite-1");
    await cancelInvitation(context, "invite-1");

    expect(rpc).toHaveBeenCalledWith("accept_invitation", { invitation_id_input: "invite-1" });
    expect(rpc).toHaveBeenCalledWith("decline_invitation", { invitation_id_input: "invite-1" });
    expect(rpc).toHaveBeenCalledWith("cancel_invitation", { invitation_id_input: "invite-1" });
  });

  it("blocks expired invitations safely", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() =>
        query({
          data: {
            id: "invite-1",
            inviter_user_id: "user-a",
            invitee_email: "bia@example.com",
            invitee_email_normalized: "bia@example.com",
            status: "pending",
            expires_at: "2020-01-01T00:00:00.000Z",
            created_at: "2019-12-25T00:00:00.000Z",
            shared_budget_id: "budget-1"
          },
          error: null
        })
      )
    } as never);

    await expect(getInvitation(context, "invite-1")).resolves.toEqual({
      ok: false,
      reason: "expired",
      message: COUPLE_MESSAGES.unavailable
    });
  });
});
