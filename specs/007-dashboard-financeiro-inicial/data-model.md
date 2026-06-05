# Data Model: F07 - Dashboard financeiro inicial

## Financial Dashboard Period

| Field | Example | Purpose |
|-------|---------|---------|
| `key` | `2026-06` | Identidade de interface e URL |
| `startDate` | `2026-06-01` | Limite inclusivo da consulta |
| `nextStartDate` | `2026-07-01` | Limite exclusivo da consulta |
| `label` | `junho de 2026` | Apresentacao `pt-BR` |

### Invariants

- O periodo representa exatamente um mes civil.
- Conversoes nao usam timezone nem instantes.
- Valores invalidos sao normalizados para o mes civil atual antes da consulta.

## Authorized Dashboard Query

Consulta canonica enviada a `public.get_financial_dashboard`.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `monthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes civil |
| `nextMonthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes seguinte |
| `recentLimit` | `number` | Yes | Fixo em 5 no frontend; maximo 10 no banco |

### Invariants

- Periodo usa inicio inclusivo e proximo mes exclusivo.
- `recentLimit` nunca e usado como paginacao.
- Parametros invalidos falham de forma segura e nao ampliam a consulta.

## Dashboard Indicator Set

Totais calculados somente a partir de transacoes autorizadas no periodo.

| Field | Type | Rule |
|-------|------|------|
| `incomeCents` | `number` | Soma de receitas autorizadas; default `0` |
| `expenseCents` | `number` | Soma de despesas autorizadas; default `0` |
| `balanceCents` | `number` | `incomeCents - expenseCents` |
| `resultMeaning` | `positive \| negative \| zero` | Derivado de `balanceCents` |
| `hasAuthorizedMonthData` | `boolean` | Existe ao menos uma transacao autorizada no mes |

### Invariants

- Receitas e despesas sao somadas separadamente.
- Receitas e despesas sao exibidas como valores positivos; o rótulo comunica o
  sentido financeiro.
- Resultado positivo, negativo ou zero deve ser compreensivel por texto.
- `hasAuthorizedMonthData` nao e contagem e nao descreve dados inacessiveis.

## Dashboard Result Meaning

| Value | Condition | Suggested copy intent |
|-------|-----------|-----------------------|
| `positive` | `balanceCents > 0` | Houve economia/sobra no mes |
| `negative` | `balanceCents < 0` | Houve deficit no mes |
| `zero` | `balanceCents === 0` | Receitas e despesas ficaram equilibradas ou sem movimentacao |

Linguagem deve ser neutra e nao julgadora.

## Recent Transaction Summary

Item retornado somente depois de periodo e RLS.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` | Identidade interna do item autorizado |
| `title` | `string` | Titulo autorizado |
| `amountCents` | `number` | Inteiro positivo exato |
| `transactionType` | `income \| expense` | Natureza explicita |
| `transactionDate` | `YYYY-MM-DD` | Data civil |
| `createdAt` | `timestamptz` | Desempate estavel |
| `categoryCode` | `string` | Identidade historica |
| `categoryLabel` | `string` | Nome canonico atual/historico |
| `createdByUserId` | `uuid` | Contrato interno autorizado |
| `creatorLabel` | `Voce \| Pessoa parceira` | Exibido quando relevante |
| `responsibleUserId` | `uuid` | Contrato interno autorizado |
| `responsibleLabel` | `Voce \| Pessoa parceira` | Contexto financeiro |
| `visibility` | `individual \| shared` | Escopo explicito |

### Ordering

```text
transaction_date DESC, created_at DESC, id DESC
```

O dashboard retorna no maximo 5 itens. Observacao nao e exibida nem retornada.

## Authorized Dashboard Response

| Field | Type | Meaning |
|-------|------|---------|
| `period` | `FinancialDashboardPeriod` | Mes consultado |
| `indicators` | `DashboardIndicatorSet` | Totais autorizados |
| `recentTransactions` | `RecentTransactionSummary[]` | Ate 5 itens recentes autorizados |
| `generatedAt` | `timestamptz` | Momento tecnico da resposta |

### Invariants

- Indicadores e recentes derivam da mesma consulta autorizada.
- Resposta nao inclui contagens, facetas ou IDs expostos na interface.
- Mes vazio autorizado retorna indicadores zerados, lista vazia e
  `hasAuthorizedMonthData = false`.

## Dashboard Presentation Summary

Modelo de apresentacao derivado de `Dashboard Indicator Set`.

### Required content

- Receita do mes formatada.
- Despesa do mes formatada.
- Saldo do mes formatado com sinal textual compreensivel.
- Economia, deficit ou equilibrio do mes em linguagem neutra.
- Periodo selecionado.

Indicadores nao dependem apenas de cor ou icone.

## Dashboard State

| State | Meaning | Allowed retained data |
|-------|---------|-----------------------|
| `loading` | Primeira consulta ou contexto sensivel mudou | Nenhum resultado anterior |
| `refreshing` | Mes mudou e nova consulta esta em andamento | Nenhum dado compartilhado obsoleto; pode manter shell visual |
| `ready` | Mes possui resposta autorizada populada ou zerada | Indicadores e recentes atuais |
| `empty_month` | Mes sem transacao autorizada | Indicadores zerados e mensagem neutra |
| `error` | Falha recuperavel | Periodo atual; nenhum item potencialmente obsoleto |

### State transitions

```text
loading -> ready | empty_month | error
ready | empty_month | error -> loading
ready -> refreshing -> ready | empty_month | error
```

Somente a requisicao atual pode causar transicao. Mudanca de sessao ou
relacionamento limpa resultados antes da nova consulta.
