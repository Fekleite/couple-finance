# Implementation Plan: F03 - Modelo de permissoes e isolamento de dados

**Branch**: `003-data-permissions-isolation` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-data-permissions-isolation/spec.md`

## Summary

Implementar uma camada explicita de permissao e isolamento para o Couple
Finance, consolidando as regras atuais de F02 e criando contratos reutilizaveis
para dados financeiros futuros. A solucao usa Supabase PostgreSQL/RLS como
fonte final de autorizacao, adiciona uma feature modular em
`src/features/permissions`, documenta padroes para dados individuais,
compartilhados e inacessiveis, e valida que convites, membros e orcamentos
compartilhados nao vazam dados por listagens, contadores, mensagens, estados
vazios ou carregamento prematuro.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
React Hook Form, Zod, `@hookform/resolvers`, `@supabase/supabase-js`,
Supabase Auth, Supabase PostgreSQL, Supabase RLS, ESLint, Prettier, Husky,
lint-staged, Vitest e Testing Library. TanStack Query e Recharts ficam fora
desta feature.

**Storage**: Supabase PostgreSQL existente da F02, com `shared_budgets`,
`budget_members` e `budget_invitations`, RLS habilitado, constraints, indices
e RPCs transacionais. A F03 pode adicionar migration incremental de hardening se
a revisao das policies/funcoes exigir, mas nao cria tabelas financeiras novas.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes devem cobrir
matriz de permissoes, classificacao de visibilidade, mensagens seguras,
helpers de autorizacao, integracao com estados F02 e cenarios RLS positivos e
negativos com usuarios distintos.

**Target Platform**: Web single-page application, mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Resolver permissao e relacionamento com consultas
pequenas e indexadas por `auth.uid()`, `user_id`, `shared_budget_id`, e-mail
normalizado e status; evitar flicker de dados privados; preservar meta
Lighthouse acima de 90 para experiencia web.

**Constraints**: Nao renderizar dados antes de sessao, relacionamento e
autorizacao; nao usar `service_role` no cliente; nao usar `user_metadata` para
autorizacao; manter um espaco compartilhado ativo por usuario e no maximo dois
membros ativos por espaco no MVP; manter helpers de frontend como camada de UX,
nunca como autoridade de seguranca; nao implementar dados financeiros reais.

**Scale/Scope**: Terceira feature privada do MVP: modelo central de permissao,
contratos para features financeiras futuras, hardening de F02 quando
necessario, sem transacoes, categorias, dashboard, metas, graficos, auditoria
financeira ou papeis administrativos avancados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A F03 reduz ambiguidade criando estados e mensagens
  reutilizaveis em vez de espalhar regras por telas futuras.
- **Financial Transparency**: PASS. O plano torna individual, compartilhado e
  inacessivel conceitos tecnicos e de UX explicitos.
- **Mobile-First**: PASS. Rotulos, mensagens e estados de permissao continuam
  compactos, acionaveis e validaveis em telas pequenas.
- **Accessibility**: PASS. Contratos exigem feedback perceptivel, foco visivel,
  teclado e rotulos que nao dependem apenas de cor.
- **Security & Privacy**: PASS. A autorizacao final permanece no Supabase
  PostgreSQL/RLS, com constraints e RPCs quando atomicidade for necessaria.
- **Technical Quality**: PASS. A feature isola matriz, tipos, helpers e
  mensagens em modulo proprio, preservando baixo acoplamento com auth/couple.
- **Performance & Financial Data Clarity**: PASS. Padroes de consulta,
  agregacao, filtro e contagem exigem escopo antes de qualquer dado financeiro.

## Project Structure

### Documentation (this feature)

```text
specs/003-data-permissions-isolation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── permission-matrix.md
│   ├── permission-operations.md
│   ├── rls-patterns.md
│   ├── safe-messages.md
│   └── visibility-scopes.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       ├── 20260602000000_create_couple_linking.sql
│       ├── 20260602015325_fix_budget_members_rls_recursion.sql
│       ├── 20260602015822_fix_create_invite_status_ambiguity.sql
│       └── <timestamp>_harden_permissions_isolation.sql
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
│   │   ├── couple/
│   │   └── permissions/
│   │       ├── permission-matrix.test.ts
│   │       ├── permission-matrix.ts
│   │       ├── permission-messages.test.ts
│   │       ├── permission-messages.ts
│   │       ├── permission-types.ts
│   │       ├── visibility-scope.test.ts
│   │       └── visibility-scope.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── invitation-page.test.tsx
│   │   ├── invitation-page.tsx
│   │   ├── private-home-page.test.tsx
│   │   └── private-home-page.tsx
│   └── test/
│       ├── auth-test-utils.tsx
│       ├── couple-test-utils.tsx
│       └── permissions-test-utils.ts
└── specs/
    └── 003-data-permissions-isolation/
```

**Structure Decision**: Manter a SPA no root e acrescentar uma fatia
`src/features/permissions` para regras puras de permissao e visibilidade. A
F01 continua responsavel por identidade/sessao; a F02 continua responsavel por
convites e relacionamento; a F03 passa a fornecer matriz, tipos, mensagens e
contratos para que F04-F10 herdem o mesmo isolamento. Migrations entram apenas
se a revisao de hardening apontar lacunas nas policies/RPCs existentes.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve Authenticated
  Person, Individual Data, Shared Financial Space, Couple Member, Invitation,
  Permission State, Permission Matrix, Visibility Scope e Future Financial
  Record.
- Contratos: [permission-matrix.md](./contracts/permission-matrix.md),
  [visibility-scopes.md](./contracts/visibility-scopes.md),
  [permission-operations.md](./contracts/permission-operations.md),
  [safe-messages.md](./contracts/safe-messages.md) e
  [rls-patterns.md](./contracts/rls-patterns.md) definem matriz, escopos,
  operacoes, mensagens e padroes Supabase/RLS.
- Quickstart: [quickstart.md](./quickstart.md) lista ambiente, comandos,
  validacoes tecnicas, validacao Supabase/RLS e revisao manual de privacidade,
  responsividade e acessibilidade.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano como
  contexto atual.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Contratos tornam cada estado de permissao uma
  decisao clara de acao permitida, bloqueada ou indisponivel.
- **Financial Transparency**: PASS. Escopos de visibilidade nomeiam dados
  individuais, compartilhados e inacessiveis antes de telas financeiras reais.
- **Mobile-First**: PASS. Quickstart exige revisao de mensagens/rotulos em
  mobile, tablet, desktop e texto ampliado.
- **Accessibility**: PASS. Mensagens e rotulos devem ser perceptiveis por
  tecnologia assistiva, operaveis por teclado e independentes de cor.
- **Security & Privacy**: PASS. RLS, constraints, RPCs e mensagens seguras
  protegem acesso direto, tentativas por URL, listagens, buscas e contadores.
- **Technical Quality**: PASS. Matriz, tipos, helpers e mensagens ficam
  testaveis em modulo proprio, sem acoplar auth, couple e features futuras.
- **Performance & Financial Data Clarity**: PASS. Padroes exigem filtros por
  escopo e indices antes de agregacoes, listas, graficos ou dashboards futuros.
