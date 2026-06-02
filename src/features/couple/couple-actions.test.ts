import { describe, expect, it } from "vitest";

import {
  coupleMutationReducer,
  INITIAL_COUPLE_MUTATION_STATE,
  toActionResult
} from "@/features/couple/couple-actions";
import { COUPLE_MESSAGES, sanitizeCoupleMessage } from "@/features/couple/couple-messages";

describe("couple actions", () => {
  it("tracks loading, success, error and reset states", () => {
    const loading = coupleMutationReducer(INITIAL_COUPLE_MUTATION_STATE, {
      type: "start",
      message: COUPLE_MESSAGES.creatingInvite
    });
    expect(loading).toEqual({ status: "loading", message: COUPLE_MESSAGES.creatingInvite });

    const success = coupleMutationReducer(loading, {
      type: "success",
      message: COUPLE_MESSAGES.inviteCreated
    });
    expect(success.status).toBe("success");

    const error = coupleMutationReducer(success, {
      type: "error",
      message: COUPLE_MESSAGES.retryableFailure
    });
    expect(error.status).toBe("error");

    expect(coupleMutationReducer(error, { type: "reset" })).toEqual(INITIAL_COUPLE_MUTATION_STATE);
  });

  it("maps service result to action result", () => {
    expect(toActionResult({ ok: true, data: "ok", message: "Feito" })).toEqual({
      ok: true,
      message: "Feito"
    });
    expect(
      toActionResult({ ok: false, reason: "temporary_failure", message: "Tente novamente" })
    ).toEqual({
      ok: false,
      reason: "temporary_failure",
      message: "Tente novamente"
    });
  });

  it("sanitizes raw provider and data messages", () => {
    expect(sanitizeCoupleMessage("Supabase update policy failed")).toBe(
      COUPLE_MESSAGES.retryableFailure
    );
  });
});
