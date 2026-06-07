import type { AuthorizedAuditEvent, FinancialAuditEventRow } from "@/features/audit";

export function createAuditRow(
  overrides: Partial<FinancialAuditEventRow> = {}
): FinancialAuditEventRow {
  return {
    id: "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
    occurred_at: "2026-06-07T12:00:00.000Z",
    actor_user_id: "22222222-2222-4222-8222-222222222222",
    item_type: "transaction",
    item_id: "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
    action_type: "created",
    visibility: "individual",
    owner_user_id: "22222222-2222-4222-8222-222222222222",
    shared_budget_id: null,
    subject_label: "Mercado",
    subject_amount_cents: 12345,
    subject_date: "2026-06-07",
    subject_status: null,
    summary_key: "transaction_created",
    created_at: "2026-06-07T12:00:00.000Z",
    ...overrides
  };
}

export function createAuditEvent(
  overrides: Partial<AuthorizedAuditEvent> = {}
): AuthorizedAuditEvent {
  return {
    id: "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
    occurredAt: "2026-06-07T12:00:00.000Z",
    actorUserId: "22222222-2222-4222-8222-222222222222",
    itemType: "transaction",
    itemId: "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
    actionType: "created",
    visibility: "individual",
    ownerUserId: "22222222-2222-4222-8222-222222222222",
    sharedBudgetId: null,
    subjectLabel: "Mercado",
    subjectAmountCents: 12345,
    subjectDate: "2026-06-07",
    subjectStatus: null,
    summaryKey: "transaction_created",
    ...overrides
  };
}

export function createAuditQueryMock(rows: FinancialAuditEventRow[] = []) {
  const state = { rows, error: null as { message?: string } | null };
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => Promise.resolve({ data: state.rows, error: state.error }))
  };
  return { builder, state };
}
