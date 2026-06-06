import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memberComparisonFixture } from "@/test/dashboard-chart-test-utils";
import { MemberComparisonChart } from "./member-comparison-chart";

describe("MemberComparisonChart", () => {
  it("renders neutral shared-only values and responsibility basis", () => {
    render(
      <MemberComparisonChart periodLabel="junho de 2026" comparison={memberComparisonFixture()} />
    );
    expect(screen.getAllByText("Voce")).not.toHaveLength(0);
    expect(screen.getAllByText("Pessoa parceira")).not.toHaveLength(0);
    expect(screen.getByText(/base: pessoa responsavel/i)).toBeInTheDocument();
    expect(screen.getAllByText(/nao inclui dados individuais/i)).not.toHaveLength(0);
  });

  it("renders empty and unavailable shared states safely", () => {
    const { rerender } = render(
      <MemberComparisonChart
        periodLabel="junho de 2026"
        comparison={memberComparisonFixture({ status: "empty", members: [] })}
      />
    );
    expect(screen.getByText(/sem despesas compartilhadas no mes/i)).toBeInTheDocument();
    rerender(
      <MemberComparisonChart
        periodLabel="junho de 2026"
        comparison={memberComparisonFixture({ status: "unavailable_shared", members: [] })}
      />
    );
    expect(screen.getByText(/comparativo compartilhado indisponivel/i)).toBeInTheDocument();
  });
});
