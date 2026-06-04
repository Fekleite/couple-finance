import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PrivateHomePage } from "@/pages/private-home-page";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { getPermissionMessage } from "@/features/permissions";
import { renderWithCoupleAuth } from "@/test/couple-test-utils";

vi.mock("@/features/couple/use-couple-relationship", () => ({
  useCoupleRelationship: vi.fn()
}));

function mockRelationship(overrides: Partial<ReturnType<typeof useCoupleRelationship>> = {}) {
  vi.mocked(useCoupleRelationship).mockReturnValue({
    relationshipState: { status: "no_shared_budget" },
    invitation: null,
    mutationState: { status: "idle", message: null },
    refresh: vi.fn(),
    createInvite: vi.fn(),
    accept: vi.fn(),
    decline: vi.fn(),
    cancel: vi.fn(),
    ...overrides
  });
}

describe("PrivateHomePage couple states", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRelationship();
  });

  it("links to the read-only standard category catalog", () => {
    renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByRole("link", { name: /consultar categorias/i })).toHaveAttribute(
      "href",
      "/app/categories"
    );
  });

  it("links to the authorized transaction list without replacing creation", () => {
    renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByRole("link", { name: /ver transacoes/i })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
    expect(screen.getByRole("link", { name: /nova transacao/i })).toHaveAttribute(
      "href",
      "/app/transactions/new"
    );
  });

  it("renders no_shared_budget form with accessible validation and keyboard submit", async () => {
    const user = userEvent.setup();
    const createInvite = vi
      .fn()
      .mockResolvedValue({ ok: true, message: COUPLE_MESSAGES.inviteCreated });
    mockRelationship({ createInvite });
    renderWithCoupleAuth(<PrivateHomePage />);

    await user.click(screen.getByRole("button", { name: /criar espaco e convidar/i }));
    expect(await screen.findByText(COUPLE_MESSAGES.emailRequired)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/e-mail da pessoa parceira/i), "bia@example.com");
    await user.keyboard("{Enter}");

    await waitFor(() =>
      expect(createInvite).toHaveBeenCalledWith({ inviteeEmail: "bia@example.com" })
    );
  });

  it("renders invitation_sent state and cancellation", async () => {
    const user = userEvent.setup();
    const cancel = vi.fn();
    mockRelationship({
      relationshipState: {
        status: "invitation_sent",
        invitation: {
          id: "invite-1",
          inviteeEmail: "bia@example.com",
          status: "pending",
          expiresAt: "2026-06-09T00:00:00.000Z",
          createdAt: "2026-06-02T00:00:00.000Z"
        }
      },
      cancel
    });
    renderWithCoupleAuth(<PrivateHomePage />);

    expect(screen.getByText(/bia@example.com/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancelar convite/i }));
    expect(cancel).toHaveBeenCalledWith("invite-1");
  });

  it("renders received invitation with one primary action", () => {
    mockRelationship({
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
      }
    });
    renderWithCoupleAuth(<PrivateHomePage />);

    expect(screen.getByRole("link", { name: /responder convite/i })).toHaveAttribute(
      "href",
      "/app/invites/invite-1"
    );
  });

  it("renders linked state without future feature content", () => {
    mockRelationship({
      relationshipState: {
        status: "couple_linked",
        sharedBudget: {
          id: "budget-1",
          name: "Espaco compartilhado",
          memberCount: 2,
          currentUserRole: "creator"
        }
      }
    });
    renderWithCoupleAuth(<PrivateHomePage />);

    expect(screen.getByText(COUPLE_MESSAGES.linkedTitle)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard|grafico/i)).not.toBeInTheDocument();
  });

  it("renders loading, unavailable and retryable error states safely", () => {
    mockRelationship({ relationshipState: { status: "loading" } });
    const loading = renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByText(getPermissionMessage("permissionChecking"))).toBeInTheDocument();
    loading.unmount();

    mockRelationship({
      relationshipState: { status: "invitation_unavailable", reason: "expired" }
    });
    const unavailable = renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByText(getPermissionMessage("permissionUnavailable"))).toBeInTheDocument();
    unavailable.unmount();

    mockRelationship({
      relationshipState: { status: "error", message: COUPLE_MESSAGES.retryableFailure }
    });
    renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByRole("button", { name: /tentar novamente/i })).toBeInTheDocument();
  });
});
