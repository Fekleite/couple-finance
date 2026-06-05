# Contract: Dashboard Query Authorization

## Purpose

Garantir que indicadores, transacoes recentes e estados do dashboard derivem
somente de dados autorizados.

## Authorization Rules

- Usuario deve estar autenticado.
- Transacao individual e autorizada somente para `created_by_user_id = auth.uid()`.
- Transacao compartilhada e autorizada somente para membro ativo do mesmo
  `shared_budget_id`.
- Responsabilidade nao concede acesso por si so.
- Convites pendentes, recusados, cancelados, expirados ou indisponiveis nao
  concedem acesso.
- Vinculo encerrado, inativo ou de outro espaco financeiro nao concede acesso.

## Dashboard Output Rules

- RLS deve ser aplicada antes de totais, recentes e metadados.
- Indicadores nao podem incluir linhas bloqueadas.
- Transacoes recentes nao podem incluir linhas bloqueadas.
- Mes vazio nao pode diferenciar inexistencia de dados bloqueados.
- Falha ou indisponibilidade nao pode revelar existencia de recurso inacessivel.
- Revogacao de vinculo deve remover dados compartilhados na proxima consulta.

## Database Surface

- RPC publica deve usar `security invoker`.
- `search_path` deve ser fixo.
- SQL deve ser estatico e sem concatenacao insegura.
- Grants devem limitar `authenticated` ao `EXECUTE` necessario e leituras sob
  RLS.
- `service_role`, secrets e `user_metadata` nao podem ser fonte final de
  autorizacao.
