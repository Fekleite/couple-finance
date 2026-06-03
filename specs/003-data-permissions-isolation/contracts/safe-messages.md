# Contract: Safe Messages

## Tone

- Neutro, calmo e nao julgador.
- Claro sobre proxima acao quando houver uma acao segura.
- Sem detalhes internos de Supabase, SQL, RLS, policies ou RPCs.

## Message Keys

| Key | Intent |
|-----|--------|
| `permissionUnavailable` | Informacao nao esta disponivel para a pessoa atual |
| `permissionChecking` | Acesso ainda esta sendo verificado |
| `permissionBlocked` | Acao nao pode ser concluida com o acesso atual |
| `individualOnly` | Informacao pertence somente a pessoa atual |
| `sharedOnly` | Informacao pertence ao espaco compartilhado ativo |
| `safeEmptyState` | Nao ha dados permitidos para exibir |
| `temporaryFailure` | Falha temporaria com opcao de tentar novamente |

## Required Copy Intents

- "Esta informacao nao esta disponivel para voce" para indisponibilidade
  generica.
- "Estamos verificando seu acesso" para loading sem dados privados.
- "Nao encontramos dados disponiveis para exibir" para estado vazio seguro.
- "Esta informacao fica visivel somente para voce" para dado individual.
- "Esta informacao pertence ao espaco compartilhado" para dado compartilhado.

## Must Not Reveal

- Se e-mail de terceiro possui conta.
- Se convite, orcamento, transacao, categoria, meta ou auditoria existe para
  usuario nao relacionado.
- Saldos, valores, nomes de categorias, metas, transacoes ou totais fora do
  escopo permitido.
- Mensagens cruas de banco, nomes de policies, nomes de funcoes ou codigos SQL
  sensiveis.

## Error Mapping

| Technical case | User-facing result |
|----------------|--------------------|
| RLS returns no rows | `permissionUnavailable` or safe empty state |
| RPC raises unavailable | `permissionUnavailable` |
| Network/service failure | `temporaryFailure` |
| Resource exists but user unrelated | `permissionUnavailable` |
| Resource removed or nonexistent | `permissionUnavailable` |
| Authorized own empty list | `safeEmptyState` |
