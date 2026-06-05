import { describe, expect, it } from "vitest";

import { DASHBOARD_MESSAGES, resultMeaningMessage } from "./dashboard-messages";

describe("dashboard messages", () => {
  it("uses neutral Brazilian Portuguese copy without inaccessible-data hints", () => {
    const copy = Object.values(DASHBOARD_MESSAGES).join(" ");
    expect(copy).toContain("disponiveis para voce");
    expect(copy).not.toMatch(/ocult|bloquead|rls|sql|parceir[oa] tem/i);
    expect(resultMeaningMessage("negative")).toContain("deficit");
    expect(resultMeaningMessage("zero")).toContain("equilibrado");
  });
});
