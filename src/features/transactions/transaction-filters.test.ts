import { describe, expect, it } from "vitest";

import { activeTransactionFilters } from "./transaction-filters";
import { parseTransactionFilters } from "./transaction-query";

describe("transaction filters", () => {
  it("maps active filters through authorized option labels", () => {
    const filters = parseTransactionFilters("?month=2026-06&category=food&type=expense&q=mercado");
    expect(
      activeTransactionFilters(filters, {
        categoryOptions: [{ code: "food", label: "Alimentacao", isActive: true }],
        responsibleOptions: []
      }).map((filter) => filter.label)
    ).toEqual(["Alimentacao", "Despesa", "Busca: mercado"]);
  });
});
