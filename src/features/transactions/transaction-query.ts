import type { TransactionFilterSet, TransactionQueryInput } from "./transaction-list-types";
import { currentCivilMonth, parseCivilMonth } from "./transaction-month";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CATEGORY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function normalizeTransactionSearch(value: string | null | undefined): string | null {
  const normalized = value?.trim().replace(/\s+/g, " ").slice(0, 100);
  return normalized || null;
}

export function parseTransactionFilters(
  input: URLSearchParams | string,
  now = new Date()
): TransactionFilterSet {
  const params = typeof input === "string" ? new URLSearchParams(input) : input;
  const category = params.get("category");
  const responsible = params.get("responsible");
  const type = params.get("type");
  return {
    month: (parseCivilMonth(params.get("month")) ?? currentCivilMonth(now)).key,
    categoryCode: category && CATEGORY_PATTERN.test(category) ? category : null,
    responsibleUserId: responsible && UUID_PATTERN.test(responsible) ? responsible : null,
    transactionType: type === "income" || type === "expense" ? type : null,
    searchText: normalizeTransactionSearch(params.get("q"))
  };
}

export function serializeTransactionFilters(filters: TransactionFilterSet): URLSearchParams {
  const params = new URLSearchParams({ month: filters.month });
  if (filters.categoryCode) params.set("category", filters.categoryCode);
  if (filters.responsibleUserId) params.set("responsible", filters.responsibleUserId);
  if (filters.transactionType) params.set("type", filters.transactionType);
  if (filters.searchText) params.set("q", filters.searchText);
  return params;
}

export function clearTransactionFilter(
  filters: TransactionFilterSet,
  filter: Exclude<keyof TransactionFilterSet, "month">
): TransactionFilterSet {
  return { ...filters, [filter]: null };
}

export function clearAdditionalTransactionFilters(
  filters: TransactionFilterSet
): TransactionFilterSet {
  return {
    month: filters.month,
    categoryCode: null,
    responsibleUserId: null,
    transactionType: null,
    searchText: null
  };
}

export function toTransactionQueryInput(filters: TransactionFilterSet): TransactionQueryInput {
  const month = parseCivilMonth(filters.month) ?? currentCivilMonth();
  return {
    monthStart: month.startDate,
    nextMonthStart: month.nextStartDate,
    categoryCode: filters.categoryCode,
    responsibleUserId: filters.responsibleUserId,
    transactionType: filters.transactionType,
    searchText: filters.searchText,
    cursor: null,
    pageSize: 50
  };
}

export function transactionFiltersKey(filters: TransactionFilterSet): string {
  return serializeTransactionFilters(filters).toString();
}
