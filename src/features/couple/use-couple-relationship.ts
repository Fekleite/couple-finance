import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import {
  acceptInvitation,
  cancelInvitation,
  createSharedBudgetAndInvite,
  declineInvitation,
  getInvitation,
  getRelationshipState
} from "@/features/couple/couple-service";
import type { CreateInviteInput, InvitationDetail } from "@/features/couple/couple-types";
import {
  coupleMutationReducer,
  INITIAL_COUPLE_MUTATION_STATE,
  toActionResult
} from "@/features/couple/couple-actions";
import {
  errorRelationshipState,
  LOADING_RELATIONSHIP_STATE,
  type RelationshipState,
  unavailableRelationshipState
} from "@/features/couple/relationship-state";
import { useAuth } from "@/features/auth/use-auth";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";

export function useCoupleRelationship(invitationId?: string) {
  const { user, status } = useAuth();
  const [relationshipState, setRelationshipState] = useState<RelationshipState>(
    LOADING_RELATIONSHIP_STATE
  );
  const [invitation, setInvitation] = useState<InvitationDetail | null>(null);
  const [mutationState, dispatchMutation] = useReducer(
    coupleMutationReducer,
    INITIAL_COUPLE_MUTATION_STATE
  );

  const context = useMemo(() => (user ? { user } : null), [user]);

  const refresh = useCallback(async () => {
    if (status !== "authenticated" || !context) {
      setRelationshipState(LOADING_RELATIONSHIP_STATE);
      return;
    }

    const result = await getRelationshipState(context);
    setRelationshipState(result.ok ? result.data : errorRelationshipState(result.message));
  }, [context, status]);

  const refreshInvitation = useCallback(async () => {
    if (!invitationId || status !== "authenticated" || !context) {
      return;
    }

    const result = await getInvitation(context, invitationId);

    if (result.ok) {
      setInvitation(result.data);
      return;
    }

    setInvitation(null);
    setRelationshipState(unavailableRelationshipState(toUnavailableReason(result.reason)));
  }, [context, invitationId, status]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  useEffect(() => {
    void Promise.resolve().then(refreshInvitation);
  }, [refreshInvitation]);

  const createInvite = useCallback(
    async (input: CreateInviteInput) => {
      if (!context) {
        return toActionResult({
          ok: false,
          reason: "temporary_failure",
          message: "Acesso invalido."
        });
      }

      dispatchMutation({ type: "start", message: "Criando convite..." });
      const result = await createSharedBudgetAndInvite(context, input);
      const action = toActionResult(result);
      dispatchMutation({
        type: action.ok ? "success" : "error",
        message: action.message
      });
      await refresh();
      return action;
    },
    [context, refresh]
  );

  const accept = useCallback(async () => {
    if (!context || !invitationId) {
      return;
    }
    dispatchMutation({ type: "start", message: "Aceitando convite..." });
    const result = await acceptInvitation(context, invitationId);
    dispatchMutation({
      type: result.ok ? "success" : "unavailable",
      message: result.message ?? COUPLE_MESSAGES.inviteAccepted
    });
    await refresh();
    await refreshInvitation();
  }, [context, invitationId, refresh, refreshInvitation]);

  const decline = useCallback(async () => {
    if (!context || !invitationId) {
      return;
    }
    dispatchMutation({ type: "start", message: "Recusando convite..." });
    const result = await declineInvitation(context, invitationId);
    dispatchMutation({
      type: result.ok ? "success" : "unavailable",
      message: result.message ?? COUPLE_MESSAGES.inviteDeclined
    });
    await refresh();
    await refreshInvitation();
  }, [context, invitationId, refresh, refreshInvitation]);

  const cancel = useCallback(
    async (sentInvitationId: string) => {
      if (!context) {
        return;
      }
      dispatchMutation({ type: "start", message: "Cancelando convite..." });
      const result = await cancelInvitation(context, sentInvitationId);
      dispatchMutation({
        type: result.ok ? "success" : "unavailable",
        message: result.message ?? COUPLE_MESSAGES.inviteCancelled
      });
      await refresh();
    },
    [context, refresh]
  );

  return {
    relationshipState,
    invitation,
    mutationState,
    refresh,
    createInvite,
    accept,
    decline,
    cancel
  };
}

function toUnavailableReason(reason: string) {
  switch (reason) {
    case "not_found":
    case "expired":
    case "cancelled":
    case "declined":
    case "accepted":
    case "unauthorized":
    case "already_linked":
    case "service_error":
      return reason;
    default:
      return "service_error";
  }
}
