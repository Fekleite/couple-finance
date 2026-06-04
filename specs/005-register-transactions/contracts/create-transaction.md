# Contract: Create Financial Transaction

## Purpose

Criar ou recuperar idempotentemente uma transacao autorizada.

## Public RPC

`public.create_financial_transaction(...)`

### Input

- `title_input text`
- `amount_cents_input bigint`
- `transaction_type_input text`
- `transaction_date_input date`
- `category_code_input text`
- `visibility_input text`
- `shared_budget_id_input uuid`
- `responsible_user_id_input uuid`
- `observation_input text`
- `idempotency_key_input uuid`

`created_by_user_id` nao faz parte do input; vem de `auth.uid()`.

### Success

Retorna somente o resumo autorizado:

- `id`
- `title`
- `amount_cents`
- `transaction_type`
- `transaction_date`
- `category_code`
- `created_by_user_id`
- `responsible_user_id`
- `visibility`
- `shared_budget_id`
- `observation`
- `created_at`

### Validation

- Sessao autenticada.
- Payload dentro dos limites.
- Categoria ativa e aplicavel.
- Individual força criador como responsavel e sem espaco.
- Shared exige budget ativo e memberships ativas do criador e responsavel.
- Chave idempotente igual com payload diferente gera conflito seguro.

### Failure

O servico converte falhas em:

- `validation`
- `category_unavailable`
- `shared_context_unavailable`
- `responsible_unavailable`
- `submission_conflict`
- `temporary_failure`

Mensagens nao revelam recursos fora da autorizacao.
