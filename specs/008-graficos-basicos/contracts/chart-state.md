# Contract: Chart State

## Purpose

Definir estados de apresentacao para a secao de graficos e para cada grafico.

## States

| State | Meaning | Data allowed |
|-------|---------|--------------|
| `loading` | Primeira consulta ou contexto sensivel mudou | Nenhum agregado anterior |
| `refreshing` | Nova consulta para outro mes | Shell visual sem dado revogado |
| `ready` | Dados autorizados recebidos | Graficos atuais |
| `empty` | Grafico sem dados autorizados | Periodo e mensagem neutra |
| `unavailable_shared` | Comparativo sem vinculo ativo | Mensagem sem sugerir parceiro |
| `error` | Falha recuperavel | Periodo atual e retry |

## Transitions

```text
loading -> ready | empty | unavailable_shared | error
ready | empty | unavailable_shared | error -> loading
ready -> refreshing -> ready | empty | unavailable_shared | error
```

## Rules

- Somente a requisicao mais recente pode atualizar estado.
- Mudanca de sessao ou relacionamento limpa resultados sensiveis.
- Erros nao exibem SQL, IDs, RLS ou existencia de recurso inacessivel.
