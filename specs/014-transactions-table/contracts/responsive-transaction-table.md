# Contract: Responsive Transaction Table

## Purpose

Definir comportamento responsivo da listagem tabular em desktop, tablet e
mobile.

## Modes

### Table Mode

Used for desktop and wider tablet layouts when all essential columns fit
without harming readability.

Requirements:

- Use table semantics.
- Show column headers.
- Keep amount/date/action alignment stable.
- Preserve active sort controls.

### Compact Mode

Used for small screens where the full table would require mandatory horizontal
scrolling.

Requirements:

- No mandatory horizontal scrolling.
- Show all essential fields with labels or equivalent semantic context.
- Keep filters, sort and actions reachable by keyboard and touch.
- Preserve focus visibility and readable wrapping.

## Rules

- Both modes must show title, value, type, category, date, responsible person,
  visibility/sharing and actions when applicable.
- The responsive switch must not change authorized data.
- Long content must not overlap adjacent fields or controls.
- The layout must coexist with authenticated sidebar/drawer from F13.

## Tests

- Desktop/tablet render table headers and rows.
- Mobile render compact presentation without dropping essential fields.
- Long title/category/responsible labels remain readable.
- Sort and actions are still available in compact mode.
- No element requires horizontal scrolling for the primary review flow.
