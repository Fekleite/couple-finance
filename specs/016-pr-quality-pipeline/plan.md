# Implementation Plan: F17 - Pipeline de Pull Request com lint, testes, typecheck e build

**Branch**: `017-pr-quality-pipeline` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-pr-quality-pipeline/spec.md`

## Summary

Criar um pipeline de Pull Request para a branch principal `main` usando GitHub
Actions, com instalacao reprodutivel por `npm ci` a partir de
`package-lock.json` e etapas explicitas para `format:check`, `lint`,
`typecheck`, `test:run` e `build`. A implementacao deve adicionar um workflow
versionado em `.github/workflows/`, documentar a validacao local em `docs/` e
registrar a configuracao esperada de branch protection como acao manual de
repositorio. Nenhuma tela, regra financeira, autorizacao, schema, Supabase,
Prisma ou fluxo da aplicacao deve mudar.

## Technical Context

**Language/Version**: TypeScript em modo estrito sobre React 19, Vite 8 e React
Router 7, conforme `package.json`.

**Primary Dependencies**: GitHub Actions para CI, Node.js/npm, `package-lock.json`,
ESLint, Prettier, TypeScript, Vitest, Vite, Husky e lint-staged. Dependencias de
runtime existentes incluem React, TailwindCSS 4, Shadcn/ui/Radix, Supabase,
React Hook Form, Zod, Recharts e `@tanstack/react-table`, mas a F17 nao altera
runtime da aplicacao.

**Storage**: N/A. Nao ha nova tabela, migration, schema, Prisma, Supabase,
repository, service ou alteracao de persistencia.

**Testing**: Validacoes locais e de CI devem usar `npm run format:check`,
`npm run lint`, `npm run typecheck`, `npm run test:run` e `npm run build`.
`npm run build` ja executa typecheck internamente, mas o workflow deve manter
`typecheck` como etapa separada para status e diagnostico claros no Pull
Request.

**Target Platform**: GitHub-hosted Linux runner para validacao de Pull Requests
de uma SPA web privada. A aplicacao final continua web mobile-first para
mobile, tablet e desktop.

**Project Type**: Aplicacao frontend SPA com tooling Node/npm e documentacao
tecnica versionada.

**Performance Goals**: Pipeline com feedback claro e previsivel. O primeiro
plano deve priorizar confiabilidade e legibilidade dos status sobre otimizacoes
de cache; cache de npm pode ser usado se suportado pela acao oficial sem
comprometer reprodutibilidade.

**Constraints**: Nao implementar deploy; nao adicionar E2E completo; nao
integrar monitoramento externo; nao instalar dependencias novas sem necessidade
clara; nao alterar codigo de produto, dados financeiros, autenticacao,
autorizacao, Supabase, Prisma, schema, UI, rotas ou fluxos F00-F16. Nao depender
de secrets ou credenciais de producao para validar PRs.

**Scale/Scope**: Um workflow de PR, documentacao local de validacao e guia de
branch protection. Escopo limitado a qualidade de Pull Request para a branch
principal local `main`, com possibilidade documentada de expandir para outras
branches principais se o repositorio adotar release branches.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Incremental Baseline**: PASS. A F17 protege os fluxos F00-F16 sem recriar
  autenticacao, casal, permissoes, transacoes, dashboard, metas, auditoria,
  responsividade ou acessibilidade.
- **Simplicity & Visual Clarity**: PASS. Sem UI de produto nova; os status ficam
  no Pull Request e a orientacao local fica em documentacao tecnica.
- **Financial Transparency**: PASS. Nenhuma representacao financeira muda; o
  pipeline apenas reduz risco de regressao em valores, filtros, totais e
  auditoria.
- **Mobile-First**: PASS. Nenhuma experiencia mobile muda; o build/test suite
  existente continua protegendo a aplicacao.
- **Accessibility**: PASS. Nenhum controle acessivel novo e necessario; a
  validacao automatizada passa a proteger regressao em testes/build existentes.
- **Security & Privacy**: PASS. O workflow nao deve usar secrets, credenciais de
  producao nem imprimir dados sensiveis. Nao altera RLS, Auth, autorizacao ou
  isolamento.
- **Technical Quality & Tests**: PASS. A feature torna lint, format check,
  typecheck, testes e build verificacoes obrigatorias de PR e reproduziveis
  localmente.
- **Performance, Server State & Data Clarity**: PASS. Sem mudancas runtime,
  query, refetch, tabelas, graficos, totais ou formatacao financeira.
- **Prisma & Server-Side Boundary**: PASS. Sem Prisma, migrations, schema,
  backend ou camada server-side.
- **PR Pipeline**: PASS. Este e o objetivo central da feature; o plano define
  execucao local e em PR.

## Project Structure

### Documentation (this feature)

```text
specs/016-pr-quality-pipeline/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
|   +-- branch-protection.md
|   +-- local-validation.md
|   +-- pull-request-validation.md
+-- checklists/
|   +-- requirements.md
+-- spec.md
```

### Source Code (repository root)

```text
.github/
+-- workflows/
|   +-- pull-request-quality.yml
docs/
+-- pr-quality-pipeline.md
package.json
package-lock.json
```

**Structure Decision**: Criar apenas infraestrutura de CI e documentacao. O
workflow novo deve viver em `.github/workflows/pull-request-quality.yml`.
`docs/pr-quality-pipeline.md` deve explicar como reproduzir a validacao local e
como configurar branch protection. `package.json` e `package-lock.json` devem
ser lidos como fonte dos scripts existentes; so devem mudar se a auditoria
provar que um script necessario esta ausente ou incoerente.

## Complexity Tracking

Nenhuma violacao da constituicao foi identificada. A escolha por GitHub Actions
e incremental porque o repositorio ja usa Git e o objetivo da feature e
publicar status no Pull Request. A configuracao de branch protection depende do
repositorio remoto e deve ser documentada, nao simulada por codigo local.

## Phase 0 Research Summary

As decisoes tecnicas foram consolidadas em [research.md](./research.md). Nao
restam clarificacoes pendentes.

## Phase 1 Design Summary

- Modelo conceitual: [data-model.md](./data-model.md) define Pull Request,
  Principal Branch, Quality Validation Run, Validation Category, Workflow
  Configuration, Branch Protection Rule e Local Validation Guide.
- Contratos:
  [pull-request-validation.md](./contracts/pull-request-validation.md),
  [local-validation.md](./contracts/local-validation.md) e
  [branch-protection.md](./contracts/branch-protection.md).
- Quickstart: [quickstart.md](./quickstart.md) lista validacao local, verificacao
  do workflow, simulacao de falhas, revisao de seguranca e configuracao manual
  de branch protection.
- Agent context: [AGENTS.md](../../AGENTS.md) aponta para este plano.

## Constitution Check - Post-Design

- **Incremental Baseline**: PASS. Os artefatos de design limitam a mudanca a CI
  e documentacao, preservando F00-F16.
- **Simplicity & Visual Clarity**: PASS. Status claros por etapa no PR e
  documentacao objetiva, sem UI de produto.
- **Financial Transparency**: PASS. A F17 protege regressao, mas nao altera
  visibilidade, responsabilidade ou calculos financeiros.
- **Mobile-First**: PASS. Sem mudanca de layout; build e testes existentes
  continuam cobrindo a aplicacao web.
- **Accessibility**: PASS. Sem novos controles; a pipeline passa a bloquear
  regressao detectada pelas validacoes existentes.
- **Security & Privacy**: PASS. Contratos declaram ausencia de secrets e de
  deploy, alem de nao depender de dados de producao.
- **Technical Quality & Tests**: PASS. O contrato de PR exige format check,
  lint, typecheck, test run e build como categorias separadas e bloqueantes.
- **Performance, Server State & Data Clarity**: PASS. Sem runtime ou server
  state; build/test suite protegem mudancas futuras.
- **Prisma & Server-Side Boundary**: PASS. Sem Prisma, schema, migrations ou
  backend.
- **PR Pipeline**: PASS. Quickstart e contratos tornam a validacao local e o
  required check verificaveis.
