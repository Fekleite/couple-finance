# Contract: Audit Event Registration

## Purpose

Garantir que alteracoes financeiras importantes em transacoes e metas gerem
eventos de auditoria atomicos, autorizados e com snapshot seguro.

## Registration source

Eventos sao criados por funcoes SQL chamadas dentro das RPCs de mutacao:

- `create_financial_transaction` registra `transaction/created`.
- Futuras RPCs de edicao/remocao de transacao registram `transaction/updated`
  ou `transaction/removed_from_main_flow` quando existirem.
- `create_individual_goal` e `create_shared_goal` registram `goal/created`.
- `update_goal` registra `goal/updated`.
- `complete_goal` registra `goal/completed`.
- `archive_goal` registra `goal/archived`.

## Inputs

| Field | Rule |
|-------|------|
| `actor_user_id` | Sempre derivado de `auth.uid()` |
| `item_type` | `transaction` ou `goal` |
| `item_id` | ID persistido do item alterado |
| `action_type` | Acao fechada autorizada |
| `visibility` | Copiada do item autorizado |
| `owner_user_id` | Obrigatorio para item individual |
| `shared_budget_id` | Obrigatorio para item compartilhado |
| `snapshot` | Campos seguros do item depois da mutacao |

## Guarantees

- Evento e mutacao financeira confirmam ou falham juntos.
- Cliente nao envia autoria confiavel.
- Cliente nao possui insert direto em `financial_audit_events`.
- Evento nao e criado para navegacao, filtro, ordenacao ou formulario cancelado.
- Edicao sem campo financeiro/contextual relevante nao cria evento.
- Erros retornam mensagens seguras e nao expõem detalhes de RLS.

## Failure behavior

- Se o evento nao puder ser registrado, a mutacao financeira deve falhar de
  forma segura.
- Se a mutacao financeira falhar, nenhum evento deve permanecer.
- Falhas de validacao usam codigos seguros, por exemplo
  `audit_registration_unavailable`, sem indicar recurso privado.
