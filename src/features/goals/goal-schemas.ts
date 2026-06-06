import { z } from "zod";

import {
  MAX_TRANSACTION_AMOUNT_CENTS,
  parsePtBrCurrencyToCents
} from "@/features/transactions/transaction-money";
import type { GoalFormValues } from "./goal-types";

const goalMutationBaseSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(80, "Use ate 80 caracteres."),
  targetAmountCents: z
    .number()
    .int()
    .min(1, "Informe um alvo maior que zero.")
    .max(MAX_TRANSACTION_AMOUNT_CENTS, "Informe um valor dentro do limite aceito."),
  currentAmountCents: z
    .number()
    .int()
    .min(0, "Informe um valor atual valido.")
    .max(MAX_TRANSACTION_AMOUNT_CENTS, "Informe um valor dentro do limite aceito."),
  deadlineDate: z
    .string()
    .refine((value) => value === "" || isCivilDate(value), "Informe uma data valida.")
    .transform((value) => value || null),
  visibility: z.enum(["individual", "shared"]),
  sharedBudgetId: z.string().uuid().nullable()
});

export const goalCreateSchema = goalMutationBaseSchema.superRefine((value, context) => {
  if (value.visibility === "shared" && !value.sharedBudgetId) {
    context.addIssue({
      code: "custom",
      path: ["visibility"],
      message: "Escolha um espaco compartilhado ativo."
    });
  }
});

export const goalUpdateSchema = goalMutationBaseSchema.omit({
  visibility: true,
  sharedBudgetId: true
});

export function validateGoalForm(values: GoalFormValues, sharedBudgetId: string | null) {
  const targetAmountCents = parsePtBrCurrencyToCents(values.targetAmount);
  const currentAmountCents = parseOptionalCurrencyToCents(values.currentAmount);
  return goalCreateSchema.safeParse({
    name: values.name.trim(),
    targetAmountCents: targetAmountCents ?? 0,
    currentAmountCents: currentAmountCents ?? -1,
    deadlineDate: values.deadlineDate,
    visibility: values.visibility,
    sharedBudgetId: values.visibility === "shared" ? sharedBudgetId : null
  });
}

export function validateGoalUpdateForm(values: GoalFormValues) {
  const targetAmountCents = parsePtBrCurrencyToCents(values.targetAmount);
  const currentAmountCents = parseOptionalCurrencyToCents(values.currentAmount);
  return goalUpdateSchema.safeParse({
    name: values.name.trim(),
    targetAmountCents: targetAmountCents ?? 0,
    currentAmountCents: currentAmountCents ?? -1,
    deadlineDate: values.deadlineDate
  });
}

export function isCivilDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function parseOptionalCurrencyToCents(value: string): number | null {
  if (!value.trim()) return 0;
  const parsed = parsePtBrCurrencyToCents(value);
  return parsed === null && /^0+(?:,0{1,2})?$/.test(value.trim()) ? 0 : parsed;
}
