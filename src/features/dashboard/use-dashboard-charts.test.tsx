import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dashboardChartsResponse } from "@/test/dashboard-chart-test-utils";
import { dashboardPeriod } from "@/test/dashboard-test-utils";
import { dispatchFocusReturnEvents } from "@/test/server-state-focus-test-utils";
import { getFinancialDashboardCharts } from "./dashboard-chart-service";
import { useDashboardCharts } from "./use-dashboard-charts";

vi.mock("./dashboard-chart-service", () => ({ getFinancialDashboardCharts: vi.fn() }));

describe("useDashboardCharts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not refetch dashboard charts when browser focus returns", async () => {
    vi.mocked(getFinancialDashboardCharts).mockResolvedValue({
      ok: true,
      data: dashboardChartsResponse()
    });
    const { result } = renderHook(() => useDashboardCharts(dashboardPeriod(), "user-a:budget-1"));

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();

    expect(result.current.state.status).toBe("ready");
    expect(getFinancialDashboardCharts).toHaveBeenCalledTimes(1);
  });

  it("loads, retries and ignores stale rapid month responses", async () => {
    vi.mocked(getFinancialDashboardCharts).mockResolvedValue({
      ok: true,
      data: dashboardChartsResponse()
    });
    const { result, rerender } = renderHook(
      ({ month }) => useDashboardCharts(dashboardPeriod(month), "user-a:budget-1"),
      { initialProps: { month: "2026-06" } }
    );
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    result.current.retry();
    await waitFor(() => expect(getFinancialDashboardCharts).toHaveBeenCalledTimes(2));
    rerender({ month: "2026-05" });
    await waitFor(() => expect(getFinancialDashboardCharts).toHaveBeenCalledTimes(3));
  });

  it("clears stale data before refetch when authorization context changes", async () => {
    vi.mocked(getFinancialDashboardCharts).mockResolvedValue({
      ok: true,
      data: dashboardChartsResponse()
    });
    const { result, rerender } = renderHook(
      ({ context }) => useDashboardCharts(dashboardPeriod(), context),
      { initialProps: { context: "user-a:budget-1" } }
    );
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    rerender({ context: "user-a:no-shared-budget" });
    expect(result.current.state.status).toBe("loading");
  });

  it("preserves the selected chart period when browser focus returns", async () => {
    vi.mocked(getFinancialDashboardCharts).mockResolvedValue({
      ok: true,
      data: dashboardChartsResponse({ period: dashboardPeriod("2026-05") })
    });
    const { result } = renderHook(() =>
      useDashboardCharts(dashboardPeriod("2026-05"), "user-a:budget-1")
    );

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();

    expect(result.current.state.period.key).toBe("2026-05");
    expect(getFinancialDashboardCharts).toHaveBeenCalledTimes(1);
  });
});
