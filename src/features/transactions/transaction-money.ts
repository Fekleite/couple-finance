export const MAX_TRANSACTION_AMOUNT_CENTS = 99_999_999_999;

export function parsePtBrCurrencyToCents(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(/^R\$/, "");
  if (!/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const [whole, fraction = ""] = normalized.replace(/\./g, "").split(",");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents >= 1 && cents <= MAX_TRANSACTION_AMOUNT_CENTS
    ? cents
    : null;
}

export function formatCurrencyFromCents(amountCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(amountCents / 100);
}

export function formatCivilDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day))
  );
}
