# Contract: Dashboard State

## Purpose

Controlar estados seguros do dashboard mensal.

## States

- `loading`: primeira consulta ou contexto sensivel mudou.
- `refreshing`: mes mudou e nova consulta esta em andamento.
- `ready`: resposta autorizada com indicadores e possiveis recentes.
- `empty_month`: mes sem transacoes autorizadas.
- `error`: falha recuperavel.

## Rules

- Somente a requisicao mais recente pode atualizar o estado.
- Mudanca de usuario, sessao ou relacionamento limpa dados antes de nova
  consulta.
- `empty_month` nao sugere dados inacessiveis.
- `error` nao exibe mensagens cruas do Supabase, SQL, IDs ou detalhes de RLS.
- `refreshing` nao pode manter dados compartilhados potencialmente revogados
  quando o contexto de autorizacao mudou.

## Allowed Transitions

```text
loading -> ready | empty_month | error
ready | empty_month | error -> loading
ready -> refreshing -> ready | empty_month | error
```
