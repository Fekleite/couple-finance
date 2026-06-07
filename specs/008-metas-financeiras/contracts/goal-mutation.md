# Contract: Goal Mutation

## Purpose

Definir mutacoes de criacao, edicao, conclusao e arquivamento de metas
financeiras autorizadas.

## Create Goal

```ts
type CreateGoalInput = {
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  deadlineDate: string | null;
  visibility: "individual" | "shared";
  sharedBudgetId: string | null;
};
```

### Rules

- `created_by_user_id` vem de `auth.uid()`.
- Individual persiste `shared_budget_id = null`.
- Shared exige membership ativa no `sharedBudgetId`.
- Status inicial e sempre `active`.

## Update Goal

```ts
type UpdateGoalInput = {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  deadlineDate: string | null;
};
```

### Rules

- Apenas metas autorizadas e ativas podem ser editadas no MVP.
- `visibility` e `sharedBudgetId` nao podem ser alterados.
- A resposta retorna a meta atualizada autorizada.

## Complete Goal

```ts
type CompleteGoalInput = {
  id: string;
};
```

Define `status = "completed"` e `completed_at = now()`.

## Archive Goal

```ts
type ArchiveGoalInput = {
  id: string;
};
```

Define `status = "archived"` e `archived_at = now()`.

## Failure Reasons

| Reason | Meaning |
|--------|---------|
| `validation` | Campos invalidos |
| `shared_context_unavailable` | Shared sem membership ativa |
| `goal_unavailable` | Meta inexistente, inacessivel ou nao ativa |
| `transition_unavailable` | Transicao nao permitida |
| `temporary_failure` | Falha recuperavel |

Mensagens publicas nao diferenciam meta inexistente de meta sem autorizacao.
