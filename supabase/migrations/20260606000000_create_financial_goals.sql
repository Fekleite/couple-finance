create schema if not exists private;

create table if not exists public.financial_goals (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name = btrim(name) and length(name) between 1 and 80),
  target_amount_cents bigint not null check (target_amount_cents between 1 and 99999999999),
  current_amount_cents bigint not null check (current_amount_cents between 0 and 99999999999),
  deadline_date date,
  visibility text not null check (visibility in ('individual', 'shared')),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  shared_budget_id uuid references public.shared_budgets (id) on delete restrict,
  completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (visibility = 'individual' and shared_budget_id is null)
    or (visibility = 'shared' and shared_budget_id is not null)
  ),
  check ((status = 'completed') = (completed_at is not null)),
  check ((status = 'archived') = (archived_at is not null))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists financial_goals_set_updated_at on public.financial_goals;
create trigger financial_goals_set_updated_at
  before update on public.financial_goals
  for each row execute function public.set_updated_at();

create index if not exists financial_goals_creator_status_updated_idx
  on public.financial_goals (created_by_user_id, status, updated_at desc, id desc);
create index if not exists financial_goals_shared_status_updated_idx
  on public.financial_goals (shared_budget_id, status, updated_at desc, id desc)
  where visibility = 'shared';
create index if not exists financial_goals_active_deadline_idx
  on public.financial_goals (deadline_date, id)
  where status = 'active';

alter table public.financial_goals enable row level security;
revoke all on table public.financial_goals from public, anon, authenticated;
grant select on table public.financial_goals to authenticated;

create policy "Authorized people can read financial goals"
  on public.financial_goals for select to authenticated
  using (
    (visibility = 'individual' and created_by_user_id = (select auth.uid()))
    or (
      visibility = 'shared'
      and exists (
        select 1
        from public.shared_budgets budgets
        join public.budget_members members on members.shared_budget_id = budgets.id
        where budgets.id = financial_goals.shared_budget_id
          and budgets.status = 'active'
          and members.user_id = (select auth.uid())
          and members.status = 'active'
      )
    )
  );

create policy "Authorized people can update financial goals through RPC"
  on public.financial_goals for update to authenticated
  using (
    (visibility = 'individual' and created_by_user_id = (select auth.uid()))
    or (
      visibility = 'shared'
      and exists (
        select 1
        from public.shared_budgets budgets
        join public.budget_members members on members.shared_budget_id = budgets.id
        where budgets.id = financial_goals.shared_budget_id
          and budgets.status = 'active'
          and members.user_id = (select auth.uid())
          and members.status = 'active'
      )
    )
  )
  with check (
    (visibility = 'individual' and created_by_user_id = (select auth.uid()))
    or (
      visibility = 'shared'
      and exists (
        select 1
        from public.shared_budgets budgets
        join public.budget_members members on members.shared_budget_id = budgets.id
        where budgets.id = financial_goals.shared_budget_id
          and budgets.status = 'active'
          and members.user_id = (select auth.uid())
          and members.status = 'active'
      )
    )
  );

create or replace function private.user_can_access_goal(goal_row public.financial_goals)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select (
    (goal_row.visibility = 'individual' and goal_row.created_by_user_id = (select auth.uid()))
    or (
      goal_row.visibility = 'shared'
      and exists (
        select 1
        from public.shared_budgets budgets
        join public.budget_members members on members.shared_budget_id = budgets.id
        where budgets.id = goal_row.shared_budget_id
          and budgets.status = 'active'
          and members.user_id = (select auth.uid())
          and members.status = 'active'
      )
    )
  )
$$;

