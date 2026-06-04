import { useCallback, useEffect, useRef, useState } from "react";

import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import { listActiveCategories } from "@/features/categories/category-service";
import type { CategoryCatalogState } from "@/features/categories/category-types";
import { useAuth } from "@/features/auth/use-auth";

export function useCategories() {
  const { status, user } = useAuth();
  const [catalogState, setCatalogState] = useState<CategoryCatalogState>({ status: "loading" });
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setCatalogState({ status: "loading" });

    if (status !== "authenticated" || !user) {
      return;
    }

    const result = await listActiveCategories();
    if (currentRequest !== requestId.current) {
      return;
    }

    if (!result.ok) {
      setCatalogState({ status: "error", message: result.message });
      return;
    }

    setCatalogState(
      result.data.length > 0
        ? { status: "ready", categories: result.data }
        : { status: "empty", message: CATEGORY_MESSAGES.emptyMessage }
    );
  }, [status, user]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
    return () => {
      requestId.current += 1;
    };
  }, [refresh]);

  return { catalogState, refresh };
}
