export const COUPLE_MESSAGES = {
  loadingRelationship: "Estamos verificando seu estado de vinculo com seguranca.",
  loadingInvitation: "Estamos verificando se este convite pode ser aberto.",
  creatingInvite: "Criando o espaco e registrando o convite...",
  acceptingInvite: "Aceitando o convite...",
  decliningInvite: "Recusando o convite...",
  cancellingInvite: "Cancelando o convite...",
  inviteCreated: "Espaco compartilhado criado e convite registrado. Agora e so aguardar o aceite.",
  inviteAccepted: "Convite aceito. Voces agora compartilham o mesmo espaco financeiro.",
  inviteDeclined: "Convite recusado. Nenhum vinculo foi criado.",
  inviteCancelled: "Convite cancelado. Ele nao podera mais ser aceito.",
  emailRequired: "Informe o e-mail da pessoa parceira.",
  emailInvalid: "Informe um e-mail valido.",
  ownEmailBlocked: "Use o e-mail da outra pessoa. Voce nao pode convidar a si mesmo.",
  alreadyLinked: "No MVP, cada pessoa pode participar de apenas um espaco compartilhado ativo.",
  unavailable:
    "Este convite nao esta disponivel. Ele pode ter expirado, ja ter sido respondido ou nao pertencer ao seu acesso.",
  retryableFailure: "Nao foi possivel concluir agora. Tente novamente em instantes.",
  noSharedBudgetTitle: "Crie o espaco do casal",
  noSharedBudgetMessage:
    "Convide sua pessoa parceira para iniciar um espaco compartilhado vazio e seguro.",
  sentTitle: "Convite enviado",
  receivedTitle: "Convite recebido",
  linkedTitle: "Espaco compartilhado ativo",
  linkedMessage:
    "O vinculo do casal esta pronto. As proximas features poderao usar este contexto compartilhado.",
  unavailableTitle: "Convite indisponivel",
  errorTitle: "Nao foi possivel carregar o vinculo"
} as const;

const FORBIDDEN_USER_MESSAGE_PARTS = [
  "supabase",
  "select",
  "insert",
  "update",
  "delete",
  "policy",
  "rls",
  "service_role",
  "transaction",
  "balance",
  "dashboard"
];

export function sanitizeCoupleMessage(message: string | null | undefined): string {
  if (!message) {
    return COUPLE_MESSAGES.retryableFailure;
  }

  const lower = message.toLowerCase();

  if (FORBIDDEN_USER_MESSAGE_PARTS.some((part) => lower.includes(part))) {
    return COUPLE_MESSAGES.retryableFailure;
  }

  return message;
}
