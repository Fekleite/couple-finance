import { describe, expect, it } from "vitest";

import { currentCivilMonth, moveCivilMonth, parseCivilMonth } from "./transaction-month";

describe("civil month", () => {
  it("creates timezone-free month limits and pt-BR labels", () => {
    expect(currentCivilMonth(new Date(2026, 5, 4))).toMatchObject({
      key: "2026-06",
      startDate: "2026-06-01",
      nextStartDate: "2026-07-01",
      label: "junho de 2026"
    });
  });

  it("moves across year boundaries and rejects invalid keys", () => {
    expect(moveCivilMonth("2026-01", -1).key).toBe("2025-12");
    expect(moveCivilMonth("2026-12", 1).key).toBe("2027-01");
    expect(parseCivilMonth("2026-13")).toBeNull();
  });
});
