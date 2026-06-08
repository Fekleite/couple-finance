import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GOAL_MESSAGES } from "./goal-messages";
import { validateGoalForm, validateGoalUpdateForm } from "./goal-schemas";
import type {
  AuthorizedGoal,
  GoalFormValues,
  GoalMutation,
  GoalUpdateMutation
} from "./goal-types";

type Props = {
  hasActiveSharedBudget: boolean;
  activeSharedBudgetId: string | null;
  submitting: boolean;
  editingGoal?: AuthorizedGoal | null;
  onCancelEdit?: () => void;
  onCreate: (input: GoalMutation) => void;
  onUpdate: (goalId: string, input: GoalUpdateMutation) => void;
};

const emptyValues: GoalFormValues = {
  name: "",
  targetAmount: "",
  currentAmount: "",
  deadlineDate: "",
  visibility: "individual"
};

export function GoalForm({
  hasActiveSharedBudget,
  activeSharedBudgetId,
  submitting,
  editingGoal,
  onCancelEdit,
  onCreate,
  onUpdate
}: Props) {
  const [values, setValues] = useState<GoalFormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const editMode = Boolean(editingGoal);

  useEffect(() => {
    if (!editingGoal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(emptyValues);
      setErrors({});
      return;
    }
    setValues({
      name: editingGoal.name,
      targetAmount: formatInputCurrency(editingGoal.targetAmountCents),
      currentAmount: formatInputCurrency(editingGoal.currentAmountCents),
      deadlineDate: editingGoal.deadlineDate ?? "",
      visibility: editingGoal.visibility
    });
    setErrors({});
  }, [editingGoal]);

  function updateValue(key: keyof GoalFormValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editMode && editingGoal) {
      const result = validateGoalUpdateForm(values);
      if (!result.success) {
        setErrors(flattenErrors(result.error));
        return;
      }
      setErrors({});
      onUpdate(editingGoal.id, result.data);
      return;
    }
    const result = validateGoalForm(values, activeSharedBudgetId);
    if (!result.success) {
      setErrors(flattenErrors(result.error));
      return;
    }
    setErrors({});
    onCreate(result.data);
    setValues(emptyValues);
  }

  return (
    <form noValidate onSubmit={submit} className="grid min-w-0 gap-4">
      <FieldGroup>
        <TextField
          id="goal-name"
          label="Nome da meta"
          value={values.name}
          error={errors.name}
          maxLength={80}
          onChange={(value) => updateValue("name", value)}
        />
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <TextField
            id="goal-target"
            label="Valor alvo"
            value={values.targetAmount}
            error={errors.targetAmountCents}
            inputMode="decimal"
            placeholder="0,00"
            onChange={(value) => updateValue("targetAmount", value)}
          />
          <TextField
            id="goal-current"
            label="Valor atual"
            value={values.currentAmount}
            error={errors.currentAmountCents}
            inputMode="decimal"
            placeholder="0,00"
            onChange={(value) => updateValue("currentAmount", value)}
          />
        </div>
        <TextField
          id="goal-deadline"
          label="Prazo opcional"
          type="date"
          value={values.deadlineDate}
          error={errors.deadlineDate}
          onChange={(value) => updateValue("deadlineDate", value)}
        />
        <fieldset
          aria-describedby={errors.visibility ? "goal-visibility-error" : "goal-visibility-help"}
        >
          <legend className="text-sm font-medium break-words">Visibilidade</legend>
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
            <Choice
              name="goal-visibility"
              label="Individual"
              value="individual"
              checked={values.visibility === "individual"}
              disabled={editMode}
              onChange={() => updateValue("visibility", "individual")}
            />
            <Choice
              name="goal-visibility"
              label="Compartilhada"
              value="shared"
              checked={values.visibility === "shared"}
              disabled={editMode || !hasActiveSharedBudget}
              onChange={() => updateValue("visibility", "shared")}
            />
          </div>
          <FieldDescription id="goal-visibility-help">
            {values.visibility === "shared"
              ? GOAL_MESSAGES.visibilityShared
              : hasActiveSharedBudget
                ? GOAL_MESSAGES.visibilityIndividual
                : GOAL_MESSAGES.sharedBlocked}
          </FieldDescription>
          <FieldError id="goal-visibility-error" errors={[{ message: errors.visibility }]} />
        </fieldset>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="min-h-11 w-full sm:w-fit"
          >
            {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {submitting ? "Salvando..." : editMode ? "Salvar meta" : "Criar meta"}
          </Button>
          {editMode ? (
            <Button type="button" variant="secondary" onClick={onCancelEdit} disabled={submitting}>
              Cancelar edicao
            </Button>
          ) : null}
        </div>
      </FieldGroup>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
} & Pick<React.ComponentProps<"input">, "type" | "inputMode" | "placeholder" | "maxLength">) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      <FieldError id={`${id}-error`} errors={[{ message: error }]} />
    </Field>
  );
}

function Choice({
  name,
  label,
  value,
  checked,
  disabled,
  onChange
}: {
  name: string;
  label: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-md border p-3 break-words has-[:focus-visible]:ring-2 has-[:checked]:border-primary">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function flattenErrors(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}

function formatInputCurrency(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
