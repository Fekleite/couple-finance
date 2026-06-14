# Contract: Transaction Sort State

## Purpose

Definir como a tabela controla ordenacao por data e valor sem alterar filtros,
consulta autorizada ou paginacao existente.

## State

```text
column: "transactionDate" | "amountCents" | null
direction: "asc" | "desc" | null
```

## Default

O estado inicial deve preservar a expectativa atual de transacoes recentes
primeiro. Se a tabela precisar explicitar sort inicial, use `transactionDate`
em ordem descendente.

## Rules

- Sort opera sobre itens autorizados ja carregados.
- Mudanca de sort nao altera filtros nem parametros de URL de filtros.
- Sort nao dispara nova consulta por si so.
- "Carregar mais" continua anexando itens conforme a consulta existente; a
  ordenacao local deve manter comportamento previsivel sobre o conjunto
  carregado.
- Estado ativo deve ser comunicado visualmente e por acessibilidade.

## Tests

- Ordena por data ascendente e descendente.
- Ordena por valor ascendente e descendente.
- Mantem filtros ativos apos trocar ordenacao.
- Nao remove, duplica ou cria linhas.
- Comunica estado ativo do sort no cabecalho correspondente.
