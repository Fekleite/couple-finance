import {
  formatCurrencyFromCents,
  formatCivilDate
} from "@/features/transactions/transaction-money";
import type {
  AuthorizedGoal,
  GoalDeadlineState,
  GoalProgress,
  GoalServiceFailureReason
} from "./goal-types";

export const GOAL_MESSAGES = {
  loadingTitle: "Carregando metas",
  loading: "Buscando somente metas disponiveis para voce.",
  emptyTitle: "Nenhuma meta neste filtro",
  empty: "Crie uma meta para acompanhar um objetivo financeiro com clareza.",
  sharedBlocked:
    "Metas compartilhadas ficam disponiveis quando existe um espaco compartilhado ativo.",
  errorTitle: "Nao foi possivel carregar metas",
  retry: "Tentar novamente",
  createSuccess: "Meta criada com sucesso.",
  updateSuccess: "Meta atualizada com sucesso.",
  completeSuccess: "Meta concluida com sucesso.",
  archiveSuccess: "Meta arquivada com sucesso.",
  validation: "Revise os dados da meta e tente novamente.",
  goalUnavailable: "Esta meta nao esta disponivel para esta acao.",
  sharedContextUnavailable: "O espaco compartilhado nao esta disponivel para esta acao.",
  temporaryFailure: "Nao foi possivel concluir agora. Tente novamente em instantes.",
  visibilityIndividual: "Meta individual: apenas voce acessa.",
  visibilityShared: "Meta compartilhada: membros ativos do espaco acessam.",
  active: "Em acompanhamento",
  completed: "Concluida",
  archived: "Arquivada"
} as const;

export function goalFailureMessage(reason: GoalServiceFailureReason): string {
  return {
    validation: GOAL_MESSAGES.validation,
    goal_unavailable: GOAL_MESSAGES.goalUnavailable,
    shared_context_unavailable: GOAL_MESSAGES.sharedContextUnavailable,
    temporary_failure: GOAL_MESSAGES.temporaryFailure
  }[reason];
}

export function visibilityLabel(visibility: AuthorizedGoal["visibility"]): string {
  return visibility === "shared" ? "Compartilhada" : "Individual";
}

export function statusLabel(status: AuthorizedGoal["status"]): string {
  return {
    active: GOAL_MESSAGES.active,
    completed: GOAL_MESSAGES.completed,
    archived: GOAL_MESSAGES.archived
  }[status];
}

export function progressSummary(goal: AuthorizedGoal, progress: GoalProgress): string {
  if (progress.achievement === "exceeded") {
    return `${progress.displayPercent}% alcancado, ${formatCurrencyFromCents(
      progress.exceededAmountCents
    )} acima do alvo.`;
  }
  if (progress.achievement === "reached") {
    return `${progress.displayPercent}% alcancado, alvo atingido.`;
  }
  return `${progress.displayPercent}% alcancado, faltam ${formatCurrencyFromCents(
    progress.remainingAmountCents
  )}.`;
}

export function deadlineMessage(state: GoalDeadlineState, deadlineDate: string | null): string {
  if (state === "completed") return "Meta concluida.";
  if (state === "none" || !deadlineDate) return "Sem prazo definido.";
  if (state === "today") return "Prazo hoje.";
  if (state === "overdue") return `Prazo em ${formatCivilDate(deadlineDate)}.`;
  return `Prazo em ${formatCivilDate(deadlineDate)}.`;
}
