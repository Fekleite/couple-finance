# Implementation Plan: F10 - Auditoria simples de alteracoes financeiras

**Branch**: `010-financial-audit` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-financial-audit/spec.md`

## Summary

Implementar uma area privada de auditoria em `/app/audit`, com lista recente de
eventos autorizados para alteracoes importantes em transacoes e metas. A
solucao cria `public.financial_audit_events` protegida por RLS, consulta direta
sob RLS para leitura recente e funcoes auxiliares no banco chamadas pelas RPCs
de transacoes e metas para registrar eventos na mesma transacao da mutacao
financeira. A UI fica em `src/features/audit`, com pagina fina, snapshots
seguros, autoria com fallback, linguagem neutra e sem diffs completos.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL,
Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
React Hook Form e Zod permanecem disponiveis no projeto, mas a F10 nao precisa
de formulario novo. TanStack Query, bibliotecas de data, estado global,
realtime, diff viewer, analytics ou logging externo nao sao necessarios.

**Storage**: Nova tabela `public.financial_audit_events` com RLS habilitado,
grants explicitos, escopo individual ou compartilhado, snapshot seguro em
colunas tipadas, referencias ao item auditado e autoria derivada de
`auth.uid()`. Funcoes privadas de registro sao chamadas por RPCs de transacoes e
metas.

**Testing**: Validacao obrigatoria por `npm run lint`,
`npm run format:check`, `npm run typecheck`, `npm run test:run` e
`npm run build`. Testes cobrem schema SQL, RLS, grants, funcoes de registro,
atomicidade, consulta autorizada, revogacao de vinculo, snapshots seguros,
autoria, ordenacao, servico, hook, componentes, rota, mensagens e
acessibilidade.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Carregar ate 50 eventos recentes autorizados em ate um
segundo sob uso normal do MVP, com ordenacao deterministica e consultas
indexaveis por escopo e momento; manter meta Lighthouse acima de 90.

**Constraints**: Toda saida deriva apenas de eventos autorizados; RLS e a
barreira final; eventos individuais de outra pessoa e eventos compartilhados sem
membership ativa nao aparecem, nao contam e nao sao inferidos; auditoria cobre
somente alteracoes salvas importantes em transacoes e metas; sem compliance,
relatorios, exportacao, notificacoes, realtime, ranking, monitoramento de
fraude, diff completo ou logs tecnicos visiveis.

**Scale/Scope**: Decima feature privada do MVP: uma migration de auditoria,
ajustes planejados nas RPCs de transacoes/metas, nova rota privada, nova feature
modular `src/features/audit` e contratos de dominio/apresentacao.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A experiencia e uma lista recente com estados
  claros, sem filtros avancados, relatorios ou diffs campo a campo.
- **Financial Transparency**: PASS. Cada evento comunica acao, item, momento,
  autoria autorizada, visibilidade e contexto seguro.
- **Mobile-First**: PASS. A rota propria permite composicao empilhada,
  escaneavel e sem dependencia de desktop.
- **Accessibility**: PASS. Eventos sao textuais, navegaveis por teclado e nao
  dependem apenas de cor, icone ou posicao.
- **Security & Privacy**: PASS. RLS, snapshots minimizados e mensagens seguras
  preservam isolamento individual/compartilhado e evitam inferencia.
- **Technical Quality**: PASS. A feature fica modular em `src/features/audit`,
  enquanto registro de eventos fica encapsulado no banco e nas mutacoes
  financeiras existentes.
- **Performance & Financial Data Clarity**: PASS. Consultas recentes usam limite
  fixo, indices por escopo/momento e texto consistente para datas, dinheiro,
  visibilidade e tipos.

## Project Structure

### Documentation (this feature)

```text
specs/009-financial-audit/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- audit-event-registration.md
|   +-- authorized-audit-query.md
|   +-- audit-presentation.md
|   +-- audit-authorization.md
|   +-- audit-safe-snapshot.md
+-- tasks.md
```

### Source Code (repository root)

```text
.
+-- supabase/
|   +-- migrations/
|       +-- <timestamp>_create_financial_audit_events.sql
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
|   |   +-- audit/
|   |   |   +-- audit-authorization.test.ts
|   |   |   +-- audit-authorization.ts
|   |   |   +-- audit-event-item.test.tsx
|   |   |   +-- audit-event-item.tsx
|   |   |   +-- audit-list.test.tsx
|   |   |   +-- audit-list.tsx
|   |   |   +-- audit-messages.test.ts
|   |   |   +-- audit-messages.ts
|   |   |   +-- audit-migration.test.ts
|   |   |   +-- audit-service.test.ts
|   |   |   +-- audit-service.ts
|   |   |   +-- audit-state.test.ts
|   |   |   +-- audit-state.ts
|   |   |   +-- audit-types.ts
|   |   |   +-- audit-view.test.tsx
|   |   |   +-- audit-view.tsx
|   |   |   +-- index.ts
|   |   |   +-- use-audit-events.test.tsx
|   |   |   +-- use-audit-events.ts
|   |   +-- goals/
|   |   +-- transactions/
|   |   +-- permissions/
|   |   +-- couple/
|   |   +-- auth/
|   +-- pages/
|   |   +-- audit-page.test.tsx
|   |   +-- audit-page.tsx
|   +-- test/
|       +-- audit-test-utils.ts
+-- specs/
    +-- 009-financial-audit/
```

**Structure Decision**: Criar `src/features/audit` e uma rota privada
`/app/audit`. `AuditPage` coordena layout, titulo e entrada de rota;
`AuditView` monta estados; `useAuditEvents` controla leitura, concorrencia e
revalidacao; `audit-service` consulta `financial_audit_events` sob RLS; funcoes
puras cuidam de autoria, mensagens, visibilidade e snapshots seguros. As
features `transactions` e `goals` continuam donas das mutacoes financeiras e
passam a depender das funcoes SQL de auditoria apenas no nivel da migration/RPC.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve evento de
  auditoria, ator, item auditado, snapshot seguro, escopo de visibilidade,
  consulta autorizada e estados de apresentacao.
- Contratos:
  [audit-event-registration.md](./contracts/audit-event-registration.md),
  [authorized-audit-query.md](./contracts/authorized-audit-query.md),
  [audit-presentation.md](./contracts/audit-presentation.md),
  [audit-authorization.md](./contracts/audit-authorization.md) e
  [audit-safe-snapshot.md](./contracts/audit-safe-snapshot.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase/RLS/RPC, cenarios de auditoria, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. O desenho limita auditoria a eventos recentes
  compreensiveis e evita relatorios, busca avancada e diffs completos.
- **Financial Transparency**: PASS. Contratos exigem acao, item, autoria,
  momento, visibilidade e contexto seguro em cada evento exibido.
- **Mobile-First**: PASS. A lista, estados e eventuais links sao planejados
  para telas pequenas sem rolagem horizontal obrigatoria.
- **Accessibility**: PASS. Itens possuem texto equivalente completo, foco
  visivel, ordem logica e mensagens perceptiveis.
- **Security & Privacy**: PASS. A modelagem impede leitura ou inferencia de
  eventos individuais de outra pessoa e eventos compartilhados sem vinculo
  ativo.
- **Technical Quality**: PASS. A fronteira `audit` evita acoplamento de UI; o
  registro fica centralizado em funcoes SQL chamadas pelas mutacoes existentes.
- **Performance & Financial Data Clarity**: PASS. Limite recente, indices por
  escopo e snapshots minimizados sustentam clareza e desempenho do MVP.
