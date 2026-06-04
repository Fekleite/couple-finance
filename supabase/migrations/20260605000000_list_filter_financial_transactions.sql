create schema if not exists private;

create or replace function private.normalize_transaction_search(value text)
returns text
language sql immutable strict set search_path = ''
as $$
  select regexp_replace(
    translate(lower(btrim(value)), 'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc'),
    '\s+', ' ', 'g'
  )
$$;

create index if not exists financial_transactions_creator_list_idx
  on public.financial_transactions (created_by_user_id, transaction_date desc, created_at desc, id desc);
create index if not exists financial_transactions_shared_list_idx
  on public.financial_transactions (shared_budget_id, transaction_date desc, created_at desc, id desc)
  where visibility = 'shared';

create or replace function public.list_financial_transactions(
  month_start_input date,
  next_month_start_input date,
  category_code_input text default null,
  responsible_user_id_input uuid default null,
  transaction_type_input text default null,
  search_text_input text default null,
  cursor_transaction_date_input date default null,
  cursor_created_at_input timestamptz default null,
  cursor_id_input uuid default null,
  page_size_input integer default 50
)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_search text := nullif(private.normalize_transaction_search(coalesce(search_text_input, '')), '');
  escaped_search text;
  cursor_count integer;
  result jsonb;
begin
  cursor_count := num_nonnulls(cursor_transaction_date_input, cursor_created_at_input, cursor_id_input);
  if current_user_id is null
    or month_start_input is null
    or next_month_start_input is null
    or next_month_start_input <> (month_start_input + interval '1 month')::date
    or extract(day from month_start_input) <> 1
    or page_size_input is null
    or page_size_input not between 1 and 100
    or cursor_count not in (0, 3)
    or (transaction_type_input is not null and transaction_type_input not in ('income', 'expense'))
    or (category_code_input is not null and category_code_input !~ '^[a-z][a-z0-9_]{0,63}$')
    or length(coalesce(normalized_search, '')) > 100
  then
    raise exception 'transaction_list_invalid_query';
  end if;

  escaped_search := replace(replace(replace(normalized_search, '\', '\\'), '%', '\%'), '_', '\_');

  with authorized_month as materialized (
    select transactions.*, categories.display_name as category_label, categories.is_active as category_is_active
    from public.financial_transactions transactions
    join public.standard_financial_categories categories on categories.code = transactions.category_code
    where transactions.transaction_date >= month_start_input
      and transactions.transaction_date < next_month_start_input
  ),
  filtered as materialized (
    select *
    from authorized_month
    where (category_code_input is null or category_code = category_code_input)
      and (responsible_user_id_input is null or responsible_user_id = responsible_user_id_input)
      and (transaction_type_input is null or transaction_type = transaction_type_input)
      and (
        normalized_search is null
        or private.normalize_transaction_search(title) like '%' || escaped_search || '%' escape '\'
        or private.normalize_transaction_search(coalesce(observation, '')) like '%' || escaped_search || '%' escape '\'
      )
      and (
        cursor_count = 0
        or (transaction_date, created_at, id)
          < (cursor_transaction_date_input, cursor_created_at_input, cursor_id_input)
      )
    order by transaction_date desc, created_at desc, id desc
    limit page_size_input + 1
  ),
  page as (
    select * from filtered
    order by transaction_date desc, created_at desc, id desc
    limit page_size_input
  ),
  page_items as (
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
    from page
  ),
  last_item as (
    select * from page order by transaction_date asc, created_at asc, id asc limit 1
  ),
  categories as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'code', code, 'label', label, 'is_active', is_active
    ) order by label), '[]'::jsonb) as options
    from (
      select distinct category_code as code, category_label as label, category_is_active as is_active
      from authorized_month
    ) category_values
  ),
  responsible as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'user_id', user_id,
      'label', case when user_id = current_user_id then 'Voce' else 'Pessoa parceira' end
    ) order by case when user_id = current_user_id then 0 else 1 end), '[]'::jsonb) as options
    from (select distinct responsible_user_id as user_id from authorized_month) responsible_values
  )
  select jsonb_build_object(
    'items', page_items.items,
    'next_cursor', case when exists (select 1 from filtered offset page_size_input)
      then (select jsonb_build_object(
        'transaction_date', transaction_date, 'created_at', created_at, 'id', id
      ) from last_item)
      else null end,
    'has_more', exists (select 1 from filtered offset page_size_input),
    'has_authorized_month_data', exists (select 1 from authorized_month),
    'category_options', categories.options,
    'responsible_options', responsible.options
  )
  into result
  from page_items cross join categories cross join responsible;

  return result;
end;
$$;

revoke all on function private.normalize_transaction_search(text) from public, anon, authenticated;
revoke all on function public.list_financial_transactions(date, date, text, uuid, text, text, date, timestamptz, uuid, integer) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.normalize_transaction_search(text) to authenticated;
grant execute on function public.list_financial_transactions(date, date, text, uuid, text, text, date, timestamptz, uuid, integer) to authenticated;
