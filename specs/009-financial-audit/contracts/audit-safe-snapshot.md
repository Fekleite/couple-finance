# Contract: Audit Safe Snapshot

## Purpose

Preservar contexto suficiente para entendimento humano sem expor dados
inacessiveis ou criar historico detalhado demais.

## Allowed fields

### Transaction

| Field | Rule |
|-------|------|
| `subject_label` | Titulo normalizado da transacao |
| `subject_amount_cents` | Valor da transacao |
| `subject_date` | Data civil da transacao |
| `subject_status` | Nulo no MVP |

### Goal

| Field | Rule |
|-------|------|
| `subject_label` | Nome normalizado da meta |
| `subject_amount_cents` | Valor alvo ou valor relevante para a mensagem |
| `subject_date` | Prazo da meta, se existir |
| `subject_status` | `active`, `completed` ou `archived` |

## Excluded fields

- E-mail, telefone, nome vindo de `user_metadata` ou dados de perfil nao
  autorizados.
- Observacoes longas quando puderem conter informacao privada.
- Diff completo antes/depois.
- IDs tecnicos sem necessidade de exibicao.
- SQL, politica RLS, stack trace ou detalhes de infraestrutura.

## Snapshot lifecycle

- Snapshot e criado no momento da mutacao financeira.
- Snapshot nao precisa acompanhar edicoes futuras do item.
- Snapshot continua visivel somente enquanto o evento permanecer autorizado.
- Item removido da lista principal nao apaga automaticamente o evento, desde
  que o contexto continue autorizado.
