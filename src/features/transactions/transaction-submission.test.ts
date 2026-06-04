import { beforeEach, describe, expect, it, vi } from "vitest";

import { transactionSubmission } from "@/test/transaction-test-utils";
import {
  canonicalPayload,
  createAttempt,
  finishAttempt,
  prepareAttempt
} from "./transaction-submission";

describe("transaction submission attempts", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValueOnce("key-a").mockReturnValue("key-b")
    });
  });

  it("suppresses in-flight repeats, keeps same-payload retry, and renews changed payload", () => {
    const attempt = createAttempt();
    const first = prepareAttempt(attempt, transactionSubmission());
    expect(prepareAttempt(first, transactionSubmission())).toBe(first);
    const retry = prepareAttempt(finishAttempt(first), transactionSubmission());
    expect(retry.key).toBe("key-a");
    const changed = prepareAttempt(finishAttempt(retry), transactionSubmission({ title: "Outro" }));
    expect(changed.key).toBe("key-b");
    expect(canonicalPayload(transactionSubmission({ idempotencyKey: "x" }))).toBe(
      canonicalPayload(transactionSubmission({ idempotencyKey: "y" }))
    );
  });
});
