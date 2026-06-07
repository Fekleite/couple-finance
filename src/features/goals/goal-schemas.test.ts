import { describe, expect, it } from "vitest";

import { validateGoalForm, validateGoalUpdateForm } from "./goal-schemas";

describe("goal schemas", () => {
  it("normalizes valid create values and blocks unavailable shared creation", () => {
    expect(
      validateGoalForm(
        {
          name: "  Viagem ",
          targetAmount: "1.000,00",
          currentAmount: "0,00",
          deadlineDate: "2026-12-31",
          visibility: "individual"
        },
        null
      )
    ).toMatchObject({
      success: true,
      data: { name: "Viagem", targetAmountCents: 100000, currentAmountCents: 0 }
    });

    expect(
      validateGoalForm(
        {
          name: "Reserva",
          targetAmount: "100,00",
          currentAmount: "0,00",
          deadlineDate: "",
          visibility: "shared"
        },
        null
      ).success
    ).toBe(false);
  });

  it("validates edit payload without visibility or shared budget changes", () => {
    const result = validateGoalUpdateForm({
      name: "Reserva",
      targetAmount: "200,00",
      currentAmount: "50,00",
      deadlineDate: "",
      visibility: "shared"
    });
    expect(result).toMatchObject({
      success: true,
      data: { name: "Reserva", targetAmountCents: 20000, currentAmountCents: 5000 }
    });
    expect(result.success && result.data).not.toHaveProperty("visibility");
  });
});
