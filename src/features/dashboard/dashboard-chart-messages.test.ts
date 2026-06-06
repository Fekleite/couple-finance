import { describe, expect, it } from "vitest";

import {
  chartResultMeaningMessage,
  DASHBOARD_CHART_MESSAGES,
  formatBasisPoints
} from "./dashboard-chart-messages";

describe("dashboard chart messages", () => {
  it("uses safe empty and retry copy without implying hidden data", () => {
    expect(DASHBOARD_CHART_MESSAGES.categoryEmpty).toContain("autorizada");
    expect(DASHBOARD_CHART_MESSAGES.memberUnavailable).not.toMatch(/parceir[oa] ocult|bloquead/i);
    expect(DASHBOARD_CHART_MESSAGES.error).not.toMatch(/sql|rls|uuid|token/i);
    expect(DASHBOARD_CHART_MESSAGES.retry).toBe("Tentar novamente");
  });

  it("keeps member comparison wording neutral and private", () => {
    expect(DASHBOARD_CHART_MESSAGES.memberPrivacy).toContain("nao inclui dados individuais");
    expect(DASHBOARD_CHART_MESSAGES.memberPrivacy).not.toMatch(/culpa|pior|melhor|cobr/i);
  });

  it("formats percentages and result meanings for persistent labels", () => {
    expect(formatBasisPoints(3333)).toBe("33,3%");
    expect(chartResultMeaningMessage("negative")).toBe("saldo negativo");
  });
});
