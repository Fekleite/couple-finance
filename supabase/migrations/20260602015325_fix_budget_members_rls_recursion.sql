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

drop policy if exists "Members can read their shared budgets" on public.shared_budgets;
drop policy if exists "Members can read members from their budget" on public.budget_members;

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

revoke all on function public.current_user_has_active_budget_membership(uuid) from public;
grant execute on function public.current_user_has_active_budget_membership(uuid) to authenticated;
