# Data Model: F04 - Categorias financeiras padrao

## Standard Financial Category

**Table**: `public.standard_financial_categories`

Dado de referencia global e somente leitura que classifica futuras
movimentacoes. Nao pertence a usuario, membro ou espaco compartilhado.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `code` | `text` | Yes | Primary key estavel; nao muda depois de publicado |
| `display_name` | `text` | Yes | Nome curto em portugues brasileiro |
| `description` | `text` | Yes | Explica uso sem linguagem tecnica |
| `applicability` | `text` | Yes | `income`, `expense` ou `both` |
| `sort_order` | `smallint` | Yes | Ordem canonica unica e positiva |
| `is_active` | `boolean` | Yes | Disponivel para novas selecoes |

### Constraints

- `code` e primary key e segue formato lowercase ASCII com underscores.
- `display_name` e `description` nao podem ficar vazios apos `btrim`.
- `applicability` aceita somente `income`, `expense` ou `both`.
- `sort_order` e unico e maior que zero.
- Nao ha `user_id`, `shared_budget_id` ou contador de uso.
- Nao ha timestamps; evolucao ocorre por migrations versionadas.

### Authorization

- RLS habilitado.
- `authenticated` pode executar somente `SELECT`.
- `anon` nao recebe acesso.
- Clientes autenticados nao recebem `INSERT`, `UPDATE` ou `DELETE`.
- Alteracoes do catalogo acontecem apenas por migration revisada.

### Lifecycle

| Current state | Action | Result |
|---------------|--------|--------|
| absent | seed migration | active |
| active | edit display text/order by migration | active, same `code` |
| active | discontinue by migration | inactive, same `code` |
| inactive | restore by migration | active, same `code` |

Excluir ou trocar um `code` publicado fica fora do fluxo permitido.

## Category Applicability

Classificacao que orienta futuros seletores sem executar regra contabil.

| Value | Meaning |
|-------|---------|
| `income` | Categoria normalmente usada para entradas |
| `expense` | Categoria normalmente usada para saidas |
| `both` | Categoria pode representar entradas ou saidas conforme o contexto |

Aplicabilidade orienta apresentacao e filtro de opcoes. Ela nao autoriza,
cria, converte ou categoriza movimentacoes automaticamente.

## Category Catalog State

**Source**: `src/features/categories/use-categories.ts`.

Estado de leitura do catalogo autenticado.

| State | Data | UI behavior |
|-------|------|-------------|
| `loading` | none | Exibir feedback sem lista parcial |
| `ready` | ordered active categories | Exibir catalogo |
| `empty` | empty list | Exibir indisponibilidade inesperada |
| `error` | safe message | Exibir retry sem erro cru |

## Category Usage Context

Contexto futuro no qual uma categoria sera aplicada.

| Value | Meaning |
|-------|---------|
| `individual` | O futuro registro pertence somente ao usuario atual |
| `shared` | O futuro registro pertence ao espaco compartilhado ativo |

A categoria permanece global nos dois contextos. A autorizacao vem do registro
financeiro e dos contratos da F03.

## Future Financial Movement Reference

**Future field**: `category_code text references
public.standard_financial_categories(code)`.

Representa apenas a classificacao de uma movimentacao futura.

### Rules

- F04 nao cria a tabela de movimentacoes.
- A chave estrangeira futura usa `category_code`, nunca `display_name`.
- Uma categoria inativa continua valida para historico, mas nao aparece em
  novas selecoes por padrao.
- O registro futuro preserva seu proprio `user_id` ou `shared_budget_id`.
- RLS da movimentacao nao depende da categoria.
- Listas, filtros, dashboards e graficos futuros agregam somente registros
  autorizados, mesmo quando agrupam por categoria.
