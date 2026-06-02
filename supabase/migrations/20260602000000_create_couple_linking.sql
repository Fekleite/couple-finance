create extension if not exists "pgcrypto";

create table if not exists public.shared_budgets (
  id uuid primary key default gen_random_uuid(),
  created_by_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Espaco compartilhado',
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budget_members (
  id uuid primary key default gen_random_uuid(),
  shared_budget_id uuid not null references public.shared_budgets (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('creator', 'partner')),
  status text not null default 'active' check (status in ('active', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budget_invitations (
  id uuid primary key default gen_random_uuid(),
  shared_budget_id uuid not null references public.shared_budgets (id) on delete cascade,
  inviter_user_id uuid not null references auth.users (id) on delete cascade,
  invitee_email text not null,
  invitee_email_normalized text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled', 'expired')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(btrim(invitee_email)) > 0),
  check (invitee_email_normalized = lower(btrim(invitee_email)))
);

create unique index if not exists budget_members_one_active_budget_per_user
  on public.budget_members (user_id)
  where status = 'active';

create unique index if not exists budget_members_one_active_row_per_budget_user
  on public.budget_members (shared_budget_id, user_id)
  where status = 'active';

create unique index if not exists budget_members_one_active_creator_per_budget
  on public.budget_members (shared_budget_id)
  where status = 'active' and role = 'creator';

create unique index if not exists budget_invitations_one_pending_per_budget
  on public.budget_invitations (shared_budget_id)
  where status = 'pending';

create index if not exists budget_members_budget_status_idx
  on public.budget_members (shared_budget_id, status);

create index if not exists budget_invitations_inviter_status_idx
  on public.budget_invitations (inviter_user_id, status);

create index if not exists budget_invitations_invitee_status_expires_idx
  on public.budget_invitations (invitee_email_normalized, status, expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_shared_budgets_updated_at
  before update on public.shared_budgets
  for each row execute function public.set_updated_at();

create trigger set_budget_members_updated_at
  before update on public.budget_members
  for each row execute function public.set_updated_at();

create trigger set_budget_invitations_updated_at
  before update on public.budget_invitations
  for each row execute function public.set_updated_at();

create or replace function public.prevent_more_than_two_active_members()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' and (
    select count(*)
    from public.budget_members members
    where members.shared_budget_id = new.shared_budget_id
      and members.status = 'active'
      and members.id <> coalesce(new.id, gen_random_uuid())
  ) >= 2 then
    raise exception 'max active members reached';
  end if;

  return new;
end;
$$;

create trigger budget_members_max_two_active_members
  before insert or update on public.budget_members
  for each row execute function public.prevent_more_than_two_active_members();

create or replace function public.current_auth_email_normalized()
returns text
language sql
security definer
set search_path = auth, public
stable
as $$
  select lower(coalesce(email, ''))
  from auth.users
  where id = auth.uid()
$$;

create or replace function public.current_user_has_active_budget_membership(shared_budget_id_input uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.budget_members members
    where members.shared_budget_id = shared_budget_id_input
      and members.user_id = auth.uid()
      and members.status = 'active'
  )
$$;

alter table public.shared_budgets enable row level security;
alter table public.budget_members enable row level security;
alter table public.budget_invitations enable row level security;

create policy "Members can read their shared budgets"
  on public.shared_budgets
  for select
  to authenticated
  using (
    (select public.current_user_has_active_budget_membership(id))
  );

create policy "Members can read members from their budget"
  on public.budget_members
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.current_user_has_active_budget_membership(shared_budget_id))
  );

create policy "Related users can read invitations"
  on public.budget_invitations
  for select
  to authenticated
  using (
    inviter_user_id = (select auth.uid())
    or invitee_email_normalized = public.current_auth_email_normalized()
  );

create or replace function public.create_shared_budget_and_invite(invitee_email_input text)
returns table (
  id uuid,
  invitee_email text,
  status text,
  expires_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_user_email text;
  normalized_invitee_email text := lower(btrim(invitee_email_input));
  new_budget_id uuid;
  new_invitation_id uuid;
begin
  if current_user_id is null then
    raise exception 'not authenticated';
  end if;

  select lower(coalesce(email, '')) into current_user_email
  from auth.users
  where auth.users.id = current_user_id;

  if normalized_invitee_email = '' then
    raise exception 'invalid invitee email';
  end if;

  if normalized_invitee_email = current_user_email then
    raise exception 'self invite blocked';
  end if;

  if exists (
    select 1
    from public.budget_members members
    where members.user_id = current_user_id
      and members.status = 'active'
  ) then
    raise exception 'active membership already exists';
  end if;

  insert into public.shared_budgets (created_by_user_id)
  values (current_user_id)
  returning shared_budgets.id into new_budget_id;

  insert into public.budget_members (shared_budget_id, user_id, role)
  values (new_budget_id, current_user_id, 'creator');

  insert into public.budget_invitations (
    shared_budget_id,
    inviter_user_id,
    invitee_email,
    invitee_email_normalized
  )
  values (
    new_budget_id,
    current_user_id,
    btrim(invitee_email_input),
    normalized_invitee_email
  )
  returning budget_invitations.id into new_invitation_id;

  return query
    select
      invitations.id as id,
      invitations.invitee_email as invitee_email,
      invitations.status as status,
      invitations.expires_at as expires_at,
      invitations.created_at as created_at
    from public.budget_invitations invitations
    where invitations.id = new_invitation_id;
end;
$$;

create or replace function public.accept_invitation(invitation_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_user_email text;
  target_invitation public.budget_invitations%rowtype;
begin
  if current_user_id is null then
    raise exception 'not authenticated';
  end if;

  select lower(coalesce(email, '')) into current_user_email
  from auth.users
  where auth.users.id = current_user_id;

  select * into target_invitation
  from public.budget_invitations
  where id = invitation_id_input
  for update;

  if not found then
    raise exception 'invitation not found';
  end if;

  if target_invitation.status <> 'pending' or target_invitation.expires_at <= now() then
    raise exception 'invitation unavailable';
  end if;

  if target_invitation.invitee_email_normalized <> current_user_email then
    raise exception 'invitation unavailable';
  end if;

  if exists (
    select 1 from public.budget_members
    where user_id = current_user_id and status = 'active'
  ) then
    raise exception 'active membership already exists';
  end if;

  insert into public.budget_members (shared_budget_id, user_id, role)
  values (target_invitation.shared_budget_id, current_user_id, 'partner');

  update public.budget_invitations
  set status = 'accepted', responded_at = now()
  where id = invitation_id_input;
end;
$$;

create or replace function public.decline_invitation(invitation_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_email text;
begin
  select lower(coalesce(email, '')) into current_user_email
  from auth.users
  where auth.users.id = auth.uid();

  update public.budget_invitations
  set status = 'declined', responded_at = now()
  where id = invitation_id_input
    and status = 'pending'
    and expires_at > now()
    and invitee_email_normalized = current_user_email;

  if not found then
    raise exception 'invitation unavailable';
  end if;
end;
$$;

create or replace function public.cancel_invitation(invitation_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update public.budget_invitations
  set status = 'cancelled', responded_at = now()
  where id = invitation_id_input
    and status = 'pending'
    and expires_at > now()
    and inviter_user_id = auth.uid();

  if not found then
    raise exception 'invitation unavailable';
  end if;
end;
$$;

revoke all on function public.create_shared_budget_and_invite(text) from public;
revoke all on function public.accept_invitation(uuid) from public;
revoke all on function public.decline_invitation(uuid) from public;
revoke all on function public.cancel_invitation(uuid) from public;
revoke all on function public.current_auth_email_normalized() from public;
revoke all on function public.current_user_has_active_budget_membership(uuid) from public;

grant execute on function public.create_shared_budget_and_invite(text) to authenticated;
grant execute on function public.accept_invitation(uuid) to authenticated;
grant execute on function public.decline_invitation(uuid) to authenticated;
grant execute on function public.cancel_invitation(uuid) to authenticated;
grant execute on function public.current_auth_email_normalized() to authenticated;
grant execute on function public.current_user_has_active_budget_membership(uuid) to authenticated;
