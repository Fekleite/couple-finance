import { describe, expect, it } from "vitest";

import {
  getPermissionMessage,
  mapPermissionFailure,
  PERMISSION_MESSAGES
} from "@/features/permissions/permission-messages";
import { SAFE_MESSAGE_KEYS } from "@/features/permissions/permission-types";

describe("permission messages", () => {
  it("defines safe copy for every message key", () => {
    for (const key of SAFE_MESSAGE_KEYS) {
      expect(getPermissionMessage(key)).toBe(PERMISSION_MESSAGES[key]);
      expect(getPermissionMessage(key)).not.toMatch(/supabase|policy|rls|sql|rpc/i);
    }
  });

  it("maps inaccessible technical failures to unavailable copy", () => {
    for (const kind of [
      "rls_no_rows",
      "rpc_unavailable",
      "nonexistent_resource",
      "removed_resource",
      "unrelated_resource"
    ] as const) {
      expect(mapPermissionFailure({ kind })).toBe("permissionUnavailable");
    }
  });

  it("maps empty and temporary failures without exposing raw details", () => {
    expect(mapPermissionFailure({ kind: "authorized_empty" })).toBe("safeEmptyState");
    expect(mapPermissionFailure({ kind: "service_failure", message: "Supabase timeout" })).toBe(
      "temporaryFailure"
    );
  });
});
