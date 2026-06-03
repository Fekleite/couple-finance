import type { SafeMessageKey } from "@/features/permissions/permission-types";

export const PERMISSION_MESSAGES = {
  permissionUnavailable: "Esta informacao nao esta disponivel para voce.",
  permissionChecking: "Estamos verificando seu acesso antes de mostrar qualquer informacao.",
  permissionBlocked: "Nao foi possivel concluir esta acao com o acesso atual.",
  individualOnly: "Esta informacao fica visivel somente para voce.",
  sharedOnly: "Esta informacao pertence ao espaco compartilhado do casal.",
  safeEmptyState: "Nao encontramos dados disponiveis para exibir.",
  temporaryFailure: "Nao foi possivel verificar o acesso agora. Tente novamente em instantes."
} as const satisfies Record<SafeMessageKey, string>;

const TEMPORARY_FAILURE_MARKERS = ["network", "timeout", "fetch", "service", "temporar"];

export type PermissionFailureKind =
  | "rls_no_rows"
  | "rpc_unavailable"
  | "nonexistent_resource"
  | "removed_resource"
  | "unrelated_resource"
  | "service_failure"
  | "authorized_empty";

export function getPermissionMessage(key: SafeMessageKey): string {
  return PERMISSION_MESSAGES[key];
}

export function mapPermissionFailure(input: {
  kind?: PermissionFailureKind;
  message?: string | null;
}): SafeMessageKey {
  if (input.kind === "authorized_empty") {
    return "safeEmptyState";
  }

  if (input.kind === "service_failure" || looksTemporary(input.message)) {
    return "temporaryFailure";
  }

  return "permissionUnavailable";
}

function looksTemporary(message: string | null | undefined): boolean {
  const lower = message?.toLowerCase() ?? "";

  return TEMPORARY_FAILURE_MARKERS.some((marker) => lower.includes(marker));
}
