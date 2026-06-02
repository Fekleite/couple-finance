import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import type { CoupleActionResult, CoupleServiceResult } from "@/features/couple/couple-types";

export type CoupleMutationState = {
  status: "idle" | "loading" | "success" | "error" | "unavailable";
  message: string | null;
};

export const INITIAL_COUPLE_MUTATION_STATE: CoupleMutationState = {
  status: "idle",
  message: null
};

export type CoupleMutationEvent =
  | { type: "start"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | { type: "unavailable"; message: string }
  | { type: "reset" };

export function coupleMutationReducer(
  state: CoupleMutationState,
  event: CoupleMutationEvent
): CoupleMutationState {
  switch (event.type) {
    case "start":
      return { status: "loading", message: event.message };
    case "success":
      return { status: "success", message: event.message };
    case "error":
      return { status: "error", message: event.message };
    case "unavailable":
      return { status: "unavailable", message: event.message };
    case "reset":
      return INITIAL_COUPLE_MUTATION_STATE;
    default:
      return state;
  }
}

export function toActionResult<T>(result: CoupleServiceResult<T>): CoupleActionResult {
  if (result.ok) {
    return { ok: true, message: result.message ?? "Acao concluida." };
  }

  return {
    ok: false,
    message: result.message,
    reason: result.reason
  };
}

export const COUPLE_ACTION_LOADING_MESSAGES = {
  create: COUPLE_MESSAGES.creatingInvite,
  accept: COUPLE_MESSAGES.acceptingInvite,
  decline: COUPLE_MESSAGES.decliningInvite,
  cancel: COUPLE_MESSAGES.cancellingInvite
} as const;
