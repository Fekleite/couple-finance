# Contract: Authorized Audit Query

## Purpose

Listar eventos recentes de auditoria que a pessoa autenticada esta autorizada a
visualizar.

## Query

Fonte: `public.financial_audit_events` sob RLS.

| Parameter | Type | Default | Rule |
|-----------|------|---------|------|
| `limit` | `number` | `50` | Maximo `100` |
| `itemType` | `transaction \| goal \| all` | `all` | Filtro simples opcional |
| `visibility` | `individual \| shared \| all` | `all` | Filtro simples opcional |

Ordenacao obrigatoria:

```text
occurred_at desc, id desc
```

## Result

```ts
type AuthorizedAuditQueryResult = {
  items: AuthorizedAuditEvent[];
  hasActiveSharedBudget: boolean;
  generatedAt: string;
};
```

## Authorization

- Individual: `owner_user_id = auth.uid()`.
- Shared: membership ativa em `shared_budget_id`.
- Sem sessao: rota privada bloqueia a UI e RLS nao retorna linhas.
- Vinculo inativo: eventos compartilhados deixam de aparecer.

## Privacy constraints

- Nao retornar contagem total de eventos no MVP.
- Nao diferenciar evento inexistente, removido ou inacessivel.
- Estado vazio deve falar apenas da ausencia de eventos autorizados.
- Erro de consulta deve ser generico e permitir retry.
