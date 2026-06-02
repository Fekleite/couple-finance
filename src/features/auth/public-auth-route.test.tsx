import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { AuthContext } from "@/features/auth/auth-context-value";
import { PublicAuthRoute } from "@/features/auth/public-auth-route";
import type { AuthStatus } from "@/features/auth/auth-types";
import { createAuthContextValue } from "@/test/auth-test-utils";

function renderPublicAuth(status: AuthStatus) {
  render(
    <AuthContext.Provider value={createAuthContextValue({ status })}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<PublicAuthRoute />}>
            <Route path="/login" element={<p>Formulario de login</p>} />
          </Route>
          <Route path={PRIVATE_ROUTES.app.path} element={<p>Espaco privado</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("PublicAuthRoute", () => {
  it("keeps unauthenticated users on auth pages", () => {
    renderPublicAuth("unauthenticated");

    expect(screen.getByText("Formulario de login")).toBeInTheDocument();
  });

  it("redirects authenticated users to the private area", () => {
    renderPublicAuth("authenticated");

    expect(screen.getByText("Espaco privado")).toBeInTheDocument();
  });

  it("shows loading instead of redirect loops while session is loading", () => {
    renderPublicAuth("loading");

    expect(screen.getByText("Verificando seu acesso privado.")).toBeInTheDocument();
  });
});
