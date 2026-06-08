import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("uses responsive width and visible focus styling", () => {
    render(<Input aria-label="Categoria" />);

    expect(screen.getByRole("textbox", { name: /categoria/i })).toHaveClass(
      "w-full",
      "min-w-0",
      "focus-visible:ring-3"
    );
  });

  it("exposes disabled and invalid states", () => {
    render(<Input aria-label="Valor" disabled aria-invalid="true" />);

    const input = screen.getByLabelText(/valor/i);
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("disabled:opacity-50", "aria-invalid:border-destructive");
  });

  it("keeps long values constrained inside the field", () => {
    render(<Input aria-label="Descricao" defaultValue={"texto-".repeat(30)} />);

    expect(screen.getByRole("textbox", { name: /descricao/i })).toHaveClass("text-ellipsis");
  });
});
