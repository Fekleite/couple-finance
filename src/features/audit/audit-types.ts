export type AuditItemType = "transaction" | "goal";
export type AuditVisibility = "individual" | "shared";
export type AuditActionType =
  | "created"
  | "updated"
  | "completed"
  | "archived"
  | "removed_from_main_flow";
export type AuditSummaryKey =
  | "transaction_created"
  | "transaction_updated"
  | "transaction_removed_from_main_flow"
  | "goal_created"
  | "goal_updated"
  | "goal_completed"
  | "goal_archived";

export type FinancialAuditEventRow = {
  id: string;
  occurred_at: string;
  actor_user_id: string | null;
  item_type: AuditItemType;
  item_id: string;
  action_type: AuditActionType;
  visibility: AuditVisibility;
  owner_user_id: string | null;
  shared_budget_id: string | null;
  subject_label: string;
  subject_amount_cents: number | string | null;
  subject_date: string | null;
  subject_status: string | null;
  summary_key: AuditSummaryKey;
  created_at: string;
};

export type AuthorizedAuditEvent = {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  itemType: AuditItemType;
  itemId: string;
  actionType: AuditActionType;
  visibility: AuditVisibility;
  ownerUserId: string | null;
  sharedBudgetId: string | null;
  subjectLabel: string;
  subjectAmountCents: number | null;
  subjectDate: string | null;
  subjectStatus: string | null;
  summaryKey: AuditSummaryKey;
};

export type AuditQuery = {
  limit?: number;
  itemType?: AuditItemType | "all";
  visibility?: AuditVisibility | "all";
};

export type AuthorizedAuditResult = {
  items: AuthorizedAuditEvent[];
  hasActiveSharedBudget: boolean;
  activeSharedBudgetId: string | null;
  generatedAt: string;
};

export type AuditServiceResult =
  | { ok: true; data: AuthorizedAuditResult }
  | { ok: false; reason: "blocked" | "temporary_failure"; message: string };

export type AuditState =
  | { status: "loading"; items: [] }
  | {
      status: "ready";
      items: AuthorizedAuditEvent[];
      generatedAt: string;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
    }
  | {
      status: "empty";
      items: [];
      generatedAt: string;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
    }
  | {
      status: "refreshing";
      items: AuthorizedAuditEvent[];
      generatedAt: string;
      hasActiveSharedBudget: boolean;
      activeSharedBudgetId: string | null;
    }
  | { status: "error"; items: []; message: string }
  | { status: "blocked"; items: []; message: string };
