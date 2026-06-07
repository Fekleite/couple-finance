import type { AuditSummaryKey } from "./audit-types";

const ALLOWED_STATUSES = new Set(["active", "completed", "archived"]);
const ALLOWED_SUMMARY_KEYS = new Set<AuditSummaryKey>([
  "transaction_created",
  "transaction_updated",
  "transaction_removed_from_main_flow",
  "goal_created",
  "goal_updated",
  "goal_completed",
  "goal_archived"
]);

export type SafeSnapshotInput = {
  label: string;
  amountCents?: number | null;
  date?: string | null;
  status?: string | null;
  summaryKey: AuditSummaryKey;
};

export function normalizeAuditLabel(label: string): string {
  return label.replace(/\s+/g, " ").trim().slice(0, 120);
}

export function createSafeAuditSnapshot(input: SafeSnapshotInput) {
  const label = normalizeAuditLabel(input.label);
  return {
    subjectLabel: label || "Item financeiro",
    subjectAmountCents: safeAmount(input.amountCents ?? null),
    subjectDate: input.date ?? null,
    subjectStatus: safeStatus(input.status ?? null),
    summaryKey: safeSummaryKey(input.summaryKey)
  };
}

function safeAmount(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null;
  return value >= 0 && value <= 99_999_999_999 ? Math.trunc(value) : null;
}

function safeStatus(value: string | null) {
  if (!value) return null;
  return ALLOWED_STATUSES.has(value) ? value : null;
}

function safeSummaryKey(value: AuditSummaryKey) {
  if (!ALLOWED_SUMMARY_KEYS.has(value)) throw new Error("invalid_audit_summary_key");
  return value;
}