create or replace function private.validate_goal_input(
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text := btrim(name_input);
begin
  if (select auth.uid()) is null then raise exception 'goal_validation'; end if;
  if normalized_name = ''
    or length(normalized_name) > 80
    or target_amount_cents_input not between 1 and 99999999999
    or current_amount_cents_input not between 0 and 99999999999
  then raise exception 'goal_validation'; end if;
  return normalized_name;
end;
$$;

create or replace function private.create_individual_goal(
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date,
  shared_budget_id_input uuid
)
returns public.financial_goals
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text;
  created_goal public.financial_goals;
begin
  normalized_name := private.validate_goal_input(
    name_input, target_amount_cents_input, current_amount_cents_input, deadline_date_input
  );

  insert into public.financial_goals (
    name, target_amount_cents, current_amount_cents, deadline_date,
    visibility, created_by_user_id, shared_budget_id
  ) values (
    normalized_name, target_amount_cents_input, current_amount_cents_input, deadline_date_input,
    'individual', (select auth.uid()), null
  ) returning * into created_goal;

  return created_goal;
end;
$$;

create or replace function private.create_shared_goal(
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date,
  shared_budget_id_input uuid
)
returns public.financial_goals
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text;
  created_goal public.financial_goals;
begin
  normalized_name := private.validate_goal_input(
    name_input, target_amount_cents_input, current_amount_cents_input, deadline_date_input
  );

  if shared_budget_id_input is null or not exists (
    select 1
    from public.shared_budgets budgets
    join public.budget_members members on members.shared_budget_id = budgets.id
    where budgets.id = shared_budget_id_input
      and budgets.status = 'active'
      and members.user_id = (select auth.uid())
      and members.status = 'active'
  ) then raise exception 'goal_shared_context_unavailable'; end if;

  insert into public.financial_goals (
    name, target_amount_cents, current_amount_cents, deadline_date,
    visibility, created_by_user_id, shared_budget_id
  ) values (
    normalized_name, target_amount_cents_input, current_amount_cents_input, deadline_date_input,
    'shared', (select auth.uid()), shared_budget_id_input
  ) returning * into created_goal;

  return created_goal;
end;
$$;

create or replace function private.update_goal(
  goal_id_input uuid,
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date
)
returns public.financial_goals
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_name text;
  existing public.financial_goals;
  updated_goal public.financial_goals;
begin
  normalized_name := private.validate_goal_input(
    name_input, target_amount_cents_input, current_amount_cents_input, deadline_date_input
  );

  select * into existing
  from public.financial_goals goals
  where goals.id = goal_id_input
  for update;

  if not found or existing.status <> 'active' or not private.user_can_access_goal(existing) then
    raise exception 'goal_unavailable';
  end if;

  update public.financial_goals
  set name = normalized_name,
      target_amount_cents = target_amount_cents_input,
      current_amount_cents = current_amount_cents_input,
      deadline_date = deadline_date_input
  where id = existing.id
  returning * into updated_goal;

  return updated_goal;
end;
$$;

create or replace function private.transition_goal(goal_id_input uuid, next_status text)
returns public.financial_goals
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.financial_goals;
  updated_goal public.financial_goals;
begin
  select * into existing
  from public.financial_goals goals
  where goals.id = goal_id_input
  for update;

  if not found or existing.status <> 'active' or not private.user_can_access_goal(existing) then
    raise exception 'goal_unavailable';
  end if;

  update public.financial_goals
  set status = next_status,
      completed_at = case when next_status = 'completed' then now() else completed_at end,
      archived_at = case when next_status = 'archived' then now() else archived_at end
  where id = existing.id
  returning * into updated_goal;

  return updated_goal;
end;
$$;

create or replace function public.create_individual_goal(
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date,
  shared_budget_id_input uuid default null
)
returns public.financial_goals
language sql
security invoker
set search_path = ''
as $$
  select * from private.create_individual_goal(
    name_input, target_amount_cents_input, current_amount_cents_input, deadline_date_input,
    shared_budget_id_input
  )
$$;

create or replace function public.create_shared_goal(
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date,
  shared_budget_id_input uuid
)
returns public.financial_goals
language sql
security invoker
set search_path = ''
as $$
  select * from private.create_shared_goal(
    name_input, target_amount_cents_input, current_amount_cents_input, deadline_date_input,
    shared_budget_id_input
  )
$$;

create or replace function public.update_goal(
  goal_id_input uuid,
  name_input text,
  target_amount_cents_input bigint,
  current_amount_cents_input bigint,
  deadline_date_input date
)
returns public.financial_goals
language sql
security invoker
set search_path = ''
as $$
  select * from private.update_goal(
    goal_id_input, name_input, target_amount_cents_input, current_amount_cents_input,
    deadline_date_input
  )
$$;

create or replace function public.complete_goal(goal_id_input uuid)
returns public.financial_goals
language sql
security invoker
set search_path = ''
as $$
  select * from private.transition_goal(goal_id_input, 'completed')
$$;

create or replace function public.archive_goal(goal_id_input uuid)
returns public.financial_goals
language sql
security invoker
set search_path = ''
as $$
  select * from private.transition_goal(goal_id_input, 'archived')
$$;

revoke all on function private.user_can_access_goal(public.financial_goals) from public, anon, authenticated;
revoke all on function private.validate_goal_input(text, bigint, bigint, date) from public, anon, authenticated;
revoke all on function private.create_individual_goal(text, bigint, bigint, date, uuid) from public, anon, authenticated;
revoke all on function private.create_shared_goal(text, bigint, bigint, date, uuid) from public, anon, authenticated;
revoke all on function private.update_goal(uuid, text, bigint, bigint, date) from public, anon, authenticated;
revoke all on function private.transition_goal(uuid, text) from public, anon, authenticated;
revoke all on function public.create_individual_goal(text, bigint, bigint, date, uuid) from public, anon;
revoke all on function public.create_shared_goal(text, bigint, bigint, date, uuid) from public, anon;
revoke all on function public.update_goal(uuid, text, bigint, bigint, date) from public, anon;
revoke all on function public.complete_goal(uuid) from public, anon;
revoke all on function public.archive_goal(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.create_individual_goal(text, bigint, bigint, date, uuid) to authenticated;
grant execute on function private.create_shared_goal(text, bigint, bigint, date, uuid) to authenticated;
grant execute on function private.update_goal(uuid, text, bigint, bigint, date) to authenticated;
grant execute on function private.transition_goal(uuid, text) to authenticated;
grant execute on function public.create_individual_goal(text, bigint, bigint, date, uuid) to authenticated;
grant execute on function public.create_shared_goal(text, bigint, bigint, date, uuid) to authenticated;
grant execute on function public.update_goal(uuid, text, bigint, bigint, date) to authenticated;
grant execute on function public.complete_goal(uuid) to authenticated;
grant execute on function public.archive_goal(uuid) to authenticated;
