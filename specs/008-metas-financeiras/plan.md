# Implementation Plan: F09 - Metas financeiras

**Branch**: `009-metas-financeiras` | **Date**: 2026-06-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-metas-financeiras/spec.md`

## Summary

Implementar uma area privada de metas financeiras em `/app/goals`, com listagem
de metas autorizadas, formulario de criacao/edicao, progresso manual por valor
atual versus valor alvo, e acoes de concluir ou arquivar. A solucao cria uma
tabela `public.financial_goals` protegida por RLS, usa consultas diretas para
leitura autorizada e RPCs finas para mutacoes validadas, mantendo metas
individuais privadas, metas compartilhadas limitadas ao espaco compartilhado
ativo e paginas de rota finas em torno de `src/features/goals`.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, React Hook Form, Zod, `@hookform/resolvers`,
`@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL, Supabase RLS,
ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library. TanStack Query,
bibliotecas de data, estado global, mascara monetaria, animacao, graficos ou
visualizacao nao sao necessarias nesta feature.

**Storage**: Nova tabela `public.financial_goals`, com `uuid`, valores em
centavos, `date` opcional para prazo, status fechado e referencias a
`auth.users` e `public.shared_budgets`. RLS aplica leitura e escrita por
propriedade individual ou membership ativa no espaco compartilhado. RPCs publicas
finais chamam funcoes privadas para criacao, atualizacao, conclusao e
arquivamento.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem schema
SQL, RLS, grants, autorizacao individual e compartilhada, revogacao de vinculo,
calculo de progresso, prazo civil, status, transicoes, validacao, formularios,
hook, servico, rota, estados e acessibilidade.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Listar e atualizar metas autorizadas em ate um segundo
sob uso normal, com dezenas de metas por pessoa ou casal; renderizar somente
metas do escopo atual e manter meta Lighthouse acima de 90.

**Constraints**: Toda saida deriva apenas de metas autorizadas; progresso e
valor restante sao calculados a partir de valores manuais da meta; metas nao
consultam nem vinculam transacoes; exclusao definitiva, historico detalhado,
comentarios, anexos, recomendacoes, simuladores, graficos avancados e
gamificacao ficam fora do escopo; dados compartilhados revogados deixam de
aparecer na proxima consulta.

**Scale/Scope**: Nona feature privada do MVP: uma migration de schema/RLS/RPCs,
uma rota privada de metas, nova feature modular `src/features/goals`, contratos
de dominio e apresentacao reutilizaveis para auditoria futura sem implementar
auditoria detalhada.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A jornada usa lista, formulario essencial e acoes
  claras de concluir/arquivar, sem historico ou automacoes.
- **Financial Transparency**: PASS. Metas exibem visibilidade, valor alvo,
  valor atual, progresso, valor restante, prazo e status como conceitos
  distintos.
- **Mobile-First**: PASS. A rota propria permite fluxo focado em metas com
  layout empilhado, controles de toque e sem dependencia de desktop.
- **Accessibility**: PASS. Formularios, progresso, status, dialogs e mensagens
  exigem labels, foco visivel, teclado e resumo textual equivalente.
- **Security & Privacy**: PASS. RLS limita metas individuais ao proprietario e
  metas compartilhadas a membros ativos; mensagens e estados nao inferem metas
  inacessiveis.
- **Technical Quality**: PASS. Dominio, servico, schemas, estado e componentes
  ficam em `src/features/goals`, com pagina fina e tipos estritos.
- **Performance & Financial Data Clarity**: PASS. Valores em centavos, prazo
  civil, lista pequena e consultas indexaveis preservam fluidez e consistencia.

## Project Structure

### Documentation (this feature)

```text
specs/008-metas-financeiras/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- authorized-goal-query.md
|   +-- goal-mutation.md
|   +-- goal-progress.md
|   +-- goal-state.md
|   +-- goal-authorization.md
+-- tasks.md
```

### Source Code (repository root)

