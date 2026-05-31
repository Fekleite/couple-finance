import { useEffect } from "react";

import { PUBLIC_ROUTES } from "@/app/routes";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { setPageTitle } from "@/lib/page-title";

const PRINCIPLES = [
  {
    title: "Clareza para os dois",
    text: "A fundacao do produto nasce para reduzir duvidas e facilitar conversas financeiras sem julgamento."
  },
  {
    title: "Privacidade desde o comeco",
    text: "Esta etapa nao coleta, salva ou exibe dados financeiros. Ela apenas prepara uma experiencia confiavel."
  },
  {
    title: "Simplicidade antes de volume",
    text: "A interface inicial prioriza leitura, navegacao e estados basicos antes de qualquer fluxo financeiro."
  }
];

export function HomePage() {
  useEffect(() => {
    setPageTitle(PUBLIC_ROUTES.home.title);
  }, []);

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="section-eyebrow">Organizacao financeira para casais</p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
            Couple Finance
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Uma base simples, acolhedora e transparente para casais organizarem a vida financeira
            juntos, com clareza sobre o que existe hoje e cuidado com o que vira depois.
          </p>
        </div>

        <aside className="rounded-lg border border-border bg-muted p-5" aria-label="Escopo atual">
          <h2 className="text-xl font-semibold">O que esta disponivel nesta fundacao</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A F00 entrega a primeira tela publica, navegacao base, pagina de rota nao encontrada e
            componentes reutilizaveis de feedback. Autenticacao, transacoes, dashboard, metas,
            graficos e persistencia ainda nao estao ativos.
          </p>
        </aside>
      </section>

      <section aria-labelledby="principios-title">
        <p className="section-eyebrow">Tom do produto</p>
        <h2 id="principios-title" className="mt-2 text-2xl font-bold">
          Clareza, privacidade e simplicidade
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.title}
              className="rounded-lg border border-border bg-background p-5"
            >
              <h3 className="text-lg font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="feedback-title">
        <p className="section-eyebrow">Estados basicos</p>
        <h2 id="feedback-title" className="mt-2 text-2xl font-bold">
          Feedback preparado para telas futuras
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <LoadingState
            title="Preparando a experiencia"
            message="Use este estado quando uma tela futura estiver carregando informacoes com seguranca."
          />
          <EmptyState
            title="Nada para mostrar por enquanto"
            message="Este estado comunica ausencia esperada de conteudo, sem sugerir falha ou dados perdidos."
          />
          <ErrorState
            title="Nao foi possivel concluir agora"
            message="Quando houver recuperacao possivel, o estado deve orientar o proximo passo de forma clara."
            actionLabel="Voltar ao inicio"
            actionHref="/"
          />
        </div>
      </section>
    </>
  );
}
