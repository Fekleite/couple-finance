import type {
  DataScope,
  PermissionAction,
  PermissionState
} from "@/features/permissions/permission-types";

export type QueryScopeOperation = Extract<
  PermissionAction,
  "list" | "search" | "count" | "summarize"
>;

export type AuthorizedQueryScope =
  | {
      scope: "individual";
      operation: QueryScopeOperation;
      currentUserId: string;
      userId: string;
    }
  | {
      scope: "shared";
      operation: QueryScopeOperation;
      state: PermissionState;
      sharedBudgetId: string;
      activeSharedBudgetId: string;
    }
  | {
      scope: "aggregate";
      operation: QueryScopeOperation;
      sourceScope: Exclude<DataScope, "inaccessible">;
      sourceAuthorized: boolean;
    }
  | {
      scope: "inaccessible";
      operation: QueryScopeOperation;
    };

export function assertAuthorizedQueryScope(input: AuthorizedQueryScope): boolean {
  if (input.scope === "individual") {
    return input.userId === input.currentUserId;
  }

  if (input.scope === "shared") {
    return (
      input.state === "active_couple_link" && input.sharedBudgetId === input.activeSharedBudgetId
    );
  }

  if (input.scope === "aggregate") {
    return input.sourceAuthorized;
  }

  return false;
}
