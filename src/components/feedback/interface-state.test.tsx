import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";

describe("interface state components", () => {
  it("announces loading with status and busy semantics", () => {
    render(<LoadingState title="Carregando transacoes" message="Buscando dados autorizados." />);

    const status = screen.getByRole("status", { name: /carregando transacoes/i });
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveTextContent(/dados autorizados/i);
  });

  it("renders empty states with reachable safe actions", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        title="Nenhum resultado"
        message="Ajuste os filtros ou registre uma nova informacao autorizada."
        actionLabel="Registrar transacao"
        onAction={onAction}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(/nenhum resultado/i);
    await user.click(screen.getByRole("button", { name: /registrar transacao/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders recoverable errors as alerts with retry actions", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <ErrorState
        title="Nao foi possivel carregar"
        message="Tente novamente sem expor detalhes internos."
        actionLabel="Tentar novamente"
        onAction={onAction}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/sem expor detalhes internos/i);
    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
