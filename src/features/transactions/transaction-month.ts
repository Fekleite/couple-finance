import type { CivilMonth } from "./transaction-list-types";

const MONTH_KEY_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function currentCivilMonth(now = new Date()): CivilMonth {
  return civilMonthFromParts(now.getFullYear(), now.getMonth() + 1);
}

export function parseCivilMonth(value: string | null | undefined): CivilMonth | null {
  const match = value?.match(MONTH_KEY_PATTERN);
  return match ? civilMonthFromParts(Number(match[1]), Number(match[2])) : null;
}

export function moveCivilMonth(month: CivilMonth | string, offset: number): CivilMonth {
  const parsed = typeof month === "string" ? parseCivilMonth(month) : month;
  if (!parsed) throw new Error("invalid_civil_month");
  const [year, monthNumber] = parsed.key.split("-").map(Number);
  const target = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
  return civilMonthFromParts(target.getUTCFullYear(), target.getUTCMonth() + 1);
}

function civilMonthFromParts(year: number, month: number): CivilMonth {
  const key = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
  const next = new Date(Date.UTC(year, month, 1));
  return {
    key,
    startDate: `${key}-01`,
    nextStartDate: `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`,
    label: new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, 1)))
  };
}
