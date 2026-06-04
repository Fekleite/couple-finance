create table if not exists public.standard_financial_categories (
  code text primary key check (code ~ '^[a-z][a-z0-9_]*$'),
  display_name text not null check (length(btrim(display_name)) > 0),
  description text not null check (length(btrim(description)) > 0),
  applicability text not null check (applicability in ('income', 'expense', 'both')),
  sort_order smallint not null unique check (sort_order > 0),
  is_active boolean not null default true
);

alter table public.standard_financial_categories enable row level security;

drop policy if exists "Authenticated users can read standard financial categories"
  on public.standard_financial_categories;

create policy "Authenticated users can read standard financial categories"
  on public.standard_financial_categories
  for select
  to authenticated
  using (true);

revoke all on table public.standard_financial_categories from public, anon, authenticated;
grant select on table public.standard_financial_categories to authenticated;

insert into public.standard_financial_categories (
  code,
  display_name,
  description,
  applicability,
  sort_order,
  is_active
)
values
  ('income', 'Renda', 'Salarios, pagamentos, beneficios e outras entradas.', 'income', 10, true),
  ('housing', 'Moradia', 'Aluguel, condominio, manutencao e itens essenciais da residencia.', 'expense', 20, true),
  ('food', 'Alimentacao', 'Mercado, feira, restaurantes, delivery e refeicoes.', 'expense', 30, true),
  ('transportation', 'Transporte', 'Combustivel, transporte publico, aplicativos e manutencao.', 'expense', 40, true),
  ('health', 'Saude', 'Consultas, medicamentos, exames e plano de saude.', 'expense', 50, true),
  ('bills', 'Contas', 'Agua, luz, internet, telefone, assinaturas e seguros.', 'expense', 60, true),
  ('education', 'Educacao', 'Cursos, livros, mensalidades e materiais.', 'expense', 70, true),
  ('shopping', 'Compras', 'Roupas, eletronicos, presentes e itens pessoais nao recorrentes.', 'expense', 80, true),
  ('leisure', 'Lazer', 'Entretenimento, viagens, hobbies, eventos e experiencias.', 'expense', 90, true),
  ('investments', 'Investimentos', 'Aportes, aplicacoes, resgates e movimentacoes patrimoniais.', 'both', 100, true),
  ('other', 'Outros', 'Casos sem uma categoria especifica adequada.', 'both', 110, true)
on conflict (code) do update
set
  display_name = excluded.display_name,
  description = excluded.description,
  applicability = excluded.applicability,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
