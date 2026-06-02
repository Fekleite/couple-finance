# Implementation Plan: F00 - Configuracao inicial do app

**Branch**: `000-configuracao-inicial-app` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/000-configuracao-inicial-app/spec.md`

## Summary

Implementar a fundacao navegavel da aplicacao web Couple Finance com React,
Vite, TypeScript estrito, TailwindCSS, Shadcn/ui e React Router. A entrega deve
criar a primeira experiencia publica do produto, layout base, rotas iniciais,
not-found e componentes reutilizaveis de loading, error e empty, sem
implementar autenticacao, persistencia, dashboard, transacoes, metas ou graficos.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 18+ e Vite.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, React Router,
ESLint, Prettier, Husky e lint-staged. React Hook Form, Zod, TanStack Query,
Recharts e Supabase ficam fora da implementacao ativa desta feature.

**Storage**: N/A. F00 nao persiste dados, nao cria banco, nao usa Supabase e nao
simula dados financeiros sensiveis.

**Testing**: Validacao obrigatoria por scripts de lint, format check, typecheck
e build. Testes automatizados de UI poderao ser adicionados se a estrutura de
testes for criada nesta feature; revisao manual deve cobrir responsividade,
teclado, foco visivel, nomes acessiveis e not-found.

**Target Platform**: Web single-page application, mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA.

**Performance Goals**: Carregamento inicial rapido, baixa complexidade de bundle
e interface fluida para telas publicas iniciais. Lighthouse acima de 90 permanece
meta de qualidade para entregas web.

**Constraints**: Nao prometer funcionalidades futuras como disponiveis; manter
rotas protegidas apenas como estrutura preparada; garantir navegacao por teclado,
foco visivel, semantica HTML clara e legibilidade com texto ampliado.

**Scale/Scope**: Fundacao inicial do MVP: uma tela inicial publica, rotas
publicas, not-found, layout base, componentes de feedback e configuracao de
qualidade. Deve preparar evolucao para F01 autenticacao, F02 convite de casal e
features financeiras posteriores.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A F00 limita o escopo a primeira tela, navegacao
  base e estados reutilizaveis, com poucos caminhos e feedback claro.
- **Financial Transparency**: PASS. A copia deve explicar o proposito do produto
  e diferenciar proposta futura de funcionalidades disponiveis, sem mostrar
  dados financeiros reais ou simulados como se fossem persistidos.
- **Mobile-First**: PASS. A estrutura de layout, navegacao e estados sera
  projetada primeiro para telas pequenas e depois expandida para tablet/desktop.
- **Accessibility**: PASS. Rotas, navegacao e componentes interativos exigem
  teclado, foco visivel, nomes acessiveis, hierarquia semantica e contraste.
- **Security & Privacy**: PASS. Nao ha dados sensiveis nem integracao Supabase
  nesta feature; a arquitetura separa areas publicas de futuras areas protegidas
  sem implementar permissao falsa.
- **Technical Quality**: PASS. A stack padrao sera configurada com TypeScript
  estrito, componentes pequenos, separacao de layout/pages/ui/lib e scripts de
  qualidade.
- **Performance & Financial Data Clarity**: PASS. A feature evita dependencias
  futuras desnecessarias e define padroes iniciais para legibilidade, moeda,
  estados e linguagem financeira clara.

## Project Structure

### Documentation (this feature)

```text
specs/000-configuracao-inicial-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── routes.md
│   └── ui-states.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── components.json
├── eslint.config.js
├── prettier.config.js
├── src/
│   ├── app/
│   │   ├── app.tsx
│   │   └── router.tsx
│   ├── components/
│   │   ├── feedback/
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   └── loading-state.tsx
│   │   ├── layout/
│   │   │   ├── app-layout.tsx
│   │   │   └── public-navigation.tsx
│   │   └── ui/
│   │       └── ...
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── home-page.tsx
│   │   └── not-found-page.tsx
│   ├── styles/
│   │   └── globals.css
│   └── main.tsx
└── tests/
    ├── accessibility/
    └── smoke/
```

**Structure Decision**: Usar uma SPA frontend simples no root do repositorio.
`src/app` concentra bootstrap e roteamento, `src/pages` guarda telas por rota,
`src/components/layout` guarda composicao estrutural, `src/components/feedback`
guarda estados reutilizaveis e `src/components/ui` fica reservado para Shadcn/ui.
`tests/` fica preparado para smoke/accessibility quando a automacao for
introduzida; validacoes minimas desta feature tambem devem rodar via scripts.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md) registra que a F00 nao cria
  entidades persistentes e define apenas conceitos de UI.
- Contratos: [contracts/routes.md](./contracts/routes.md) e
  [contracts/ui-states.md](./contracts/ui-states.md) definem rotas e estados
  publicos esperados.
- Quickstart: [quickstart.md](./quickstart.md) lista comandos de instalacao,
  desenvolvimento e validacao.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano como
  contexto atual.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Rotas e estados foram definidos com contratos
  pequenos, sem fluxos financeiros prematuros.
- **Financial Transparency**: PASS. Os contratos impedem copia que afirme
  autenticacao, transacoes, dashboard, metas, graficos ou persistencia como
  disponiveis.
- **Mobile-First**: PASS. Quickstart e contratos exigem validacao em viewports
  mobile, tablet e desktop.
- **Accessibility**: PASS. Contratos exigem nomes acessiveis, foco visivel,
  semantica e navegacao por teclado.
- **Security & Privacy**: PASS. Nenhum dado sensivel, storage ou Supabase entra
  nesta feature; areas protegidas sao apenas preparacao arquitetural.
- **Technical Quality**: PASS. Estrutura modular e scripts de qualidade estao
  definidos.
- **Performance & Financial Data Clarity**: PASS. Dependencias futuras foram
  mantidas fora da F00 e a interface evita dados financeiros ficticios ambiguuos.

## Complexity Tracking

Nenhuma violacao da constituicao foi identificada; nao ha complexidade extra a
justificar nesta feature.
