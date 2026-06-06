export const DASHBOARD_CHART_MESSAGES = {
  sectionTitle: "Graficos do mes",
  sectionDescription: "Visualizacoes basicas com dados autorizados para o periodo selecionado.",
  loadingTitle: "Carregando graficos",
  loading: "Buscando agregados autorizados para os graficos.",
  refreshing: "Atualizando os graficos do mes selecionado.",
  updated: "Graficos atualizados.",
  errorTitle: "Nao foi possivel carregar os graficos",
  error: "Nao foi possivel atualizar os graficos agora. Tente novamente.",
  invalidQuery: "Nao foi possivel usar o mes informado para os graficos.",
  retry: "Tentar novamente",
  categoryTitle: "Despesas por categoria",
  categoryEmptyTitle: "Sem despesas por categoria",
  categoryEmpty: "Nenhuma despesa autorizada foi encontrada neste mes. O grafico permanece vazio.",
  categoryPrivacy: "A distribuicao usa somente despesas disponiveis para voce.",
  categoryHighestPrefix: "Maior categoria",
  evolutionTitle: "Evolucao recente",
  evolutionEmpty: "Sem movimentacoes autorizadas neste mes.",
  evolutionSelected: "Mes selecionado",
  incomeLabel: "Receitas",
  expenseLabel: "Despesas",
  balanceLabel: "Saldo",
  memberTitle: "Responsabilidades compartilhadas",
  memberEmptyTitle: "Sem despesas compartilhadas no mes",
  memberEmpty:
    "Quando houver despesas compartilhadas autorizadas, a divisao por responsavel aparecera aqui.",
  memberUnavailableTitle: "Comparativo compartilhado indisponivel",
  memberUnavailable:
    "Crie ou aceite um espaco compartilhado ativo para ver responsabilidades compartilhadas.",
  memberPrivacy:
    "O comparativo usa somente despesas compartilhadas autorizadas e nao inclui dados individuais da pessoa parceira.",
  responsibleBasis: "Base: pessoa responsavel pela despesa compartilhada.",
  creatorResponsibleNote:
    "Responsabilidade e autoria podem ser diferentes em despesas compartilhadas."
} as const;

export function chartResultMeaningMessage(meaning: "positive" | "negative" | "zero"): string {
  if (meaning === "positive") return "saldo positivo";
  if (meaning === "negative") return "saldo negativo";
  return "saldo zerado";
}

export function formatBasisPoints(value: number): string {
  return `${(value / 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}
