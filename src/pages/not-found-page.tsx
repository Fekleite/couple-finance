import { useEffect } from "react";
import { Link } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { setPageTitle } from "@/lib/page-title";

export function NotFoundPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    setPageTitle("Pagina nao encontrada");
  }, []);

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Rota nao encontrada
      </p>
      <h1 className="text-3xl font-bold sm:text-4xl">Nao encontramos esta pagina</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        O caminho acessado nao faz parte das areas disponiveis. Voce pode voltar para um ponto
        seguro e continuar sem expor informacoes privadas.
      </p>
      <Button asChild size="lg" className="w-fit">
        <Link
          to={isAuthenticated ? PRIVATE_ROUTES.app.path : PUBLIC_ROUTES.home.path}
          aria-label="Voltar para uma area segura do Couple Finance"
        >
          {isAuthenticated ? "Voltar ao espaco privado" : "Voltar ao inicio"}
        </Link>
      </Button>
    </section>
  );
}
