# Contract: Authorized Goal Query

## Purpose

Definir a leitura autorizada de metas financeiras para a area privada de metas.
O contrato retorna somente metas individuais da pessoa autenticada e metas
compartilhadas do espaco compartilhado ativo autorizado por RLS.

## Input

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | `active \| completed \| archived \| all` | No | Default `active` |
| `visibility` | `individual \| shared \| all` | No | Default `all` |
| `limit` | `number` | No | Default pequeno; maximo seguro |

## Authorization

- A consulta usa `public.financial_goals` sob RLS.
- Individual: `created_by_user_id = auth.uid()`.
- Shared: membership ativa no `shared_budget_id`.
- Convites e memberships inativas nao concedem leitura.
- Sem contagem total no MVP.

## Output

```ts
type AuthorizedGoalQueryResult = {
  items: AuthorizedGoal[];
  generatedAt: string;
};
```

## Safe States

- `empty`: nenhuma meta autorizada no filtro atual.
- `error`: falha recuperavel sem SQL, IDs, detalhes de RLS ou existencia de
  recurso.
- `blocked`: somente para acoes compartilhadas quando nao ha budget ativo.

## Ordering

Metas ativas com prazo aparecem antes por `deadline_date asc`; metas sem prazo
aparecem depois; `updated_at desc` e `id desc` sao desempates. Concluidas e
arquivadas ordenam por `updated_at desc, id desc`.
