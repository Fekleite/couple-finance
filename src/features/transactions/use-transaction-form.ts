import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/features/auth/use-auth";
import { useCategories } from "@/features/categories";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { createFinancialTransaction, listResponsibleOptions } from "./transaction-service";
import {
  createAttempt,
  finishAttempt,
  prepareAttempt,
  type SubmissionAttempt
} from "./transaction-submission";
import { validateTransactionForm } from "./transaction-schemas";
import type {
  TransactionFormContext,
  TransactionFormState,
  TransactionFormValues
} from "./transaction-types";

export function currentCivilDate(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function initialTransactionValues(currentUserId = ""): TransactionFormValues {
  return {
    title: "",
    amount: "",
    transactionType: "",
    transactionDate: currentCivilDate(),
    categoryCode: "",
    visibility: "individual",
    responsibleUserId: currentUserId,
    observation: ""
  };
}

export function useTransactionForm() {
  const { user } = useAuth();
  const { catalogState, refresh: refreshCategories } = useCategories();
  const { relationshipState, refresh: refreshRelationship } = useCoupleRelationship();
  const [loadedResponsibleOptions, setLoadedResponsibleOptions] = useState<
    TransactionFormContext["responsibleOptions"]
  >([]);
  const [values, setValues] = useState(() => initialTransactionValues(user?.id));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionState, setActionState] = useState<TransactionFormState>({ status: "ready" });
  const attempt = useRef<SubmissionAttempt>(createAttempt());

  const sharedBudgetId =
    relationshipState.status === "couple_linked" ? relationshipState.sharedBudget.id : null;
  const categories = useMemo(
    () => (catalogState.status === "ready" ? catalogState.categories : []),
    [catalogState]
  );
  const responsibleOptions = useMemo(
    () =>
      sharedBudgetId
        ? loadedResponsibleOptions
        : user
          ? [{ userId: user.id, label: "Voce" as const }]
          : [],
    [loadedResponsibleOptions, sharedBudgetId, user]
  );
  const context = useMemo<TransactionFormContext | null>(
    () =>
      user && catalogState.status === "ready"
        ? { currentUserId: user.id, categories, sharedBudgetId, responsibleOptions }
        : null,
    [catalogState.status, categories, responsibleOptions, sharedBudgetId, user]
  );

  useEffect(() => {
    let active = true;
    if (!user || !sharedBudgetId) {
      return;
    }
    void listResponsibleOptions(user.id, sharedBudgetId).then((options) => {
      if (active) setLoadedResponsibleOptions(options ?? [{ userId: user.id, label: "Voce" }]);
    });
    return () => {
      active = false;
    };
  }, [sharedBudgetId, user]);

  const state = useMemo<TransactionFormState>(() => {
    if (actionState.status !== "ready") return actionState;
    if (!user || catalogState.status === "loading" || relationshipState.status === "loading") {
      return { status: "loading_context" };
    }
    if (
      catalogState.status === "error" ||
      catalogState.status === "empty" ||
      relationshipState.status === "error"
    ) {
      return { status: "blocked", message: "Nao foi possivel preparar as opcoes de registro." };
    }
    return actionState;
  }, [actionState, catalogState.status, relationshipState.status, user]);

  const updateValue = useCallback(
    (field: keyof TransactionFormValues, value: string) => {
      setValues((current) => {
        const next = { ...current, [field]: value };
        if (field === "transactionType") next.categoryCode = "";
        if (field === "visibility" && value === "individual") {
          next.responsibleUserId = user?.id ?? "";
        }
        if (field === "visibility" && value === "shared") {
          next.responsibleUserId = responsibleOptions.some(
            (option) => option.userId === current.responsibleUserId
          )
            ? current.responsibleUserId
            : "";
        }
        return next;
      });
      setErrors((current) => ({ ...current, [field]: "" }));
    },
    [responsibleOptions, user?.id]
  );

  const refresh = useCallback(async () => {
    await Promise.all([refreshCategories(), refreshRelationship()]);
  }, [refreshCategories, refreshRelationship]);

  const submit = useCallback(async () => {
    if (!context || attempt.current.inFlight) return;
    const parsed = validateTransactionForm(values, context, attempt.current.key);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      setActionState({ status: "recoverable_error", message: "Revise os campos indicados." });
      return;
    }
    const prepared = prepareAttempt(attempt.current, parsed.data);
    attempt.current = prepared;
    const submission = { ...parsed.data, idempotencyKey: prepared.key };
    setActionState({ status: "submitting", message: "Registrando transacao..." });
    const result = await createFinancialTransaction(submission);
    attempt.current = finishAttempt(prepared);
    if (result.ok) {
      setActionState({ status: "success", summary: result.data });
      return;
    }
    setActionState({
      status:
        result.reason === "shared_context_unavailable" ||
        result.reason === "responsible_unavailable"
          ? "blocked"
          : "recoverable_error",
      message: result.message
    });
    if (result.reason === "category_unavailable") setErrors({ categoryCode: result.message });
    await refresh();
  }, [context, refresh, values]);

  const reset = useCallback(() => {
    attempt.current = createAttempt();
    setValues(initialTransactionValues(user?.id));
    setErrors({});
    setActionState({ status: "ready" });
  }, [user?.id]);

  return {
    values,
    errors,
    state,
    categories,
    responsibleOptions,
    sharedAvailable: Boolean(sharedBudgetId),
    updateValue,
    submit,
    reset,
    refresh
  };
}
