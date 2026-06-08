import { Outlet } from "react-router-dom";

import { PublicNavigation } from "@/components/layout/public-navigation";

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <a
        href="#conteudo-principal"
        className="sr-only left-4 top-4 z-50 rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow-md focus:not-sr-only focus:fixed"
      >
        Pular para o conteudo principal
      </a>
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          <PublicNavigation />
        </div>
      </header>
      <main
        id="conteudo-principal"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 px-4 py-6 focus:outline-none sm:gap-12 sm:px-6 sm:py-8 lg:px-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
