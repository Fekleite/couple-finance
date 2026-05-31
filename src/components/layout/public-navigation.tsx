import { NavLink } from "react-router-dom";

import { FUTURE_PROTECTED_AREAS, PUBLIC_ROUTES } from "@/app/routes";
import { FutureAreaIndicator } from "@/components/layout/future-area-indicator";
import { cn } from "@/lib/utils";

export function PublicNavigation() {
  return (
    <nav
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Navegacao publica"
    >
      <NavLink
        to={PUBLIC_ROUTES.home.path}
        className="inline-flex w-fit flex-col rounded-md px-1 py-1"
        aria-label="Ir para a pagina inicial do Couple Finance"
      >
        <span className="text-lg font-bold text-primary">Couple Finance</span>
        <span className="text-sm text-muted-foreground">Fundacao publica</span>
      </NavLink>

      <div className="flex flex-wrap items-center gap-2">
        <NavLink
          to={PUBLIC_ROUTES.home.path}
          className={({ isActive }) =>
            cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )
          }
        >
          Inicio
        </NavLink>
        {FUTURE_PROTECTED_AREAS.map((area) => (
          <FutureAreaIndicator
            key={area.label}
            label={area.label}
            intendedFeature={area.intendedFeature}
          />
        ))}
      </div>
    </nav>
  );
}
