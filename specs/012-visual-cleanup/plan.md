# Implementation Plan: F12 - Limpeza visual e remocao de informacoes desnecessarias

**Branch**: `012-visual-cleanup` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-visual-cleanup/spec.md`

## Summary

Implementar uma limpeza visual incremental nas telas autenticadas ja existentes,
removendo ou consolidando informacoes decorativas, redundantes, repetidas ou sem
funcao clara. A solucao preserva os fluxos F00-F11, nao altera dados,
autorizacao, RLS, schema, queries ou navegacao principal, e concentra ajustes em
componentes e features atuais: dashboard, transacoes, metas, categorias,
convites/parceiro, configuracoes, estados de interface e mensagens seguras.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme `package.json`.

**Primary Dependencies**: React, Vite, TailwindCSS 4, Shadcn/ui/Radix,
React Router, Lucide React, Recharts, React Hook Form, Zod,
`@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL/RLS, ESLint,
Prettier, Husky, lint-staged, Vitest e Testing Library. Nenhuma dependencia
nova e planejada para a F12.

**Storage**: N/A. A feature nao cria tabelas, migrations, storage, Prisma,
repositories, services de dados ou mudancas de persistencia.

**Testing**: `npm run lint`, `npm run format:check`, `npm run typecheck`,
`npm run test:run` e `npm run build`. Testes focam renderizacao condicional,
mensagens, estados, informacao financeira essencial, acessibilidade pratica e
regressao visual/comportamental em componentes alterados.

**Target Platform**: Web SPA mobile-first, responsiva para mobile, tablet e
desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Reduzir ruido de renderizacao e densidade visual sem
adicionar runtime, dependencias ou consultas; preservar interacoes fluidas em
listas, cards, graficos e estados existentes.

**Constraints**: Nao alterar regras financeiras, autorizacao, RLS, ownership,
vinculo do casal, query behavior global, schema, Prisma, navegacao principal ou
design system. Nao remover informacoes essenciais de valores, datas,
responsaveis, categorias, visibilidade, status, auditoria, permissao ou contexto
individual/compartilhado.

**Scale/Scope**: Feature incremental sobre dashboard, transacoes, metas,
categorias, convite/parceiro, configuracoes, estados de interface e componentes
compartilhados relevantes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Incremental Baseline**: PASS. A F12 reaproveita F00-F11 e altera somente
  apresentacao, densidade de conteudo e mensagens de telas existentes.
- **Simplicity & Visual Clarity**: PASS. O objetivo central e remover elementos
  que nao apoiam decisao financeira, seguranca, auditoria ou orientacao.
- **Financial Transparency**: PASS. O plano preserva sinais de valores, datas,
  responsaveis, visibilidade, progresso e contexto individual/compartilhado.
- **Mobile-First**: PASS. Toda tela revisada deve manter validacao em mobile,
  tablet e desktop, sem rolagem horizontal obrigatoria em fluxos essenciais.
- **Accessibility**: PASS. Remocoes nao podem apagar headings, labels, nomes
  acessiveis, ordem de foco, estados perceptiveis ou equivalentes textuais.
- **Security & Privacy**: PASS. Mensagens e estados continuam seguros e nao
  revelam dados inacessiveis.
- **Technical Quality & Tests**: PASS. Mudancas de renderizacao com risco terao
  testes unitarios ou de componente proporcionais.
- **Performance, Server State & Data Clarity**: PASS. Nao ha mudanca de server
  state; qualquer impacto em freshness, totais, loading ou refetch e regressao a
  evitar.
- **Prisma & Server-Side Boundary**: PASS. Prisma e mudancas server-side estao
  fora do escopo da F12.
- **PR Pipeline**: PASS. A validacao exige lint, format check, typecheck,
  testes e build.

## Project Structure

### Documentation (this feature)

```text
specs/012-visual-cleanup/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- deferred-cleanup-candidate.md
|   +-- essential-financial-information.md
|   +-- responsive-accessible-review.md
|   +-- safe-interface-state.md
|   +-- visual-cleanup-audit.md
+-- checklists/
|   +-- requirements.md
+-- spec.md
```

### Source Code (repository root)

```text
src/
+-- app/
+-- components/
|   +-- feedback/
|   +-- layout/
|   +-- ui/
+-- features/
|   +-- auth/
|   +-- audit/
|   +-- categories/
|   +-- couple/
|   +-- dashboard/
|   +-- goals/
|   +-- permissions/
|   +-- transactions/
+-- lib/
+-- pages/
+-- styles/
+-- test/
```

**Structure Decision**: Manter a arquitetura existente. Ajustes transversais
ficam em `src/components/feedback`, `src/components/layout`, `src/components/ui`
e `src/styles/globals.css` somente quando reduzirem repeticao real. Ajustes de
dominio permanecem nas features que possuem o contexto financeiro. Paginas em
`src/pages` continuam finas, coordenando rota e composicao.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) define Reviewed Screen,
  Visual Element Review, Essential Financial Information, Financial Context
  Indicator, Interface State e Deferred Cleanup Candidate.
- Contratos:
  [visual-cleanup-audit.md](./contracts/visual-cleanup-audit.md),
  [essential-financial-information.md](./contracts/essential-financial-information.md),
  [safe-interface-state.md](./contracts/safe-interface-state.md),
  [responsive-accessible-review.md](./contracts/responsive-accessible-review.md) e
  [deferred-cleanup-candidate.md](./contracts/deferred-cleanup-candidate.md).
- Quickstart: [quickstart.md](./quickstart.md) lista comandos, roteiro de
  inventario por tela, validacao responsiva, teclado, estados, privacidade e
  testes.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Incremental Baseline**: PASS. Contratos exigem inventario e regressao dos
  fluxos F00-F11 antes de qualquer remocao visual.
- **Simplicity & Visual Clarity**: PASS. Toda remocao precisa de classificacao
  manter/remover/consolidar/reordenar/reescrever/adiar.
- **Financial Transparency**: PASS. Essential Financial Information e Financial
  Context Indicator impedem perda de contexto financeiro.
- **Mobile-First**: PASS. Responsive Accessible Review cobre mobile, tablet,
  desktop, texto longo e ordem visual.
- **Accessibility**: PASS. Contratos preservam headings, labels, nomes
  acessiveis, foco, ordem de leitura e equivalentes textuais.
- **Security & Privacy**: PASS. Safe Interface State cobre mensagens que nao
  revelam ou inferem dados inacessiveis.
- **Technical Quality & Tests**: PASS. Quickstart e contratos vinculam mudancas
  de renderizacao a testes de componente ou regressao.
- **Performance, Server State & Data Clarity**: PASS. A abordagem evita novas
  dependencias, novas queries e trabalho extra em runtime.
- **Prisma & Server-Side Boundary**: PASS. Sem impacto em Prisma, schema,
  migrations, services ou APIs.
- **PR Pipeline**: PASS. Validacao final exige lint, format check, typecheck,
  testes e build.
