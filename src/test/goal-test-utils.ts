import type { AuthorizedGoal, FinancialGoalRow } from "@/features/goals";

export function createGoalRow(overrides: Partial<FinancialGoalRow> = {}): FinancialGoalRow {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Reserva de emergencia",
    target_amount_cents: 100000,
    current_amount_cents: 25000,
    deadline_date: "2026-12-31",
    visibility: "individual",
    status: "active",
    created_by_user_id: "22222222-2222-4222-8222-222222222222",
    shared_budget_id: null,
    completed_at: null,
    archived_at: null,
    created_at: "2026-06-06T12:00:00.000Z",
    updated_at: "2026-06-06T12:00:00.000Z",
    ...overrides
  };
}

export function createGoal(overrides: Partial<AuthorizedGoal> = {}): AuthorizedGoal {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Reserva de emergencia",
    targetAmountCents: 100000,
    currentAmountCents: 25000,
    deadlineDate: "2026-12-31",
    visibility: "individual",
    status: "active",
    createdByUserId: "22222222-2222-4222-8222-222222222222",
    sharedBudgetId: null,
    completedAt: null,
    archivedAt: null,
    createdAt: "2026-06-06T12:00:00.000Z",
    updatedAt: "2026-06-06T12:00:00.000Z",
    ...overrides
  };
}
