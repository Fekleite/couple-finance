# Contract: Authorized Transaction Query

## Purpose

Consultar uma pagina coordenada de transacoes e opcoes autorizadas.

## Public RPC

`public.list_financial_transactions(...)`

### Input

- `month_start_input date`
- `next_month_start_input date`
- `category_code_input text default null`
- `responsible_user_id_input uuid default null`
- `transaction_type_input text default null`
- `search_text_input text default null`
- `cursor_transaction_date_input date default null`
- `cursor_created_at_input timestamptz default null`
- `cursor_id_input uuid default null`
- `page_size_input integer default 50`

### Validation

- Sessao autenticada.
- Inicio e proximo inicio formam exatamente um mes civil.
- Tipo e categoria opcionais possuem formato valido.
- Busca normalizada possui no maximo 100 caracteres.
- Cursor esta totalmente ausente ou totalmente presente.
- Pagina possui 1 a 100 itens.

### Success document

- `items`: no maximo `page_size_input` itens autorizados e filtrados.
- `next_cursor`: cursor composto ou nulo.
- `has_more`: booleano sem quantidade.
- `has_authorized_month_data`: existencia autorizada antes dos filtros
  adicionais.
- `category_options`: categorias distintas do mes autorizado, sem contagens.
- `responsible_options`: responsaveis distintos do mes autorizado, sem
  contagens.

### Query rules

- RLS e aplicada antes de qualquer saida.
- Periodo e filtros adicionais usam `AND`.
- Busca considera titulo e observacao, mas observacao nao e retornada.
- Ordem: `transaction_date desc, created_at desc, id desc`.
- Opcoes dependem do mes autorizado, nao dos filtros adicionais.

### Failure

O servico converte qualquer falha em `temporary_failure` ou `invalid_query`,
com mensagem neutra e sem SQL, IDs, existencia de recursos ou detalhes de RLS.
