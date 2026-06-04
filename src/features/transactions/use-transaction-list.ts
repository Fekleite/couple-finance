import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { listFinancialTransactions } from "./transaction-list-service";
import type {
  AuthorizedTransactionQueryResult,
  TransactionFilterSet,
  TransactionListState
} from "./transaction-list-types";
import { toTransactionQueryInput, transactionFiltersKey } from "./transaction-query";

const EMPTY_RESULT: AuthorizedTransactionQueryResult = {
  items: [],
  nextCursor: null,
  hasMore: false,
  hasAuthorizedMonthData: false,
  categoryOptions: [],
  responsibleOptions: []
};

export function useTransactionList(filters: TransactionFilterSet, authorizationContext = "") {
  const [state, setState] = useState<TransactionListState>({ status: "loading" });
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const loadingMore = useRef(false);
  const queryKey = `${transactionFiltersKey(filters)}|${authorizationContext}`;
  const query = useMemo(() => toTransactionQueryInput(filters), [filters]);

  const load = useCallback(
    async (append: boolean) => {
      if (
        append &&
        (loadingMore.current || state.status !== "ready" || !state.hasMore || !state.nextCursor)
      )
        return;
      loadingMore.current = append;
      const ownedRequest = ++requestId.current;
      controller.current?.abort();
      controller.current = new AbortController();
      const previous = append && state.status === "ready" ? state : null;
      setState(
        append && previous ? { ...previous, status: "loading_more" } : { status: "loading" }
      );
      const result = await listFinancialTransactions(
        { ...query, cursor: previous?.nextCursor ?? null },
        controller.current.signal
      );
      if (ownedRequest !== requestId.current) return;
      loadingMore.current = false;
      if (!result.ok) {
        setState({ status: "error", message: result.message });
        return;
      }
      const data =
        append && previous
          ? { ...result.data, items: [...previous.items, ...result.data.items] }
          : result.data;
      setState(
        data.items.length
          ? { ...data, status: "ready" }
          : data.hasAuthorizedMonthData
            ? { ...data, status: "no_matches" }
            : { ...EMPTY_RESULT, ...data, status: "empty_month" }
      );
    },
    [query, state]
  );

  useEffect(() => {
    void queryKey;
    ++requestId.current;
    loadingMore.current = false;
    controller.current?.abort();
    // Remote query ownership changes must clear potentially revoked financial data immediately.
    void load(false);
    return () => controller.current?.abort();
    // load intentionally changes with remote state; queryKey owns initial reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return {
    state,
    retry: () => void load(false),
    loadMore: () => void load(true)
  };
}
