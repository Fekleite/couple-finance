import { NavLink } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { cn } from "@/lib/utils";

export function PublicNavigation() {
  return (
    <nav
      className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Navegacao publica"
    >
      <NavLink
        to={PUBLIC_ROUTES.login.path}
        className="inline-flex w-fit max-w-full flex-col rounded-md px-1 py-1"
        aria-label="Ir para a entrada do Couple Finance"
      >
        <span className="text-lg font-bold break-words text-primary">Couple Finance</span>
        <span className="text-sm break-words text-muted-foreground">Controle financeiro</span>
      </NavLink>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <NavLink
          to={PUBLIC_ROUTES.signUp.path}
          className={({ isActive }) =>
            cn(
              "min-h-10 rounded-md px-3 py-2 text-sm font-medium break-words text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )
          }
        >
          Criar conta
        </NavLink>
        <NavLink
          to={PUBLIC_ROUTES.login.path}
          className={({ isActive }) =>
            cn(
              "min-h-10 rounded-md px-3 py-2 text-sm font-medium break-words text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )
          }
        >
          Entrar
        </NavLink>
        <NavLink
          to={PRIVATE_ROUTES.app.path}
          className="min-h-10 rounded-md px-3 py-2 text-sm font-medium break-words text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Espaco privado
        </NavLink>
      </div>
    </nav>
  );
}
