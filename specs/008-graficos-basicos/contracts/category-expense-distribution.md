# Contract: Category Expense Distribution

## Purpose

Representar despesas autorizadas do mes selecionado agrupadas por categoria.

## Item

| Field | Type | Rule |
|-------|------|------|
| `categoryCode` | `string` | Identidade historica da categoria |
| `categoryLabel` | `string` | Nome seguro para apresentacao |
| `expenseCents` | `number` | Soma em centavos |
| `weightBasisPoints` | `number` | Peso de 0 a 10000 |
| `rank` | `number` | Ordem de exibicao |

## Ordering

```text
expenseCents DESC, categoryLabel ASC, categoryCode ASC
```

## Empty State

Quando nao houver despesas autorizadas no mes, retornar array vazio e mensagem
neutra na camada de estado. Nao sugerir dados inacessiveis.

## Accessibility

O grafico deve expor categoria, valor e peso em texto persistente ou resumo
equivalente, sem depender de cor, hover ou tamanho visual.
