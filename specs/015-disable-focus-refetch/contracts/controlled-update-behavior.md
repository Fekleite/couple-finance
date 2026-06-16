# Contract: Controlled Update Behavior

## Purpose

Definir quais gatilhos podem atualizar dados remotos e como preservar coerencia
apos acoes financeiras.

## Allowed Update Triggers

- Primeira carga de um hook remoto.
- Mudanca de usuario, casal ou contexto de autorizacao.
- Mudanca de filtro, periodo, status, rota ou identificador relevante.
- Retry acionado pela pessoa usuaria.
- Criacao, edicao, exclusao, aceite de convite ou mutacao financeira.
- Evento explicito de dominio, como refresh de auditoria apos mutacao.

## Required Behavior After Mutations

- Transacoes criadas, editadas ou excluidas devem refletir nos dados
  relacionados cobertos pelo fluxo.
- Metas criadas, atualizadas, concluidas ou arquivadas devem recarregar apenas
  o escopo necessario.
- Eventos de auditoria devem ser atualizados por sinal explicito de dominio,
  nao por foco de janela.
- Falhas devem preservar contexto seguro e oferecer retry quando aplicavel.

## Forbidden Behavior

- Depender de troca de aba para atualizar dados apos mutacao.
- Invalidar todos os dados remotos sem necessidade demonstrada.
- Apagar dados ja autorizados durante uma atualizacao que poderia preservar
  contexto.
- Exibir acoes ou dados fora da permissao atual depois de uma atualizacao.

## Verification

- Testes de hook para mutacoes/retry ja existentes.
- Testes novos ou ajustados para foco sem chamada extra de service.
- Revisao de permissao e isolamento em estados pos-mutacao.
