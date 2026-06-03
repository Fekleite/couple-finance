export const PERMISSION_STATES = [
  "unauthenticated",
  "no_couple_link",
  "sent_pending_invitation",
  "received_pending_invitation",
  "active_couple_link",
  "unavailable_invitation",
  "ended_or_inactive_couple_link",
  "unrelated_authenticated_user"
] as const;

export type PermissionState = (typeof PERMISSION_STATES)[number];

export const DATA_SCOPES = ["individual", "shared", "inaccessible"] as const;

export type DataScope = (typeof DATA_SCOPES)[number];

export const DATA_TYPES = [
  "individual_record",
  "shared_budget",
  "budget_member",
  "invitation",
  "future_category",
  "future_transaction",
  "future_goal",
  "future_balance",
  "future_chart",
  "future_audit_entry"
] as const;

export type DataType = (typeof DATA_TYPES)[number];

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "list",
  "search",
  "count",
  "summarize"
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const VISIBILITY_SCOPES = [
  "individual",
  "shared",
  "inaccessible",
  "unknown_loading"
] as const;

export type VisibilityScope = (typeof VISIBILITY_SCOPES)[number];

export const SAFE_MESSAGE_KEYS = [
  "permissionUnavailable",
  "permissionChecking",
  "permissionBlocked",
  "individualOnly",
  "sharedOnly",
  "safeEmptyState",
  "temporaryFailure"
] as const;

export type SafeMessageKey = (typeof SAFE_MESSAGE_KEYS)[number];

export type PermissionDecision =
  | { allowed: true; scope: Exclude<VisibilityScope, "inaccessible" | "unknown_loading"> }
  | { allowed: false; scope: "inaccessible"; messageKey: SafeMessageKey };
