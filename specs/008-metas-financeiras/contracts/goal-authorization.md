# Contract: Goal Authorization

## Purpose

Definir as regras de isolamento para metas individuais e compartilhadas.

## Individual Goals

- `visibility = "individual"`.
- `shared_budget_id is null`.
- `created_by_user_id = auth.uid()` para leitura e mutacao.
- Nunca aparecem para parceiro, parceira ou outra pessoa autenticada.

## Shared Goals

- `visibility = "shared"`.
- `shared_budget_id is not null`.
- Leitura e mutacao exigem linha ativa em `public.budget_members` para
  `auth.uid()` e o mesmo `shared_budget_id`.
- Budget deve estar ativo quando a mutacao cria uma meta compartilhada.

## Inactive Or Pending Contexts

Nao concedem acesso:

- Convite pendente.
- Convite recusado.
- Convite cancelado.
- Convite expirado.
- Convite indisponivel.
- Membership removida.
- Budget arquivado/inativo.

## No Inference Rules

- Nao retornar contagens de metas inacessiveis.
- Nao diferenciar nao encontrado de nao autorizado.
- Nao manter dados compartilhados revogados em tela apos troca de contexto.
- Nao sugerir nomes, valores, prazos, progresso, status ou existencia de metas
  inacessiveis em erros, vazios, loading ou resumos.
