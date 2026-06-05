import { describe, expect, it } from "vitest";

import { dashboardPeriod, dashboardResponse } from "@/test/dashboard-test-utils";
import { dashboardStateFromResult, startDashboardLoad } from "./dashboard-state";

describe("dashboard state", () => {
  it("allows safe loading, refreshing, empty and error transitions", () => {
    const period = dashboardPeriod();
    expect(startDashboardLoad(null, period)).toMatchObject({ status: "loading" });
    expect(
      startDashboardLoad(
        { ...dashboardResponse({ period }), status: "ready", period },
        period,
        false
      )
    ).toMatchObject({ status: "refreshing" });
    expect(
      dashboardStateFromResult(period, {
        ok: true,
        data: dashboardResponse({
          period,
          indicators: {
            incomeCents: 10,
            expenseCents: 10,
            balanceCents: 0,
            resultMeaning: "zero",
            hasAuthorizedMonthData: false
          }
        })
      })
    ).toMatchObject({
      status: "empty_month",
      indicators: { incomeCents: 0 },
      recentTransactions: []
    });
    expect(
      dashboardStateFromResult(period, {
        ok: false,
        reason: "temporary_failure",
        message: "Falha segura."
      })
    ).toMatchObject({ status: "error", message: "Falha segura." });
  });
});
