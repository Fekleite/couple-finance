# Contract: Transaction Query Authorization

## Read matrix

| Context | Individual | Shared |
|---------|------------|--------|
| Criador autenticado | Allow own | Allow own active budget |
| Parceiro ativo | Deny partner individual | Allow same active budget |
| Convite pendente | Allow own | Deny |
| Membership removida/inativa | Allow own | Deny |
| Pessoa externa/outro budget | Allow own | Deny |

## Protected outputs

As mesmas regras protegem:

- Itens.
- Busca em titulo e observacao.
- Opcoes de categoria e responsavel.
- `has_authorized_month_data`.
- Cursor e `has_more`.
- Estados vazios e erros.

## Database enforcement

- RLS `SELECT to authenticated` da F05 permanece a fronteira final.
- RPC de consulta usa `security invoker`.
- Responsabilidade nao concede leitura.
- Convite nao concede leitura.
- Nenhuma contagem ou faceta inclui linha inacessivel.
- Revogacao de membership passa a valer na consulta seguinte.

## Safe failure

Nao diferenciar budget inexistente, inativo, de outro casal ou membership
removida. Retornar lista autorizada restante, vazio seguro ou falha temporaria
neutra conforme o resultado real da consulta.
