import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dashboardPeriod, dashboardResponse } from "@/test/dashboard-test-utils";
import { getFinancialDashboard } from "./dashboard-service";
import { useDashboard } from "./use-dashboard";

vi.mock("./dashboard-service", () => ({ getFinancialDashboard: vi.fn() }));

describe("useDashboard", () => {
  beforeEach(() => vi.clearAllMocks());

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
});
