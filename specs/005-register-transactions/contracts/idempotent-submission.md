# Contract: Idempotent Transaction Submission

## Purpose

Garantir no maximo uma transacao por tentativa de confirmacao.

## Rules

- O frontend gera UUID quando o formulario fica pronto.
- Cliques repetidos durante `submitting` nao iniciam nova chamada.
- Retry apos falha recuperavel reutiliza a mesma chave enquanto representar o
  mesmo payload pretendido.
- Editar qualquer valor canonico depois de uma tentativa gera nova chave antes
  do proximo envio.
- Banco aplica unicidade por `(created_by_user_id, idempotency_key)`.
- Mesmo payload retorna a transacao ja persistida.
- Payload diferente com a mesma chave falha sem alterar ou criar linha.
- `Registrar outra transacao` gera nova chave.
- Chaves nunca retornam linhas pertencentes a outro criador.

## Payload Equivalence

Comparar valores canonicos persistidos apos normalizacao:

- titulo
- centavos
- tipo
- data
- categoria
- responsavel efetivo
- visibilidade
- espaco
- observacao normalizada

## UI States

`ready -> submitting -> success`

`ready -> submitting -> recoverable_error -> submitting`

`success -> ready` somente por acao explicita de novo registro.
