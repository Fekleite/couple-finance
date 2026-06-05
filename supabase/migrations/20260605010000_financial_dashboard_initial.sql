create or replace function public.get_financial_dashboard(
  month_start_input date,
  next_month_start_input date,
  recent_limit_input integer default 5
)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  safe_recent_limit integer := least(recent_limit_input, 10);
  result jsonb;
begin
  if current_user_id is null
    or month_start_input is null
    or next_month_start_input is null
    or next_month_start_input <> (month_start_input + interval '1 month')::date
    or extract(day from month_start_input) <> 1
    or recent_limit_input is null
    or recent_limit_input not between 1 and 10
  then
    raise exception 'financial_dashboard_invalid_query';
  end if;

  with authorized_month as materialized (
    select transactions.*, categories.display_name as category_label
    from public.financial_transactions transactions
    join public.standard_financial_categories categories on categories.code = transactions.category_code
    where transactions.transaction_date >= month_start_input
      and transactions.transaction_date < next_month_start_input
      and (
        (transactions.visibility = 'individual' and transactions.created_by_user_id = current_user_id)
        or (
          transactions.visibility = 'shared'
          and exists (
            select 1
            from public.budget_members members
            where members.shared_budget_id = transactions.shared_budget_id
              and members.user_id = current_user_id
              and members.status = 'active'
          )
        )
      )
  ),
  totals as (
    select
      coalesce(sum(amount_cents) filter (where transaction_type = 'income'), 0)::bigint as income_cents,
      coalesce(sum(amount_cents) filter (where transaction_type = 'expense'), 0)::bigint as expense_cents,
      exists (select 1 from authorized_month) as has_authorized_month_data
    from authorized_month
  ),
  indicators as (
    select
      income_cents,
      expense_cents,
      income_cents - expense_cents as balance_cents,
      case
        when income_cents - expense_cents > 0 then 'positive'
        when income_cents - expense_cents < 0 then 'negative'
        else 'zero'
      end as result_meaning,
      has_authorized_month_data
    from totals
  ),
  recent as (
    select *
    from authorized_month
    order by transaction_date desc, created_at desc, id desc
    limit safe_recent_limit
  ),
  recent_items as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', id,
      'title', title,
      'amount_cents', amount_cents,
      'transaction_type', transaction_type,
      'transaction_date', transaction_date,
      'created_at', created_at,
      'category_code', category_code,
      'category_label', category_label,
      'created_by_user_id', created_by_user_id,
      'creator_label', case when created_by_user_id = current_user_id then 'Voce' else 'Pessoa parceira' end,
      'responsible_user_id', responsible_user_id,
      'responsible_label', case when responsible_user_id = current_user_id then 'Voce' else 'Pessoa parceira' end,
      'visibility', visibility
    ) order by transaction_date desc, created_at desc, id desc), '[]'::jsonb) as items
    from recent
  )
  select jsonb_build_object(
    'period', jsonb_build_object(
      'start_date', month_start_input,
      'next_start_date', next_month_start_input
    ),
    'indicators', jsonb_build_object(
      'income_cents', indicators.income_cents,
      'expense_cents', indicators.expense_cents,
      'balance_cents', indicators.balance_cents,
      'result_meaning', indicators.result_meaning,
      'has_authorized_month_data', indicators.has_authorized_month_data
    ),
    'recent_transactions', recent_items.items,
    'generated_at', now()
  )
  into result
  from indicators cross join recent_items;

  return result;
end;
$$;

revoke all on function public.get_financial_dashboard(date, date, integer) from public, anon;
grant execute on function public.get_financial_dashboard(date, date, integer) to authenticated;
