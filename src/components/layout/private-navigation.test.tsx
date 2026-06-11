import { describe, expect, it } from "vitest";

import { PRIVATE_ROUTES } from "@/app/routes";
import {
  getActivePrivateNavigationItem,
  getPrivateNavigationItems,
  isPrivateNavigationItemActive
} from "@/components/layout/private-navigation";

describe("private navigation", () => {
  it("defines available private destinations without creating unavailable modules", () => {
    const items = getPrivateNavigationItems();

    expect(items.map((item) => item.label)).toEqual([
      "Dashboard",
      "Transacoes",
      "Categorias",
      "Metas",
      "Auditoria"
    ]);
    expect(items.map((item) => item.to)).toEqual([
      PRIVATE_ROUTES.app.path,
      PRIVATE_ROUTES.transactions.path,
      PRIVATE_ROUTES.categories.path,
      PRIVATE_ROUTES.goals.path,
      PRIVATE_ROUTES.audit.path
    ]);
    expect(items.some((item) => /registrar|nova transacao|nova meta/i.test(item.label))).toBe(
      false
    );
    expect(items.some((item) => /configuracoes|settings/i.test(item.label))).toBe(false);
    expect(items.some((item) => /parceiro|convites/i.test(item.label))).toBe(false);
  });

  it("matches active routes for dashboard and financial modules", () => {
    const items = getPrivateNavigationItems();

    expect(getActivePrivateNavigationItem("/app")?.id).toBe("dashboard");
    expect(getActivePrivateNavigationItem("/app/transactions")?.id).toBe("transactions");
    expect(getActivePrivateNavigationItem("/app/transactions/new")?.id).toBe("transactions");
    expect(getActivePrivateNavigationItem("/app/categories")?.id).toBe("categories");
    expect(getActivePrivateNavigationItem("/app/goals")?.id).toBe("goals");
    expect(getActivePrivateNavigationItem("/app/audit")?.id).toBe("audit");
    expect(isPrivateNavigationItemActive("/app/transactions/new", items[1])).toBe(true);
  });

  it("keeps dynamic invite routes without a false active aggregate item", () => {
    expect(getActivePrivateNavigationItem("/app/invites/invite-1")).toBeUndefined();
  });
});
