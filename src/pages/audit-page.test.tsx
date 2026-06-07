import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuditPage } from "./audit-page";
import { createAuthContextValue } from "@/test/auth-test-utils";
import { AuthContext } from "@/features/auth/auth-context-value";

vi.mock("@/features/couple/use-couple-relationship", () => ({
  useCoupleRelationship: () => ({ relationshipState: { status: "solo" } })
}));

vi.mock("@/features/audit", async () => {
  const actual = await vi.importActual<typeof import("@/features/audit")>("@/features/audit");
  return {
    ...actual,
    useAuditEvents: () => ({ state: { status: "loading", items: [] }, retry: vi.fn() })
  };
});

describe("AuditPage", () => {
  it("renders route title copy and the audit view", () => {
    render(
      <AuthContext.Provider
        value={createAuthContextValue({
          status: "authenticated",
          user: { id: "user-1", email: "ana@example.com" }
        })}
      >
        <AuditPage />
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /auditoria financeira/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/alteracoes recentes autorizadas/i)).toBeInTheDocument();
  });
});
