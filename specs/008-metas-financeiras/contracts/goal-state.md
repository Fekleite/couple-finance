# Contract: Goal Presentation State

## Purpose

Definir estados de UI para lista, formulario e mutacoes de metas.

## States

```ts
type GoalViewState =
  | { status: "loading" }
  | { status: "ready"; items: AuthorizedGoal[]; filter: GoalFilter }
  | { status: "empty"; filter: GoalFilter; message: string }
  | { status: "submitting"; message: string; items: AuthorizedGoal[] }
  | { status: "success"; message: string; items: AuthorizedGoal[] }
  | { status: "error"; message: string }
  | { status: "blocked"; message: string };
```

## Transition Rules

- `loading -> ready | empty | error`
- `ready -> submitting -> success | error`
- `success -> loading` para revalidacao quando necessario
- Qualquer troca de sessao ou relacionamento compartilhado limpa itens antes de
  nova leitura.
- Somente a requisicao mais recente pode publicar resultado.

## Safe Messaging

- Loading nao deve exibir metas antigas quando contexto sensivel mudou.
- Empty nao deve sugerir existencia de metas bloqueadas.
- Error nao deve exibir SQL, IDs internos, Supabase cru ou detalhes de RLS.
- Blocked explica somente o que a pessoa pode fazer, como criar um espaco
  compartilhado antes de criar meta compartilhada.
