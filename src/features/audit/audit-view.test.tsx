import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuditView } from "./audit-view";

describe("AuditView", () => {
  it("uses safe blocked and shared-unavailable states without inaccessible details", () => {
    render(
      <AuditView
        state={{ status: "blocked", items: [], message: "Entre novamente para consultar." }}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: /alteracoes recentes/i })).toBeInTheDocument();
    expect(screen.getByText(/entre novamente/i)).toBeInTheDocument();
    expect(screen.queryByText(/sql|rls|permissao negada|id/i)).not.toBeInTheDocument();
  });
});
