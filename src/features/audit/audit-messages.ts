import type { AuditActionType, AuditItemType, AuditVisibility } from "./audit-types";

export const AUDIT_MESSAGES = {
  title: "Auditoria financeira",
  subtitle: "Alteracoes recentes em transacoes e metas acessiveis.",
  loadingTitle: "Auditoria financeira",
  loading: "Carregando alteracoes recentes.",
  emptyTitle: "Auditoria sem registros recentes",
  empty: "Nenhuma alteracao financeira autorizada aparece por enquanto.",
  errorTitle: "Nao foi possivel carregar a auditoria",
  error: "Nao foi possivel carregar as alteracoes agora. Tente novamente.",
  blockedTitle: "Acesso necessario",
  blocked: "Entre novamente para consultar as alteracoes autorizadas.",
  retry: "Tentar novamente",
  sharedUnavailable: "Eventos compartilhados aparecem apenas enquanto o vinculo estiver ativo."
} as const;

export function auditActionLabel(action: AuditActionType) {
  const labels: Record<AuditActionType, string> = {
    created: "criou",
    updated: "atualizou",
    completed: "concluiu",
    archived: "arquivou",
    removed_from_main_flow: "removeu do fluxo principal"
  };
  return labels[action];
}

export function auditItemLabel(itemType: AuditItemType) {
  return itemType === "goal" ? "meta" : "transacao";
}

export function auditVisibilityLabel(visibility: AuditVisibility) {
  return visibility === "shared" ? "Compartilhado" : "Individual";
}

export function formatAuditCurrency(amountCents: number | null) {
  if (amountCents === null) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    amountCents / 100
  );
}

export function formatAuditDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatAuditCivilDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00.000Z`)
  );
}
