# Implementation Plan: F14 - Tabela de transacoes com TanStack Table

**Branch**: `014-transactions-table` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-transactions-table/spec.md`

## Summary

Evoluir a listagem autenticada de transacoes de uma lista de cards para uma
estrutura tabular baseada em TanStack Table, preservando a consulta autorizada
existente, filtros por URL, paginacao "Carregar mais", estados de interface,
permissoes, auditoria, isolamento individual/compartilhado e responsividade. A
implementacao fica concentrada em `src/features/transactions/`, adicionando uma
camada tipada para colunas, estado de ordenacao por data/valor e apresentacao
responsiva desktop/mobile. A F14 adiciona `@tanstack/react-table` para cumprir
a restricao catalogada da feature, mas nao altera schema, migrations, RLS,
RPCs, services de autorizacao, cadastro de transacao ou comportamento global de
server state.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme `package.json`.

**Primary Dependencies**: React, Vite, TailwindCSS 4, Shadcn/ui/Radix,
React Router, Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase
PostgreSQL/RLS, React Hook Form, Zod, ESLint, Prettier, Husky, lint-staged,
Vitest e Testing Library. `@tanstack/react-table` deve ser adicionado porque a
F14 exige TanStack Table e ele nao aparece em `package.json` no estado atual.
TanStack Query tambem nao aparece em `package.json`; a F14 nao deve adiciona-lo
nem alterar refetch/invalidation, que pertencem a F15.

**Storage**: Reutilizar a RPC `list_financial_transactions`,
`public.financial_transactions`, categorias e budget members existentes. Nao ha
nova tabela, migration, schema, Prisma, repository server-side ou mudanca de
RLS.

**Testing**: `npm run lint`, `npm run format:check`, `npm run typecheck`,
`npm run test:run` e `npm run build`. Testes cobrem colunas, celulas,
formatacao, ordenacao, filtros, estados da lista, acoes por permissao,
responsividade e acessibilidade pratica com Testing Library.

**Target Platform**: Web SPA mobile-first, responsiva para mobile, tablet e
desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Manter a listagem fluida para paginas de 50 transacoes
autorizadas e historicos carregados incrementalmente; evitar recalculo
desnecessario de colunas/dados derivados; preservar resposta perceptivel em
ate um segundo sob uso normal definido pela F06.

**Constraints**: Preservar filtros existentes por mes, categoria, responsavel,
tipo e texto; manter semantica de autorizacao da RPC/RLS; ordenar apenas
transacoes ja autorizadas e carregadas; nao exigir rolagem horizontal em
mobile; nao revelar dados ou acoes sem permissao; nao alterar cadastro,
edicao, exclusao, auditoria, schema, RLS, Prisma ou comportamento global de
server state.

**Scale/Scope**: Evolucao incremental da listagem de transacoes existente,
incluindo dependencia TanStack Table, componentes/colunas da tabela, sort
state, alternativa responsiva, testes e documentacao de contratos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Incremental Baseline**: PASS. A F14 reaproveita F05, F06, F03, F09, F11,
  F12 e F13 sem recriar autenticacao, consulta, formulario, permissoes,
  auditoria ou layout autenticado.
- **Simplicity & Visual Clarity**: PASS. A tabela prioriza campos essenciais,
  remove a leitura em frases longas dos cards e evita badges, graficos ou
  textos sem funcao.
- **Financial Transparency**: PASS. Valor, tipo, categoria, data,
  responsavel, visibilidade e acoes continuam explicitos em desktop e mobile.
- **Mobile-First**: PASS. O plano exige alternativa compacta sem rolagem
  horizontal obrigatoria e compatibilidade com a area util do layout F13.
- **Accessibility**: PASS. Cabecalhos, ordenacao, filtros, estados, foco,
  teclado e nomes acessiveis das acoes sao criterios centrais.
- **Security & Privacy**: PASS. A tabela consome apenas dados autorizados da
  camada existente e nao altera RLS, membership, ownership ou mensagens seguras.
- **Technical Quality & Tests**: PASS. Colunas, sort state, adaptacao
  responsiva e permissoes ficam tipados em modulos pequenos com testes
  proporcionais.
- **Performance, Server State & Data Clarity**: PASS. Sem novas consultas ou
  refetch global; ordenacao local sobre dados carregados; paginacao existente
  continua como limite de volume.
- **Prisma & Server-Side Boundary**: PASS. Prisma, schema, migrations e camada
  server-side ficam fora do escopo.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  testes e build.

## Project Structure

### Documentation (this feature)

```text
specs/014-transactions-table/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- responsive-transaction-table.md
|   +-- transaction-action-availability.md
|   +-- transaction-column-definition.md
|   +-- transaction-filter-integration.md
|   +-- transaction-sort-state.md
|   +-- transaction-table-accessibility-review.md
|   +-- transaction-table-row.md
+-- checklists/
|   +-- requirements.md
+-- spec.md
```

### Source Code (repository root)

```text
src/
+-- features/
|   +-- transactions/
|   |   +-- transaction-table.tsx
|   |   +-- transaction-table.test.tsx
|   |   +-- transaction-table-columns.tsx
|   |   +-- transaction-table-columns.test.tsx
|   |   +-- transaction-table-sort.ts
|   |   +-- transaction-table-sort.test.ts
|   |   +-- transaction-list.tsx
|   |   +-- transaction-list.test.tsx
|   |   +-- transaction-list-controls.tsx
|   |   +-- transaction-list-controls.test.tsx
|   |   +-- transaction-list-item.tsx
|   |   +-- transaction-list-types.ts
|   |   +-- transaction-money.ts
|   |   +-- transaction-query.ts
|   |   +-- use-transaction-list.ts
+-- pages/
|   +-- transactions-page.tsx
|   +-- transactions-page.test.tsx
+-- components/
|   +-- feedback/
|   +-- layout/
|   +-- ui/
+-- app/
+-- lib/
+-- test/
package.json
```

**Structure Decision**: Manter a arquitetura feature-based. A F14 deve
concentrar tabela, colunas e ordenacao em `src/features/transactions/`, onde ja
existem tipos, filtros, servico, hook e testes da listagem. `src/pages` continua
fino e apenas compoe filtros, modal de registro e listagem. A camada Supabase
existente permanece como fonte de dados autorizados; `src/components/ui` so
recebe alteracao se houver componente generico necessario e ja alinhado aos
padroes atuais.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) define Transaction Table
  Row, Transaction Column Definition, Transaction Sort State, Transaction
  Filter State, Transaction List State, Transaction Action Availability e
  Responsive Transaction Presentation.
- Contratos:
  [transaction-table-row.md](./contracts/transaction-table-row.md),
  [transaction-column-definition.md](./contracts/transaction-column-definition.md),
  [transaction-sort-state.md](./contracts/transaction-sort-state.md),
  [transaction-filter-integration.md](./contracts/transaction-filter-integration.md),
  [transaction-action-availability.md](./contracts/transaction-action-availability.md),
  [responsive-transaction-table.md](./contracts/responsive-transaction-table.md)
  e
  [transaction-table-accessibility-review.md](./contracts/transaction-table-accessibility-review.md).
- Quickstart: [quickstart.md](./quickstart.md) lista instalacao da dependencia,
  comandos de validacao, roteiro responsivo, filtros, ordenacao, permissoes,
  teclado, estados e regressao de fluxos de transacao.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Incremental Baseline**: PASS. Contratos preservam a RPC e estados da F06,
  formulario da F05, permissoes da F03, auditoria da F09 e layout da F13.
- **Simplicity & Visual Clarity**: PASS. Column Definition limita a tabela aos
  campos essenciais e proibe ornamentos sem funcao.
- **Financial Transparency**: PASS. Table Row e Responsive Presentation mantem
  contexto individual/compartilhado, responsavel, valor, tipo, categoria e data.
- **Mobile-First**: PASS. Responsive Transaction Table define tabela em telas
  amplas e apresentacao compacta em mobile sem rolagem horizontal obrigatoria.
- **Accessibility**: PASS. Accessibility Review cobre cabecalhos, aria-sort,
  nomes de acoes, foco, teclado, estados e alternativa mobile.
- **Security & Privacy**: PASS. Action Availability e Filter Integration
  impedem ampliacao de dados e acoes fora das permissoes existentes.
- **Technical Quality & Tests**: PASS. Quickstart e contratos exigem testes de
  colunas, sort, filtros, permissoes, estados e responsividade.
- **Performance, Server State & Data Clarity**: PASS. Sort State opera sobre
  dados carregados, mantem load more e evita novas queries/refetch global.
- **Prisma & Server-Side Boundary**: PASS. Sem Prisma, migrations, schema,
  services server-side ou APIs novas.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  test run e build.
