# Data Model: F03 - Modelo de permissoes e isolamento de dados

## Authenticated Person

**Source**: Supabase Auth user.

Pessoa com sessao autenticada. Toda decisao de acesso parte de `auth.uid()` e,
quando indispensavel para convite, do e-mail autenticado normalizado.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Supabase Auth user id |
| `email_normalized` | `text` | Conditional | Lowercase/trim; usado apenas para convite |
| `session_state` | `authenticated` | Yes | Rotas privadas exigem sessao confirmada |

### Rules

- Nunca usar `user_metadata` como fonte de autorizacao.
- Nunca expor tokens, segredos ou `service_role` no cliente.
- Usuario autenticado nao relacionado deve receber indisponibilidade segura.

## Individual Data

**Future table pattern**: qualquer tabela futura com dados individuais.

Representa informacao pertencente a uma pessoa e nao visivel automaticamente ao
parceiro.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Primary key |
| `user_id` | `uuid` | Yes | References `auth.users(id)` |
| `visibility_scope` | `individual` | Yes | Conceitual ou derivado pela tabela |
| `created_at` | `timestamptz` | Yes | Default `now()` |
| `updated_at` | `timestamptz` | Yes | Atualizado em mutacoes |

### Rules

- SELECT/INSERT/UPDATE/DELETE somente para `user_id = auth.uid()`.
- Listas, buscas, contagens e resumos filtram por `user_id = auth.uid()`.
- O parceiro nao ve esses dados sem uma acao futura explicita de
  compartilhamento.

## Shared Financial Space

**Table**: `public.shared_budgets`

Espaco compartilhado criado na F02. Para a F03 ele e o escopo compartilhado que
futuras entidades financeiras devem referenciar.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Primary key |
| `created_by_user_id` | `uuid` | Yes | References `auth.users(id)` |
| `name` | `text` | Yes | Nome seguro, sem valores financeiros |
| `status` | `text` | Yes | `active` ou `archived` |
| `created_at` | `timestamptz` | Yes | Default `now()` |
| `updated_at` | `timestamptz` | Yes | Atualizado em mutacoes |

### Rules

- Acesso somente para membros ativos do espaco.
- Um usuario pode ter no maximo uma membership ativa no MVP.
- Um espaco pode ter no maximo dois membros ativos no MVP.
- Dados financeiros compartilhados futuros referenciam `shared_budget_id`.

## Couple Member

**Table**: `public.budget_members`

Representa participacao de uma pessoa em um espaco compartilhado.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Primary key |
| `shared_budget_id` | `uuid` | Yes | References `shared_budgets(id)` |
| `user_id` | `uuid` | Yes | References `auth.users(id)` |
| `role` | `text` | Yes | `creator` ou `partner` |
| `status` | `text` | Yes | `active` ou `removed` |
| `created_at` | `timestamptz` | Yes | Default `now()` |
| `updated_at` | `timestamptz` | Yes | Atualizado em mutacoes |

### Rules

- Usuario pode ver sua propria membership.
- Membro ativo pode ver memberships do proprio espaco compartilhado.
- Membership pendente nao existe; convite pendente nao concede acesso
  compartilhado.

## Invitation

**Table**: `public.budget_invitations`

Pedido para entrar em um espaco compartilhado. Determina quem pode responder,
mas nao concede acesso compartilhado antes do aceite valido.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Primary key e identificador de rota |
| `shared_budget_id` | `uuid` | Yes | References `shared_budgets(id)` |
| `inviter_user_id` | `uuid` | Yes | References `auth.users(id)` |
| `invitee_email` | `text` | Yes | Valor exibivel para remetente autorizado |
| `invitee_email_normalized` | `text` | Yes | Lowercase/trim |
| `status` | `text` | Yes | `pending`, `accepted`, `declined`, `cancelled`, `expired` |
| `expires_at` | `timestamptz` | Yes | 7 dias apos criacao |
| `responded_at` | `timestamptz` | No | Set em estados terminais |
| `created_at` | `timestamptz` | Yes | Default `now()` |
| `updated_at` | `timestamptz` | Yes | Atualizado em mutacoes |

### Rules

- Remetente ve e cancela convites enviados por ele.
- Destinatario autenticado ve e responde convites para seu e-mail normalizado.
- Convite pendente, recusado, cancelado, expirado, aceito ou indisponivel nao
  concede acesso financeiro compartilhado.
- Usuario nao relacionado recebe mensagem segura sem detalhes.

## Permission State

**Source**: Derivado de sessao, convite, membership e recurso solicitado.

| State | Meaning | Shared access |
|-------|---------|---------------|
| `unauthenticated` | Sessao ausente ou ainda nao confirmada | No |
| `no_couple_link` | Sem membership ativa ou convite aplicavel | No |
| `sent_pending_invitation` | Convite pendente enviado | No |
| `received_pending_invitation` | Convite pendente recebido | No |
| `active_couple_link` | Membership ativa no espaco compartilhado | Yes, own space only |
| `unavailable_invitation` | Link invalido, expirado, terminal ou bloqueado | No |
| `ended_or_inactive_couple_link` | Membership removida ou espaco inativo | No active shared access |
| `unrelated_authenticated_user` | Usuario autenticado fora do contexto | No |

## Permission Matrix

**Source**: `src/features/permissions/permission-matrix.ts`.

Combina `PermissionState`, `DataScope`, `DataType` e `PermissionAction`.

### PermissionAction

- `view`
- `create`
- `update`
- `delete`
- `list`
- `search`
- `count`
- `summarize`

### DataScope

- `individual`
- `shared`
- `inaccessible`

### Rules

- `individual`: permitido apenas para o dono autenticado.
- `shared`: permitido apenas para membro ativo do `shared_budget_id`.
- `inaccessible`: nenhuma acao de dado e permitida; somente mensagem segura.
- Agregacoes usam a mesma permissao da lista de origem.

## Visibility Scope

**Source**: `src/features/permissions/visibility-scope.ts`.

Rotulo de UX que descreve a informacao para a pessoa atual.

| Scope | User-facing meaning |
|-------|---------------------|
| `individual` | Visivel apenas para voce |
| `shared` | Visivel no espaco compartilhado do casal |
| `inaccessible` | Informacao indisponivel para voce |
| `unknown_loading` | Acesso ainda em verificacao |

### Rules

- `unknown_loading` nao exibe detalhes privados.
- `inaccessible` usa mensagem segura e acionavel.
- Rotulo nao substitui RLS.

## Future Financial Record

**Future table pattern**: categorias, transacoes, metas, saldos, graficos,
listas, filtros, resumos e auditoria.

### Shared pattern

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `uuid` | Yes | Primary key |
| `shared_budget_id` | `uuid` | Yes | References `shared_budgets(id)` |
| `created_by_user_id` | `uuid` | Yes | References `auth.users(id)` |
| `visibility_scope` | `shared` | Yes | Conceitual ou derivado |
| `created_at` | `timestamptz` | Yes | Default `now()` |
| `updated_at` | `timestamptz` | Yes | Atualizado em mutacoes |

### Rules

- SELECT/list/search/count/summarize apenas para membros ativos do
  `shared_budget_id`.
- INSERT/UPDATE/DELETE apenas para membros ativos e conforme regra especifica
  da futura feature.
- Graficos e dashboards agregam somente linhas permitidas.
- Auditoria futura deve registrar autoria sem expor eventos a usuarios fora do
  escopo.
