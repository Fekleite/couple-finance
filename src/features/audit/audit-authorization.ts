import type { AuthorizedAuditEvent } from "./audit-types";

export function actorLabel(event: AuthorizedAuditEvent, currentUserId: string | null | undefined) {
  if (event.actorUserId && event.actorUserId === currentUserId) return "Voce";
  if (event.visibility === "shared" && event.actorUserId) return "Pessoa parceira";
  return "Autoria indisponivel";
}

export function visibilityLabel(visibility: AuthorizedAuditEvent["visibility"]) {
  return visibility === "shared" ? "Compartilhado" : "Individual";
}

export function canShowSharedContext(hasActiveSharedBudget: boolean) {
  return hasActiveSharedBudget;
}
