import { z } from "zod";

import type { StandardFinancialCategory } from "@/features/categories";
import { MAX_TRANSACTION_AMOUNT_CENTS, parsePtBrCurrencyToCents } from "./transaction-money";
import type { TransactionFormContext, TransactionFormValues } from "./transaction-types";

const civilDate = z.string().refine(isCivilDate, "Informe uma data valida.");
const uuid = z.string().uuid();

export const transactionSubmissionSchema = z
  .object({
    title: z.string().trim().min(1, "Informe um titulo.").max(120, "Use ate 120 caracteres."),
    amountCents: z
      .number()
      .int()
      .min(1, "Informe um valor maior que zero.")
      .max(MAX_TRANSACTION_AMOUNT_CENTS, "Informe um valor dentro do limite aceito."),
    transactionType: z.enum(["income", "expense"], { error: "Escolha receita ou despesa." }),
    transactionDate: civilDate,
    categoryCode: z.string().trim().min(1, "Escolha uma categoria."),
    responsibleUserId: uuid.nullable(),
    visibility: z.enum(["individual", "shared"]),
    sharedBudgetId: uuid.nullable(),
    observation: z.string().trim().max(500, "Use ate 500 caracteres.").nullable(),
    idempotencyKey: uuid
  })
  .superRefine((value, context) => {
    if (value.visibility === "shared" && (!value.sharedBudgetId || !value.responsibleUserId)) {
      context.addIssue({
        code: "custom",
        path: ["visibility"],
        message: "Escolha um espaco e uma pessoa responsavel disponiveis."
      });
    }
  });

export function validateTransactionForm(
  values: TransactionFormValues,
  context: TransactionFormContext,
  idempotencyKey: string
) {
  const amountCents = parsePtBrCurrencyToCents(values.amount);
  const category = findApplicableCategory(
    context.categories,
    values.categoryCode,
    values.transactionType
  );
  const responsibleUserId =
    values.visibility === "individual" ? context.currentUserId : values.responsibleUserId;
  const submission = {
    title: values.title.trim(),
    amountCents: amountCents ?? 0,
    transactionType: values.transactionType,
    transactionDate: values.transactionDate,
    categoryCode: category?.code ?? "",
    responsibleUserId: responsibleUserId || null,
    visibility: values.visibility,
    sharedBudgetId: values.visibility === "shared" ? context.sharedBudgetId : null,
    observation: values.observation.trim() || null,
    idempotencyKey
  };

  const result = transactionSubmissionSchema.safeParse(submission);
  if (!result.success) {
    return result;
  }
  if (values.categoryCode && !category) {
    return {
      success: false as const,
      error: new z.ZodError([
        { code: "custom", path: ["categoryCode"], message: "Escolha uma categoria disponivel." }
      ])
    };
  }
  if (
    values.visibility === "shared" &&
    !context.responsibleOptions.some((option) => option.userId === responsibleUserId)
  ) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["responsibleUserId"],
          message: "Escolha uma pessoa responsavel disponivel."
        }
      ])
    };
  }
  return result;
}

export function findApplicableCategory(
  categories: StandardFinancialCategory[],
  code: string,
  type: TransactionFormValues["transactionType"]
) {
  return categories.find(
    (category) =>
      category.code === code &&
      category.isActive &&
      Boolean(type) &&
      (category.applicability === type || category.applicability === "both")
  );
}

export function isCivilDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}
