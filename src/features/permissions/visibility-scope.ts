import type {
  DataScope,
  PermissionState,
  VisibilityScope
} from "@/features/permissions/permission-types";

export type VisibilityLabelInfo = {
  scope: VisibilityScope;
  label: string;
  description: string;
};

export const VISIBILITY_LABELS = {
  individual: {
    scope: "individual",
    label: "So voce",
    description: "Esta informacao fica visivel somente para voce."
  },
  shared: {
    scope: "shared",
    label: "Espaco compartilhado",
    description: "Esta informacao pertence ao espaco compartilhado do casal."
  },
  inaccessible: {
    scope: "inaccessible",
    label: "Indisponivel",
    description: "Esta informacao nao esta disponivel para voce."
  },
  unknown_loading: {
    scope: "unknown_loading",
    label: "Verificando acesso",
    description: "Estamos verificando seu acesso antes de mostrar qualquer informacao."
  }
} as const satisfies Record<VisibilityScope, VisibilityLabelInfo>;

export function classifyVisibility(input: {
  state: PermissionState;
  dataScope?: DataScope;
  isOwner?: boolean;
  isActiveMember?: boolean;
}): VisibilityScope {
  if (input.state === "unauthenticated") {
    return "unknown_loading";
  }

  if (input.dataScope === "individual" && input.isOwner) {
    return "individual";
  }

  if (
    input.dataScope === "shared" &&
    input.state === "active_couple_link" &&
    input.isActiveMember
  ) {
    return "shared";
  }

  if (input.dataScope === "inaccessible") {
    return "inaccessible";
  }

  return "inaccessible";
}

export function getVisibilityLabel(scope: VisibilityScope): VisibilityLabelInfo {
  return VISIBILITY_LABELS[scope];
}
