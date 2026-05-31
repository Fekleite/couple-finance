import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { setPageTitle } from "@/lib/page-title";

export function NotFoundPage() {
  useEffect(() => {
    setPageTitle("Pagina nao encontrada");
  }, []);

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-5 py-12">
      <p className="section-eyebrow">Rota nao encontrada</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Nao encontramos esta pagina</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        O caminho acessado nao faz parte da fundacao publica atual. Voce pode voltar para a pagina
        inicial e continuar a partir das areas disponiveis.
      </p>
      <Button asChild size="lg" className="w-fit">
        <Link to="/" aria-label="Voltar para a pagina inicial do Couple Finance">
          Voltar ao inicio
        </Link>
      </Button>
    </section>
  );
}
