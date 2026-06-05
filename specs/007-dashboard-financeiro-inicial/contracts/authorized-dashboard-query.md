# Contract: Authorized Dashboard Query

## Purpose

Consultar indicadores mensais e transacoes recentes em uma resposta coordenada
e autorizada.

## Public RPC

`public.get_financial_dashboard(...)`

### Input

- `month_start_input date`
- `next_month_start_input date`
- `recent_limit_input integer default 5`

### Validation

- Sessao autenticada.
- Inicio e proximo inicio formam exatamente um mes civil.
- `recent_limit_input` possui 1 a 10 itens.
- Parametros invalidos falham sem ampliar a consulta.

### Success document

- `period`: mes civil consultado.
- `indicators`: receitas, despesas, saldo, leitura do resultado e existencia
  autorizada do mes.
- `recent_transactions`: ate `recent_limit_input` itens autorizados.
- `generated_at`: timestamp tecnico da resposta.

### Query rules

- RLS e aplicada antes de qualquer soma ou saida.
- Periodo usa `transaction_date >= month_start_input` e
  `transaction_date < next_month_start_input`.
- Receitas e despesas sao somadas separadamente a partir de `amount_cents`.
- Saldo e `income_cents - expense_cents`.
- Resultado e `positive`, `negative` ou `zero`.
- Ordem dos recentes:
  `transaction_date desc, created_at desc, id desc`.
- Observacao nao e retornada.
- Resposta nao inclui contagens, facetas, filtros ou dados inacessiveis.

### Failure

O servico converte qualquer falha em `temporary_failure` ou `invalid_query`,
com mensagem neutra e sem SQL, IDs, existencia de recursos ou detalhes de RLS.
