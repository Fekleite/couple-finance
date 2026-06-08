import { ChartNoAxesCombined, FolderTree, History, Home, LogOut, Plus, Target } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";

const PRIVATE_NAV_ITEMS = [
  {
    to: PRIVATE_ROUTES.app.path,
    label: "Inicio privado",
    icon: Home
  },
  {
    to: PRIVATE_ROUTES.categories.path,
    label: "Categorias",
    icon: FolderTree
  },
  {
    to: PRIVATE_ROUTES.transactions.path,
    label: "Transacoes",
    icon: ChartNoAxesCombined
  },
  {
    to: PRIVATE_ROUTES.newTransaction.path,
    label: "Registrar transacao",
    icon: Plus
  },
  {
    to: PRIVATE_ROUTES.goals.path,
    label: "Metas",
    icon: Target
  },
  {
    to: PRIVATE_ROUTES.audit.path,
    label: "Auditoria",
    icon: History
  }
] as const;

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
    <section className="min-w-0 space-y-6">
      <header className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold break-words text-primary uppercase">
            Espaco privado ativo
          </p>
          <h1 className="mt-2 text-2xl font-bold break-words">Couple Finance</h1>
          <p className="mt-2 text-sm leading-6 break-words text-muted-foreground">
            Acesso autenticado para {user?.email ?? "sua conta"}. Nenhum dado financeiro e exibido
            nesta etapa.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSignOut}
          disabled={isEnding}
          aria-label={isEnding ? "Saindo da conta" : "Sair da conta"}
          aria-busy={isEnding}
          className="w-full sm:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {isEnding ? "Saindo..." : "Sair"}
        </Button>
      </header>
      {message ? (
        <Alert className="max-w-2xl">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <nav aria-label="Navegacao privada" className="flex min-w-0 flex-wrap gap-2">
        {PRIVATE_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Button key={to} asChild variant="secondary" className="max-w-full">
            <NavLink
              to={to}
              end={to === PRIVATE_ROUTES.app.path}
              className={({ isActive }) =>
                cn(isActive && "bg-primary/10 text-primary hover:bg-primary/15")
              }
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="min-w-0 break-words">{label}</span>
            </NavLink>
          </Button>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
