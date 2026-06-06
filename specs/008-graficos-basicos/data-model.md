# Data Model: F08 - Graficos basicos

## Chart Period

| Field | Example | Purpose |
|-------|---------|---------|
| `key` | `2026-06` | Identidade de interface e URL |
| `startDate` | `2026-06-01` | Limite inclusivo do mes selecionado |
| `nextStartDate` | `2026-07-01` | Limite exclusivo do mes selecionado |
| `label` | `junho de 2026` | Apresentacao `pt-BR` |

### Invariants

- O periodo representa exatamente um mes civil.
- Conversoes nao usam timezone nem instantes.
- Valores invalidos sao normalizados para o mes civil atual antes da consulta.

## Chart Evolution Window

| Field | Example | Rule |
|-------|---------|------|
| `startMonth` | `2026-01` | Cinco meses antes do mes selecionado |
| `endMonth` | `2026-06` | Mes selecionado |
| `monthCount` | `6` | Fixo no MVP |

### Invariants

- A janela e curta e propria para dashboard.
- O mes selecionado sempre esta presente.
- Meses vazios permanecem na serie.

## Authorized Chart Query

Consulta canonica enviada a `public.get_financial_dashboard_charts`.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `monthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes civil selecionado |
| `nextMonthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes seguinte |
| `evolutionMonthCount` | `number` | Yes | Fixo em 6 no frontend; maximo 12 no banco |

### Invariants

- Periodos usam inicio inclusivo e proximo mes exclusivo.
- Parametros invalidos falham de forma segura e nao ampliam consulta.
- O cliente nao envia IDs de usuario, casal ou escopo como autoridade.

## Authorized Chart Transaction

Linha conceitual que pode contribuir para agregacoes depois de RLS.

| Field | Rule |
|-------|------|
| `amountCents` | Inteiro positivo exato |
| `transactionType` | `income` ou `expense` |
| `transactionDate` | Data civil usada para mes |
| `categoryCode` | Categoria historica autorizada |
| `visibility` | `individual` ou `shared` |
| `createdByUserId` | Usado apenas para labels internos seguros |
| `responsibleUserId` | Usado para responsabilidade quando autorizado |
| `sharedBudgetId` | Deve pertencer ao vinculo ativo para dados compartilhados |

### Authorization

- Individual contribui somente para o criador autenticado.
- Compartilhada contribui somente para membro ativo do mesmo espaco financeiro.
- Responsabilidade nao concede acesso por si so.

## Category Expense Distribution

Despesas autorizadas do mes selecionado agrupadas por categoria.

| Field | Type | Rule |
|-------|------|------|
| `categoryCode` | `string` | Identidade historica |
| `categoryLabel` | `string` | Nome canonico/historico seguro |
| `expenseCents` | `number` | Soma de despesas autorizadas |
| `weightBasisPoints` | `number` | Peso sobre total autorizado, 0 a 10000 |
| `rank` | `number` | Ordem de apresentacao |

### Ordering

```text
expense_cents DESC, category_label ASC, category_code ASC
```

### Invariants

- Usa somente despesas autorizadas.
- Receitas nao entram na distribuicao.
- Categorias zeradas nao aparecem.
- Empates permanecem deterministas.

## Monthly Evolution Point

Ponto mensal da janela recente.

| Field | Type | Rule |
|-------|------|------|
| `monthKey` | `YYYY-MM` | Identidade do mes |
| `monthLabel` | `string` | Label curto `pt-BR` |
| `isSelectedMonth` | `boolean` | Verdadeiro para o mes do dashboard |
| `incomeCents` | `number` | Soma de receitas autorizadas |
| `expenseCents` | `number` | Soma de despesas autorizadas |
| `balanceCents` | `number` | `incomeCents - expenseCents` |
| `resultMeaning` | `positive \| negative \| zero` | Derivado do saldo |
| `hasAuthorizedMonthData` | `boolean` | Existe movimentacao autorizada no mes |

