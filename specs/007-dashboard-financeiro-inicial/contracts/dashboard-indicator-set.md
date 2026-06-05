# Contract: Dashboard Indicator Set

## Purpose

Definir os indicadores financeiros mensais exibidos no dashboard.

## Fields

- `income_cents`: soma autorizada de receitas do mes.
- `expense_cents`: soma autorizada de despesas do mes.
- `balance_cents`: receitas menos despesas.
- `result_meaning`: `positive`, `negative` ou `zero`.
- `has_authorized_month_data`: existencia autorizada de transacao no mes, sem
  quantidade.

## Presentation

- Receitas e despesas aparecem como valores positivos.
- Saldo pode ser positivo, negativo ou zero, mas seu significado deve ser
  explicado por texto.
- Economia/deficit e uma leitura do saldo mensal, nao uma meta ou comparacao.
- Mes sem transacoes autorizadas apresenta leitura neutra de ausencia de
  movimentacao.

## Privacy Rules

- Indicadores consideram somente transacoes autorizadas pela RLS.
- Indicadores nao podem sugerir valores, existencia ou ausencia de transacoes
  inacessiveis.
- Nenhum indicador retorna contagem de transacoes.
