export const DASHBOARD_MESSAGES = {
  loadingTitle: "Carregando dashboard",
  loading: "Buscando somente movimentacoes disponiveis para voce.",
  refreshing: "Atualizando o mes selecionado.",
  updated: "Dashboard atualizado.",
  emptyTitle: "Sem movimentacoes neste mes",
  empty:
    "Nenhuma movimentacao disponivel foi encontrada para este mes. Os indicadores permanecem zerados.",
  errorTitle: "Nao foi possivel carregar o dashboard",
  error: "Nao foi possivel atualizar os indicadores agora. Tente novamente.",
  invalidQuery: "Nao foi possivel usar o mes informado.",
  retry: "Tentar novamente",
  selectedPeriod: "Periodo selecionado",
  previousMonth: "Mes anterior",
  nextMonth: "Proximo mes",
  currentMonth: "Mes atual",
  summaryRegion: "Resumo financeiro do mes",
  recentRegion: "Ultimas transacoes autorizadas",
  recentEmptyTitle: "Sem transacoes recentes",
  recentEmpty: "Quando houver movimentacoes disponiveis neste mes, elas aparecerao aqui.",
  fullList: "Ver lista completa",
  incomeLabel: "Receitas do mes",
  expenseLabel: "Despesas do mes",
  balanceLabel: "Saldo do mes",
  resultLabel: "Economia do mes",
  incomeDescription: "Total de receitas autorizadas no periodo.",
  expenseDescription: "Total de despesas autorizadas no periodo.",
  balanceDescription: "Receitas menos despesas autorizadas no periodo.",
  positiveResult: "Resultado positivo: houve sobra no mes.",
  negativeResult: "Resultado negativo: houve deficit no mes.",
  zeroResult: "Resultado equilibrado: receitas e despesas ficaram em zero ou se compensaram."
} as const;

export function resultMeaningMessage(meaning: "positive" | "negative" | "zero"): string {
  if (meaning === "positive") return DASHBOARD_MESSAGES.positiveResult;
  if (meaning === "negative") return DASHBOARD_MESSAGES.negativeResult;
  return DASHBOARD_MESSAGES.zeroResult;
}
