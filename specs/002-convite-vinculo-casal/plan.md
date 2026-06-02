# Implementation Plan: F02 - Convite e vinculo do casal

**Branch**: `002-convite-vinculo-casal` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-convite-vinculo-casal/spec.md`

## Summary

Implementar o primeiro contexto compartilhado do Couple Finance: usuario
autenticado cria um orcamento compartilhado vazio, convida uma pessoa por
e-mail, acompanha o convite, e a pessoa convidada aceita ou recusa. A solucao
usa Supabase PostgreSQL com RLS como fonte de autorizacao, mantem a F01 de
autenticacao como base, adiciona uma feature isolada em `src/features/couple`,
e atualiza a area privada `/app` para mostrar o estado do vinculo sem expor
transacoes, saldos, metas, categorias, dashboard ou dados financeiros futuros.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
React Hook Form, Zod, `@hookform/resolvers`, `@supabase/supabase-js`,
Supabase Auth, Supabase PostgreSQL, Supabase RLS, ESLint, Prettier, Husky,
lint-staged, Vitest e Testing Library. TanStack Query e Recharts ficam fora
desta feature.

**Storage**: Supabase PostgreSQL em tabelas novas `shared_budgets`,
`budget_members` e `budget_invitations`, com RLS habilitado, constraints,
indices e uma funcao RPC transacional para aceite do convite. Supabase Auth
continua sendo a fonte de identidade e sessao.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes automatizados
devem cobrir schemas, servicos Supabase mockados, hooks/estados de
relacionamento, rotas, formularios e mensagens. Validacao Supabase deve cobrir
migrations, constraints, RLS e cenarios positivos/negativos com usuarios
distintos.

**Target Platform**: Web single-page application, mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Carregar estado de relacionamento na area privada com
feedback imediato e sem flicker de dados privados; manter as consultas pequenas
e indexadas por `auth.uid()`, e-mail normalizado, orcamento e status de convite;
preservar meta Lighthouse acima de 90 para experiencia web.

**Constraints**: Nao renderizar convite, orcamento ou membro antes da
confirmacao de sessao e autorizacao; nao expor dados financeiros; nao usar
`service_role` no cliente; nao usar `user_metadata` para autorizacao; manter
um orcamento ativo por usuario e no maximo dois membros ativos por orcamento no
MVP; convite pendente expira em 7 dias corridos; fluxos devem funcionar por
teclado, toque e texto ampliado.

**Scale/Scope**: Segunda feature privada do MVP: tres tabelas persistentes,
uma area de feature frontend, rotas/contratos de convite e estado de vinculo,
sem transacoes, categorias, dashboard, metas, graficos, auditoria financeira ou
permissoes avancadas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A area privada decide uma proxima acao principal
  por estado: criar convite, aguardar, responder, ou confirmar vinculo.
- **Financial Transparency**: PASS. O plano cria o contexto compartilhado para
  dados futuros, mas nao mostra saldos, transacoes, metas, categorias,
  dashboard ou comparativos.
- **Mobile-First**: PASS. Formularios e acoes principais sao projetados para
  toque, telas pequenas, texto ampliado e hierarquia compacta.
- **Accessibility**: PASS. Labels, mensagens associadas, foco visivel,
  navegacao por teclado e feedback perceptivel entram nos contratos.
- **Security & Privacy**: PASS. Autorizacao fica no banco via RLS e constraints,
  com mensagens seguras para convite inexistente, indisponivel ou nao
  relacionado ao usuario.
- **Technical Quality**: PASS. A implementacao fica modular em feature propria,
  com schemas, servicos, hooks, paginas e contratos separados da F01.
- **Performance & Financial Data Clarity**: PASS. Consultas usam indices em
  colunas de autorizacao/estado, e telas evitam densidade visual e dados
  financeiros fora de escopo.

## Project Structure

### Documentation (this feature)

```text
specs/002-convite-vinculo-casal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── couple-forms.md
│   ├── couple-messages.md
│   ├── couple-operations.md
│   ├── couple-routes.md
│   └── relationship-states.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_create_couple_linking.sql
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── routes.test.ts
│   │   └── routes.ts
│   ├── components/
│   │   ├── feedback/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   └── couple/
│   │       ├── couple-actions.test.ts
│   │       ├── couple-actions.ts
│   │       ├── couple-messages.ts
│   │       ├── couple-schemas.test.ts
│   │       ├── couple-schemas.ts
│   │       ├── couple-service.test.ts
│   │       ├── couple-service.ts
│   │       ├── couple-types.ts
│   │       ├── relationship-state.test.ts
│   │       ├── relationship-state.ts
│   │       ├── use-couple-relationship.test.tsx
│   │       └── use-couple-relationship.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── invitation-page.test.tsx
│   │   ├── invitation-page.tsx
│   │   ├── private-home-page.test.tsx
│   │   └── private-home-page.tsx
│   └── test/
│       ├── auth-test-utils.tsx
│       └── couple-test-utils.tsx
└── specs/
    └── 002-convite-vinculo-casal/
```

**Structure Decision**: Manter a SPA no root e acrescentar apenas a fatia da
F02. `src/features/couple` concentra tipos, schemas, servicos, mapeamento de
estado e hooks; `src/pages` guarda telas de rota; `src/app` registra metadados
e rotas; `supabase/migrations` passa a conter o schema persistente minimo da
feature. A F01 permanece em `src/features/auth` sem receber regras de casal.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve Shared Budget,
  Budget Member, Invitation e Relationship State, com campos, constraints,
  indices, RLS e transicoes de estado.
- Contratos: [couple-routes.md](./contracts/couple-routes.md),
  [relationship-states.md](./contracts/relationship-states.md),
  [couple-forms.md](./contracts/couple-forms.md),
  [couple-messages.md](./contracts/couple-messages.md) e
  [couple-operations.md](./contracts/couple-operations.md) definem rotas,
  estados, formularios, mensagens, operacoes e autorizacao.
- Quickstart: [quickstart.md](./quickstart.md) lista ambiente, comandos,
  migrations, validacoes tecnicas, revisao manual, RLS e cenarios de
  privacidade.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano como
  contexto atual.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Os contratos reduzem cada estado a uma acao
  principal e feedback claro.
- **Financial Transparency**: PASS. O design nomeia o espaco compartilhado como
  contexto futuro e bloqueia apresentacao de valores financeiros.
- **Mobile-First**: PASS. Quickstart e contratos exigem validacao em telas
  pequenas, toque, teclado virtual e texto ampliado.
- **Accessibility**: PASS. Formularios, mensagens e acoes exigem labels,
  descricoes, foco visivel, estados anunciaveis e navegacao por teclado.
- **Security & Privacy**: PASS. RLS, constraints e RPC transacional protegem
  acesso e mutacoes; mensagens indisponiveis nao revelam dados financeiros nem
  contas de terceiros.
- **Technical Quality**: PASS. A feature separa persistencia, servico, hooks,
  schemas, contratos e paginas, preservando TypeScript estrito e baixo
  acoplamento.
- **Performance & Financial Data Clarity**: PASS. Indices cobrem consultas e
  politicas; telas permanecem curtas e sem dependencias pesadas.
