import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  dashboardChartsResponse,
  monthlyEvolutionFixture
} from "@/test/dashboard-chart-test-utils";
import { MonthlyEvolutionChart } from "./monthly-evolution-chart";

describe("MonthlyEvolutionChart", () => {
  it("renders a compact visual chart and selected month summary", () => {
    const data = dashboardChartsResponse({ monthlyEvolution: monthlyEvolutionFixture() });
    const { container } = render(
      <MonthlyEvolutionChart
        periodLabel={data.period.label}
        window={data.evolutionWindow}
        points={data.monthlyEvolution}
      />
    );
    expect(container.querySelector("[data-slot='chart']")).toHaveClass("h-40");
    expect(screen.getByText(/jun. 2026, Mes selecionado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/saldo negativo/i)).not.toHaveLength(0);
    expect(screen.getByText(/jan. 2026/i)).toHaveClass("sr-only");
  });
});
