# Implementation Plan: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

**Branch**: `015-disable-focus-refetch` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-disable-focus-refetch/spec.md`

## Summary

Endurecer o comportamento atual de server state para garantir que a aplicacao
nao recarregue dados remotos apenas porque a janela ou aba voltou a ter foco,
preservando atualizacoes controladas apos acoes financeiras explicitas. A
auditoria do codigo mostra que `@tanstack/react-query` nao esta instalado nem
em uso; os fluxos remotos usam hooks locais com `useEffect`, services Supabase,
`requestId`, `AbortController`, `retry` explicito e recarregamento por mudanca
de filtro/contexto/mutacao. Portanto a F15 nao deve introduzir TanStack Query
vazio nem migrar server state de forma ampla; deve documentar a divergencia,
definir uma politica tecnica para futura adocao de Query Client e adicionar
testes de regressao nos hooks remotos atuais contra recarregamento por foco.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme `package.json`.

**Primary Dependencies**: React, Vite, TailwindCSS 4, Shadcn/ui/Radix, React
Router, Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase
PostgreSQL/RLS, React Hook Form, Zod, Recharts, `@tanstack/react-table`,
ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
`@tanstack/react-query` nao aparece em `package.json` e nao ha uso de
`QueryClient`, `QueryClientProvider`, `useQuery`, `useMutation`,
`invalidateQueries` ou `refetchOnWindowFocus` em `src/`.

**Storage**: Reutilizar os services, RPCs/tabelas Supabase e RLS existentes.
Nao ha nova tabela, migration, schema, Prisma, repository server-side, policy
ou alteracao de persistencia.

**Testing**: `npm run lint`, `npm run format:check`, `npm run typecheck`,
`npm run test:run` e `npm run build`. Testes focam hooks remotos atuais,
politica de server state, ausencia de refetch por foco, atualizacoes
controladas por retry/mutacao e preservacao de filtros/contexto.

**Target Platform**: Web SPA mobile-first, responsiva para mobile, tablet e
desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Zero recarregamento visual causado apenas por evento de
foco em fluxos testados; manter dados ja carregados visiveis enquanto nao
houver acao explicita, mudanca de filtros/contexto ou excecao documentada;
preservar resposta perceptivel em ate um segundo sob uso normal definido pelas
features anteriores.

**Constraints**: Nao introduzir `@tanstack/react-query` sem fluxo real a migrar;
nao criar provider vazio; nao reescrever transacoes, dashboard, metas,
categorias, casal ou auditoria; nao alterar schema, RLS, Supabase Auth,
permissoes, auditoria, Prisma ou regras financeiras; nao depender de troca de
aba para atualizar dados apos mutacoes.

**Scale/Scope**: Hardening incremental do padrao de server state existente,
incluindo pesquisa, contratos, quickstart, possiveis testes de regressao e
documentacao tecnica. A implementacao futura deve se concentrar em hooks com
dados remotos, nao em migracao arquitetural ampla.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Incremental Baseline**: PASS. A F15 preserva F00-F14 e atua somente sobre
  comportamento de carregamento/atualizacao em hooks remotos ja existentes.
- **Simplicity & Visual Clarity**: PASS. A solucao reduz flicker/loading sem
  adicionar UI, cards, textos ou estados visuais novos.
- **Financial Transparency**: PASS. Dados financeiros ja exibidos permanecem
  estaveis; atualizacoes controladas continuam refletindo mutacoes reais.
- **Mobile-First**: PASS. O contrato cobre retorno de aba/janela e retomada de
  app mobile sem refetch global por foco.
- **Accessibility**: PASS. Estados de loading/erro/sucesso continuam ligados a
  acoes reais ou retry explicito; nao ha novos controles inacessiveis.
- **Security & Privacy**: PASS. Services, RPCs, RLS e autorizacao existentes
  continuam sendo a fonte de dados; erros nao devem revelar dados indevidos.
- **Technical Quality & Tests**: PASS. O plano exige testes proporcionais para
  hooks remotos e documenta a politica futura para Query Client.
- **Performance, Server State & Data Clarity**: PASS. A F15 formaliza que nao
  ha refetch por foco no codigo atual e protege esse comportamento por
  contratos/testes; TanStack Query futuro deve usar `refetchOnWindowFocus:
  false`.
- **Prisma & Server-Side Boundary**: PASS. Sem Prisma, migrations, schema,
  camada server-side ou mudancas de persistencia.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  testes e build.

## Project Structure

### Documentation (this feature)

```text
specs/015-disable-focus-refetch/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- controlled-update-behavior.md
|   +-- focus-return-context-preservation.md
|   +-- focus-refetch-exception-policy.md
|   +-- server-state-configuration.md
|   +-- server-state-security-review.md
+-- checklists/
|   +-- requirements.md
+-- spec.md
```

### Source Code (repository root)

```text
src/
+-- app/
|   +-- app.tsx
+-- features/
|   +-- transactions/
|   |   +-- use-transaction-list.ts
|   |   +-- use-transaction-list.test.tsx
|   |   +-- use-transaction-form.ts
|   +-- dashboard/
|   |   +-- use-dashboard.ts
|   |   +-- use-dashboard.test.tsx
|   |   +-- use-dashboard-charts.ts
|   |   +-- use-dashboard-charts.test.tsx
|   +-- goals/
|   |   +-- use-goals.ts
|   |   +-- use-goals.test.tsx
|   +-- audit/
|   |   +-- use-audit-events.ts
|   |   +-- use-audit-events.test.tsx
|   |   +-- audit-refresh-signal.ts
|   +-- categories/
|   |   +-- use-categories.ts
|   |   +-- use-categories.test.tsx
|   +-- couple/
|   |   +-- use-couple-relationship.ts
|   |   +-- use-couple-relationship.test.tsx
+-- lib/
+-- test/
package.json
```

**Structure Decision**: Manter o padrao feature-based e nao criar uma camada
global nova de server state nesta F15. A implementacao deve adicionar ou
ajustar testes nos hooks remotos existentes e, se necessario, uma documentacao
tecnica pequena sobre politica de server state. `src/app/app.tsx` so deve mudar
se TanStack Query ja existir ou for introduzido em uma decisao futura
justificada; a F15 atual nao deve adicionar provider vazio.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada. A divergencia entre roadmap
e codigo real (`TanStack Query` esperado pela F15, mas ausente do projeto) foi
resolvida como decisao de escopo: nao instalar dependencia sem fluxo real de
server state migrado e proteger o comportamento existente por testes e
contratos.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) define Server State
  Consumer, Focus Return Event, Controlled Update Trigger, Remote Data State,
  Refresh Exception e Server State Policy.
- Contratos:
  [server-state-configuration.md](./contracts/server-state-configuration.md),
  [focus-refetch-exception-policy.md](./contracts/focus-refetch-exception-policy.md),
  [controlled-update-behavior.md](./contracts/controlled-update-behavior.md),
  [focus-return-context-preservation.md](./contracts/focus-return-context-preservation.md)
  e
  [server-state-security-review.md](./contracts/server-state-security-review.md).
- Quickstart: [quickstart.md](./quickstart.md) lista validacao de ausencia de
  TanStack Query, testes de foco, mutacoes, filtros/contexto, permissoes,
  mobile, acessibilidade e comandos de qualidade.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Incremental Baseline**: PASS. Contratos preservam hooks, services e fluxos
  F00-F14 sem recriar dados remotos.
- **Simplicity & Visual Clarity**: PASS. Sem UI nova; foco em reduzir loading
  indevido e preservar estados existentes.
- **Financial Transparency**: PASS. Controlled Update Behavior exige que
  mutacoes reais atualizem dados relacionados sem depender de foco.
- **Mobile-First**: PASS. Focus Return Context Preservation cobre retorno de
  app mobile em segundo plano.
- **Accessibility**: PASS. Estados de atualizacao continuam vinculados a acoes
  explicitas e mensagens existentes.
- **Security & Privacy**: PASS. Security Review impede ampliacao de dados,
  bypass de RLS ou erros reveladores.
- **Technical Quality & Tests**: PASS. Quickstart exige testes contra focus
  refetch e regressao de mutacoes/contexto.
- **Performance, Server State & Data Clarity**: PASS. A politica bloqueia
  refetch global por foco agora e define default futuro para Query Client.
- **Prisma & Server-Side Boundary**: PASS. Sem Prisma, migrations, schema ou
  API server-side.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  test run e build.
