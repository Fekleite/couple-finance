import { describe, expect, it } from "vitest";

import { dashboardChartsResponse } from "@/test/dashboard-chart-test-utils";
import { dashboardPeriod } from "@/test/dashboard-test-utils";
import {
  chartEvolutionWindowFor,
  dashboardChartsStateFromResult,
  sanitizeDashboardChartsResponse,
  startDashboardChartsLoad,
  toDashboardChartQuery
} from "./dashboard-chart-state";

describe("dashboard chart state", () => {
  it("normalizes chart queries and six-month evolution windows", () => {
    const period = dashboardPeriod("2026-06");
    expect(toDashboardChartQuery(period)).toEqual({
      monthStart: "2026-06-01",
      nextMonthStart: "2026-07-01",
      evolutionMonthCount: 6
    });
    expect(chartEvolutionWindowFor(period)).toEqual({
      startMonth: "2026-01",
      endMonth: "2026-06",
      monthCount: 6
    });
  });

  it("clears sensitive data for unavailable shared states and empty months", () => {
    const sanitized = sanitizeDashboardChartsResponse(
      dashboardChartsResponse({
        memberComparison: {
          status: "unavailable_shared",
          basis: "responsible_user",
          summary: "",
          members: [
            {
              memberKey: "partner",
              memberLabel: "Pessoa parceira",
              expenseCents: 10,
              weightBasisPoints: 10000
            }
          ]
        }
      })
    );
    expect(sanitized.memberComparison.members).toEqual([]);
    expect(sanitized.monthlyEvolution.find((point) => !point.hasAuthorizedMonthData)).toMatchObject(
      {
        incomeCents: 0,
        expenseCents: 0,
        balanceCents: 0,
        resultMeaning: "zero"
      }
    );
  });

  it("handles loading, refreshing and safe error states", () => {
    const period = dashboardPeriod();
    expect(startDashboardChartsLoad(null, period)).toEqual({ status: "loading", period });
    expect(
      startDashboardChartsLoad({ ...dashboardChartsResponse({ period }), status: "ready" }, period)
    ).toEqual({ status: "refreshing", period });
    expect(
      dashboardChartsStateFromResult(period, {
        ok: false,
        reason: "temporary_failure",
        message: "Erro seguro"
      })
    ).toEqual({ status: "error", period, message: "Erro seguro" });
  });
});
