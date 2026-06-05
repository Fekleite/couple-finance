# Implementation Plan: F08 - Graficos basicos

**Branch**: `008-graficos-basicos` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-graficos-basicos/spec.md`

## Summary

Implementar graficos basicos dentro do dashboard privado do Couple Finance. Uma
RPC dedicada `security invoker` retorna, em uma resposta coordenada sob RLS, a
distribuicao de despesas por categoria do mes selecionado, uma evolucao curta
de receitas, despesas e saldo, e um comparativo neutro de responsabilidades
compartilhadas quando houver vinculo ativo. O frontend evolui
`src/features/dashboard` com componentes nativos acessiveis em HTML/CSS/SVG,
reutilizando contratos de mes civil, dinheiro, visibilidade, categorias,
responsaveis e estados da F04-F07, sem criar relatorios avancados, filtros
detalhados, drill-down, metas, mutacoes ou nova dependencia de graficos.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL,
Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
Recharts, TanStack Query, bibliotecas de data, estado global, virtualizacao,
animacao ou relatorio nao serao adicionadas nesta feature.

**Storage**: Reutilizar `public.financial_transactions`,
`public.standard_financial_categories` e `public.budget_members`. Nova migration
adiciona somente a RPC de graficos e, se necessario, indices complementares
para periodo, tipo, categoria, visibilidade, `shared_budget_id` e responsavel,
sem criar tabela, snapshot, cache persistente ou relatorio materializado.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem mes
civil, janela de evolucao, agregacoes autorizadas, categorias, empates, meses
vazios, comparativo neutro, isolamento individual/compartilhado, concorrencia,
estados, resumos acessiveis, rota, migration, RPC, grants, RLS e revogacao de
acesso compartilhado.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Atualizar os graficos em ate um segundo sob uso normal
para periodos com ate 1.000 transacoes autorizadas; renderizar somente agregados
e series curtas; preservar meta Lighthouse acima de 90.

**Constraints**: Toda saida deriva apenas de linhas autorizadas; mes civil e
obrigatorio; agregacoes rodam no banco; evolucao mensal e curta; comparativo
usa somente dados compartilhados autorizados; graficos possuem resumo textual;
sem contagens de faceta, filtros detalhados, drill-down, relatorios, metas,
exportacao, recomendacoes ou mutacoes; dados compartilhados revogados deixam de
aparecer na proxima consulta.

**Scale/Scope**: Oitava feature privada do MVP: uma RPC publica fina, evolucao
modular do dashboard, componentes nativos de grafico, contratos reutilizaveis
para visualizacoes basicas e atualizacao da referencia de plano em `AGENTS.md`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A feature adiciona tres visualizacoes basicas
  dentro do dashboard, mantendo a leitura rapida e evitando superficie de
  relatorio.
- **Financial Transparency**: PASS. Categorias, receitas, despesas, saldo,
  responsabilidade, autoria quando relevante e visibilidade continuam
  conceitos distintos e rotulados.
- **Mobile-First**: PASS. Graficos usam composicao responsiva, resumos
  textuais e series curtas sem dependencia de desktop ou rolagem horizontal.
- **Accessibility**: PASS. Cada grafico exige titulo, legenda, estrutura
  semantica, foco previsivel, texto equivalente e valores essenciais fora de
  tooltips.
- **Security & Privacy**: PASS. RPC `security invoker`, RLS e mensagens
  seguras impedem exposicao direta ou indireta de dados inacessiveis.
- **Technical Quality**: PASS. Consulta, estado, agregacao, apresentacao e
  resumos ficam em modulos tipados e testaveis dentro de `src/features/dashboard`.
- **Performance & Financial Data Clarity**: PASS. Agregacoes server-side,
  series curtas, centavos inteiros e formatos reutilizados preservam fluidez e
  consistencia financeira.

## Project Structure

### Documentation (this feature)

```text
specs/008-graficos-basicos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── accessible-chart-summary.md
│   ├── authorized-chart-query.md
│   ├── category-expense-distribution.md
│   ├── chart-query-authorization.md
│   ├── chart-state.md
│   ├── member-responsibility-comparison.md
│   └── monthly-evolution.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_basic_financial_charts.sql
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
│   │   │   ├── accessible-chart-summary.test.ts
│   │   │   ├── accessible-chart-summary.ts
│   │   │   ├── category-expense-chart.test.tsx
│   │   │   ├── category-expense-chart.tsx
│   │   │   ├── dashboard-chart-messages.test.ts
│   │   │   ├── dashboard-chart-messages.ts
│   │   │   ├── dashboard-chart-service.test.ts
│   │   │   ├── dashboard-chart-service.ts
│   │   │   ├── dashboard-chart-state.test.ts
│   │   │   ├── dashboard-chart-state.ts
│   │   │   ├── dashboard-chart-types.ts
│   │   │   ├── dashboard-charts-section.test.tsx
│   │   │   ├── dashboard-charts-section.tsx
│   │   │   ├── dashboard-view.tsx
│   │   │   ├── member-comparison-chart.test.tsx
│   │   │   ├── member-comparison-chart.tsx
│   │   │   ├── monthly-evolution-chart.test.tsx
│   │   │   ├── monthly-evolution-chart.tsx
│   │   │   ├── use-dashboard-charts.test.tsx
│   │   │   └── use-dashboard-charts.ts
│   │   ├── categories/
│   │   ├── couple/
│   │   ├── permissions/
│   │   └── transactions/
│   │       ├── transaction-money.ts
│   │       ├── transaction-month.ts
│   │       └── transaction-types.ts
│   ├── pages/
│   │   ├── private-home-page.test.tsx
│   │   └── private-home-page.tsx
│   └── test/
│       ├── dashboard-chart-test-utils.ts
│       └── dashboard-test-utils.ts
└── specs/
    └── 008-graficos-basicos/
