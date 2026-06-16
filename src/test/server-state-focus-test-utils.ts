import { act } from "@testing-library/react";

export const SERVER_STATE_REMOTE_CONSUMERS = [
  "useTransactionList",
  "useDashboard",
  "useDashboardCharts",
  "useGoals",
  "useAuditEvents",
  "useCategories",
  "useCoupleRelationship"
] as const;

export const SERVER_STATE_FOCUS_EVENTS = ["focus", "visibilitychange", "pageshow"] as const;

export function dispatchFocusReturnEvents() {
  act(() => {
    window.dispatchEvent(new Event("focus"));
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pageshow"));
  });
}
