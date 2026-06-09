import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { dashboardChartsResponse } from "@/test/dashboard-chart-test-utils";
import { dashboardPeriod, dashboardResponse } from "@/test/dashboard-test-utils";
import { DashboardView } from "./dashboard-view";

describe("DashboardView", () => {
  it("renders current-month summary, recent transactions and full list link", () => {
    const period = dashboardPeriod();
    render(
      <MemoryRouter>
        <DashboardView
          selectedPeriod={period}
          state={{ ...dashboardResponse({ period }), status: "ready", period }}
          chartsState={{ ...dashboardChartsResponse({ period }), status: "ready", period }}
          onMonthChange={vi.fn()}
          onRetry={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /dashboard financeiro/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Resumo financeiro do mes")).toHaveClass("min-w-0");
    expect(screen.getByRole("heading", { name: /graficos do mes/i })).toBeInTheDocument();
    expect(screen.getByText("Receitas do mes")).toBeInTheDocument();
    expect(screen.queryByText("Economia do mes")).not.toBeInTheDocument();
    expect(screen.getByText(/resultado positivo/i)).toBeInTheDocument();
    expect(screen.getByText("Mercado")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver lista completa/i })).toHaveAttribute(
      "href",
      "/app/transactions"
    );
  });

  it("supports keyboard month controls and safe empty/error states", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    const period = dashboardPeriod();
    const { rerender } = render(
      <MemoryRouter>
        <DashboardView
          selectedPeriod={period}
          state={{ status: "loading", period }}
          onMonthChange={onMonthChange}
          onRetry={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/buscando somente movimentacoes/i)).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <DashboardView
          selectedPeriod={period}
          state={{
            ...dashboardResponse({
              period,
              indicators: {
                incomeCents: 0,
                expenseCents: 0,
                balanceCents: 0,
                resultMeaning: "zero",
                hasAuthorizedMonthData: false
              },
              recentTransactions: []
            }),
            status: "empty_month",
            period
          }}
          onMonthChange={onMonthChange}
          onRetry={vi.fn()}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(onMonthChange).toHaveBeenCalledWith(expect.objectContaining({ key: "2026-05" }));
    expect(screen.getByText(/sem movimentacoes neste mes/i)).toBeInTheDocument();
    expect(screen.getByText(/sem transacoes recentes/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Resumo financeiro do mes")).toHaveClass("min-w-0");
  });
});
