# Implementation Plan: F11 - Responsividade e acessibilidade base

**Branch**: `011-responsive-accessibility-base` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-responsive-accessibility-base/spec.md`

## Summary

Implementar uma camada transversal de responsividade, acessibilidade base,
estados de interface e mensagens seguras nos fluxos essenciais ja existentes do
MVP. A solucao prioriza componentes compartilhados em `src/components/ui`,
`src/components/feedback` e `src/components/layout`, ajustes locais em
features existentes quando necessario e contratos reutilizaveis para validar
mobile, teclado, foco, labels, estados, graficos com resumo textual, conteudo
longo e privacidade de mensagens. A F11 nao cria novo modulo financeiro, nao
altera RLS/autorizacao e nao redesenha o produto inteiro.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme dependencias atuais do projeto.

**Primary Dependencies**: React, Vite, TailwindCSS, Shadcn/ui, Radix via
Shadcn, React Router, Lucide React, Recharts, React Hook Form, Zod,
`@supabase/supabase-js`, Supabase Auth, Supabase PostgreSQL/RLS, ESLint,
Prettier, Husky, lint-staged, Vitest e Testing Library. Nenhuma nova
dependencia e planejada para a F11.

**Storage**: N/A. A feature nao cria tabelas, migrations, RPCs ou storage novo.
Servicos e queries existentes continuam protegidos por Supabase Auth e RLS.

**Testing**: Validacao obrigatoria por `npm run lint`,
`npm run format:check`, `npm run typecheck`, `npm run test:run` e
`npm run build`. Testes focam componentes compartilhados, formularios, estados,
rotas, mensagens, roles/labels acessiveis, interacoes por teclado viaveis,
graficos com resumo textual, privacidade e regressao dos fluxos essenciais.

**Target Platform**: Web single-page application mobile-first, responsiva para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA integrada a Supabase Auth e Supabase
PostgreSQL/RLS.

**Performance Goals**: Manter meta Lighthouse acima de 90, evitar rolagem
horizontal obrigatoria em fluxos essenciais e preservar interacoes fluidas em
listas, cards, formularios e graficos sob uso normal do MVP.

**Constraints**: Nao alterar autorizacao, RLS, ownership, vinculo do casal ou
persistencia financeira; nao revelar dados inacessiveis por estados, erros,
listas, graficos, resumos ou mensagens; nao adicionar dependencias ou suite E2E
pesada sem justificativa; nao transformar a entrega em redesign amplo.

**Scale/Scope**: Decima primeira feature do MVP, transversal a autenticacao,
area privada, convite/vinculo, permissoes, categorias, transacoes, dashboard,
graficos, metas e auditoria.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity & UX**: PASS. A F11 remove bloqueios de uso e padroniza estados
  sem criar novas capacidades financeiras ou fluxos complexos.
- **Financial Transparency**: PASS. Rotulos textuais, formatos consistentes e
  resumos acessiveis preservam clareza de dados individuais/compartilhados.
- **Mobile-First**: PASS. Mobile, texto ampliado e ausencia de rolagem
  horizontal obrigatoria sao criterios centrais do plano.
- **Accessibility**: PASS. Foco visivel, teclado, labels, erros associados,
  estados perceptiveis e resumos textuais sao tratados como requisitos.
- **Security & Privacy**: PASS. A feature preserva Supabase Auth/RLS e define
  mensagens seguras que nao inferem dados inacessiveis.
- **Technical Quality**: PASS. Correcoes ficam em componentes compartilhados e
  features existentes, com contratos pequenos e testes focados.
- **Performance & Financial Data Clarity**: PASS. A abordagem privilegia CSS,
  semantica nativa e componentes pequenos, evitando custo de runtime e
  dependencias novas.

## Project Structure

### Documentation (this feature)

```text
specs/010-responsive-accessibility-base/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- accessible-control.md
|   +-- accessible-financial-summary.md
|   +-- financial-context-label.md
|   +-- interface-state.md
|   +-- responsive-baseline.md
|   +-- safe-message.md
+-- tasks.md
```

### Source Code (repository root)

```text
.
+-- src/
|   +-- app/
|   |   +-- router.tsx
|   |   +-- routes.test.ts
|   |   +-- routes.ts
|   +-- components/
|   |   +-- feedback/
|   |   |   +-- empty-state.tsx
|   |   |   +-- error-state.tsx
|   |   |   +-- loading-state.tsx
|   |   +-- layout/
|   |   |   +-- app-layout.tsx
|   |   |   +-- authenticated-layout.tsx
|   |   |   +-- public-navigation.tsx
|   |   +-- ui/
|   |       +-- alert.tsx
|   |       +-- button.tsx
|   |       +-- field.tsx
|   |       +-- input.tsx
|   |       +-- chart.tsx
|   +-- features/
|   |   +-- auth/
|   |   +-- audit/
|   |   +-- categories/
|   |   +-- couple/
|   |   +-- dashboard/
|   |   +-- goals/
|   |   +-- permissions/
|   |   +-- transactions/
|   +-- pages/
|   +-- styles/
|   |   +-- globals.css
|   +-- test/
+-- specs/
    +-- 010-responsive-accessibility-base/
```

**Structure Decision**: Nao criar `src/features/accessibility` nem nova rota. A
F11 e transversal: ajustes globais ficam em `globals.css`, `components/ui`,
`components/feedback` e `components/layout`; ajustes de dominio permanecem nas
features que ja possuem os dados e mensagens. Paginas em `src/pages` continuam
finas, coordenando rota e composicao.

## Complexity Tracking

Nenhuma violacao de constituicao foi identificada.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) descreve Essential Flow,
  Responsive Requirement, Accessible Control, Interface State, Safe Message,
  Financial Context Label, Accessible Financial Summary e Future Feature
  Acceptance Baseline.
- Contratos:
  [responsive-baseline.md](./contracts/responsive-baseline.md),
  [accessible-control.md](./contracts/accessible-control.md),
  [interface-state.md](./contracts/interface-state.md),
  [safe-message.md](./contracts/safe-message.md),
  [financial-context-label.md](./contracts/financial-context-label.md) e
  [accessible-financial-summary.md](./contracts/accessible-financial-summary.md).
- Quickstart: [quickstart.md](./quickstart.md) lista comandos, revisao por
  fluxo essencial, validacao mobile/tablet/desktop, teclado, texto ampliado,
  graficos, mensagens seguras e checks tecnicos.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Simplicity & UX**: PASS. Os contratos removem friccao nos fluxos atuais sem
  adicionar novas jornadas financeiras.
- **Financial Transparency**: PASS. Contexto individual/compartilhado, valores,
  datas, status e progresso devem ser textuais e consistentes.
- **Mobile-First**: PASS. O baseline define ausencia de rolagem horizontal,
  conteudo longo, texto ampliado e alvos de toque como criterios transversais.
- **Accessibility**: PASS. Contratos cobrem controles, formularios, foco,
  estados, dialogos e equivalentes textuais para informacao visual.
- **Security & Privacy**: PASS. Safe Message impede inferencia de dados
  inacessiveis e nenhum artefato altera RLS/autorizacao.
- **Technical Quality**: PASS. A fronteira permanece nos modulos existentes,
  com contratos pequenos e verificaveis.
- **Performance & Financial Data Clarity**: PASS. A decisao evita dependencias
  novas, wrappers pesados e medicao de layout em runtime.
