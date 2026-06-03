# Supabase Validation: F02 - Convite e vinculo do casal

## Scope

Validar migration, constraints, RLS e funcoes RPC para tres usuarios:

- Usuario A: remetente.
- Usuario B: destinatario.
- Usuario C: nao relacionado.

## Setup Notes

Executar quando Supabase local estiver disponivel:

```bash
supabase --help
supabase db reset
supabase migration list --local
```

## Constraint Scenarios

- Criar um orcamento, membro criador e convite pendente para A.
- Confirmar que A nao consegue criar segundo `budget_members.status = active`.
- Confirmar que terceiro membro ativo no mesmo orcamento falha pelo trigger
  `budget_members_max_two_active_members`.
- Confirmar que apenas um criador ativo existe por orcamento.
- Confirmar que apenas um convite pendente existe por orcamento.
- Confirmar que convites em estados `accepted`, `declined`, `cancelled` e
  `expired` nao voltam a `pending` por fluxo da aplicacao.

## RLS Scenarios

- A visualiza seu orcamento, sua membresia e convite enviado.
- B visualiza somente convite enderecado ao e-mail autenticado.
- C nao visualiza orcamento, membros ou convite de A/B.
- Usuarios anonimos nao visualizam tabelas F02.
- Policies usam `to authenticated` e nao dependem de `user_metadata`.

## RPC Scenarios

- `create_shared_budget_and_invite` cria exatamente um orcamento ativo, um
  membro criador ativo e um convite pendente com `expires_at` em 7 dias.
- Auto-convite falha.
- Usuario com membresia ativa nao cria novo espaco.
- `accept_invitation` para B cria exatamente um membro parceiro e marca convite
  como `accepted`.
- Segundo aceite do mesmo convite nao cria novo membro.
- B ja vinculado nao aceita outro convite.
- Convite expirado, cancelado, recusado ou aceito nao cria vinculo.
- `decline_invitation` marca convite pendente como `declined` sem criar membro.
- `cancel_invitation` marca convite pendente como `cancelled` sem criar membro.
- Usuario C recebe indisponibilidade segura em aceite, recusa ou cancelamento.

## Validation Status

- Supabase CLI detected: `2.101.0`.
- Database validation attempted with `supabase db reset`.
- Result: skipped/blocked because Docker daemon was not running.
- Error summary: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock`.
- Expected next command after Docker is available: `supabase db reset`.

## Accessibility Review Notes

- `/app` form uses visible e-mail label, associated field error, disabled
  submit while loading and keyboard submit.
- `/app` states use headings, perceivable alert/loading/error feedback and one
  primary action per state.
- `/app/invites/:invitationId` exposes accept/decline buttons with explicit
  text, disabled loading state and safe unavailable message.
- Manual screen reader and 200% text review remains recommended in a browser.

## Responsive Review Notes

- `/app` and `/app/invites/:invitationId` use constrained single-column mobile
  layouts and expand actions with `sm:flex-row`.
- Essential actions remain visible in the first content column on mobile.
- Manual viewport review remains recommended for common mobile, tablet and
  desktop widths.

## Financial Privacy Audit Notes

- Couple service does not use `service_role` keys.
- Authorization is based on `auth.uid()`, Supabase Auth e-mail and persistent
  tables, not `user_metadata`.
- UI does not render balances, categories, goals, charts or dashboard values.
- Service maps raw Supabase/SQL failures to safe user-facing messages.
