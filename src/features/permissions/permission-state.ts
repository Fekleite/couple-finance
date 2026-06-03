import type { RelationshipState } from "@/features/couple/relationship-state";
import type { PermissionState } from "@/features/permissions/permission-types";

export function mapRelationshipToPermissionState(
  relationshipState: RelationshipState
): PermissionState {
  switch (relationshipState.status) {
    case "loading":
      return "unauthenticated";
    case "no_shared_budget":
      return "no_couple_link";
    case "invitation_sent":
      return "sent_pending_invitation";
    case "invitation_received":
      return "received_pending_invitation";
    case "couple_linked":
      return "active_couple_link";
    case "invitation_unavailable":
      return "unavailable_invitation";
    case "error":
      return "ended_or_inactive_couple_link";
    default:
      return assertNever(relationshipState);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled relationship state: ${JSON.stringify(value)}`);
}
