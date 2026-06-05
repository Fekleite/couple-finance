# Dashboard feature boundaries

The dashboard feature owns the initial monthly financial overview rendered at
`/app`.

- Keep data loading behind `dashboard-service` and `use-dashboard`.
- Keep authorization decisions in Supabase/RLS; frontend state only clears or
  presents authorized responses.
- Reuse transaction month, money, date and visibility contracts instead of
  duplicating formatting rules.
- Do not add charts, pagination, detailed filters, mutations, exports, goals or
  predictive alerts here.