```

**Structure Decision**: Evoluir `src/features/dashboard` em vez de criar
`src/features/charts`, porque os graficos da F08 pertencem ao contexto mensal do
dashboard F07 e nao a uma area analitica independente. A fronteira continua
baixa em acoplamento: servico/RPC, hook, estado, componentes de grafico e
resumos acessiveis ficam separados, enquanto `dashboard-view.tsx` apenas compoe
indicadores, transacoes recentes e a nova secao de graficos.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve periodo, consulta,
  resposta autorizada, distribuicao por categoria, evolucao mensal, comparativo,
  resumo acessivel e estados.
- Contratos: [authorized-chart-query.md](./contracts/authorized-chart-query.md),
  [category-expense-distribution.md](./contracts/category-expense-distribution.md),
  [monthly-evolution.md](./contracts/monthly-evolution.md),
  [member-responsibility-comparison.md](./contracts/member-responsibility-comparison.md),
  [accessible-chart-summary.md](./contracts/accessible-chart-summary.md),
  [chart-state.md](./contracts/chart-state.md) e
  [chart-query-authorization.md](./contracts/chart-query-authorization.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. A solucao permanece no dashboard e limita a
  interacao a selecionar periodo, revisar tres graficos e tentar novamente.
- **Financial Transparency**: PASS. Contratos preservam categoria, tipo, saldo,
  responsabilidade, autoria quando relevante, visibilidade e contexto do mes.
- **Mobile-First**: PASS. Componentes usam barras/listas/series curtas
  responsivas e resumos textuais sem rolagem horizontal.
- **Accessibility**: PASS. Contratos exigem texto equivalente, semantica,
  teclado, foco visivel, legendas e valores essenciais fora de tooltips.
- **Security & Privacy**: PASS. Uma resposta coordenada sob RLS deriva todos os
  valores, pesos, legendas e estados apenas das linhas autorizadas.
- **Technical Quality**: PASS. O desenho reaproveita F04-F07 e separa consulta,
  estado, apresentacao e mensagens em modulos tipados.
- **Performance & Financial Data Clarity**: PASS. Agregacoes no banco, series
  pequenas e ausencia de nova dependencia sustentam desempenho e clareza.
