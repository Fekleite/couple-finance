import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createGoal } from "@/test/goal-test-utils";
import { useGoals } from "./use-goals";

vi.mock("./goal-service", () => ({
  listGoals: vi.fn(),
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  completeGoal: vi.fn(),
  archiveGoal: vi.fn()
}));

import {
  archiveGoal,
  completeGoal,
  createGoal as createGoalService,
  listGoals,
  updateGoal
} from "./goal-service";

describe("useGoals", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads, retries, mutates, filters, and ignores stale load responses", async () => {
    vi.mocked(listGoals).mockResolvedValue({
      ok: true,
      data: {
        items: [createGoal()],
        hasActiveSharedBudget: true,
        activeSharedBudgetId: "budget-1",
        generatedAt: "now"
      }
    });
    vi.mocked(createGoalService).mockResolvedValue({
      ok: true,
      data: createGoal(),
      message: "Meta criada com sucesso."
    });
    vi.mocked(updateGoal).mockResolvedValue({
      ok: true,
      data: createGoal(),
      message: "Meta atualizada com sucesso."
    });
    vi.mocked(completeGoal).mockResolvedValue({
      ok: true,
      data: createGoal(),
      message: "Meta concluida com sucesso."
    });
    vi.mocked(archiveGoal).mockResolvedValue({
      ok: true,
      data: createGoal(),
      message: "Meta arquivada com sucesso."
    });

    const { result, rerender } = renderHook(({ context }) => useGoals(context), {
      initialProps: { context: "user-a:no_shared_budget" }
    });
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    expect(result.current.state.items).toHaveLength(1);

    result.current.setStatusFilter("completed");
    await waitFor(() => expect(listGoals).toHaveBeenLastCalledWith({ status: "completed" }));
    await result.current.create({
      name: "Reserva",
      targetAmountCents: 10000,
      currentAmountCents: 0,
      deadlineDate: null,
      visibility: "individual",
      sharedBudgetId: null
    });
    await result.current.update("goal-1", {
      name: "Reserva",
      targetAmountCents: 10000,
      currentAmountCents: 5000,
      deadlineDate: null
    });
    await result.current.complete("goal-1");
    await result.current.archive("goal-1");
    expect(createGoalService).toHaveBeenCalled();
    expect(updateGoal).toHaveBeenCalled();
    expect(completeGoal).toHaveBeenCalled();
    expect(archiveGoal).toHaveBeenCalled();

    rerender({ context: "user-b:couple_linked" });
    await waitFor(() => expect(listGoals).toHaveBeenLastCalledWith({ status: "completed" }));
  });
});
