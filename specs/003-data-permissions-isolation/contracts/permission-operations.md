# Contract: Permission Operations

## `classifyVisibility(input)`

Purpose:

- Classificar um recurso ou estado como `individual`, `shared`,
  `inaccessible` ou `unknown_loading` para a pessoa atual.

Input:

- Auth/session status.
- Relationship state da F02.
- Resource scope conhecido.
- Ownership ou active membership quando disponivel.

Returns:

- `VisibilityScope`.
- Label e descricao segura.

Failure:

- Dados insuficientes retornam `unknown_loading` ou `inaccessible`, nunca dados
  privados parciais.

## `getPermissionDecision(input)`

Purpose:

- Decidir se a UI deve mostrar, habilitar ou bloquear uma acao.

Input:

- `PermissionState`.
- `DataScope`.
- `DataType`.
- `PermissionAction`.
- Flags contextuais como `isOwner`, `isActiveMember`, `isInviter` e
  `isInvitee`.

Returns:

```ts
type PermissionDecision =
  | { allowed: true; scope: VisibilityScope }
  | { allowed: false; scope: "inaccessible"; messageKey: SafeMessageKey };
```

Failure:

- Divergencia com RLS deve ser tratada como bloqueio seguro e retry/feedback
  neutro.

## `mapPermissionFailure(error)`

Purpose:

- Converter falhas de Supabase, RLS, RPC, recurso ausente ou indisponibilidade
  em mensagens seguras.

Rules:

- Nao propagar mensagens cruas do Supabase para a UI.
- Nao diferenciar inexistente, removido e nao autorizado para usuario nao
  relacionado.
- Usar mensagem especifica apenas quando o usuario ja esta autorizado a saber o
  contexto.

## `assertAuthorizedQueryScope(queryScope)`

Purpose:

- Contrato para features futuras validarem que listas, filtros, buscas,
  contadores e resumos carregam apenas um escopo permitido.

Rules:

- Consultas individuais exigem `user_id = currentUser.id`.
- Consultas compartilhadas exigem `shared_budget_id` de membership ativa.
- Consultas agregadas herdam o mesmo escopo.
