import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  dashboardChartsResponse,
  monthlyEvolutionFixture
} from "@/test/dashboard-chart-test-utils";
import { MonthlyEvolutionChart } from "./monthly-evolution-chart";

describe("MonthlyEvolutionChart", () => {
  it("renders all monthly labels, selected month and result meanings", () => {
    const data = dashboardChartsResponse({ monthlyEvolution: monthlyEvolutionFixture() });
    render(
      <MonthlyEvolutionChart
        periodLabel={data.period.label}
        window={data.evolutionWindow}
        points={data.monthlyEvolution}
      />
    );
    expect(screen.getAllByText(/jan. 2026/i)).not.toHaveLength(0);
    expect(screen.getByText(/jun. 2026, Mes selecionado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/saldo negativo/i)).not.toHaveLength(0);
    expect(screen.getByText(/sem movimentacoes autorizadas/i)).toBeInTheDocument();
  });
});
