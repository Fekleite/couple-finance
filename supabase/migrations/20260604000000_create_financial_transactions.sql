create schema if not exists private;

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (title = btrim(title) and length(title) between 1 and 120),
  amount_cents bigint not null check (amount_cents between 1 and 99999999999),
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  transaction_date date not null,
  category_code text not null references public.standard_financial_categories (code) on delete restrict,
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  responsible_user_id uuid not null references auth.users (id) on delete restrict,
  visibility text not null check (visibility in ('individual', 'shared')),
  shared_budget_id uuid references public.shared_budgets (id) on delete restrict,
  observation text check (observation is null or (observation = btrim(observation) and length(observation) between 1 and 500)),
  idempotency_key uuid not null,
  created_at timestamptz not null default now(),
  check (
    (visibility = 'individual' and shared_budget_id is null and created_by_user_id = responsible_user_id)
    or (visibility = 'shared' and shared_budget_id is not null)
  ),
  unique (created_by_user_id, idempotency_key)
);

create index if not exists financial_transactions_creator_date_idx
  on public.financial_transactions (created_by_user_id, transaction_date desc);
create index if not exists financial_transactions_shared_date_idx
  on public.financial_transactions (shared_budget_id, transaction_date desc)
  where visibility = 'shared';

alter table public.financial_transactions enable row level security;
revoke all on table public.financial_transactions from public, anon, authenticated;
grant select on table public.financial_transactions to authenticated;

create policy "Authorized people can read financial transactions"
  on public.financial_transactions for select to authenticated
  using (
    (visibility = 'individual' and created_by_user_id = (select auth.uid()))
    or (
      visibility = 'shared'
      and exists (
        select 1 from public.budget_members members
        where members.shared_budget_id = financial_transactions.shared_budget_id
          and members.user_id = (select auth.uid())
          and members.status = 'active'
      )
    )
  );

create or replace function private.create_financial_transaction(
  title_input text, amount_cents_input bigint, transaction_type_input text,
  transaction_date_input date, category_code_input text, visibility_input text,
  shared_budget_id_input uuid, responsible_user_id_input uuid, observation_input text,
  idempotency_key_input uuid
)
returns setof public.financial_transactions
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_title text := btrim(title_input);
  normalized_observation text := nullif(btrim(observation_input), '');
  effective_responsible_id uuid;
  effective_budget_id uuid;
  existing public.financial_transactions%rowtype;
begin
  if current_user_id is null then raise exception 'transaction_validation'; end if;
  if normalized_title = '' or length(normalized_title) > 120
    or amount_cents_input not between 1 and 99999999999
    or transaction_type_input not in ('income', 'expense')
    or transaction_date_input is null
    or visibility_input not in ('individual', 'shared')
    or idempotency_key_input is null
    or length(coalesce(normalized_observation, '')) > 500
  then raise exception 'transaction_validation'; end if;

  if not exists (
    select 1 from public.standard_financial_categories categories
    where categories.code = category_code_input and categories.is_active
      and categories.applicability in (transaction_type_input, 'both')
  ) then raise exception 'transaction_category_unavailable'; end if;

  if visibility_input = 'individual' then
    effective_responsible_id := current_user_id;
    effective_budget_id := null;
  else
    effective_responsible_id := responsible_user_id_input;
    effective_budget_id := shared_budget_id_input;
    if effective_budget_id is null or not exists (
      select 1 from public.shared_budgets budgets
      join public.budget_members members on members.shared_budget_id = budgets.id
      where budgets.id = effective_budget_id and budgets.status = 'active'
        and members.user_id = current_user_id and members.status = 'active'
    ) then raise exception 'transaction_shared_context_unavailable'; end if;
    if effective_responsible_id is null or not exists (
      select 1 from public.budget_members members
      where members.shared_budget_id = effective_budget_id
        and members.user_id = effective_responsible_id and members.status = 'active'
    ) then raise exception 'transaction_responsible_unavailable'; end if;
  end if;

  select * into existing from public.financial_transactions transactions
  where transactions.created_by_user_id = current_user_id
    and transactions.idempotency_key = idempotency_key_input for update;
  if found then
    if existing.title = normalized_title and existing.amount_cents = amount_cents_input
      and existing.transaction_type = transaction_type_input
      and existing.transaction_date = transaction_date_input
      and existing.category_code = category_code_input
      and existing.responsible_user_id = effective_responsible_id
      and existing.visibility = visibility_input
      and existing.shared_budget_id is not distinct from effective_budget_id
      and existing.observation is not distinct from normalized_observation
    then return next existing; return;
    end if;
    raise exception 'transaction_submission_conflict';
  end if;

  return query insert into public.financial_transactions (
    title, amount_cents, transaction_type, transaction_date, category_code,
    created_by_user_id, responsible_user_id, visibility, shared_budget_id,
    observation, idempotency_key
  ) values (
    normalized_title, amount_cents_input, transaction_type_input, transaction_date_input,
    category_code_input, current_user_id, effective_responsible_id, visibility_input,
    effective_budget_id, normalized_observation, idempotency_key_input
  ) returning *;
end;
$$;

create or replace function public.create_financial_transaction(
  title_input text, amount_cents_input bigint, transaction_type_input text,
  transaction_date_input date, category_code_input text, visibility_input text,
  shared_budget_id_input uuid, responsible_user_id_input uuid, observation_input text,
  idempotency_key_input uuid
)
returns setof public.financial_transactions
language sql security invoker set search_path = ''
as $$
  select * from private.create_financial_transaction(
    title_input, amount_cents_input, transaction_type_input, transaction_date_input,
    category_code_input, visibility_input, shared_budget_id_input,
    responsible_user_id_input, observation_input, idempotency_key_input
  )
$$;

revoke all on function private.create_financial_transaction(text, bigint, text, date, text, text, uuid, uuid, text, uuid) from public, anon, authenticated;
revoke all on function public.create_financial_transaction(text, bigint, text, date, text, text, uuid, uuid, text, uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.create_financial_transaction(text, bigint, text, date, text, text, uuid, uuid, text, uuid) to authenticated;
grant execute on function public.create_financial_transaction(text, bigint, text, date, text, text, uuid, uuid, text, uuid) to authenticated;
