# Implementation Plan: F13 - Layout principal com sidebar de dashboard

**Branch**: `013-dashboard-sidebar` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-dashboard-sidebar/spec.md`

## Summary

Implementar uma evolucao incremental do layout autenticado existente para um
padrao de dashboard com sidebar lateral em desktop e navegacao compacta em
tablet/mobile. A solucao preserva `ProtectedRoute`, sessao Supabase Auth,
rotas privadas existentes, paginas atuais e isolamento de dados, concentrando a
mudanca em `src/components/layout/`, `src/app/routes.ts`,
`src/app/router.tsx` quando necessario e testes de layout/rota. A F13 nao cria
novas paginas de produto, nao altera regras financeiras, nao adiciona
dependencias e nao modifica persistencia, RLS ou services.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme `package.json`.

**Primary Dependencies**: React, Vite, TailwindCSS 4, Shadcn/ui/Radix,
React Router, Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase
PostgreSQL/RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing
Library. TanStack Query nao aparece em `package.json` no estado atual; a F13
nao deve adiciona-lo nem alterar comportamento de server state.

**Storage**: N/A. A feature nao cria tabelas, migrations, storage, Prisma,
repositories, services de dados ou mudancas de persistencia.

**Testing**: `npm run lint`, `npm run format:check`, `npm run typecheck`,
`npm run test:run` e `npm run build`. Testes focam renderizacao do layout
autenticado, itens de navegacao, rota ativa, navegacao compacta, estados de
sessao e operacao por teclado.

**Target Platform**: Web SPA mobile-first, responsiva para mobile, tablet e
desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Manter navegacao entre modulos sem recarregamento
desnecessario, sem consulta adicional apenas para montar a sidebar e sem
prejudicar area util das telas financeiras.

**Constraints**: Nao alterar autenticacao, autorizacao, RLS, ownership,
membership, regras financeiras, schema, Prisma, services, repositories,
queries, dashboard interno, formularios, listagens ou graficos. Nao criar
paginas novas de Configuracoes ou Parceiro se nao existirem rotas estaveis.

**Scale/Scope**: Feature incremental sobre layout autenticado, configuracao de
rotas privadas, navegacao principal, estados de sessao e testes relacionados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Incremental Baseline**: PASS. A F13 evolui `AuthenticatedLayout` e
  reaproveita `ProtectedRoute`, `PRIVATE_ROUTES`, paginas privadas e features
  F00-F11 sem recria-las.
- **Simplicity & Visual Clarity**: PASS. A navegacao passa a priorizar destinos
  principais e orientacao, removendo o menu horizontal flex-wrap como padrao
  principal e evitando badges/textos decorativos.
- **Financial Transparency**: PASS. A feature nao altera dados financeiros nem
  oculta informacoes essenciais das paginas internas.
- **Mobile-First**: PASS. O plano exige modo compacto em mobile/tablet, sem
  rolagem horizontal obrigatoria e com acesso aos destinos principais.
- **Accessibility**: PASS. A rota ativa, landmarks, nomes acessiveis, foco
  visivel e operacao por teclado sao criterios centrais do design.
- **Security & Privacy**: PASS. A sidebar so existe dentro de `ProtectedRoute`,
  nao consulta dados privados adicionais e nao revela contagens ou estados
  sensiveis.
- **Technical Quality & Tests**: PASS. A navegacao sera centralizada em
  contratos/tipos pequenos e coberta por testes de componente e regressao.
- **Performance, Server State & Data Clarity**: PASS. Sem novas queries,
  invalidacoes, refetch global ou manipulacao de server state.
- **Prisma & Server-Side Boundary**: PASS. Prisma, schema, migrations e camada
  server-side estao fora do escopo.
- **PR Pipeline**: PASS. A validacao final usa lint, format check, typecheck,
  testes e build.

## Project Structure

### Documentation (this feature)

```text
specs/013-dashboard-sidebar/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- active-route-state.md
|   +-- authenticated-layout-state.md
|   +-- navigation-accessibility-review.md
|   +-- navigation-item.md
|   +-- responsive-navigation-behavior.md
+-- checklists/
|   +-- requirements.md
+-- spec.md
```

### Source Code (repository root)

```text
src/
+-- app/
|   +-- router.tsx
|   +-- routes.ts
+-- components/
|   +-- layout/
|   |   +-- authenticated-layout.tsx
|   |   +-- authenticated-layout.test.tsx
|   |   +-- app-layout.tsx
|   |   +-- public-navigation.tsx
|   +-- ui/
|   +-- feedback/
+-- features/
|   +-- auth/
|   +-- couple/
|   +-- permissions/
|   +-- dashboard/
|   +-- transactions/
|   +-- categories/
|   +-- goals/
|   +-- audit/
+-- pages/
+-- lib/
+-- test/
+-- styles/
```

**Structure Decision**: Manter a arquitetura existente. A F13 deve centralizar
layout e navegacao em `src/components/layout/`, manter paginas em `src/pages`
finas, reaproveitar `PRIVATE_ROUTES` como fonte de destinos e evitar mover
logica de dominio das features financeiras. Se for necessario extrair a lista
de navegacao, ela deve permanecer perto do layout, em arquivo pequeno e tipado
em `src/components/layout/`.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) define Authenticated
  Layout, Navigation Item, Active Route Match, Responsive Navigation Mode,
  Authenticated Layout State e Navigation Availability State.
- Contratos:
  [navigation-item.md](./contracts/navigation-item.md),
  [active-route-state.md](./contracts/active-route-state.md),
  [responsive-navigation-behavior.md](./contracts/responsive-navigation-behavior.md),
  [authenticated-layout-state.md](./contracts/authenticated-layout-state.md) e
  [navigation-accessibility-review.md](./contracts/navigation-accessibility-review.md).
- Quickstart: [quickstart.md](./quickstart.md) lista comandos, roteiro
  responsivo, teclado, rota ativa, estados de sessao e regressao dos modulos
  principais.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Incremental Baseline**: PASS. Contratos preservam rotas e paginas atuais,
  incluindo `/app`, transacoes, categorias, metas, auditoria, convite dinamico e
  registro de transacao.
- **Simplicity & Visual Clarity**: PASS. Navigation Item impede badges,
  contagens ou textos auxiliares sem funcao clara.
- **Financial Transparency**: PASS. Essential financial content continua nas
  paginas internas; a sidebar apenas orienta deslocamento.
- **Mobile-First**: PASS. Responsive Navigation Behavior cobre desktop, tablet,
  mobile, abertura/fechamento e area util.
- **Accessibility**: PASS. Navigation Accessibility Review cobre landmarks,
  nomes, foco, teclado, rota atual e modo compacto.
- **Security & Privacy**: PASS. Authenticated Layout State evita sidebar para
  usuario nao autenticado e proibe inferencias privadas.
- **Technical Quality & Tests**: PASS. Quickstart e contratos vinculam mudancas
  a testes de componente e regressao.
- **Performance, Server State & Data Clarity**: PASS. O design nao exige novas
  queries, server state ou dependencia.
- **Prisma & Server-Side Boundary**: PASS. Sem impacto em Prisma, schema,
  migrations, services ou APIs.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  testes e build.
