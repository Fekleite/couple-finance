import { describe, expect, it, vi } from "vitest";

import { getTransactionActionAvailability } from "./transaction-table-actions";

describe("transaction table actions", () => {
  it("maps availability from existing callbacks without creating permission rules", () => {
    expect(getTransactionActionAvailability({})).toEqual({ canEdit: false, canDelete: false });
    expect(getTransactionActionAvailability({ onEditTransaction: vi.fn() })).toEqual({
      canEdit: true,
      canDelete: false
    });
    expect(getTransactionActionAvailability({ onDeleteTransaction: vi.fn() })).toEqual({
      canEdit: false,
      canDelete: true
    });
  });
});
