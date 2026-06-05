import { formatCurrencyFromCents } from "@/features/transactions/transaction-money";
import type { DashboardIndicatorSet } from "./dashboard-types";
import { resultMeaningMessage } from "./dashboard-messages";

export type DashboardIndicatorPresentation = {
  id: "income" | "expense" | "balance" | "result";
  label: string;
  value: string;
  description: string;
  tone: "positive" | "negative" | "neutral";
};

export function deriveResultMeaning(balanceCents: number) {
  if (balanceCents > 0) return "positive";
  if (balanceCents < 0) return "negative";
  return "zero";
}

export function formatSignedCurrency(amountCents: number): string {
  if (amountCents === 0) return formatCurrencyFromCents(0);
  const prefix = amountCents > 0 ? "+ " : "negativo ";
  return `${prefix}${formatCurrencyFromCents(Math.abs(amountCents))}`;
}

export function dashboardResultReading(indicators: DashboardIndicatorSet): string {
  return resultMeaningMessage(indicators.resultMeaning);
}

export function zeroDashboardIndicators(): DashboardIndicatorSet {
  return {
    incomeCents: 0,
    expenseCents: 0,
    balanceCents: 0,
    resultMeaning: "zero",
    hasAuthorizedMonthData: false
  };
}
