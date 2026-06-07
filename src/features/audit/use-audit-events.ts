import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { auditStateFromResult, blockedAuditState, startAuditLoad } from "./audit-state";
import type { AuditState } from "./audit-types";
import { listAuditEvents } from "./audit-service";
import { AUDIT_REFRESH_EVENT } from "./audit-refresh-signal";

export function useAuditEvents(userId: string | null | undefined, authorizationContext = "") {
  const [state, setState] = useState<AuditState>({ status: "loading", items: [] });
  const requestId = useRef(0);
  const previousContext = useRef("");
  const queryKey = useMemo(
    () => `${userId ?? "signed-out"}:${authorizationContext}`,
    [authorizationContext, userId]
  );

  const load = useCallback(
    async (contextChanged = false) => {
      if (!userId) {
        requestId.current += 1;
        setState(blockedAuditState());
        return;
      }
      const ownedRequest = ++requestId.current;
      setState((previous) => startAuditLoad(previous, contextChanged));
      const result = await listAuditEvents();
      if (ownedRequest !== requestId.current) return;
      setState(auditStateFromResult(result));
    },
    [userId]
  );

  useEffect(() => {
    const contextChanged = previousContext.current !== queryKey;
    previousContext.current = queryKey;
    void load(contextChanged);
  }, [load, queryKey]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleRefresh = () => void load(false);
    window.addEventListener(AUDIT_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(AUDIT_REFRESH_EVENT, handleRefresh);
  }, [load]);

  return {
    state,
    retry: () => void load(false),
    refresh: () => void load(false)
  };
}
