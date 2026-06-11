# Contract: Transaction Filter Integration

## Purpose

Preservar a integracao de filtros da F06 enquanto a listagem muda para tabela.

## Existing Filters

- `month`
- `categoryCode`
- `responsibleUserId`
- `transactionType`
- `searchText`

## Rules

- Filtros continuam serializados em URL.
- `parseTransactionFilters`, `serializeTransactionFilters` e limpeza de
  filtros continuam sendo a fonte de verdade.
- A tabela recebe dados ja filtrados pelo service/hook existente.
- Sort nao substitui nem duplica filtros.
- Estado `no_matches` continua distinto de `empty_month`.
- Opcoes de categoria e responsavel continuam derivadas da resposta autorizada.

## Tests

- Aplicar cada filtro atual continua mudando a consulta esperada.
- Limpar filtros adicionais preserva o mes.
- Busca textual continua normalizada.
- `no_matches` aparece quando filtros nao retornam itens, com acao de limpar.
- Sort aplicado sobre resultado filtrado nao altera filtros ativos.
