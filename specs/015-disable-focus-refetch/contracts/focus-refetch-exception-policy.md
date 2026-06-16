# Contract: Focus Refetch Exception Policy

## Purpose

Definir quando uma area pode atualizar dados ao recuperar foco, mesmo com a
politica global de nao refetch por foco.

## Default

Nenhum consumidor de dados remotos deve atualizar apenas porque a janela, aba ou
app voltou a ter foco.

## Exception Requirements

Uma excecao so pode existir se todos os criterios forem atendidos:

- Ha valor claro para a pessoa usuaria ou mitigacao de risco real.
- A excecao e localizada em um consumidor especifico, nao global.
- O escopo dos dados atualizados e autorizado pelas regras existentes.
- A justificativa fica documentada perto da configuracao ou em documentacao
  tecnica da feature.
- Existe teste ou verificacao objetiva cobrindo a excecao.
- Estados de loading/erro/sucesso continuam compreensiveis e acessiveis.

## Non-Allowed Exceptions

- "Manter dados sempre frescos" sem caso de uso especifico.
- Compensar ausencia de invalidacao apos mutacao.
- Recarregar todos os dados financeiros ao foco.
- Contornar filtros, membership, ownership ou RLS.
- Esconder erro de atualizacao atras de recarregamento automatico.

## Review Checklist

- A excecao preserva privacidade?
- A excecao preserva filtros e contexto visual?
- A excecao tem impacto de performance aceitavel?
- A excecao tem alternativa com retry ou invalidacao controlada?
- A excecao esta coberta por teste?
