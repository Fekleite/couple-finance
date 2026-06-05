# Contract: Monthly Evolution

## Purpose

Representar uma janela curta de meses recentes com receitas, despesas e saldo
autorizados.

## Window

| Field | Type | Rule |
|-------|------|------|
| `startMonth` | `YYYY-MM` | Cinco meses antes do selecionado |
| `endMonth` | `YYYY-MM` | Mes selecionado |
| `monthCount` | `number` | Fixo em 6 no MVP |

## Point

| Field | Type | Rule |
|-------|------|------|
| `monthKey` | `YYYY-MM` | Identidade do mes |
| `monthLabel` | `string` | Label curto `pt-BR` |
| `isSelectedMonth` | `boolean` | Destaca o mes atual do dashboard |
| `incomeCents` | `number` | Receitas autorizadas |
| `expenseCents` | `number` | Despesas autorizadas |
| `balanceCents` | `number` | Receitas menos despesas |
| `resultMeaning` | `positive \| negative \| zero` | Leitura do saldo |
| `hasAuthorizedMonthData` | `boolean` | Movimentacao autorizada existe |

## Rules

- Todos os meses da janela devem aparecer.
- Meses vazios usam valores zerados e texto de ausencia.
- Resultado positivo, negativo ou zero deve ser claro sem depender de cor.
