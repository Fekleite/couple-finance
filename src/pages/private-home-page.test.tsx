import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PrivateHomePage } from "@/pages/private-home-page";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { useDashboard } from "@/features/dashboard";
import { getPermissionMessage } from "@/features/permissions";
import { dashboardPeriod, dashboardResponse } from "@/test/dashboard-test-utils";
import { renderWithCoupleAuth, renderWithCoupleRoute } from "@/test/couple-test-utils";

vi.mock("@/features/couple/use-couple-relationship", () => ({
  useCoupleRelationship: vi.fn()
}));
vi.mock("@/features/dashboard", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/dashboard")>()),
  useDashboard: vi.fn()
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
    const period = dashboardPeriod();
    vi.mocked(useDashboard).mockReturnValue({
      state: { ...dashboardResponse({ period }), status: "ready", period },
      retry: vi.fn()
    });
  });

  it("renders dashboard first with default current month and preserved landmark order", () => {
    renderWithCoupleRoute(<PrivateHomePage />, { route: "/app", path: "/app" });
    expect(screen.getByRole("heading", { name: /dashboard financeiro/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Resumo financeiro do mes")).toBeInTheDocument();
    expect(screen.getByLabelText("Acoes financeiras")).toBeInTheDocument();
  });

  it("uses a valid month query and normalizes invalid months", async () => {
    renderWithCoupleRoute(<PrivateHomePage />, {
      route: "/app?month=2026-05",
      path: "/app"
    });
    expect(useDashboard).toHaveBeenCalledWith(
      expect.objectContaining({ key: "2026-05" }),
      expect.stringContaining("user-a")
    );

    const invalid = renderWithCoupleRoute(<PrivateHomePage />, {
      route: "/app?month=not-a-month",
      path: "/app"
    });
    await waitFor(() => expect(useDashboard).toHaveBeenCalled());
    const calls = vi.mocked(useDashboard).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall?.[0].key).toMatch(/^\d{4}-\d{2}$/);
    expect(lastCall?.[0].key).not.toBe("not-a-month");
    invalid.unmount();
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

  it("links to goals without adding dashboard summaries or goal charts", () => {
    renderWithCoupleAuth(<PrivateHomePage />);
    expect(screen.getByRole("link", { name: /ver metas/i })).toHaveAttribute("href", "/app/goals");
    expect(screen.queryByText(/grafico de metas/i)).not.toBeInTheDocument();
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

  it("renders linked state with active shared context and no future charts", () => {
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
    expect(screen.getByRole("heading", { name: /dashboard financeiro/i })).toBeInTheDocument();
    expect(screen.queryByText(/grafico/i)).not.toBeInTheDocument();
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
