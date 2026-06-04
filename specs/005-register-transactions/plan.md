# Implementation Plan: F05 - Registro de transacoes

**Branch**: `005-register-transactions` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-register-transactions/spec.md`

## Summary

Implementar o primeiro fluxo de criacao de transacoes financeiras individuais e
compartilhadas do Couple Finance. A solucao persiste valores exatos em centavos
e datas civis em `public.financial_transactions`, separa autoria,
responsabilidade e visibilidade, e cria transacoes apenas por uma operacao
transacional idempotente que revalida categoria, vinculo e responsavel no banco.
O frontend acrescenta `src/features/transactions` e a rota privada
`/app/transactions/new`, reutilizando F01-F04 para sessao, relacionamento,
permissoes e categorias, sem implementar lista, filtros, edicao ou dashboard.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
React Hook Form, Zod, Lucide React, `@supabase/supabase-js`, Supabase Auth,
Supabase PostgreSQL, Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest
e Testing Library. TanStack Query e Recharts nao sao necessarios nesta feature.

**Storage**: Nova tabela `public.financial_transactions`, com valor em centavos
inteiros, data civil `date`, chave estrangeira para categoria padrao, autoria,
responsabilidade, visibilidade, escopo compartilhado opcional e chave de
idempotencia unica por criador. Criacao ocorre por RPC publica fina que delega
a validacao e insercao atomicas para funcao privilegiada em schema privado.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem
schemas, moeda, data, formulario, mudancas de visibilidade, categorias,
responsaveis, submissao, retry, idempotencia, migration, grants, RPC e RLS.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Carregar formulario com poucas consultas pequenas;
feedback imediato ao confirmar; uma unica operacao remota de criacao; nenhuma
duplicacao em retry; preservar meta Lighthouse acima de 90.

**Constraints**: Transacao individual nunca e exposta ao parceiro; transacao
compartilhada exige membership ativa; autoria vem da sessao; valor nao usa
ponto flutuante persistido; categoria deve estar ativa e aplicavel; criacao e
idempotente; nenhuma interface de listagem, edicao ou exclusao.

**Scale/Scope**: Quinta feature privada do MVP: uma tabela financeira, uma
operacao de criacao, uma feature frontend modular, uma rota autenticada e
contratos reutilizaveis para F06-F08.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. Um formulario dedicado usa defaults seguros,
  validacao por campo, retry e resumo de sucesso.
- **Financial Transparency**: PASS. Tipo, valor, categoria, autoria,
  responsabilidade e visibilidade permanecem distintos e explicitos.
- **Mobile-First**: PASS. A rota de registro usa fluxo curto, controles de toque
  e nenhuma dependencia de desktop.
- **Accessibility**: PASS. O formulario exige labels, teclado, foco visivel,
  erros associados e feedback perceptivel.
- **Security & Privacy**: PASS. Criacao atomica e RLS revalidam isolamento no
  banco; o cliente nao recebe mutacao direta.
- **Technical Quality**: PASS. Dominio, schemas, servico, controller,
  componentes e testes possuem responsabilidades claras e tipos estritos.
- **Performance & Financial Data Clarity**: PASS. Centavos inteiros, data civil,
  consultas pequenas e idempotencia preservam consistencia e fluidez.

## Project Structure

### Documentation (this feature)

```text
specs/005-register-transactions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── create-transaction.md
│   ├── idempotent-submission.md
│   ├── transaction-authorization.md
│   ├── transaction-form.md
│   └── transaction-success-summary.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_create_financial_transactions.sql
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── routes.test.ts
│   │   └── routes.ts
│   ├── components/
│   │   ├── feedback/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── couple/
│   │   ├── permissions/
│   │   └── transactions/
│   │       ├── index.ts
│   │       ├── transaction-form.test.tsx
│   │       ├── transaction-form.tsx
│   │       ├── transaction-messages.ts
│   │       ├── transaction-money.test.ts
│   │       ├── transaction-money.ts
│   │       ├── transaction-schemas.test.ts
│   │       ├── transaction-schemas.ts
│   │       ├── transaction-service.test.ts
│   │       ├── transaction-service.ts
│   │       ├── transaction-submission.test.ts
│   │       ├── transaction-submission.ts
│   │       ├── transaction-success-summary.tsx
│   │       ├── transaction-types.ts
│   │       ├── use-transaction-form.test.tsx
│   │       └── use-transaction-form.ts
│   ├── pages/
│   │   ├── new-transaction-page.test.tsx
│   │   └── new-transaction-page.tsx
│   └── test/
│       └── transaction-test-utils.ts
└── specs/
    └── 005-register-transactions/
```

**Structure Decision**: Manter a SPA no root e criar
`src/features/transactions` como API interna da F05. A pagina de rota coordena
somente a superficie autenticada; schemas e funcoes puras tratam valores e
regras locais; o servico chama a RPC; o controller preserva a tentativa
idempotente e os dados seguros. F02-F04 continuam fontes de relacionamento,
permissao e categoria, sem duplicacao de contratos.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve Financial
  Transaction, Transaction Submission, Idempotency Key e referencias.
- Contratos: [create-transaction.md](./contracts/create-transaction.md),
  [idempotent-submission.md](./contracts/idempotent-submission.md),
  [transaction-authorization.md](./contracts/transaction-authorization.md),
  [transaction-form.md](./contracts/transaction-form.md) e
  [transaction-success-summary.md](./contracts/transaction-success-summary.md).
- Quickstart: [quickstart.md](./quickstart.md) lista migration, validacao
  Supabase, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. O desenho limita a rota a registrar, confirmar e
  reiniciar, com preservacao segura em falhas recuperaveis.
- **Financial Transparency**: PASS. Modelo e contratos mantem tipo, categoria,
  criador, responsavel e visibilidade explicitos.
- **Mobile-First**: PASS. Formulario linear e controles reutilizaveis funcionam
  sem rolagem horizontal.
- **Accessibility**: PASS. Contratos exigem semantica, teclado, foco e anuncios
  de estado sem dependencia de cor.
- **Security & Privacy**: PASS. RPC privada, grants minimos, RLS e mensagens
  seguras protegem criacao e leitura.
- **Technical Quality**: PASS. Fronteiras modulares evitam acoplamento com
  futuras listas, edicao ou agregacao.
- **Performance & Financial Data Clarity**: PASS. Representacao exata, indices
  de escopo e operacao unica de criacao preparam consultas futuras sem
  antecipa-las.
