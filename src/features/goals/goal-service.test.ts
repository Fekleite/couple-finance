import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseClient } from "@/lib/supabase";
import { createGoalRow } from "@/test/goal-test-utils";
import { createGoal, listGoals, mapGoalRow } from "./goal-service";

vi.mock("@/lib/supabase", () => ({ getSupabaseClient: vi.fn() }));

describe("goal service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps authorized rows and orders active goal reads safely", async () => {
    const limit = vi.fn().mockResolvedValue({ data: [createGoalRow()], error: null });
    const order = vi.fn(() => ({ order, eq, limit }));
    const eq = vi.fn(() => ({ order, eq, limit }));
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn((table: string) =>
        table === "budget_members"
          ? {
              select: () => ({
                eq: () => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) })
              })
            }
          : { select: () => ({ order, eq, limit }) }
      )
    } as never);

    const result = await listGoals({ status: "active" });
    expect(result).toMatchObject({
      ok: true,
      data: { items: [{ name: "Reserva de emergencia" }] }
    });
    expect(eq).toHaveBeenCalledWith("status", "active");
  });

  it("calls individual create RPC without caller-controlled owner and maps failures safely", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: createGoalRow(), error: null });
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
    await createGoal({
      name: "Reserva",
      targetAmountCents: 10000,
      currentAmountCents: 0,
      deadlineDate: null,
      visibility: "individual",
      sharedBudgetId: null
    });
    expect(rpc).toHaveBeenCalledWith(
      "create_individual_goal",
      expect.objectContaining({ name_input: "Reserva" })
    );
    expect(rpc.mock.calls[0][1]).not.toHaveProperty("created_by_user_id");

    rpc.mockResolvedValueOnce({ data: null, error: { message: "goal_unavailable private-id" } });
    const failure = await createGoal({
      name: "Reserva",
      targetAmountCents: 10000,
      currentAmountCents: 0,
      deadlineDate: null,
      visibility: "individual",
      sharedBudgetId: null
    });
    expect(failure).toMatchObject({ ok: false, reason: "goal_unavailable" });
    expect(JSON.stringify(failure)).not.toContain("private-id");
  });

  it("maps snake case rows to domain fields", () => {
    expect(
      mapGoalRow(createGoalRow({ visibility: "shared", shared_budget_id: "budget-1" }))
    ).toMatchObject({
      targetAmountCents: 100000,
      visibility: "shared",
      sharedBudgetId: "budget-1"
    });
  });
});
