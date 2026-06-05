import { describe, expect, it } from "vitest";

import { dashboardIndicators } from "@/test/dashboard-test-utils";
import {
  dashboardResultReading,
  deriveResultMeaning,
  formatSignedCurrency
} from "./dashboard-summary";

describe("dashboard summary helpers", () => {
  it("derives positive, negative and zero readings without color-only meaning", () => {
    expect(deriveResultMeaning(1)).toBe("positive");
    expect(deriveResultMeaning(-1)).toBe("negative");
    expect(deriveResultMeaning(0)).toBe("zero");
    expect(dashboardResultReading(dashboardIndicators({ resultMeaning: "negative" }))).toContain(
      "deficit"
    );
    expect(formatSignedCurrency(12345)).toMatch(/\+\s*R\$\s*123,45/);
    expect(formatSignedCurrency(-12345)).toMatch(/negativo.*R\$\s*123,45/);
  });
});
