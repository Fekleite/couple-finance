# Implementation Plan: F01 - Autenticacao e sessao do usuario

**Branch**: `001-user-auth-session` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-user-auth-session/spec.md`

## Summary

Implementar autenticacao por e-mail e senha com Supabase Auth na SPA Couple
Finance, incluindo cadastro, login, logout, recuperacao/redefinicao de senha,
sessao persistente e protecao real de rotas privadas. A entrega reaproveita a
fundacao da F00, adiciona estado global de autenticacao, formularios acessiveis
com validacao tipada e uma area privada inicial minima, sem implementar convite
de casal, orcamento compartilhado, transacoes, dashboard, metas, graficos ou
persistencia financeira.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e
React Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
React Hook Form, Zod, `@supabase/supabase-js`, ESLint, Prettier, Husky,
lint-staged e Vitest. TanStack Query e Recharts ficam fora desta feature.

**Storage**: Supabase Auth gerencia usuarios, credenciais e sessao persistente.
A F01 nao cria tabelas em Supabase PostgreSQL, nao cria migrations e nao depende
de RLS porque nao introduz dados de negocio em schemas expostos.

**Testing**: Validacao obrigatoria por `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run test:run` e `npm run build`. Testes focados em
contratos de rotas, guards, validacao dos formularios, estados de sessao e
mensagens seguras devem ser adicionados com Vitest/Testing Library quando a
implementacao for feita.

**Target Platform**: Web single-page application, mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada ao Supabase Auth.

**Performance Goals**: Verificacao inicial de sessao sem exibicao indevida de
conteudo privado, formularios responsivos com feedback imediato e bundle sem
dependencias desnecessarias. Lighthouse acima de 90 permanece meta de qualidade
para entregas web.

**Constraints**: Nao renderizar conteudo privado antes da confirmacao de sessao;
nao expor chaves secretas, tokens, credenciais ou detalhes internos do provedor;
usar mensagens seguras para login e recuperacao; manter a feature limitada a
autenticacao e sessao; garantir teclado, foco visivel, labels, mensagens
associadas e uso com texto ampliado.

**Scale/Scope**: Primeira feature privada do MVP: rotas publicas de
autenticacao, rotas privadas protegidas, area autenticada inicial minima,
provider/hook de sessao e contratos de formulario/redirecionamento. Deve
preparar F02 convite de casal, F03 isolamento de dados e features financeiras
posteriores sem implementa-las.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. Fluxos essenciais ficam curtos, com rotas diretas
  para login, cadastro, recuperacao e area privada inicial, sempre com estados
  claros de loading, sucesso, erro e validacao.
- **Financial Transparency**: PASS. A feature nao cria dados financeiros; a area
  privada inicial deve comunicar apenas que o acesso privado esta ativo, sem
  prometer dashboard, transacoes, metas ou orcamento compartilhado.
- **Mobile-First**: PASS. Formularios, navegacao e logout serao projetados para
  telas pequenas, teclado virtual e toque, expandindo para tablet/desktop sem
  perda de acoes essenciais.
- **Accessibility**: PASS. Formularios exigem labels, descricoes, mensagens
  associadas, foco visivel, ordem de foco previsivel e feedback perceptivel por
  tecnologias assistivas.
- **Security & Privacy**: PASS. Supabase Auth gerencia credenciais e sessao; a
  aplicacao bloqueia rotas privadas ate confirmar sessao, evita mensagens
  reveladoras e nao armazena tokens manualmente.
- **Technical Quality**: PASS. A arquitetura separa cliente Supabase, servico de
  autenticacao, provider/hook, rotas, paginas e componentes de formulario, com
  TypeScript estrito e convencoes da constitution.
- **Performance & Financial Data Clarity**: PASS. A feature evita TanStack Query,
  Recharts e persistencia financeira; estados de sessao reduzem flicker e
  mantem clareza entre conteudo publico e privado.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth-session/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth-forms.md
│   ├── auth-messages.md
│   ├── auth-routes.md
│   └── session-states.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── .env.example
├── package.json
├── src/
│   ├── app/
│   │   ├── app.tsx
│   │   ├── router.tsx
│   │   ├── routes.ts
│   │   └── routes.test.ts
│   ├── components/
│   │   ├── feedback/
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   └── loading-state.tsx
│   │   ├── layout/
│   │   │   ├── app-layout.tsx
│   │   │   ├── authenticated-layout.test.tsx
│   │   │   ├── authenticated-layout.tsx
│   │   │   ├── future-area-indicator.tsx
│   │   │   └── public-navigation.tsx
│   │   └── ui/
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── separator.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── auth-context-value.ts
│   │       ├── auth-context.test.tsx
│   │       ├── auth-context.tsx
│   │       ├── auth-messages.ts
│   │       ├── auth-schemas.test.ts
│   │       ├── auth-service.ts
│   │       ├── auth-service.test.ts
│   │       ├── auth-schemas.ts
│   │       ├── auth-types.ts
│   │       ├── protected-route.test.tsx
│   │       ├── protected-route.tsx
│   │       ├── public-auth-route.test.tsx
│   │       ├── public-auth-route.tsx
│   │       └── use-auth.ts
│   ├── lib/
│   │   ├── page-title.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── forgot-password-page.test.tsx
│   │   ├── forgot-password-page.tsx
│   │   ├── home-page.tsx
│   │   ├── login-page.test.tsx
│   │   ├── login-page.tsx
│   │   ├── not-found-page.tsx
│   │   ├── private-home-page.tsx
│   │   ├── reset-password-page.test.tsx
│   │   ├── reset-password-page.tsx
│   │   ├── sign-up-page.test.tsx
│   │   └── sign-up-page.tsx
│   ├── styles/
│   │   └── globals.css
│   └── test/
│       ├── auth-test-utils.tsx
│       └── setup.ts
└── specs/
    └── 001-user-auth-session/
```

