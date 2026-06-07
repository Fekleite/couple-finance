import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuditEventItem } from "./audit-event-item";
import { createAuditEvent } from "@/test/audit-test-utils";

describe("AuditEventItem", () => {
  it("renders semantic neutral text for action, item, author, moment, and visibility", () => {
    render(
      <ul>
        <AuditEventItem
          event={createAuditEvent({ visibility: "shared" })}
          currentUserId="22222222-2222-4222-8222-222222222222"
        />
      </ul>
    );

    expect(screen.getByRole("heading", { name: /voce criou transacao/i })).toBeInTheDocument();
    expect(screen.getByText("Compartilhado")).toBeInTheDocument();
    expect(screen.getByText("Mercado")).toBeInTheDocument();
    expect(screen.queryByText(/culpa|vigilancia|ranking/i)).not.toBeInTheDocument();
  });
});
