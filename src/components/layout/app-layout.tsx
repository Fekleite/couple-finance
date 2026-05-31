import { Outlet } from "react-router-dom";

import { PublicNavigation } from "@/components/layout/public-navigation";

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <PublicNavigation />
        </div>
      </header>
      <main id="conteudo-principal" className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
