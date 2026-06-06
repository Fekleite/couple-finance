import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getFinancialDashboardCharts } from "./dashboard-chart-service";
import {
  dashboardChartsStateFromResult,
  startDashboardChartsLoad,
  toDashboardChartQuery
} from "./dashboard-chart-state";
import type { DashboardChartPeriod, DashboardChartsState } from "./dashboard-chart-types";

export function useDashboardCharts(period: DashboardChartPeriod, authorizationContext = "") {
  const [state, setState] = useState<DashboardChartsState>({ status: "loading", period });
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const previousContext = useRef(authorizationContext);
  const query = useMemo(() => toDashboardChartQuery(period), [period]);
  const queryKey = `${period.key}|${authorizationContext}`;

  const load = useCallback(
    async (contextChanged = false) => {
      const ownedRequest = ++requestId.current;
      controller.current?.abort();
      controller.current = new AbortController();
      setState((previous) => startDashboardChartsLoad(previous, period, contextChanged));
      const result = await getFinancialDashboardCharts(query, controller.current.signal);
      if (ownedRequest !== requestId.current) return;
      setState(dashboardChartsStateFromResult(period, result));
    },
    [period, query]
  );

  useEffect(() => {
    void queryKey;
    const contextChanged = previousContext.current !== authorizationContext;
    previousContext.current = authorizationContext;
    void load(contextChanged);
    return () => controller.current?.abort();
    // queryKey owns reloads; load captures the normalized query for this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return {
    state,
    retry: () => void load(false)
  };
}
