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

  select lower(coalesce(users.email, '')) into current_user_email
  from auth.users users
  where users.id = current_user_id;

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

revoke all on function public.create_shared_budget_and_invite(text) from public;
grant execute on function public.create_shared_budget_and_invite(text) to authenticated;
