import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { dashboardChartsResponse } from "@/test/dashboard-chart-test-utils";
import { dashboardPeriod } from "@/test/dashboard-test-utils";
import { DashboardChartsSection } from "./dashboard-charts-section";

describe("DashboardChartsSection", () => {
  it("renders semantic chart regions and ready state", () => {
    const period = dashboardPeriod();
    render(
      <DashboardChartsSection
        selectedPeriod={period}
        state={{ ...dashboardChartsResponse({ period }), status: "ready", period }}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: /graficos do mes/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /despesas por categoria/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /evolucao recente/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /responsabilidades compartilhadas/i })
    ).toBeInTheDocument();
  });

  it("supports loading, error and keyboard-reachable retry states", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const period = dashboardPeriod();
    const { rerender } = render(
      <DashboardChartsSection
        selectedPeriod={period}
        state={{ status: "loading", period }}
        onRetry={onRetry}
      />
    );
    expect(screen.getByText(/buscando agregados autorizados/i)).toBeInTheDocument();
    rerender(
      <DashboardChartsSection
        selectedPeriod={period}
        state={{ status: "error", period, message: "Erro seguro" }}
        onRetry={onRetry}
      />
    );
    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
