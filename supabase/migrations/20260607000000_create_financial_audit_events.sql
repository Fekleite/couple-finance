create schema if not exists private;

create table if not exists public.financial_audit_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_user_id uuid references auth.users (id) on delete set null,
  item_type text not null check (item_type in ('transaction', 'goal')),
  item_id uuid not null,
  action_type text not null check (action_type in ('created', 'updated', 'completed', 'archived', 'removed_from_main_flow')),
  visibility text not null check (visibility in ('individual', 'shared')),
  owner_user_id uuid references auth.users (id) on delete restrict,
  shared_budget_id uuid references public.shared_budgets (id) on delete restrict,
  subject_label text not null check (subject_label = btrim(subject_label) and length(subject_label) between 1 and 120),
  subject_amount_cents bigint check (subject_amount_cents is null or subject_amount_cents between 0 and 99999999999),
  subject_date date,
  subject_status text check (subject_status is null or subject_status in ('active', 'completed', 'archived')),
  summary_key text not null check (summary_key in (
    'transaction_created',
    'transaction_updated',
    'transaction_removed_from_main_flow',
    'goal_created',
    'goal_updated',
    'goal_completed',
    'goal_archived'
  )),
  created_at timestamptz not null default now(),
  check (
    (visibility = 'individual' and owner_user_id is not null and shared_budget_id is null)
    or (visibility = 'shared' and owner_user_id is null and shared_budget_id is not null)
  ),
  check (
    (item_type = 'transaction' and summary_key in ('transaction_created', 'transaction_updated', 'transaction_removed_from_main_flow'))
    or (item_type = 'goal' and summary_key in ('goal_created', 'goal_updated', 'goal_completed', 'goal_archived'))
  )
);

create index if not exists financial_audit_events_owner_recent_idx
  on public.financial_audit_events (owner_user_id, occurred_at desc, id desc)
  where visibility = 'individual';
create index if not exists financial_audit_events_shared_recent_idx
  on public.financial_audit_events (shared_budget_id, occurred_at desc, id desc)
  where visibility = 'shared';
create index if not exists financial_audit_events_item_recent_idx
  on public.financial_audit_events (item_type, item_id, occurred_at desc);

alter table public.financial_audit_events enable row level security;
revoke all on table public.financial_audit_events from public, anon, authenticated;
grant select on table public.financial_audit_events to authenticated;

create policy "Authorized people can read individual financial audit events"
  on public.financial_audit_events for select to authenticated
  using (
    visibility = 'individual'
    and owner_user_id = (select auth.uid())
  );

create policy "Authorized people can read shared financial audit events"
  on public.financial_audit_events for select to authenticated
  using (
    visibility = 'shared'
    and exists (
      select 1
      from public.shared_budgets budgets
      join public.budget_members members on members.shared_budget_id = budgets.id
      where budgets.id = financial_audit_events.shared_budget_id
        and budgets.status = 'active'
        and members.user_id = (select auth.uid())
        and members.status = 'active'
    )
  );

create or replace function private.record_financial_audit_event(
  item_type_input text,
  item_id_input uuid,
  action_type_input text,
  visibility_input text,
  owner_user_id_input uuid,
  shared_budget_id_input uuid,
  subject_label_input text,
  subject_amount_cents_input bigint,
  subject_date_input date,
  subject_status_input text,
  summary_key_input text
)
returns public.financial_audit_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_label text := btrim(subject_label_input);
  created_event public.financial_audit_events;
begin
  if (select auth.uid()) is null then raise exception 'audit_validation'; end if;
  if item_id_input is null
    or item_type_input not in ('transaction', 'goal')
    or action_type_input not in ('created', 'updated', 'completed', 'archived', 'removed_from_main_flow')
    or visibility_input not in ('individual', 'shared')
    or normalized_label = ''
    or length(normalized_label) > 120
    or subject_amount_cents_input not between 0 and 99999999999
    or subject_status_input is not null and subject_status_input not in ('active', 'completed', 'archived')
    or summary_key_input not in (
      'transaction_created',
      'transaction_updated',
      'transaction_removed_from_main_flow',
      'goal_created',
      'goal_updated',
      'goal_completed',
      'goal_archived'
    )
  then raise exception 'audit_validation'; end if;

  if visibility_input = 'individual' and (owner_user_id_input is null or shared_budget_id_input is not null) then
    raise exception 'audit_validation';
  end if;
  if visibility_input = 'shared' and (shared_budget_id_input is null or owner_user_id_input is not null) then
    raise exception 'audit_validation';
  end if;

  insert into public.financial_audit_events (
    actor_user_id, item_type, item_id, action_type, visibility, owner_user_id,
    shared_budget_id, subject_label, subject_amount_cents, subject_date, subject_status, summary_key
  ) values (
    (select auth.uid()), item_type_input, item_id_input, action_type_input, visibility_input,
    owner_user_id_input, shared_budget_id_input, normalized_label, subject_amount_cents_input,
    subject_date_input, subject_status_input, summary_key_input
  ) returning * into created_event;

  return created_event;
end;
$$;

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
  created_transaction public.financial_transactions%rowtype;
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

  insert into public.financial_transactions (
    title, amount_cents, transaction_type, transaction_date, category_code,
    created_by_user_id, responsible_user_id, visibility, shared_budget_id,
    observation, idempotency_key
  ) values (
    normalized_title, amount_cents_input, transaction_type_input, transaction_date_input,
    category_code_input, current_user_id, effective_responsible_id, visibility_input,
    effective_budget_id, normalized_observation, idempotency_key_input
  ) returning * into created_transaction;

  perform private.record_financial_audit_event(
    'transaction', created_transaction.id, 'created', created_transaction.visibility,
    case when created_transaction.visibility = 'individual' then created_transaction.created_by_user_id else null end,
    created_transaction.shared_budget_id, created_transaction.title, created_transaction.amount_cents,
    created_transaction.transaction_date, null, 'transaction_created'
  );

  return next created_transaction;
end;
$$;

create or replace function private.audit_goal(goal_row public.financial_goals, action_input text, summary_key_input text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.record_financial_audit_event(
    'goal', goal_row.id, action_input, goal_row.visibility,
    case when goal_row.visibility = 'individual' then goal_row.created_by_user_id else null end,
    goal_row.shared_budget_id, goal_row.name, goal_row.target_amount_cents,
    goal_row.deadline_date, goal_row.status, summary_key_input
  );
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

  perform private.audit_goal(created_goal, 'created', 'goal_created');
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

  perform private.audit_goal(created_goal, 'created', 'goal_created');
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

  perform private.audit_goal(updated_goal, 'updated', 'goal_updated');
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
  summary_key text;
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

  summary_key := case when next_status = 'completed' then 'goal_completed' else 'goal_archived' end;
  perform private.audit_goal(updated_goal, next_status, summary_key);
  return updated_goal;
end;
$$;

revoke all on function private.record_financial_audit_event(text, uuid, text, text, uuid, uuid, text, bigint, date, text, text) from public, anon, authenticated;
revoke all on function private.audit_goal(public.financial_goals, text, text) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.record_financial_audit_event(text, uuid, text, text, uuid, uuid, text, bigint, date, text, text) to authenticated;
grant execute on function private.audit_goal(public.financial_goals, text, text) to authenticated;
