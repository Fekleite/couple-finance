import { describe, expect, it } from "vitest";

import {
  formatCivilDate,
  formatCurrencyFromCents,
  MAX_TRANSACTION_AMOUNT_CENTS,
  parsePtBrCurrencyToCents
} from "./transaction-money";

describe("transaction money", () => {
  it("parses exact pt-BR values and bounds", () => {
    expect(parsePtBrCurrencyToCents("0,01")).toBe(1);
    expect(parsePtBrCurrencyToCents("1.234,56")).toBe(123456);
    expect(parsePtBrCurrencyToCents("999.999.999,99")).toBe(MAX_TRANSACTION_AMOUNT_CENTS);
    expect(parsePtBrCurrencyToCents("0")).toBeNull();
    expect(parsePtBrCurrencyToCents("1,234")).toBeNull();
    expect(parsePtBrCurrencyToCents("1.000.000.000,00")).toBeNull();
  });

  it("formats currency and civil dates without timezone shifts", () => {
    expect(formatCurrencyFromCents(123456)).toMatch(/1\.234,56/);
    expect(formatCivilDate("2026-06-04")).toMatch(/4 de jun/i);
  });
});
