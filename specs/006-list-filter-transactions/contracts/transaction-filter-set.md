# Contract: Transaction Filter Set

## Canonical fields

| Filter | Required | Default | Rule |
|--------|----------|---------|------|
| Month | Yes | Current civil month | `YYYY-MM` |
| Category | No | None | One authorized category code |
| Responsible | No | None | One authorized responsible ID |
| Type | No | None | `income` or `expense` |
| Text | No | None | Trimmed/collapsed, up to 100 characters |

## URL representation

- `month=YYYY-MM`
- `category=<code>`
- `responsible=<uuid>`
- `type=income|expense`
- `q=<text>`

Invalid optional values are removed. Invalid or absent month becomes current
civil month. Results, cursors and private labels never enter the URL.

## Behavior

- Every active filter uses `AND`.
- Changing any filter clears cursor and loaded pages.
- Removing one filter preserves all others.
- `Limpar filtros` removes category, responsible, type and text, preserving
  month.
- Search changes may debounce briefly; discrete filters apply immediately.
- Active filters are identifiable by text and removable without color-only
  meaning.