```text
.
+-- supabase/
|   +-- migrations/
|       +-- <timestamp>_create_financial_goals.sql
+-- src/
|   +-- app/
|   |   +-- router.tsx
|   |   +-- routes.test.ts
|   |   +-- routes.ts
|   +-- components/
|   |   +-- feedback/
|   |   +-- layout/
|   |   +-- ui/
|   +-- features/
|   |   +-- goals/
|   |   |   +-- goal-actions.test.ts
|   |   |   +-- goal-actions.ts
|   |   |   +-- goal-card.test.tsx
|   |   |   +-- goal-card.tsx
|   |   |   +-- goal-form.test.tsx
|   |   |   +-- goal-form.tsx
|   |   |   +-- goal-list.test.tsx
|   |   |   +-- goal-list.tsx
|   |   |   +-- goal-messages.test.ts
|   |   |   +-- goal-messages.ts
|   |   |   +-- goal-migration.test.ts
|   |   |   +-- goal-progress.test.ts
|   |   |   +-- goal-progress.ts
|   |   |   +-- goal-schemas.test.ts
|   |   |   +-- goal-schemas.ts
|   |   |   +-- goal-service.test.ts
|   |   |   +-- goal-service.ts
|   |   |   +-- goal-state.test.ts
|   |   |   +-- goal-state.ts
|   |   |   +-- goal-types.ts
|   |   |   +-- goal-view.test.tsx
|   |   |   +-- goal-view.tsx
|   |   |   +-- index.ts
|   |   |   +-- use-goals.test.tsx
|   |   |   +-- use-goals.ts
|   |   +-- auth/
|   |   +-- couple/
|   |   +-- permissions/
|   |   +-- transactions/
|   |       +-- transaction-money.ts
|   |       +-- transaction-schemas.ts
|   +-- pages/
|   |   +-- goals-page.test.tsx
|   |   +-- goals-page.tsx
|   +-- test/
|       +-- goal-test-utils.ts
+-- specs/
    +-- 008-metas-financeiras/
```

**Structure Decision**: Criar `src/features/goals` e uma rota privada
`/app/goals`. `GoalsPage` coordena titulo, relacionamento, navegacao e contexto
autorizado; `useGoals` controla leitura, concorrencia e revalidacao; servicos
Supabase centralizam consultas/mutacoes; componentes exibem lista, formulario,
progresso e acoes sem conter regras finais de autorizacao. O dashboard `/app`
pode apenas linkar para metas nesta feature, sem embutir resumo ou graficos de
metas.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve meta financeira,
  visibilidade, status, consulta autorizada, mutacao, progresso, prazo e estado
  de apresentacao.
- Contratos: [authorized-goal-query.md](./contracts/authorized-goal-query.md),
  [goal-mutation.md](./contracts/goal-mutation.md),
  [goal-progress.md](./contracts/goal-progress.md),
  [goal-state.md](./contracts/goal-state.md) e
  [goal-authorization.md](./contracts/goal-authorization.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase/RLS/RPC, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. O desenho limita metas a lista, formulario
  essencial, progresso manual e transicoes de status.
- **Financial Transparency**: PASS. Contratos preservam visibilidade, status,
  valores, prazo, progresso e mensagens sem ambiguidade.
- **Mobile-First**: PASS. A pagina de metas, lista, formulario e acoes possuem
  composicao responsiva sem rolagem horizontal obrigatoria.
- **Accessibility**: PASS. Contratos exigem labels, erros associados, foco,
  teclado, dialogs nomeados e resumo textual de progresso.
- **Security & Privacy**: PASS. RLS, RPCs validadas e mensagens seguras
  impedem leitura, mutacao ou inferencia de metas inacessiveis.
- **Technical Quality**: PASS. A fronteira `goals` evita acoplamento com
  dashboard, transacoes ou auditoria futura.
- **Performance & Financial Data Clarity**: PASS. Valores em centavos, datas
  civis, indices por escopo/status e renderizacao de dados autorizados sustentam
  o volume do MVP.
