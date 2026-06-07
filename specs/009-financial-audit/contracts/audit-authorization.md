# Contract: Audit Authorization

## Purpose

Preservar as mesmas fronteiras de privacidade das transacoes e metas
subjacentes.

## Individual events

- Exigem `visibility = 'individual'`.
- Exigem `owner_user_id`.
- Exigem `shared_budget_id is null`.
- RLS permite leitura somente para `owner_user_id = auth.uid()`.
- Nao aparecem para parceiro, responsavel antigo, convite pendente ou usuario
  anonimo.

## Shared events

- Exigem `visibility = 'shared'`.
- Exigem `shared_budget_id`.
- Exigem `owner_user_id is null`.
- RLS permite leitura somente quando existe membership ativa no mesmo
  `shared_budget_id`.
- Vinculos pendentes, recusados, cancelados, expirados, encerrados ou inativos
  nao concedem acesso.

## Revocation

Quando a pessoa perde membership ativa:

- Nova consulta nao retorna eventos compartilhados.
- UI deve limpar ou revalidar dados compartilhados.
- Mensagens nao devem sugerir que eventos compartilhados ainda existem.

## Inference prevention

- Sem contadores globais.
- Sem mensagens de "voce nao tem permissao para este evento".
- Sem ordenacao ou vazios que revelem lacunas de eventos inacessiveis.
- Sem detalhes de autor ou item quando o contexto nao for autorizado.
