import type { TransactionSubmission } from "./transaction-types";

export type SubmissionAttempt = {
  key: string;
  attemptedPayload: string | null;
  inFlight: boolean;
};

export function createAttempt(): SubmissionAttempt {
  return { key: crypto.randomUUID(), attemptedPayload: null, inFlight: false };
}

export function canonicalPayload(submission: TransactionSubmission): string {
  return JSON.stringify(
    Object.fromEntries(Object.entries(submission).filter(([key]) => key !== "idempotencyKey"))
  );
}

export function prepareAttempt(
  attempt: SubmissionAttempt,
  submission: TransactionSubmission
): SubmissionAttempt {
  const payload = canonicalPayload(submission);
  if (attempt.inFlight) return attempt;
  if (attempt.attemptedPayload && attempt.attemptedPayload !== payload) {
    return { key: crypto.randomUUID(), attemptedPayload: payload, inFlight: true };
  }
  return { ...attempt, attemptedPayload: payload, inFlight: true };
}

export function finishAttempt(attempt: SubmissionAttempt): SubmissionAttempt {
  return { ...attempt, inFlight: false };
}
