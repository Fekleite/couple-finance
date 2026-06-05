import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getFinancialDashboard } from "./dashboard-service";
import { dashboardStateFromResult, startDashboardLoad, toDashboardQuery } from "./dashboard-state";
import type { DashboardPeriod, DashboardState } from "./dashboard-types";

export function useDashboard(period: DashboardPeriod, authorizationContext = "") {
  const [state, setState] = useState<DashboardState>({ status: "loading", period });
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const previousContext = useRef(authorizationContext);
  const query = useMemo(() => toDashboardQuery(period), [period]);
  const queryKey = `${period.key}|${authorizationContext}`;

  const load = useCallback(
    async (contextChanged = false) => {
      const ownedRequest = ++requestId.current;
      controller.current?.abort();
      controller.current = new AbortController();
      setState((previous) => startDashboardLoad(previous, period, contextChanged));
      const result = await getFinancialDashboard(query, controller.current.signal);
      if (ownedRequest !== requestId.current) return;
      setState(dashboardStateFromResult(period, result));
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
