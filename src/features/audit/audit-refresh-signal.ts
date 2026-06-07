export const AUDIT_REFRESH_EVENT = "couple-finance:audit-refresh";

export function emitAuditRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUDIT_REFRESH_EVENT));
}
