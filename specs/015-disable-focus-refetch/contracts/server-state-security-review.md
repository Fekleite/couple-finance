# Contract: Server State Security Review

## Purpose

Garantir que a F15 nao enfraquece autorizacao, isolamento ou privacidade ao
ajustar comportamento de atualizacao.

## Required Checks

- Nenhuma mudanca em Supabase Auth, RLS, policies, migrations ou schema.
- Nenhuma ampliacao de dados carregados para facilitar atualizacao.
- Nenhum erro deve revelar existencia, contagem, responsavel, categoria, valor
  ou detalhe de dado fora do escopo autorizado.
- Mudanca de usuario/casal/contexto deve continuar limpando dados
  potencialmente revogados.
- Atualizacoes controladas devem respeitar as mesmas permissoes de visualizar,
  editar e excluir.
- Estados de auditoria devem continuar refletindo somente eventos autorizados.

## Regression Risks

- Preservar dados antigos depois de troca real de usuario ou casal.
- Reduzir refetch indevido e, sem querer, impedir atualizacao apos mutacao.
- Adicionar excecao de foco que carrega dados fora do filtro ou escopo.
- Mascarar falha de service mantendo dados obsoletos sem mensagem.

## Verification

- Testes de contexto de autorizacao continuam passando.
- Testes de permissao existentes continuam passando.
- Novos testes de foco nao removem protecoes de limpeza em troca real de
  contexto.
- Revisao manual confirma ausencia de schema/RLS/Prisma/migrations.