### Invariants

- Todos os meses da janela aparecem.
- Receitas e despesas sao exibidas como valores positivos.
- Saldo positivo, negativo ou zero e comunicado por texto.
- `hasAuthorizedMonthData` nao descreve dados inacessiveis.

## Member Responsibility Comparison

Comparativo neutro de despesas compartilhadas autorizadas do mes selecionado.

| Field | Type | Rule |
|-------|------|------|
| `status` | `ready \| empty \| unavailable_shared` | Estado seguro da comparacao |
| `basis` | `responsible_user` | Criterio de agrupamento no MVP |
| `members` | `MemberComparisonItem[]` | Maximo dois membros do casal ativo |
| `summary` | `string` | Linguagem neutra |

### MemberComparisonItem

| Field | Type | Rule |
|-------|------|------|
| `memberKey` | `self \| partner` | Label seguro |
| `memberLabel` | `Voce \| Pessoa parceira` | Sem nomes customizados |
| `expenseCents` | `number` | Soma de despesas compartilhadas autorizadas |
| `weightBasisPoints` | `number` | Peso sobre total compartilhado autorizado |

### Invariants

- Nunca inclui transacoes individuais do parceiro.
- Nao aparece como comparativo pessoal quando nao ha vinculo ativo.
- Responsabilidade e autoria sao diferenciadas em resumo quando necessario.

## Accessible Chart Summary

Texto ou estrutura equivalente para comunicar sentido essencial.

| Field | Type | Purpose |
|-------|------|---------|
| `chartId` | `category \| evolution \| member_comparison` | Relaciona resumo ao grafico |
| `periodLabel` | `string` | Contexto temporal |
| `headline` | `string` | Principal leitura financeira |
| `details` | `string[]` | Valores essenciais persistentes |
| `privacyNote` | `string` | Nota segura quando aplicavel |

### Invariants

- Nao depende de cor, hover, tooltip ou posicao.
- Nao menciona dados inacessiveis.
- Usa linguagem brasileira neutra.

## Authorized Chart Response

| Field | Type | Meaning |
|-------|------|---------|
| `period` | `Chart Period` | Mes consultado |
| `evolutionWindow` | `Chart Evolution Window` | Janela da serie |
| `categoryDistribution` | `Category Expense Distribution[]` | Categorias autorizadas do mes |
| `monthlyEvolution` | `Monthly Evolution Point[]` | Serie curta autorizada |
| `memberComparison` | `Member Responsibility Comparison` | Comparativo seguro |
| `summaries` | `Accessible Chart Summary[]` | Equivalentes textuais |
| `generatedAt` | `timestamptz` | Momento tecnico da resposta |

### Invariants

- Todos os blocos derivam da mesma consulta autorizada.
- Resposta nao inclui transacoes brutas, observacoes, facetas ou dados de
  pessoas externas.
- Estados vazios nao sugerem dados bloqueados.

## Chart Presentation State

| State | Meaning | Allowed retained data |
|-------|---------|-----------------------|
| `loading` | Primeira consulta ou contexto sensivel mudou | Nenhum resultado anterior |
| `refreshing` | Mes mudou e nova consulta esta em andamento | Shell visual; nenhum dado compartilhado obsoleto |
| `ready` | Resposta autorizada recebida | Graficos e resumos atuais |
| `empty` | Grafico especifico sem dados autorizados | Periodo e mensagem neutra |
| `unavailable_shared` | Comparativo sem vinculo ativo | Mensagem sem sugerir parceiro |
| `error` | Falha recuperavel | Periodo atual; nenhum agregado obsoleto |

### State transitions

```text
loading -> ready | empty | unavailable_shared | error
ready | empty | unavailable_shared | error -> loading
ready -> refreshing -> ready | empty | unavailable_shared | error
```

Somente a requisicao atual pode causar transicao. Mudanca de sessao ou
relacionamento limpa resultados antes da nova consulta.
