import { describe, expect, it } from "vitest";

import { TRANSACTION_LIST_MESSAGES } from "./transaction-list-messages";

describe("transaction list messages", () => {
  it("keeps public copy neutral and private by default", () => {
    const copy = Object.values(TRANSACTION_LIST_MESSAGES).join(" ").toLowerCase();
    expect(copy).not.toMatch(/sql|rls|supabase|uuid|id\b|bloquead|culpa/);
    expect(copy).toContain("transacoes");
  });
});
