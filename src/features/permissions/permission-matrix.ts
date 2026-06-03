import type {
  DataScope,
  DataType,
  PermissionAction,
  PermissionDecision,
  PermissionState
} from "@/features/permissions/permission-types";
import { classifyVisibility } from "@/features/permissions/visibility-scope";

const INVITATION_ACTIONS: readonly PermissionAction[] = ["view", "list", "update", "delete"];

export function canPerformPermissionAction(input: {
  state: PermissionState;
  dataScope: DataScope;
  dataType: DataType;
  action: PermissionAction;
  isOwner?: boolean;
  isActiveMember?: boolean;
  isInviter?: boolean;
  isInvitee?: boolean;
}): boolean {
  if (input.state === "unauthenticated" || input.dataScope === "inaccessible") {
    return false;
  }

  if (input.dataScope === "individual") {
    return input.isOwner === true;
  }

  if (input.dataType === "invitation") {
    return canAccessInvitation(input);
  }

  if (input.dataScope === "shared") {
    return input.state === "active_couple_link" && input.isActiveMember === true;
  }

  return false;
}

export function getPermissionDecision(input: {
  state: PermissionState;
  dataScope: DataScope;
  dataType: DataType;
  action: PermissionAction;
  isOwner?: boolean;
  isActiveMember?: boolean;
  isInviter?: boolean;
  isInvitee?: boolean;
}): PermissionDecision {
  const allowed = canPerformPermissionAction(input);

  if (!allowed) {
    return { allowed: false, scope: "inaccessible", messageKey: "permissionBlocked" };
  }

  const scope = classifyVisibility(input);

  return {
    allowed: true,
    scope: scope === "shared" ? "shared" : "individual"
  };
}

function canAccessInvitation(input: {
  state: PermissionState;
  action: PermissionAction;
  isInviter?: boolean;
  isInvitee?: boolean;
  isActiveMember?: boolean;
}): boolean {
  if (!INVITATION_ACTIONS.includes(input.action)) {
    return false;
  }

  if (input.state === "sent_pending_invitation") {
    return input.isInviter === true && ["view", "list", "delete"].includes(input.action);
  }

  if (input.state === "received_pending_invitation") {
    return input.isInvitee === true && ["view", "update"].includes(input.action);
  }

  if (input.state === "active_couple_link") {
    return input.isInviter === true || input.isInvitee === true || input.isActiveMember === true;
  }

  return false;
}
