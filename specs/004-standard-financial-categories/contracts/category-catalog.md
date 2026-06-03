# Contract: Standard Category Catalog

## Purpose

Definir a fonte canonica, identidade e conteudo minimo do catalogo F04.

## Persistent Shape

```ts
type CategoryApplicability = "income" | "expense" | "both";

type StandardFinancialCategory = {
  code: string;
  displayName: string;
  description: string;
  applicability: CategoryApplicability;
  sortOrder: number;
  isActive: boolean;
};
```

## Required Active Catalog

| Code | Display name | Applicability | Order |
|------|--------------|---------------|-------|
| `income` | Renda | `income` | 10 |
| `housing` | Moradia | `expense` | 20 |
| `food` | Alimentacao | `expense` | 30 |
| `transportation` | Transporte | `expense` | 40 |
| `health` | Saude | `expense` | 50 |
| `bills` | Contas | `expense` | 60 |
| `education` | Educacao | `expense` | 70 |
| `shopping` | Compras | `expense` | 80 |
| `leisure` | Lazer | `expense` | 90 |
| `investments` | Investimentos | `both` | 100 |
| `other` | Outros | `both` | 110 |

## Invariants

- `code` e estavel, unico e independente de texto.
- `sortOrder` e unico, positivo e define toda apresentacao padrao.
- `displayName` e `description` sao obrigatorios e neutros.
- `other` aparece por ultimo entre categorias ativas.
- O catalogo persistido e a unica fonte de verdade completa.
- O frontend pode mapear `code` para icone, mas nao redefine textos ou ordem.
- Categorias inativas nao aparecem em novas selecoes por padrao.
- Nenhuma categoria contem ownership, visibilidade ou contagem financeira.
