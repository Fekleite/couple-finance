# Implementation Plan: F04 - Categorias financeiras padrao

**Branch**: `004-standard-financial-categories` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-standard-financial-categories/spec.md`

## Summary

Implementar um catalogo canonico e somente leitura de categorias financeiras
padrao para o Couple Finance. A solucao persiste dados de referencia em
`public.standard_financial_categories`, usa um `code` textual estavel como
identidade para futuras chaves estrangeiras, disponibiliza leitura apenas para
pessoas autenticadas via Supabase RLS e cria `src/features/categories` para
consulta, tipos, mensagens, apresentacao e selecao reutilizavel. A F04 inclui
uma pagina autenticada de consulta do catalogo e prepara a F05 sem criar
transacoes, filtros ou agregacoes financeiras.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
Lucide React, `@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL,
Supabase RLS, ESLint, Prettier, Husky, lint-staged, Vitest e Testing Library.
React Hook Form, Zod, TanStack Query e Recharts nao sao necessarios nesta
feature.

**Storage**: Nova tabela de referencia
`public.standard_financial_categories`, sem `user_id` ou `shared_budget_id`,
com seed idempotente versionado em migration, RLS habilitado e leitura para
`authenticated`. O cliente nao recebe permissao de mutacao.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes cobrem
catalogo minimo, unicidade e estabilidade de codes, aplicabilidade, ordem,
servico, hook, estados de feedback, pagina de consulta e seletor acessivel.
Validacao Supabase cobre seed, constraints, RLS e bloqueio de mutacoes.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Uma consulta pequena e ordenada para carregar no maximo
dezenas de categorias; selecao e navegacao por teclado responsivas; sem cache
complexo ou dependencia adicional; preservar meta Lighthouse acima de 90.

**Constraints**: Catalogo somente leitura para clientes; identidade nunca
depende do nome exibido; categorias nao possuem escopo individual ou
compartilhado; nenhuma UI pode sugerir transacoes, totais ou uso; nenhum dado
financeiro real e criado; `Outros` permanece fallback e aparece por ultimo.

**Scale/Scope**: Quarta feature privada do MVP: onze categorias iniciais, uma
tabela de referencia, uma feature frontend modular, uma pagina autenticada de
consulta e um componente de selecao reutilizavel para F05.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. O catalogo pronto elimina configuracao inicial e
  usa nomes, descricoes e ordem previsiveis.
- **Financial Transparency**: PASS. Identidades estaveis criam vocabulario
  consistente; o escopo financeiro pertence ao futuro registro, nao a
  categoria.
- **Mobile-First**: PASS. Pagina e seletor usam lista compacta, alvos de toque
  adequados e nenhuma dependencia de desktop.
- **Accessibility**: PASS. Consulta e selecao exigem teclado, foco visivel,
  semantica e estado selecionado independente de cor.
- **Security & Privacy**: PASS. RLS permite somente leitura autenticada; o
  catalogo nao revela registros, usuarios ou espacos compartilhados.
- **Technical Quality**: PASS. Tabela, contratos, servico, hook, componentes e
  testes possuem responsabilidades claras e tipos estritos.
- **Performance & Financial Data Clarity**: PASS. O catalogo limitado usa
  consulta simples e ordem deterministica, preparando filtros e graficos
  futuros sem implementa-los.

## Project Structure

### Documentation (this feature)

```text
specs/004-standard-financial-categories/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── category-catalog.md
│   ├── category-query.md
│   ├── category-selector.md
│   └── future-movement-reference.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── supabase/
│   └── migrations/
│       └── <timestamp>_create_standard_financial_categories.sql
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   ├── routes.test.ts
│   │   └── routes.ts
│   ├── components/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── permissions/
│   │   └── categories/
│   │       ├── category-catalog.test.ts
│   │       ├── category-catalog.ts
│   │       ├── category-messages.ts
│   │       ├── category-option.tsx
│   │       ├── category-selector.test.tsx
│   │       ├── category-selector.tsx
│   │       ├── category-service.test.ts
│   │       ├── category-service.ts
│   │       ├── category-types.ts
│   │       ├── index.ts
│   │       ├── use-categories.test.tsx
│   │       └── use-categories.ts
│   ├── pages/
│   │   ├── categories-page.test.tsx
│   │   └── categories-page.tsx
│   └── test/
│       └── category-test-utils.ts
└── specs/
    └── 004-standard-financial-categories/
```

**Structure Decision**: Manter a SPA no root e acrescentar
`src/features/categories` como API interna canonica da F04. A migration e a
fonte persistida do catalogo; o frontend consulta e mapeia as linhas sem
manter uma segunda lista completa. A pagina `/app/categories` demonstra a
consulta autenticada sem simular transacoes. O `CategorySelector` e
implementado e testado como componente reutilizavel, mas sua integracao a um
formulario fica para F05.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve Standard Financial
  Category, Category Applicability, Category Catalog State, Category Usage
  Context e Future Financial Movement Reference.
- Contratos: [category-catalog.md](./contracts/category-catalog.md),
  [category-query.md](./contracts/category-query.md),
  [category-selector.md](./contracts/category-selector.md) e
  [future-movement-reference.md](./contracts/future-movement-reference.md)
  definem fonte canonica, leitura, selecao e referencia futura.
- Quickstart: [quickstart.md](./quickstart.md) lista ambiente, migration,
  validacao Supabase/RLS, comandos tecnicos e revisao manual.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano como
  contexto atual.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Uma lista pronta, previsivel e explicativa reduz
  escolha ambigua sem exigir cadastro manual.
- **Financial Transparency**: PASS. `code` estavel preserva significado
  historico e categorias nao confundem escopo de visibilidade.
- **Mobile-First**: PASS. Contratos exigem lista sem rolagem horizontal,
  descricoes legiveis e alvos de toque adequados.
- **Accessibility**: PASS. O seletor usa controles nativos ou semantica
  equivalente, com teclado, foco e estado selecionado perceptivel.
- **Security & Privacy**: PASS. Categorias sao referencia global autenticada e
  imutavel pelo cliente; nenhum contrato consulta ou infere dados financeiros.
- **Technical Quality**: PASS. O desenho evita lista duplicada e reserva
  integridade referencial para futuras transacoes.
- **Performance & Financial Data Clarity**: PASS. Consulta limitada e ordem
  canonica atendem selecao, filtros e analises futuras com baixo custo.
