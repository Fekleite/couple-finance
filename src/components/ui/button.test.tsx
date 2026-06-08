import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("keeps text buttons touch-friendly, wrappable, and focus-visible", () => {
    render(<Button>Registrar transacao com descricao longa</Button>);

    const button = screen.getByRole("button", {
      name: /registrar transacao com descricao longa/i
    });

    expect(button).toHaveClass("min-h-10", "whitespace-normal", "focus-visible:ring-3");
  });

  it("supports icon-only controls when an accessible name is provided", () => {
    render(
      <Button size="icon" aria-label="Atualizar lista">
        <span aria-hidden="true">↻</span>
      </Button>
    );

    expect(screen.getByRole("button", { name: /atualizar lista/i })).toHaveClass("size-10");
  });

  it("exposes busy and disabled state without changing the button label", () => {
    render(
      <Button disabled aria-busy="true">
        Salvando transacao
      </Button>
    );

    const button = screen.getByRole("button", { name: /salvando transacao/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
