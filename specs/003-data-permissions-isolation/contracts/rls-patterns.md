# Contract: Supabase RLS Patterns

## Purpose

Definir padroes que F03 valida nas tabelas atuais e que F04-F10 devem seguir
ao criar dados financeiros.

## Current F02 Tables

### `public.shared_budgets`

- RLS enabled.
- `SELECT` somente para membros ativos.
- Nenhum acesso anonimo.
- Futuras mutacoes devem preservar o limite de um espaco ativo por usuario.

### `public.budget_members`

- RLS enabled.
- Usuario pode ler sua propria membership.
- Membro ativo pode ler memberships do proprio espaco.
- Constraints preservam um espaco ativo por usuario e dois membros ativos por
  espaco.

### `public.budget_invitations`

- RLS enabled.
- Remetente pode ler convite enviado.
- Destinatario autenticado pode ler convite para seu e-mail normalizado.
- Usuario nao relacionado nao recebe detalhes.
- Convite pendente nao concede acesso a dados compartilhados.

## Future Individual Table Pattern

```sql
create policy "Users manage own records"
  on public.<table_name>
  for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
```

Required indexes:

- `(user_id)`
- Filtros frequentes combinados com `user_id`, como `(user_id, created_at)`.

## Future Shared Table Pattern

```sql
create policy "Active members read shared records"
  on public.<table_name>
  for select
  to authenticated
  using (
    public.current_user_has_active_budget_membership(shared_budget_id)
  );
```

Mutacoes compartilhadas devem usar policy equivalente ou RPC transacional
quando envolverem multiplas tabelas.

Required indexes:

- `(shared_budget_id)`
- Filtros frequentes combinados com `shared_budget_id`, status e datas.

## Function Rules

- Preferir `security invoker` quando suficiente.
- Se `security definer` for indispensavel, usar schema privado ou justificar
  schema exposto, definir `search_path` explicitamente, revogar `public` e
  conceder apenas `authenticated` quando adequado.
- RPCs nao retornam mensagens sensiveis para a UI.

## Validation Rules

- UPDATE precisa de SELECT policy compativel.
- Policies usam `to authenticated`.
- Policies nao dependem de `user_metadata`.
- Colunas usadas por policies e filtros possuem indices.
- Listas, buscas, contadores, resumos e graficos futuros usam o mesmo escopo da
  permissao de leitura.
