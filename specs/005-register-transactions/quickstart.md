# Quickstart: F05 - Registro de transacoes

## Prerequisites

- Node.js compativel com o projeto e dependencias instaladas.
- F01-F04 implementadas e validadas.
- Projeto Supabase com Authentication configurado.
- Supabase CLI e Docker disponiveis para validacao local.

## Environment

Manter `.env.local` baseado em `.env.example`. Usar somente publishable/anon
key no frontend; nunca expor `service_role`, secret key ou connection string.

## Planned Implementation

1. Criar migration `create_financial_transactions`.
2. Criar schema privado, tabela, constraints, indices, grants, RLS e operacao
   transacional idempotente.
3. Criar `src/features/transactions` com tipos, schemas, moeda, servico,
   controller, formulario, mensagens e resumo.
4. Criar rota autenticada `/app/transactions/new` e entrada discreta na area
   privada.
5. Reutilizar contexto de relacionamento, permissoes e categorias.
6. Adicionar testes unitarios, integracao frontend e contratos de migration.

## Development

```bash
npm run dev
```

Fluxos manuais:

1. Registrar receita e despesa individual sem vinculo ativo.
2. Confirmar criador e responsavel como a pessoa atual.
3. Com dois membros ativos, registrar shared para cada responsavel elegivel.
4. Confirmar tipo, valor, categoria, responsavel e visibilidade no resumo.
5. Acionar confirmar repetidamente e verificar um unico registro.
6. Simular falha recuperavel, corrigir contexto e tentar novamente.
7. Iniciar outra transacao e verificar formulario e chave renovados.

## Supabase Migration and Validation

Descobrir os comandos disponiveis antes de executar:

```bash
supabase --help
supabase db --help
supabase migration --help
```

Aplicar e revisar localmente:

```bash
supabase db reset
supabase migration list --local
```

Validar migration:

- `public.financial_transactions` possui RLS habilitado.
- `authenticated` possui somente `SELECT` na tabela e `EXECUTE` na RPC
  publica; nao possui `INSERT`, `UPDATE` ou `DELETE`.
- `anon` nao consulta tabela nem executa criacao.
- Funcao privilegiada fica em schema privado, possui `search_path` seguro e nao
  e chamavel pela Data API.
- Individual grava criador igual ao responsavel e sem `shared_budget_id`.
- Shared exige criador e responsavel ativos no mesmo espaco.
- Categoria inexistente, inativa ou incompativel e rejeitada sem fallback.
- Convite pendente, membership removida, budget inativo e pessoa externa sao
  rejeitados com falha segura.
- Mesmo criador, chave e payload retornam a mesma transacao.
- Mesmo criador e chave com payload diferente falham sem nova linha.
- Chave igual de outro criador nao revela nem reutiliza transacao.
- RLS permite leitura individual somente ao criador e shared somente a membros
  ativos.

## Technical Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
git diff --check
```

Cobertura automatizada esperada:

- Conversao exata entre entrada `pt-BR`, centavos e exibicao.
- Limites de valor, titulo e observacao.
- Data civil sem conversao de timezone.
- Defaults individual, responsavel atual e categoria vazia.
- Trocas de tipo e visibilidade limpam opcoes inelegiveis.
- Categoria por aplicabilidade e sem fallback para `other`.
- Responsaveis shared limitados aos dois membros ativos autorizados.
- Submissao, loading, falha recuperavel, bloqueio e sucesso.
- Retry preserva chave; novo registro gera nova chave.
- Editar payload apos tentativa gera nova chave antes do proximo envio.
- Servico mapeia falhas para mensagens seguras.
- Formulario e resumo acessiveis.
- Rota privada e ausencia de lista, filtros, totais ou dashboard.
- Migration, constraints, grants, RPC, idempotencia e RLS.

## Accessibility and Responsive Validation

- Testar mobile, tablet e desktop sem rolagem horizontal.
- Preencher e confirmar somente por teclado.
- Confirmar labels, foco visivel e erros associados.
- Confirmar estados de envio, erro e sucesso perceptiveis por leitor de tela
  quando disponivel.
- Confirmar que tipo, responsavel, visibilidade e selecao nao dependem de cor.
- Testar texto ampliado ate 200%.
- Verificar que uma transacao comum pode ser registrada em ate 60 segundos.

## Privacy Review

- Autoria vem da sessao e nao do payload confiavel.
- Parceiro nao le nem infere transacao individual.
- Pessoa externa nao cria nem le transacao shared.
- Seletor de responsavel nao exibe e-mail ou pessoa externa.
- Mensagens nao exibem erros crus, IDs privados ou detalhes de outro espaco.
- Logs nao contem payload, valor, observacao, token ou IDs privados.
- Resumo de sucesso pertence a operacao autorizada atual.

## Out of Scope Checks

Confirmar que F05 nao introduz:

- Lista, busca, filtro, contador ou agregacao de transacoes.
- Edicao, exclusao, arquivamento ou restauracao.
- Dashboard, saldo, total, grafico ou relatorio.
- Categorias personalizadas ou alteracao do catalogo.
- Recorrencia, agendamento, parcelas, anexos ou importacao bancaria.
- Multiplas moedas, aprovacao ou auditoria detalhada.

## Implementation Validation - 2026-06-04

Implemented the secure transaction migration, exact currency and civil-date
contracts, idempotent service/controller flow, accessible mobile-first form,
authorized success summary, protected route, and private-home entry point.

Observed automated results:

- `npm run lint`: PASS
- `npm run format:check`: PASS
- `npm run typecheck`: PASS
- `npm run test:run`: PASS (38 files, 123 tests)
- `npm run build`: PASS; Vite reports the existing bundle-size advisory
- `git diff --check`: PASS
- Migration contract tests: PASS for constraints, indexes, grants, RPC-only
  mutation, function security, idempotency, active-membership checks, and RLS

Observed reviews:

- Privacy: no raw errors, private IDs, e-mails, payload logs, or client-supplied
  creator values are displayed.
- Accessibility/mobile: visible labels, semantic groups, associated errors,
  keyboard controls, live status, touch-sized actions, bounded responsive
  layout, and no horizontal-layout dependency are present.
- Scope: no list, filter, search, edit, delete, totals, balance, dashboard,
  chart, custom category, recurrence, attachment, import, or audit history was
  introduced.
- Financial clarity: type, exact value, civil date, category, creator,
  responsible person, and visibility remain distinct in the form and summary.

Open local/manual validation:

- `supabase db reset` and `supabase migration list --local` could not run
  because Docker Desktop was not running.
- Live individual/shared authorization scenarios, 200% text zoom, screen-reader
  behavior, and the complete manual acceptance walkthrough remain to be run
  against a started local Supabase stack.
