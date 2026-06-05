# Contract: Authorized Chart Query

## Purpose

Define a entrada e saida tecnica de `public.get_financial_dashboard_charts`,
usada pelo dashboard privado para carregar graficos basicos autorizados.

## Request

| Field | Type | Required | Rule |
|-------|------|----------|------|
| `month_start` | `date` | Yes | Primeiro dia do mes civil selecionado |
| `next_month_start` | `date` | Yes | Primeiro dia do mes seguinte |
| `evolution_month_count` | `integer` | Yes | Default 6; maximo 12 |

## Response

| Field | Type | Rule |
|-------|------|------|
| `period` | `object` | Mes consultado |
| `evolution_window` | `object` | Janela curta de evolucao |
| `category_distribution` | `array` | Despesas por categoria autorizada |
| `monthly_evolution` | `array` | Receitas, despesas e saldo por mes |
| `member_comparison` | `object` | Comparativo compartilhado seguro |
| `summaries` | `array` | Equivalentes textuais |
| `generated_at` | `timestamptz` | Momento da resposta |

## Rules

- A funcao e `security invoker`.
- RLS deve aplicar autorizacao antes de qualquer agregacao.
- Parametros invalidos falham de forma segura.
- A resposta nao retorna transacoes brutas, observacoes ou facetas.
- `authenticated` recebe somente `EXECUTE` necessario.
