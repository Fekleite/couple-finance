import { describe, expect, it } from "vitest";

import { category } from "@/test/category-test-utils";
import { ATTEMPT_ID, BUDGET_ID, PARTNER_ID, USER_ID } from "@/test/transaction-test-utils";
import { isCivilDate, validateTransactionForm } from "./transaction-schemas";
import { initialTransactionValues } from "./use-transaction-form";

const context = {
  currentUserId: USER_ID,
  categories: [category({ code: "food", applicability: "expense" })],
  sharedBudgetId: BUDGET_ID,
  responsibleOptions: [
    { userId: USER_ID, label: "Voce" as const },
    { userId: PARTNER_ID, label: "Pessoa parceira" as const }
  ]
};

describe("transaction schemas", () => {
  it("normalizes a valid individual submission and derives responsibility", () => {
    const result = validateTransactionForm(
      {
        ...initialTransactionValues(PARTNER_ID),
        title: "  Mercado  ",
        amount: "12,34",
        transactionType: "expense",
        categoryCode: "food",
        observation: "  semanal  "
      },
      context,
      ATTEMPT_ID
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        title: "Mercado",
        amountCents: 1234,
        responsibleUserId: USER_ID,
        sharedBudgetId: null,
        observation: "semanal"
      });
    }
  });

  it("rejects unavailable categories, invalid shared responsibility, and invalid civil dates", () => {
    expect(isCivilDate("2026-02-29")).toBe(false);
    expect(
      validateTransactionForm(
        {
          ...initialTransactionValues(USER_ID),
          title: "Teste",
          amount: "1,00",
          transactionType: "income",
          categoryCode: "food"
        },
        context,
        ATTEMPT_ID
      ).success
    ).toBe(false);
    expect(
      validateTransactionForm(
        {
          ...initialTransactionValues(USER_ID),
          title: "Teste",
          amount: "1,00",
          transactionType: "expense",
          categoryCode: "food",
          visibility: "shared",
          responsibleUserId: "00000000-0000-4000-8000-000000000099"
        },
        context,
        ATTEMPT_ID
      ).success
    ).toBe(false);
  });
});
