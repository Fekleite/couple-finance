export type GoalVisibility = "individual" | "shared";
export type GoalStatus = "active" | "completed" | "archived";
export type GoalStatusFilter = GoalStatus | "all";
export type GoalAchievement = "in_progress" | "reached" | "exceeded";
export type GoalDeadlineState = "none" | "future" | "today" | "overdue" | "completed";

export type FinancialGoalRow = {
  id: string;
  name: string;
  target_amount_cents: number | string;
  current_amount_cents: number | string;
  deadline_date: string | null;
  visibility: GoalVisibility;
  status: GoalStatus;
  created_by_user_id: string;
  shared_budget_id: string | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthorizedGoal = {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  deadlineDate: string | null;
  visibility: GoalVisibility;
  status: GoalStatus;
  createdByUserId: string;
  sharedBudgetId: string | null;
  completedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GoalMutation = {
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  deadlineDate: string | null;
  visibility: GoalVisibility;
  sharedBudgetId: string | null;
};

export type GoalUpdateMutation = Omit<GoalMutation, "visibility" | "sharedBudgetId">;

export type GoalQuery = {
  status?: GoalStatusFilter;
  visibility?: GoalVisibility | "all";
  limit?: number;
};

export type GoalListResult = {
  items: AuthorizedGoal[];
  hasActiveSharedBudget: boolean;
  activeSharedBudgetId: string | null;
  generatedAt: string;
};

export type GoalServiceFailureReason =
  | "validation"
  | "goal_unavailable"
  | "shared_context_unavailable"
  | "temporary_failure";

export type GoalServiceResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; reason: GoalServiceFailureReason; message: string };

export type GoalProgress = {
  percent: number;
  displayPercent: number;
  barPercent: number;
  remainingAmountCents: number;
  exceededAmountCents: number;
  achievement: GoalAchievement;
};

export type GoalFormValues = {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadlineDate: string;
  visibility: GoalVisibility;
};
