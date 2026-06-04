# Implementation Plan: F06 - Lista e filtros de transacoes

**Branch**: `006-list-filter-transactions` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-list-filter-transactions/spec.md`

## Summary

Implementar a primeira consulta mensal de transacoes autorizadas do Couple
Finance. Uma RPC de leitura `security invoker` aplica periodo, filtros, busca
normalizada, ordenacao e paginacao sobre `public.financial_transactions`,
preservando a RLS da F05 e retornando em uma resposta coordenada somente itens,
opcoes historicas autorizadas e metadados seguros. O frontend evolui
`src/features/transactions` com contratos de consulta e a rota privada
`/app/transactions`, sem implementar totais, detalhes, mutacoes ou dashboard.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL,
Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
TanStack Query, React Hook Form, Zod, Recharts e bibliotecas de data, busca ou
paginacao nao sao necessarios nesta feature.

**Storage**: Reutilizar `public.financial_transactions`,
`public.standard_financial_categories` e `public.budget_members`. Nova migration
adiciona a RPC de consulta, funcao imutavel de normalizacao textual e indices
compostos justificados pelos filtros reais, sem criar outra tabela financeira.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem mes
civil, filtros, busca normalizada, cursor, concorrencia, estados, rota,
migration, RPC, grants, RLS e revogacao de acesso.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Atualizar resultados em ate um segundo sob uso normal
para meses com ate 1.000 transacoes autorizadas; retornar paginas de 50 itens;
nenhuma resposta antiga substitui a selecao mais recente; preservar meta
Lighthouse acima de 90.

**Constraints**: Toda saida deriva apenas de linhas autorizadas; mes e
obrigatorio; filtros adicionais usam semantica `AND`; busca ignora caixa,
acentuacao e espacos externos; sem contagens, agregacoes, detalhes ou mutacoes;
contexto compartilhado removido deve deixar de aparecer na proxima consulta.

**Scale/Scope**: Sexta feature privada do MVP: uma migration de consulta, uma
RPC publica fina, extensao modular da feature de transacoes, uma rota
autenticada e contratos reutilizaveis de consulta para F07-F08 sem implementar
essas features.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. Mes atual, filtros removiveis e estados distintos
  mantem a consulta direta e compreensivel.
- **Financial Transparency**: PASS. Cada item preserva tipo, valor, categoria,
  responsavel, autoria relevante e visibilidade como conceitos distintos.
- **Mobile-First**: PASS. Controles compactos, painel de filtros e lista
  paginada funcionam sem dependencia de desktop.
- **Accessibility**: PASS. Mes, filtros, busca, retry e continuacao exigem
  labels, teclado, foco visivel, semantica e atualizacoes perceptiveis.
- **Security & Privacy**: PASS. RPC `security invoker`, RLS e metadados
  derivados somente do universo autorizado evitam exposicao direta e indireta.
- **Technical Quality**: PASS. Consulta, estado, apresentacao e pagina de rota
  possuem fronteiras tipadas e separadas dos modulos de criacao.
- **Performance & Financial Data Clarity**: PASS. Filtros server-side, cursor
  estavel, paginas limitadas e formatadores existentes preservam fluidez e
  consistencia.

## Project Structure

### Documentation (this feature)

```text
specs/006-list-filter-transactions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── authorized-transaction-query.md
│   ├── transaction-filter-set.md
│   ├── transaction-list-item.md
│   ├── transaction-list-state.md
│   └── transaction-query-authorization.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_list_filter_financial_transactions.sql
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── routes.test.ts
│   │   └── routes.ts
│   ├── components/
│   │   ├── feedback/
│   │   └── ui/
│   ├── features/
│   │   ├── categories/
│   │   ├── couple/
│   │   ├── permissions/
│   │   └── transactions/
│   │       ├── index.ts
│   │       ├── transaction-filters.test.ts
│   │       ├── transaction-filters.ts
│   │       ├── transaction-list-item.test.tsx
│   │       ├── transaction-list-item.tsx
│   │       ├── transaction-list.test.tsx
│   │       ├── transaction-list.tsx
│   │       ├── transaction-list-controls.test.tsx
│   │       ├── transaction-list-controls.tsx
│   │       ├── transaction-list-messages.ts
│   │       ├── transaction-list-service.test.ts
│   │       ├── transaction-list-service.ts
│   │       ├── transaction-list-types.ts
│   │       ├── transaction-month.test.ts
│   │       ├── transaction-month.ts
│   │       ├── transaction-query.test.ts
│   │       ├── transaction-query.ts
│   │       ├── use-transaction-list.test.tsx
│   │       └── use-transaction-list.ts
│   ├── pages/
│   │   ├── transactions-page.test.tsx
│   │   └── transactions-page.tsx
│   └── test/
│       └── transaction-list-test-utils.ts
└── specs/
    └── 006-list-filter-transactions/
```

**Structure Decision**: Manter a SPA no root e evoluir
`src/features/transactions` como API interna compartilhada por criacao e
consulta, com modulos de lista explicitamente separados. A pagina coordena
somente rota e titulo; funcoes puras canonicalizam mes, filtros e cursor; o
servico chama uma RPC autorizada; o hook controla concorrencia, paginas e
estados; componentes apresentam controles e itens sem conter regras de acesso.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve consulta, filtros,
  cursor, resultado autorizado, opcoes e estados.
- Contratos: [authorized-transaction-query.md](./contracts/authorized-transaction-query.md),
  [transaction-filter-set.md](./contracts/transaction-filter-set.md),
  [transaction-list-item.md](./contracts/transaction-list-item.md),
  [transaction-list-state.md](./contracts/transaction-list-state.md) e
  [transaction-query-authorization.md](./contracts/transaction-query-authorization.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. O desenho limita a rota a consultar, filtrar,
  limpar, tentar novamente e carregar mais.
- **Financial Transparency**: PASS. Contratos de item mantem contexto
  financeiro explicito sem totais ou inferencias.
- **Mobile-First**: PASS. Controles e lista possuem composicao responsiva e
  paginacao acionavel.
- **Accessibility**: PASS. Contratos exigem semantica, foco estavel, teclado e
  anuncios moderados de estado.
- **Security & Privacy**: PASS. Uma resposta coordenada sob RLS deriva itens,
  opcoes e estados apenas das linhas autorizadas.
- **Technical Quality**: PASS. Fronteiras de consulta nao acoplam lista ao
  formulario nem antecipam dashboard.
- **Performance & Financial Data Clarity**: PASS. Cursor composto, paginas de
  50, busca limitada e indices por escopo sustentam o volume definido.
