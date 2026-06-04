# Contract: Category Query

## Purpose

Definir a leitura autenticada do catalogo sem cache complexo ou vazamento de
erro interno.

## Service Contract

```ts
type CategoryServiceResult =
  | { ok: true; data: StandardFinancialCategory[] }
  | { ok: false; reason: "temporary_failure"; message: string };

function listActiveCategories(): Promise<CategoryServiceResult>;
```

## Query Rules

- Consultar somente colunas necessarias.
- Filtrar `is_active = true`.
- Ordenar por `sort_order` ascendente.
- Nao consultar transacoes, membros, orcamentos ou contadores.
- Mapear `snake_case` persistido para contratos TypeScript.
- Retornar mensagem segura, nunca erro cru do Supabase.

## Hook State

```ts
type CategoryCatalogState =
  | { status: "loading" }
  | { status: "ready"; categories: StandardFinancialCategory[] }
  | { status: "empty"; message: string }
  | { status: "error"; message: string };
```

O hook expoe `refresh` para retry. Troca de sessao invalida o estado anterior;
nenhuma lista privada ou financeira participa do estado.

## Authorization

- A rota consumidora exige sessao autenticada confirmada.
- Supabase RLS e grants permitem `SELECT` para `authenticated`.
- `anon` nao consulta.
- `authenticated` nao insere, atualiza ou exclui.