**Structure Decision**: Manter a SPA no root, preservando a organizacao da F00.
`src/app` continua concentrando bootstrap e roteamento; `src/features/auth`
isola estado, servico, schemas, mensagens e guards de autenticacao; `src/pages`
guarda as telas de rota; `src/components/ui` e `src/components/layout` fornecem
as pecas visuais reutilizadas pelos formularios e pela area privada;
`src/lib/supabase.ts` centraliza a criacao do cliente Supabase.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) descreve User Account,
  Session, Password Recovery Request e Private Area como entidades conceituais
  da F01, com persistencia de credenciais/sessao sob responsabilidade do
  Supabase Auth.
- Contratos: [auth-routes.md](./contracts/auth-routes.md),
  [session-states.md](./contracts/session-states.md),
  [auth-forms.md](./contracts/auth-forms.md) e
  [auth-messages.md](./contracts/auth-messages.md) definem rotas, estados,
  formularios, mensagens e redirecionamentos.
- Quickstart: [quickstart.md](./quickstart.md) lista instalacao, variaveis de
  ambiente, execucao local e validacoes tecnicas/manuais.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano como
  contexto atual.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Os contratos limitam as jornadas a poucos caminhos
  e definem feedback claro para cada resultado.
- **Financial Transparency**: PASS. Contratos impedem que a area privada inicial
  simule dados financeiros ou prometa features futuras como disponiveis.
- **Mobile-First**: PASS. Quickstart e contratos exigem validacao em mobile,
  tablet, desktop, teclado virtual e texto ampliado.
- **Accessibility**: PASS. Formularios, mensagens e rotas exigem labels,
  descricoes, foco visivel, feedback anunciado e navegacao por teclado.
- **Security & Privacy**: PASS. O design usa Supabase Auth, evita armazenamento
  manual de tokens, protege rotas antes de renderizar conteudo privado e adia
  RLS para features com dados em banco.
- **Technical Quality**: PASS. O plano separa integracao, servico, provider,
  guards, schemas e paginas, mantendo baixo acoplamento.
- **Performance & Financial Data Clarity**: PASS. O design evita dependencias
  futuras desnecessarias e define estados de sessao para reduzir flicker e
  ambiguidade.

## Complexity Tracking

Nenhuma violacao da constituicao foi identificada; nao ha complexidade extra a
justificar nesta feature.
