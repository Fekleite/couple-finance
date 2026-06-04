# Data Model: F06 - Lista e filtros de transacoes

## Transaction Query

Consulta canonica enviada a `public.list_financial_transactions`.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `monthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes civil |
| `nextMonthStart` | `YYYY-MM-DD` | Yes | Primeiro dia do mes seguinte |
| `categoryCode` | `string \| null` | No | Uma identidade canonica |
| `responsibleUserId` | `uuid \| null` | No | Opcao autorizada |
| `transactionType` | `income \| expense \| null` | No | Um tipo |
| `searchText` | `string \| null` | No | Normalizado, ate 100 caracteres |
| `cursor` | `PaginationCursor \| null` | No | Ausente na primeira pagina |
| `pageSize` | `number` | Yes | Fixo em 50 no frontend; maximo 100 no banco |

### Invariants

- Periodo usa inicio inclusivo e proximo mes exclusivo.
- Filtros opcionais usam semantica `AND`.
- Cursor pertence ao conjunto de filtros atual.
- Parametros invalidos falham de forma segura e nao ampliam a consulta.

## Transaction Filter Set

Estado canonico representado na URL.

| Field | Default | URL key |
|-------|---------|---------|
| `month` | Mes civil atual | `month` |
| `categoryCode` | `null` | `category` |
| `responsibleUserId` | `null` | `responsible` |
| `transactionType` | `null` | `type` |
| `searchText` | `null` | `q` |

Filtros adicionais podem ser removidos individualmente ou em conjunto sem
alterar `month`.

## Civil Month

| Field | Example | Purpose |
|-------|---------|---------|
| `key` | `2026-06` | Identidade de interface e URL |
| `startDate` | `2026-06-01` | Limite inclusivo |
| `nextStartDate` | `2026-07-01` | Limite exclusivo |
| `label` | `junho de 2026` | Apresentacao `pt-BR` |

Conversoes nao usam timezone nem instantes.

## Authorized Transaction Result

Item retornado somente depois de periodo, filtros e RLS.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `uuid` | Usado internamente e no cursor |
| `title` | `string` | Titulo autorizado |
| `amountCents` | `number` | Inteiro positivo exato |
| `transactionType` | `income \| expense` | Natureza explicita |
| `transactionDate` | `YYYY-MM-DD` | Data civil |
| `createdAt` | `timestamptz` | Desempate estavel |
| `categoryCode` | `string` | Identidade historica |
| `categoryLabel` | `string` | Nome canonico atual/historico |
| `createdByUserId` | `uuid` | Contrato interno autorizado |
| `creatorLabel` | `Voce \| Pessoa parceira` | Exibido quando relevante |
| `responsibleUserId` | `uuid` | Contrato interno e filtro |
| `responsibleLabel` | `Voce \| Pessoa parceira` | Contexto financeiro |
| `visibility` | `individual \| shared` | Escopo explicito |

Observacao participa da busca no banco, mas nao e retornada para a lista.

## Pagination Cursor

| Field | Type | Rule |
|-------|------|------|
| `transactionDate` | `YYYY-MM-DD` | Data do ultimo item |
| `createdAt` | `timestamptz` | Segundo criterio |
| `id` | `uuid` | Desempate final |

Ordem canonica:

```text
transaction_date DESC, created_at DESC, id DESC
```

O cursor seguinte referencia o ultimo item retornado. Alterar qualquer filtro
invalida cursor e paginas acumuladas.

## Category Filter Option

| Field | Type | Rules |
|-------|------|-------|
| `code` | `string` | Presente em transacao autorizada do mes |
| `label` | `string` | Resolvido pelo catalogo canonico |
| `isActive` | `boolean` | Mantem contexto historico |

Nao possui contagem e nao depende dos filtros adicionais.

## Responsible Filter Option

| Field | Type | Rules |
|-------|------|-------|
| `userId` | `uuid` | Presente em transacao autorizada do mes |
| `label` | `Voce \| Pessoa parceira` | Sem nome, e-mail ou perfil |

Uma pessoa historica pode permanecer como opcao se aparece em transacao
autorizada do mes, mesmo sem elegibilidade para novos registros.

## Authorized Transaction Query Result

| Field | Type | Meaning |
|-------|------|---------|
| `items` | `AuthorizedTransactionResult[]` | Pagina filtrada autorizada |
| `nextCursor` | `PaginationCursor \| null` | Continuacao segura |
| `hasMore` | `boolean` | Ha pagina seguinte, sem quantidade |
| `hasAuthorizedMonthData` | `boolean` | Existe ao menos uma linha autorizada no mes antes dos filtros adicionais |
| `categoryOptions` | `CategoryFilterOption[]` | Opcoes do mes autorizado |
| `responsibleOptions` | `ResponsibleFilterOption[]` | Opcoes do mes autorizado |

## Transaction List Item

Modelo de apresentacao derivado de `Authorized Transaction Result`.

### Required content

- Titulo.
- Valor formatado em `pt-BR`.
- Receita ou despesa em texto.
- Data civil formatada.
- Categoria.
- Responsavel.
- Visibilidade.
- Criador quando compartilhada e criador diferente do responsavel.

O item nao exibe observacao, IDs, total, saldo ou acao de mutacao.

## Transaction List State

| State | Meaning | Allowed retained data |
|-------|---------|-----------------------|
| `loading` | Primeira consulta ou filtros mudaram | Nenhum resultado anterior |
| `ready` | Pagina com itens autorizados | Itens, opcoes e cursor atuais |
| `loading_more` | Continuacao em andamento | Itens atuais e cursor bloqueado |
| `empty_month` | Mes sem linha autorizada | Opcoes vazias e orientacao neutra |
| `no_matches` | Mes possui dados, filtros nao correspondem | Opcoes autorizadas e filtros atuais |
| `error` | Falha recuperavel | Filtros atuais; nenhum item potencialmente obsoleto |

### State transitions

```text
loading -> ready | empty_month | no_matches | error
ready -> loading_more -> ready | error
ready | empty_month | no_matches | error -> loading
```

Somente a requisicao atual pode causar transicao. Mudanca de sessao,
relacionamento ou filtros limpa resultados antes da nova consulta.
