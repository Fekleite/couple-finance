# Dashboard feature boundaries

The dashboard feature owns the initial monthly financial overview rendered at
`/app`.

- Keep indicator data loading behind `dashboard-service` and `use-dashboard`.
- Keep chart data loading behind `dashboard-chart-service` and
  `use-dashboard-charts`.
- Keep authorization decisions in Supabase/RLS; frontend state only clears or
  presents authorized responses.
- Reuse transaction month, money, date and visibility contracts instead of
  duplicating formatting rules.
- F08 charts use the Shadcn/UI `chart` component with Recharts for category
  expenses, recent monthly evolution and neutral shared responsibility
  comparison.
- Do not add pagination, detailed filters, drill-down, mutations, exports, goals
  or predictive alerts here.
- Chart empty, unavailable and error states must not imply hidden or blocked
  financial data.
- Keep dashboard cards, period controls, recent transactions and chart sections
  `min-w-0`, stackable on mobile, and able to wrap long money, category, period
  and status text.
- Every visual financial indicator or chart must keep a textual equivalent for
  period, value, scope and trend; color, hover and tooltip cannot be the only
  channel.
- Retry, empty and partial-data states should use neutral authorized-data
  language and shared feedback components when practical.
