import { describe, expect, it } from "vitest";

import {
  clearAdditionalTransactionFilters,
  clearTransactionFilter,
  normalizeTransactionSearch,
  parseTransactionFilters,
  serializeTransactionFilters
} from "./transaction-query";

describe("transaction query", () => {
  it("parses and serializes canonical filters while cleaning invalid values", () => {
    const filters = parseTransactionFilters(
      "?month=2026-06&category=food&responsible=no&type=expense&q=%20mercado%20%20central%20"
    );
    expect(filters).toEqual({
      month: "2026-06",
      categoryCode: "food",
      responsibleUserId: null,
      transactionType: "expense",
      searchText: "mercado central"
    });
    expect(serializeTransactionFilters(filters).toString()).toBe(
      "month=2026-06&category=food&type=expense&q=mercado+central"
    );
  });

  it("clears one or all additional filters without changing month", () => {
    const filters = parseTransactionFilters("?month=2026-06&category=food&type=expense&q=x");
    expect(clearTransactionFilter(filters, "categoryCode").categoryCode).toBeNull();
    expect(clearAdditionalTransactionFilters(filters)).toEqual({
      month: "2026-06",
      categoryCode: null,
      responsibleUserId: null,
      transactionType: null,
      searchText: null
    });
    expect(normalizeTransactionSearch("  cafe   central ")).toBe("cafe central");
  });
});
