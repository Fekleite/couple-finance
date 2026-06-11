import {
  ChartNoAxesCombined,
  FolderTree,
  History,
  Home,
  Target,
  type LucideIcon
} from "lucide-react";

import { PRIVATE_ROUTES } from "@/app/routes";

export type PrivateNavigationItem = {
  id: "dashboard" | "categories" | "transactions" | "goals" | "audit";
  label: string;
  to: string;
  icon: LucideIcon;
  matchPaths: readonly string[];
};

export const PRIVATE_NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: PRIVATE_ROUTES.app.path,
    icon: Home,
    matchPaths: [PRIVATE_ROUTES.app.path]
  },
  {
    id: "transactions",
    label: "Transacoes",
    to: PRIVATE_ROUTES.transactions.path,
    icon: ChartNoAxesCombined,
    matchPaths: [PRIVATE_ROUTES.transactions.path, PRIVATE_ROUTES.newTransaction.path]
  },
  {
    id: "categories",
    label: "Categorias",
    to: PRIVATE_ROUTES.categories.path,
    icon: FolderTree,
    matchPaths: [PRIVATE_ROUTES.categories.path]
  },
  {
    id: "goals",
    label: "Metas",
    to: PRIVATE_ROUTES.goals.path,
    icon: Target,
    matchPaths: [PRIVATE_ROUTES.goals.path]
  },
  {
    id: "audit",
    label: "Auditoria",
    to: PRIVATE_ROUTES.audit.path,
    icon: History,
    matchPaths: [PRIVATE_ROUTES.audit.path]
  }
] as const satisfies readonly PrivateNavigationItem[];

export function getPrivateNavigationItems(): readonly PrivateNavigationItem[] {
  return PRIVATE_NAVIGATION_ITEMS;
}

export function getActivePrivateNavigationItem(
  pathname: string
): PrivateNavigationItem | undefined {
  return PRIVATE_NAVIGATION_ITEMS.find((item) => isPrivateNavigationItemActive(pathname, item));
}

export function isPrivateNavigationItemActive(
  pathname: string,
  item: PrivateNavigationItem
): boolean {
  return item.matchPaths.some((path) => pathname === path);
}
