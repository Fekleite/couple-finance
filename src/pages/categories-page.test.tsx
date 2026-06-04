import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { CategoriesPage } from "@/pages/categories-page";
import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import { useCategories } from "@/features/categories/use-categories";
import { category } from "@/test/category-test-utils";

vi.mock("@/features/categories/use-categories", () => ({
  useCategories: vi.fn()
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <CategoriesPage />
    </MemoryRouter>
  );
}

describe("CategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active catalog content in canonical order without financial activity", () => {
    vi.mocked(useCategories).mockReturnValue({
      catalogState: {
        status: "ready",
        categories: [category({ code: "other", displayName: "Outros", sortOrder: 110 }), category()]
      },
      refresh: vi.fn()
    });
    renderPage();

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Moradia");
    expect(items[1]).toHaveTextContent("Outros");
    expect(
      screen.queryByText(/saldo|total|contador|transacao|compartilhado|individual/i)
    ).not.toBeInTheDocument();
  });

  it("renders loading and empty feedback safely", () => {
    vi.mocked(useCategories).mockReturnValue({
      catalogState: { status: "loading" },
      refresh: vi.fn()
    });
    const loading = renderPage();
    expect(screen.getByText(CATEGORY_MESSAGES.loadingMessage)).toBeInTheDocument();
    loading.unmount();

    vi.mocked(useCategories).mockReturnValue({
      catalogState: { status: "empty", message: CATEGORY_MESSAGES.emptyMessage },
      refresh: vi.fn()
    });
    renderPage();
    expect(screen.getByText(CATEGORY_MESSAGES.emptyMessage)).toBeInTheDocument();
  });

  it("renders safe error copy and retries", async () => {
    const user = userEvent.setup();
    const refresh = vi.fn();
    vi.mocked(useCategories).mockReturnValue({
      catalogState: { status: "error", message: CATEGORY_MESSAGES.errorMessage },
      refresh
    });
    renderPage();

    await user.click(screen.getByRole("button", { name: CATEGORY_MESSAGES.retryLabel }));
    expect(refresh).toHaveBeenCalled();
    expect(screen.queryByText(/sql|supabase|permission denied/i)).not.toBeInTheDocument();
  });
});
