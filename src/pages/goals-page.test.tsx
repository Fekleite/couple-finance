import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GoalsPage } from "@/pages/goals-page";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { useGoals } from "@/features/goals";
import { renderWithCoupleAuth } from "@/test/couple-test-utils";

vi.mock("@/features/couple/use-couple-relationship", () => ({ useCoupleRelationship: vi.fn() }));
vi.mock("@/features/goals", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/goals")>()),
  useGoals: vi.fn()
}));

describe("GoalsPage", () => {
  it("renders title, loading-safe layout, and wires relationship context", () => {
    vi.mocked(useCoupleRelationship).mockReturnValue({
      relationshipState: {
        status: "couple_linked",
        sharedBudget: { id: "budget-1", name: "Casa", memberCount: 2, currentUserRole: "creator" }
      },
      invitation: null,
      mutationState: { status: "idle", message: null },
      refresh: vi.fn(),
      createInvite: vi.fn(),
      accept: vi.fn(),
      decline: vi.fn(),
      cancel: vi.fn()
    });
    vi.mocked(useGoals).mockReturnValue({
      state: { status: "loading", items: [], statusFilter: "active" },
      statusFilter: "active",
      setStatusFilter: vi.fn(),
      retry: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      complete: vi.fn(),
      archive: vi.fn()
    });
    renderWithCoupleAuth(<GoalsPage />, { route: "/app/goals" });
    expect(screen.getByRole("heading", { name: "Metas financeiras" })).toBeInTheDocument();
    expect(screen.getByText(/buscando somente metas/i)).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("max-w-4xl");
    expect(useGoals).toHaveBeenCalledWith(expect.stringContaining("couple_linked:budget-1"));
  });
});
