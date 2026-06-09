import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardIndicatorCard } from "./dashboard-indicator-card";

describe("DashboardIndicatorCard", () => {
  it("renders label, value and textual result meaning", () => {
    render(
      <DashboardIndicatorCard
        label="Saldo do mes"
        value="+ R$ 10,00"
        description="Receitas menos despesas autorizadas."
        resultText="Resultado positivo: houve sobra no mes."
        tone="positive"
      />
    );
    expect(screen.getByText("Saldo do mes")).toBeInTheDocument();
    expect(screen.getByText(/\+\s*R\$\s*10,00/)).toBeInTheDocument();
    expect(screen.getByText(/houve sobra/i)).toBeInTheDocument();
  });

  it("allows concise cards without helper description", () => {
    render(<DashboardIndicatorCard label="Receitas" value="R$ 10,00" tone="positive" />);

    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*10,00/)).toBeInTheDocument();
    expect(screen.queryByText(/autorizadas no periodo/i)).not.toBeInTheDocument();
  });
});
