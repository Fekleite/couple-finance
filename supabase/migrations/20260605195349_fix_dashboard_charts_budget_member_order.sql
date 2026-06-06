create or replace function public.get_financial_dashboard_charts(
  month_start_input date,
  next_month_start_input date,
  evolution_month_count_input integer default 6
)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  safe_evolution_month_count integer := least(evolution_month_count_input, 12);
  evolution_start date := (month_start_input - make_interval(months => safe_evolution_month_count - 1))::date;
  active_shared_budget_id uuid;
  result jsonb;
begin
  if current_user_id is null
    or month_start_input is null
    or next_month_start_input is null
    or next_month_start_input <> (month_start_input + interval '1 month')::date
    or extract(day from month_start_input) <> 1
    or evolution_month_count_input is null
    or evolution_month_count_input not between 1 and 12
  then
    raise exception 'financial_dashboard_charts_invalid_query';
  end if;

  select members.shared_budget_id
  into active_shared_budget_id
  from public.budget_members members
  where members.user_id = current_user_id
    and members.status = 'active'
  order by members.created_at desc, members.id desc
  limit 1;

  with authorized_window as materialized (
    select transactions.*, categories.display_name as category_label
    from public.financial_transactions transactions
    join public.standard_financial_categories categories on categories.code = transactions.category_code
    where transactions.transaction_date >= evolution_start
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
  authorized_month as materialized (
    select *
    from authorized_window
    where transaction_date >= month_start_input
      and transaction_date < next_month_start_input
  ),
  category_totals as (
    select coalesce(sum(amount_cents), 0)::numeric as total_cents
    from authorized_month
    where transaction_type = 'expense'
  ),
  category_distribution as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'category_code', category_code,
      'category_label', category_label,
      'expense_cents', expense_cents,
      'weight_basis_points', weight_basis_points,
      'rank', rank
    ) order by rank), '[]'::jsonb) as items
    from (
      select
        category_code,
        category_label,
        sum(amount_cents)::bigint as expense_cents,
        case
          when (select total_cents from category_totals) = 0 then 0
          else round((sum(amount_cents)::numeric / (select total_cents from category_totals)) * 10000)::integer
        end as weight_basis_points,
        row_number() over (
          order by sum(amount_cents) desc, category_label asc, category_code asc
        )::integer as rank
      from authorized_month
      where transaction_type = 'expense'
      group by category_code, category_label
      order by expense_cents desc, category_label asc, category_code asc
    ) ranked
  ),
  month_series as (
    select generate_series(evolution_start, month_start_input, interval '1 month')::date as month_start
  ),
  monthly_evolution as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'month_key', to_char(month_start, 'YYYY-MM'),
      'month_label', lower(to_char(month_start, 'TMMon YYYY')),
      'is_selected_month', month_start = month_start_input,
      'income_cents', income_cents,
      'expense_cents', expense_cents,
      'balance_cents', income_cents - expense_cents,
      'result_meaning', case
        when income_cents - expense_cents > 0 then 'positive'
        when income_cents - expense_cents < 0 then 'negative'
        else 'zero'
      end,
      'has_authorized_month_data', has_authorized_month_data
    ) order by month_start), '[]'::jsonb) as items
    from (
      select
        months.month_start,
        coalesce(sum(amount_cents) filter (where transaction_type = 'income'), 0)::bigint as income_cents,
        coalesce(sum(amount_cents) filter (where transaction_type = 'expense'), 0)::bigint as expense_cents,
        count(authorized_window.id) > 0 as has_authorized_month_data
      from month_series months
      left join authorized_window
        on authorized_window.transaction_date >= months.month_start
       and authorized_window.transaction_date < (months.month_start + interval '1 month')::date
      group by months.month_start
    ) monthly
  ),
  active_members as (
    select
      members.user_id,
      case when members.user_id = current_user_id then 'self' else 'partner' end as member_key,
      case when members.user_id = current_user_id then 'Voce' else 'Pessoa parceira' end as member_label
    from public.budget_members members
    where active_shared_budget_id is not null
      and members.shared_budget_id = active_shared_budget_id
      and members.status = 'active'
  ),
  shared_expenses as (
    select transactions.*
    from authorized_month transactions
    where transactions.visibility = 'shared'
      and transactions.transaction_type = 'expense'
      and transactions.shared_budget_id = active_shared_budget_id
  ),
  shared_total as (
    select coalesce(sum(amount_cents), 0)::numeric as total_cents
    from shared_expenses
  ),
  member_rows as (
    select
      active_members.member_key,
      active_members.member_label,
      coalesce(sum(shared_expenses.amount_cents), 0)::bigint as expense_cents
    from active_members
    left join shared_expenses on shared_expenses.responsible_user_id = active_members.user_id
    group by active_members.member_key, active_members.member_label
  ),
  member_comparison as (
    select jsonb_build_object(
      'status', case
        when active_shared_budget_id is null then 'unavailable_shared'
        when (select total_cents from shared_total) = 0 then 'empty'
        else 'ready'
      end,
      'basis', 'responsible_user',
      'members', coalesce(jsonb_agg(jsonb_build_object(
        'member_key', member_key,
        'member_label', member_label,
        'expense_cents', expense_cents,
        'weight_basis_points', case
          when (select total_cents from shared_total) = 0 then 0
          else round((expense_cents::numeric / (select total_cents from shared_total)) * 10000)::integer
        end
      ) order by member_key desc), '[]'::jsonb),
      'summary', case
        when active_shared_budget_id is null then 'Comparativo compartilhado indisponivel sem espaco ativo.'
        else 'Comparativo neutro por pessoa responsavel em despesas compartilhadas autorizadas.'
      end
    ) as item
    from member_rows
  )
  select jsonb_build_object(
    'period', jsonb_build_object(
      'start_date', month_start_input,
      'next_start_date', next_month_start_input
    ),
    'evolution_window', jsonb_build_object(
      'start_month', to_char(evolution_start, 'YYYY-MM'),
      'end_month', to_char(month_start_input, 'YYYY-MM'),
      'month_count', safe_evolution_month_count
    ),
    'category_distribution', category_distribution.items,
    'monthly_evolution', monthly_evolution.items,
    'member_comparison', member_comparison.item,
    'summaries', '[]'::jsonb,
    'generated_at', now()
  )
  into result
  from category_distribution
  cross join monthly_evolution
  cross join member_comparison;

  return result;
end;
$$;

revoke all on function public.get_financial_dashboard_charts(date, date, integer) from public, anon;
grant execute on function public.get_financial_dashboard_charts(date, date, integer) to authenticated;
