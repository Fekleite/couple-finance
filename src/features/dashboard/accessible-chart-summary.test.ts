import { describe, expect, it } from "vitest";

import {
  dashboardChartsResponse,
  memberComparisonFixture
} from "@/test/dashboard-chart-test-utils";
import {
  buildAccessibleChartSummaries,
  buildCategorySummary,
  buildMemberComparisonSummary
} from "./accessible-chart-summary";

describe("accessible chart summary", () => {
  it("builds category text with highest category, totals and privacy note", () => {
    const summary = buildCategorySummary(
      "junho de 2026",
      dashboardChartsResponse().categoryDistribution
    );
    expect(summary.headline).toContain("Moradia");
    expect(summary.details.join(" ")).toContain("Alimentacao");
    expect(summary.privacyNote).toContain("somente despesas disponiveis");
  });

  it("keeps empty and member comparison wording safe and neutral", () => {
    expect(buildCategorySummary("junho de 2026", []).headline).toContain(
      "Nenhuma despesa autorizada"
    );
    const summary = buildMemberComparisonSummary(
      "junho de 2026",
      memberComparisonFixture({ status: "empty", members: [] })
    );
    expect(summary.headline).not.toMatch(/culpa|pior|bloquead/i);
    expect(summary.privacyNote).toContain("nao inclui dados individuais");
  });

  it("returns all chart summaries for the coordinated response", () => {
    expect(
      buildAccessibleChartSummaries(dashboardChartsResponse()).map((summary) => summary.chartId)
    ).toEqual(["category", "evolution", "member_comparison"]);
  });
});
