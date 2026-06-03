import type {
  DataScope,
  DataType,
  PermissionAction,
  PermissionState
} from "@/features/permissions/permission-types";

export const permissionUsers = {
  ana: { id: "user-ana", email: "ana@example.com" },
  bia: { id: "user-bia", email: "bia@example.com" },
  caio: { id: "user-caio", email: "caio@example.com" }
} as const;

export const permissionSharedBudget = {
  id: "budget-ab",
  name: "Espaco compartilhado",
  memberIds: [permissionUsers.ana.id, permissionUsers.bia.id]
} as const;

export const permissionInvitation = {
  id: "invite-ab",
  inviterUserId: permissionUsers.ana.id,
  inviteeEmail: permissionUsers.bia.email,
  status: "pending"
} as const;

export function permissionInput(
  overrides: Partial<{
    state: PermissionState;
    dataScope: DataScope;
    dataType: DataType;
    action: PermissionAction;
    isOwner: boolean;
    isActiveMember: boolean;
    isInviter: boolean;
    isInvitee: boolean;
  }> = {}
) {
  return {
    state: "no_couple_link" as PermissionState,
    dataScope: "individual" as DataScope,
    dataType: "individual_record" as DataType,
    action: "view" as PermissionAction,
    isOwner: true,
    isActiveMember: false,
    isInviter: false,
    isInvitee: false,
    ...overrides
  };
}
