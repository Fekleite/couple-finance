import { LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { useAuth } from "@/features/auth/use-auth";

export function AuthenticatedLayout() {
  const { user, status, message, signOut } = useAuth();
  const navigate = useNavigate();
  const isEnding = status === "ending";

  async function handleSignOut() {
    await signOut();
    navigate(PUBLIC_ROUTES.login.path, {
      replace: true,
      state: { message: AUTH_MESSAGES.logoutSuccess }
    });
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Espaco privado ativo
          </p>
          <h1 className="mt-2 text-2xl font-bold">Couple Finance</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Acesso autenticado para {user?.email ?? "sua conta"}. Nenhum dado financeiro e exibido
            nesta etapa.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={handleSignOut} disabled={isEnding}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {isEnding ? "Saindo..." : "Sair"}
        </Button>
      </header>
      {message ? (
        <Alert className="max-w-2xl">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <Outlet />
    </section>
  );
}
