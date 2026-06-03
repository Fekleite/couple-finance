import { describe, expect, it } from "vitest";

import { assertAuthorizedQueryScope } from "@/features/permissions/query-scope";

describe("query scope assertions", () => {
  it("authorizes list, search, count and summarize only inside the scoped source", () => {
    for (const operation of ["list", "search", "count", "summarize"] as const) {
      expect(
        assertAuthorizedQueryScope({
          scope: "individual",
          operation,
          currentUserId: "user-a",
          userId: "user-a"
        })
      ).toBe(true);
      expect(
        assertAuthorizedQueryScope({
          scope: "shared",
          operation,
          state: "active_couple_link",
          sharedBudgetId: "budget-1",
          activeSharedBudgetId: "budget-1"
        })
      ).toBe(true);
      expect(
        assertAuthorizedQueryScope({
          scope: "aggregate",
          operation,
          sourceScope: "shared",
          sourceAuthorized: true
        })
      ).toBe(true);
    }
  });

  it("blocks cross-user, cross-budget and inaccessible query inputs", () => {
    expect(
      assertAuthorizedQueryScope({
        scope: "individual",
        operation: "list",
        currentUserId: "user-a",
        userId: "user-b"
      })
    ).toBe(false);
    expect(
      assertAuthorizedQueryScope({
        scope: "shared",
        operation: "count",
        state: "active_couple_link",
        sharedBudgetId: "budget-a",
        activeSharedBudgetId: "budget-b"
      })
    ).toBe(false);
    expect(assertAuthorizedQueryScope({ scope: "inaccessible", operation: "search" })).toBe(false);
  });
});
