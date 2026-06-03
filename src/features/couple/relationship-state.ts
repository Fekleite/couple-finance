import type {
  RawRelationshipData,
  ReceivedInvitationSummary,
  SentInvitationSummary,
  SharedBudgetSummary,
  UnavailableReason
} from "@/features/couple/couple-types";

export type RelationshipState =
  | { status: "loading" }
  | { status: "no_shared_budget" }
  | { status: "invitation_sent"; invitation: SentInvitationSummary }
  | { status: "invitation_received"; invitation: ReceivedInvitationSummary }
  | { status: "couple_linked"; sharedBudget: SharedBudgetSummary }
  | { status: "invitation_unavailable"; reason: UnavailableReason }
  | { status: "error"; message: string };

export const LOADING_RELATIONSHIP_STATE: RelationshipState = { status: "loading" };

export function resolveRelationshipState(data: RawRelationshipData): RelationshipState {
  const activeMembership = data.activeMembership;

  if (activeMembership && activeMembership.sharedBudget.memberCount >= 2) {
    return { status: "couple_linked", sharedBudget: activeMembership.sharedBudget };
  }

  if (activeMembership?.pendingInvitation) {
    return {
      status: "invitation_sent",
      invitation: activeMembership.pendingInvitation
    };
  }

  if (data.receivedInvitation) {
    return {
      status: "invitation_received",
      invitation: data.receivedInvitation
    };
  }

  return { status: "no_shared_budget" };
}

export function unavailableRelationshipState(reason: UnavailableReason): RelationshipState {
  return { status: "invitation_unavailable", reason };
}

export function errorRelationshipState(message: string): RelationshipState {
  return { status: "error", message };
}
