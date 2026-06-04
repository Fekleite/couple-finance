import { beforeEach, describe, expect, it, vi } from "vitest";

import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import { listActiveCategories } from "@/features/categories/category-service";
import { getSupabaseClient } from "@/lib/supabase";
import { categoryRow } from "@/test/category-test-utils";

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: vi.fn()
}));

function query(result: unknown) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => Promise.resolve(result))
  };
  return builder;
}

describe("category service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries only active categories in ascending order and maps snake case", async () => {
    const builder = query({
      data: [
        categoryRow({ code: "other", display_name: "Outros", sort_order: 110 }),
        categoryRow()
      ],
      error: null
    });
    const from = vi.fn(() => builder);
    vi.mocked(getSupabaseClient).mockReturnValue({ from } as never);

    await expect(listActiveCategories()).resolves.toMatchObject({
      ok: true,
      data: [
        { code: "housing", displayName: "Moradia", sortOrder: 20 },
        { code: "other", displayName: "Outros", sortOrder: 110 }
      ]
    });
    expect(from).toHaveBeenCalledWith("standard_financial_categories");
    expect(builder.select).toHaveBeenCalledWith(
      "code, display_name, description, applicability, sort_order, is_active"
    );
    expect(builder.eq).toHaveBeenCalledWith("is_active", true);
    expect(builder.order).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("never requests financial records, ownership, memberships, or counters", async () => {
    const builder = query({ data: [], error: null });
    const from = vi.fn(() => builder);
    vi.mocked(getSupabaseClient).mockReturnValue({ from } as never);

    await listActiveCategories();

    expect(from).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(from.mock.calls) + JSON.stringify(builder.select.mock.calls)).not.toMatch(
      /user|member|budget|movement|transaction|count/i
    );
  });

  it("returns safe copy for query and configuration failures", async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => query({ data: null, error: { message: "private database detail" } }))
    } as never);

    await expect(listActiveCategories()).resolves.toEqual({
      ok: false,
      reason: "temporary_failure",
      message: CATEGORY_MESSAGES.errorMessage
    });

    vi.mocked(getSupabaseClient).mockImplementation(() => {
      throw new Error("raw configuration detail");
    });
    await expect(listActiveCategories()).resolves.toEqual({
      ok: false,
      reason: "temporary_failure",
      message: CATEGORY_MESSAGES.errorMessage
    });
  });
});
