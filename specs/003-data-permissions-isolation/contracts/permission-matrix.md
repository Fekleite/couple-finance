# Contract: Permission Matrix

## Purpose

Definir uma matriz reutilizavel para features futuras decidirem se a pessoa
autenticada pode visualizar, criar, atualizar, remover, listar, buscar, contar
ou resumir um tipo de dado.

## Types

```ts
type PermissionState =
  | "unauthenticated"
  | "no_couple_link"
  | "sent_pending_invitation"
  | "received_pending_invitation"
  | "active_couple_link"
  | "unavailable_invitation"
  | "ended_or_inactive_couple_link"
  | "unrelated_authenticated_user";

type DataScope = "individual" | "shared" | "inaccessible";

type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "list"
  | "search"
  | "count"
  | "summarize";

type DataType =
  | "individual_record"
  | "shared_budget"
  | "budget_member"
  | "invitation"
  | "future_category"
  | "future_transaction"
  | "future_goal"
  | "future_balance"
  | "future_chart"
  | "future_audit_entry";
```

## Operation

```ts
function canPerformPermissionAction(input: {
  state: PermissionState;
  dataScope: DataScope;
  dataType: DataType;
  action: PermissionAction;
  isOwner?: boolean;
  isActiveMember?: boolean;
  isInviter?: boolean;
  isInvitee?: boolean;
}): boolean;
```

## Required Decisions

| State | Individual data | Shared data | Invitations |
|-------|-----------------|-------------|-------------|
| `unauthenticated` | No access | No access | No details |
| `no_couple_link` | Own data only | No access | May start/receive allowed flow |
| `sent_pending_invitation` | Own data only | No financial access | Inviter may view/cancel sent invite |
| `received_pending_invitation` | Own data only | No financial access before accept | Invitee may view/respond |
| `active_couple_link` | Own data only | Own active shared space only | Relevant own couple context only |
| `unavailable_invitation` | Own data only | No access from invite | Safe guidance only |
| `ended_or_inactive_couple_link` | Own data only | No active shared access | No access through inactive state |
| `unrelated_authenticated_user` | Own data only | No other couple access | No unrelated invitation access |

## Invariants

- `count`, `search`, `list` and `summarize` must never be more permissive than
  `view`.
- Pending invitations never grant shared financial access.
- Individual data is not visible to a partner unless a future feature defines a
  user-visible conversion to shared data.
- Client decisions are advisory for UI; Supabase RLS remains authoritative.
