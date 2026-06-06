# Contract: Chart Query Authorization

## Purpose

Documentar regras de isolamento que toda consulta, grafico, legenda, resumo e
estado da F08 deve cumprir.

## Rules

- Usuario autenticado acessa somente dados autorizados por RLS.
- Transacao individual contribui somente para o criador autenticado.
- Transacao compartilhada contribui somente quando pertence ao espaco
  financeiro compartilhado ativo da pessoa autenticada.
- Convite pendente, recusado, cancelado, expirado ou indisponivel nao concede
  acesso.
- Vinculo encerrado ou inativo nao concede acesso.
- Responsabilidade nao concede acesso por si so.
- Comparativo entre membros usa somente transacoes compartilhadas autorizadas.
- Transacoes individuais do parceiro nunca entram em valores, percentuais,
  legendas, resumos, estados ou mensagens.
- Estados vazios e erros nao diferenciam inexistencia de dados bloqueados,
  removidos ou fora de autorizacao.

## Validation

- Testar usuario individual.
- Testar casal ativo.
- Testar outro espaco compartilhado.
- Testar revogacao de vinculo.
- Testar responsavel diferente do criador.
- Testar mes vazio autorizado.
