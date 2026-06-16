import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dashboardPeriod, dashboardResponse } from "@/test/dashboard-test-utils";
import { dispatchFocusReturnEvents } from "@/test/server-state-focus-test-utils";
import { getFinancialDashboard } from "./dashboard-service";
import { useDashboard } from "./use-dashboard";

vi.mock("./dashboard-service", () => ({ getFinancialDashboard: vi.fn() }));

describe("useDashboard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not refetch dashboard data when browser focus returns", async () => {
    vi.mocked(getFinancialDashboard).mockResolvedValue({
      ok: true,
      data: dashboardResponse()
    });
    const { result } = renderHook(() => useDashboard(dashboardPeriod(), "user-a:solo"));

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();

    expect(result.current.state.status).toBe("ready");
    expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
  });

  it("loads, retries and suppresses stale responses through request ownership", async () => {
    vi.mocked(getFinancialDashboard).mockResolvedValue({
      ok: true,
      data: dashboardResponse()
    });
    const { result } = renderHook(() => useDashboard(dashboardPeriod(), "user-a:solo"));
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    result.current.retry();
    await waitFor(() => expect(getFinancialDashboard).toHaveBeenCalledTimes(2));
  });

  it("clears stale data before refetch when authorization context changes", async () => {
    vi.mocked(getFinancialDashboard).mockResolvedValue({
      ok: true,
      data: dashboardResponse()
    });
    const { result, rerender } = renderHook(
      ({ context }) => useDashboard(dashboardPeriod(), context),
      { initialProps: { context: "user-a:budget-1" } }
    );
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    rerender({ context: "user-a:no-shared-budget" });
    expect(result.current.state.status).toBe("loading");
  });

  it("preserves the selected dashboard period when browser focus returns", async () => {
    vi.mocked(getFinancialDashboard).mockResolvedValue({
      ok: true,
      data: dashboardResponse({ period: dashboardPeriod("2026-05") })
    });
    const { result } = renderHook(() => useDashboard(dashboardPeriod("2026-05"), "user-a:solo"));

    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    dispatchFocusReturnEvents();

    expect(result.current.state.period.key).toBe("2026-05");
    expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
  });

  it("keeps a dashboard error visible until explicit retry", async () => {
    vi.mocked(getFinancialDashboard)
      .mockResolvedValueOnce({
        ok: false,
        reason: "temporary_failure",
        message: "Nao foi possivel carregar o dashboard."
      })
      .mockResolvedValueOnce({
        ok: true,
        data: dashboardResponse()
      });
    const { result } = renderHook(() => useDashboard(dashboardPeriod(), "user-a:solo"));

    await waitFor(() => expect(result.current.state.status).toBe("error"));
    dispatchFocusReturnEvents();

    expect(result.current.state.status).toBe("error");
    expect(getFinancialDashboard).toHaveBeenCalledTimes(1);

    result.current.retry();
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    expect(getFinancialDashboard).toHaveBeenCalledTimes(2);
  });
});
