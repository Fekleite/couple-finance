import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CategorySelector } from "@/features/categories/category-selector";
import { category } from "@/test/category-test-utils";

describe("CategorySelector", () => {
  const categories = [
    category({ code: "other", displayName: "Outros", applicability: "both", sortOrder: 110 }),
    category({ code: "income", displayName: "Renda", applicability: "income", sortOrder: 10 }),
    category(),
    category({ code: "inactive", displayName: "Inativa", isActive: false, sortOrder: 5 })
  ];

  it("provides native keyboard selection with labels, descriptions, and visible state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CategorySelector
        categories={categories}
        value="housing"
        onValueChange={onValueChange}
        label="Escolha uma categoria"
        description="Use a opcao mais especifica."
      />
    );

    const selected = screen.getByRole("radio", { name: /moradia/i });
    expect(selected).toBeChecked();
    expect(screen.getByText("Selecionada")).toBeInTheDocument();
    selected.focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("filters applicability, active items, and keeps Outros last", () => {
    render(
      <CategorySelector
        categories={categories}
        applicability="income"
        onValueChange={vi.fn()}
        label="Categoria"
      />
    );

    const radios = screen.getAllByRole("radio");
    expect(radios.map((radio) => radio.getAttribute("value"))).toEqual(["income", "other"]);
    expect(screen.queryByRole("radio", { name: /moradia/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /inativa/i })).not.toBeInTheDocument();
  });

  it("supports disabled, empty, and unknown-value states without false fallback", () => {
    const { rerender } = render(
      <CategorySelector
        categories={categories}
        value="unknown"
        disabled
        onValueChange={vi.fn()}
        label="Categoria"
      />
    );
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
    expect(screen.getByRole("radio", { name: /outros/i })).not.toBeChecked();

    rerender(<CategorySelector categories={[]} onValueChange={vi.fn()} label="Categoria" />);
    expect(screen.getByText("Nenhuma categoria disponivel.")).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });
});
