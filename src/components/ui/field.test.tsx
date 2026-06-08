import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

describe("Field", () => {
  it("associates labels, descriptions, invalid state, and alerts", () => {
    render(
      <FieldGroup>
        <Field data-invalid="true">
          <FieldLabel htmlFor="amount">Valor da transacao</FieldLabel>
          <FieldDescription id="amount-help">Informe o valor autorizado.</FieldDescription>
          <Input id="amount" aria-invalid="true" aria-describedby="amount-help amount-error" />
          <FieldError id="amount-error">Informe um valor maior que zero.</FieldError>
        </Field>
      </FieldGroup>
    );

    const input = screen.getByLabelText(/valor da transacao/i);
    expect(input).toHaveAccessibleDescription(
      /informe o valor autorizado\. informe um valor maior que zero\./i
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(/maior que zero/i);
  });

  it("renders multiple unique error messages in one alert", () => {
    render(
      <FieldError
        errors={[
          { message: "Campo obrigatorio." },
          { message: "Campo obrigatorio." },
          { message: "Use uma data valida." }
        ]}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/campo obrigatorio/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/data valida/i);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
