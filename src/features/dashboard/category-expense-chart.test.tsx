import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  categoryDistributionFixture,
  tiedCategoryDistributionFixture
} from "@/test/dashboard-chart-test-utils";
import { CategoryExpenseChart } from "./category-expense-chart";

describe("CategoryExpenseChart", () => {
  it("renders category labels, totals, weights and highest category", () => {
    render(
      <CategoryExpenseChart periodLabel="junho de 2026" items={categoryDistributionFixture()} />
    );
    expect(screen.getByRole("heading", { name: /despesas por categoria/i })).toBeInTheDocument();
    expect(screen.getAllByText(/moradia/i)).not.toHaveLength(0);
    expect(screen.getByText("50% do total de despesas autorizadas.")).toBeInTheDocument();
    expect(screen.getByText(/maior categoria: moradia/i)).toHaveClass("sr-only");
  });

  it("keeps deterministic tie order and safe empty state", () => {
    const { rerender } = render(
      <CategoryExpenseChart periodLabel="junho de 2026" items={tiedCategoryDistributionFixture()} />
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Alimentacao");
    expect(items[1]).toHaveTextContent("Saude");
    rerender(<CategoryExpenseChart periodLabel="junho de 2026" items={[]} />);
    expect(screen.getByText(/sem despesas por categoria/i)).toBeInTheDocument();
    expect(
      within(
        screen.getByText(/sem despesas por categoria/i).closest("section") as HTMLElement
      ).getByText(/nenhuma despesa autorizada/i)
    ).toBeInTheDocument();
  });
});
