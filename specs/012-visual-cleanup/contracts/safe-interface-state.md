# Contract: Safe Interface State

## Purpose

Preservar clareza e privacidade em estados de interface apos a limpeza visual.

## Covered States

- Loading
- Empty
- Error
- Success
- Permission unavailable
- No shared relationship
- Session-related state
- Populated state

## Rules

- Estados devem comunicar situacao e proxima acao quando houver uma acao
  disponivel.
- Loading nao deve parecer dado financeiro real.
- Empty state nao deve sugerir existencia, quantidade ou ownership de dados que
  a pessoa nao pode acessar.
- Error state nao deve revelar detalhes internos, recursos privados ou dados
  inacessiveis.
- Success state deve confirmar a acao sem adicionar conteudo redundante.
- Mensagens devem ser especificas e objetivas, evitando texto generico longo.

## Pass Criteria

- Todas as telas alteradas preservam estados claros.
- Estados com permissao ou vinculo ausente usam mensagens seguras.
- Testes cobrem estados condicionais quando a renderizacao for alterada.
