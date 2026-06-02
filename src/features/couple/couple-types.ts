import type { AuthUser } from "@/features/auth/auth-types";

export const INVITATION_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
  "expired"
] as const;

export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export const MEMBER_ROLES = ["creator", "partner"] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export type SharedBudgetSummary = {
  id: string;
  name: string;
  memberCount: number;
  currentUserRole: MemberRole;
};

export type SentInvitationSummary = {
  id: string;
  inviteeEmail: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
};

export type ReceivedInvitationSummary = {
  id: string;
  inviterLabel: string;
  sharedBudgetName: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
};

export type UnavailableReason =
  | "not_found"
  | "expired"
  | "cancelled"
  | "declined"
  | "accepted"
  | "unauthorized"
  | "already_linked"
  | "service_error";

export type CoupleServiceResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; reason: UnavailableReason | "validation" | "temporary_failure"; message: string };

export type CoupleActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; reason?: string };

export type CoupleOperationContext = {
  user: AuthUser;
};

export type CreateInviteInput = {
  inviteeEmail: string;
};

export type InvitationDetail = {
  id: string;
  inviterLabel: string;
  inviteeEmail: string;
  sharedBudgetName: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  currentUserRole: "inviter" | "invitee";
};

export type RawRelationshipData = {
  activeMembership?: {
    sharedBudget: SharedBudgetSummary;
    pendingInvitation?: SentInvitationSummary;
  };
  receivedInvitation?: ReceivedInvitationSummary;
};
