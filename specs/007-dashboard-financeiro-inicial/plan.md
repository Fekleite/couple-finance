# Implementation Plan: F07 - Dashboard financeiro inicial

**Branch**: `007-dashboard-financeiro-inicial` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-dashboard-financeiro-inicial/spec.md`

## Summary

Implementar o primeiro dashboard mensal privado do Couple Finance. Uma RPC de
leitura `security invoker` retorna, em uma resposta coordenada sob RLS, os
indicadores autorizados do mes civil selecionado e uma lista curta das
transacoes autorizadas mais recentes. O frontend substitui a area inicial
privada por uma pagina fina de dashboard em `/app`, com modulos dedicados em
`src/features/dashboard`, reutilizando contratos de mes civil, dinheiro,
visibilidade e resumo de transacao da F05-F06 sem implementar graficos, filtros
detalhados, relatorios, metas ou mutacoes.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL,
Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
TanStack Query, React Hook Form, Zod, Recharts e bibliotecas de data,
agregacao, virtualizacao ou estado nao sao necessarios nesta feature.

**Storage**: Reutilizar `public.financial_transactions`,
`public.standard_financial_categories` e `public.budget_members`. Nova migration
adiciona somente a RPC de dashboard e, se necessario, indices alinhados ao
periodo, escopo, tipo e ordenacao, sem criar tabela, snapshot ou cache de
indicadores.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem mes
civil, agregacoes autorizadas, saldo, leitura positivo/negativo/zero,
transacoes recentes, concorrencia, estados, rota, migration, RPC, grants, RLS e
revogacao de acesso compartilhado.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Atualizar indicadores e transacoes recentes em ate um
segundo sob uso normal para meses com ate 1.000 transacoes autorizadas; renderizar
somente indicadores e ate 5 transacoes recentes; preservar meta Lighthouse acima
de 90.

**Constraints**: Toda saida deriva apenas de linhas autorizadas; mes civil e
obrigatorio; agregacoes rodam no banco; lista recente e curta e sem paginacao;
sem contagens, graficos, filtros detalhados, relatorios, metas, comparacoes ou
mutacoes; dados compartilhados revogados deixam de aparecer na proxima consulta.

**Scale/Scope**: Setima feature privada do MVP: uma migration de consulta, uma
RPC publica fina, nova feature modular de dashboard, atualizacao da rota privada
inicial e contratos reutilizaveis para F08 sem implementar graficos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. O dashboard usa mes atual, quatro indicadores e
  uma lista curta de contexto, mantendo uma leitura rapida.
- **Financial Transparency**: PASS. Receitas, despesas, saldo,
  economia/deficit, responsabilidade e visibilidade permanecem conceitos
  distintos e rotulados.
- **Mobile-First**: PASS. A tela inicial prioriza empilhamento responsivo,
  indicadores legiveis e acoes essenciais sem dependencia de desktop.
- **Accessibility**: PASS. Periodo, indicadores, retry e transacoes recentes
  exigem labels, foco visivel, teclado, semantica e atualizacoes perceptiveis.
- **Security & Privacy**: PASS. RPC `security invoker`, RLS e ausencia de
  contagens impedem exposicao direta e indireta de dados inacessiveis.
- **Technical Quality**: PASS. Consulta, estado, indicadores e apresentacao
  ficam separados em modulos tipados, sem acoplar dashboard a lista ou formulario.
- **Performance & Financial Data Clarity**: PASS. Agregacoes server-side,
  limite de itens recentes e formatos compartilhados preservam fluidez e
  consistencia financeira.

## Project Structure

### Documentation (this feature)

```text
specs/007-dashboard-financeiro-inicial/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── authorized-dashboard-query.md
│   ├── dashboard-indicator-set.md
│   ├── dashboard-recent-transaction.md
│   ├── dashboard-state.md
│   └── dashboard-query-authorization.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_financial_dashboard_initial.sql
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── routes.test.ts
│   │   └── routes.ts
│   ├── components/
│   │   ├── feedback/
│   │   └── ui/
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── dashboard-indicator-card.test.tsx
│   │   │   ├── dashboard-indicator-card.tsx
│   │   │   ├── dashboard-messages.test.ts
│   │   │   ├── dashboard-messages.ts
│   │   │   ├── dashboard-recent-transaction.test.tsx
│   │   │   ├── dashboard-recent-transaction.tsx
│   │   │   ├── dashboard-service.test.ts
│   │   │   ├── dashboard-service.ts
│   │   │   ├── dashboard-state.test.ts
│   │   │   ├── dashboard-state.ts
│   │   │   ├── dashboard-summary.test.ts
│   │   │   ├── dashboard-summary.ts
│   │   │   ├── dashboard-types.ts
│   │   │   ├── dashboard-view.test.tsx
│   │   │   ├── dashboard-view.tsx
│   │   │   ├── index.ts
│   │   │   ├── use-dashboard.test.tsx
│   │   │   └── use-dashboard.ts
│   │   ├── categories/
│   │   ├── couple/
│   │   ├── permissions/
│   │   └── transactions/
│   │       ├── transaction-list-item.tsx
│   │       ├── transaction-money.ts
│   │       ├── transaction-month.ts
│   │       └── transaction-types.ts
│   ├── pages/
│   │   ├── private-home-page.test.tsx
│   │   └── private-home-page.tsx
│   └── test/
│       └── dashboard-test-utils.ts
└── specs/
    └── 007-dashboard-financeiro-inicial/
```

**Structure Decision**: Criar `src/features/dashboard` para manter o dashboard
como experiencia propria, fina e reutilizavel, enquanto importa contratos
estaveis de `src/features/transactions` apenas para mes civil, moeda,
visibilidade e resumo de movimentacao. `private-home-page.tsx` passa a coordenar
rota, titulo e contexto de autorizacao; a RPC e o hook controlam leitura,
concorrencia e estados; componentes apresentam indicadores e itens recentes sem
conter regras de acesso.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve periodo, consulta,
  resposta autorizada, indicadores, leitura do resultado, transacao recente e
  estados.
- Contratos: [authorized-dashboard-query.md](./contracts/authorized-dashboard-query.md),
  [dashboard-indicator-set.md](./contracts/dashboard-indicator-set.md),
  [dashboard-recent-transaction.md](./contracts/dashboard-recent-transaction.md),
  [dashboard-state.md](./contracts/dashboard-state.md) e
  [dashboard-query-authorization.md](./contracts/dashboard-query-authorization.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. O desenho limita a rota a consultar mes, revisar
  indicadores, tentar novamente e abrir a lista completa quando existir.
- **Financial Transparency**: PASS. Contratos de indicador e item recente
  preservam tipo, total, saldo, resultado, responsavel, autoria e visibilidade.
- **Mobile-First**: PASS. Indicadores e lista curta possuem composicao
  responsiva sem rolagem horizontal.
- **Accessibility**: PASS. Contratos exigem semantica, foco estavel, teclado,
  regioes nomeadas e anuncios moderados de estado.
- **Security & Privacy**: PASS. Uma resposta coordenada sob RLS deriva totais,
  itens e estados apenas das linhas autorizadas.
- **Technical Quality**: PASS. Fronteiras do dashboard nao acoplam agregacoes
  ao frontend, a lista da F06 ou ao formulario da F05.
- **Performance & Financial Data Clarity**: PASS. Agregacoes no banco, limite
  de 5 itens e indices por escopo sustentam o volume definido.
