# Quickstart: F04 - Categorias financeiras padrao

## Prerequisites

- Node.js compativel com o projeto.
- Dependencias instaladas com `npm install`.
- F01-F03 implementadas e validadas.
- Projeto Supabase com Authentication configurado.
- Supabase CLI instalado para aplicar e validar a migration.

## Environment

Manter `.env.local` baseado em `.env.example`. Nao commitar valores reais.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/reset-password
```

Usar somente publishable/anon key no frontend. Nunca expor `service_role`,
secret key ou connection string no bundle.

## Planned Implementation

1. Criar migration `create_standard_financial_categories`.
2. Criar tabela, constraints, RLS, grants e seed idempotente.
3. Criar `src/features/categories` com tipos, servico, hook, mensagens,
   catalogo, opcao e seletor.
4. Criar pagina autenticada `/app/categories`.
5. Atualizar rotas e navegacao privada de forma consistente.
6. Adicionar testes unitarios e de integracao.

## Development

```bash
npm run dev
```

Fluxos manuais esperados:

1. Entrar com pessoa autenticada e abrir `/app/categories`.
2. Confirmar as onze categorias em ordem canonica, com nomes e descricoes.
3. Diferenciar Moradia, Contas e Compras pelas descricoes.
4. Confirmar `Outros` como ultima opcao e `Renda` para entradas comuns.
5. Navegar pelo seletor reutilizavel em teste/integracao com teclado e foco
   visivel.
6. Simular falha de leitura e confirmar mensagem segura com retry.
7. Confirmar que nenhuma superficie mostra totais, contadores ou transacoes.

## Supabase Migration and Validation

Descobrir comandos disponiveis antes de executar:

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

Validar:

- `public.standard_financial_categories` possui RLS habilitado.
- Seed contem codes unicos e as onze categorias planejadas.
- `sort_order` e unico e `Outros` aparece por ultimo.
- Pessoa autenticada pode selecionar categorias ativas.
- Pessoa anonima nao pode consultar a tabela pela Data API.
- Pessoa autenticada nao pode inserir, atualizar ou excluir categorias.
- Reaplicar/resetar migrations nao duplica linhas.
- Alterar `display_name` por migration preserva o mesmo `code`.
- Tornar categoria inativa preserva sua linha para referencia historica.

## Technical Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

Cobertura automatizada esperada:

- Onze categorias iniciais, incluindo as dez minimas e `Renda`.
- Codes, ordem, nomes, descricoes e aplicabilidade.
- Unicidade de `code` e `sort_order`.
- `Outros` como fallback final.
- Mapeamento de rows do Supabase para contratos TypeScript.
- Estados `loading`, `ready`, `empty` e `error`.
- Retry apos falha temporaria.
- Pagina autenticada de consulta.
- `CategorySelector` por teclado, foco e estado selecionado sem depender de
  cor.
- Ausencia de contadores, totais, transacoes ou informacao de escopo.

## Accessibility and Responsive Validation

- Testar larguras mobile comuns, tablet e desktop.
- Confirmar ausencia de rolagem horizontal.
- Confirmar nomes e descricoes legiveis com texto ampliado ate 200%.
- Operar o seletor somente com teclado.
- Confirmar foco visivel e ordem logica.
- Confirmar nome, descricao e selecao perceptiveis por leitor de tela quando
  disponivel.
- Confirmar que icones sao apenas decorativos ou possuem tratamento semantico
  adequado.
- Confirmar feedback perceptivel para loading, erro e indisponibilidade.

## Privacy Review

- Catalogo nao possui `user_id` ou `shared_budget_id`.
- Pagina nao consulta nem sugere movimentacoes financeiras.
- Mensagens nao exibem erros crus do Supabase ou SQL.
- Disponibilidade de categoria nao implica existencia de dados financeiros.
- Futura movimentacao deve herdar isolamento individual/compartilhado da F03.

## Out of Scope Checks

Confirmar que a F04 nao introduz:

- Criacao, edicao ou exclusao de categorias por usuarios.
- Categorias personalizadas.
- Transacoes ou formularios de transacao.
- Filtros, dashboard, graficos, saldos, metas ou auditoria.
- Contadores ou totais por categoria.
- Categorizacao automatica.

## Implementation Validation Results

Validation performed on 2026-06-03:

- `npm run lint`: PASS.
- `npm run format:check`: PASS.
- `npm run typecheck`: PASS.
- `npm run test:run`: PASS, 30 files and 108 tests.
- `npm run build`: PASS. Vite emitted a non-blocking chunk-size warning.
- Focused category/page/route suite: PASS, 8 files and 26 tests.
- `git diff --check`: PASS.
- Static migration contract validation: PASS for constraints, eleven-category
  idempotent seed, RLS, authenticated SELECT grant, anonymous denial by revoke,
  and absence of authenticated mutation grants.
- Privacy and scope review: PASS. Production category code does not query or
  expose ownership, membership, movements, counters, totals, dashboards, or
  automatic categorization.

Pending environment-dependent validation:

- `supabase migration list --local` could not connect because the local
  Supabase stack was not running.
- `supabase start` could not start because Docker Desktop was not running.
- `supabase db reset` and live Data API checks for anonymous/authenticated RLS
  and mutation denial remain pending until Docker is available.
- Hands-on mobile viewport, 200% text zoom, screen-reader, and complete manual
  acceptance review remain pending.
