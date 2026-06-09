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
  const displayName = user ? user.name?.trim() || nameFromEmail(user.email) : "Sua conta";
  const email = user?.email || "E-mail indisponivel";
  const initials = initialsFromName(displayName);

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
        <div className="flex min-w-0 items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`Avatar de ${displayName}`}
              className="size-11 shrink-0 rounded-full border border-border object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-muted-foreground"
              aria-label={`Avatar de ${displayName}`}
              role="img"
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold break-words">{displayName}</p>
            <p className="text-sm leading-6 break-words text-muted-foreground">{email}</p>
          </div>
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

function nameFromEmail(email: string | undefined): string {
  const localPart = email?.split("@")[0]?.trim();
  return localPart || "Sua conta";
}

function initialsFromName(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2);
  return parts.join("").toUpperCase() || "CF";
}
