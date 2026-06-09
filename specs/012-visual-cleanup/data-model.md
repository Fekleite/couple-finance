# Data Model: F12 - Limpeza visual e remocao de informacoes desnecessarias

A F12 nao cria ou altera dados persistidos. Este modelo e conceitual e orienta
planejamento, implementacao, testes e revisao.

## Reviewed Screen

Tela existente em escopo para limpeza visual.

**Fields**:
- `id`: identificador humano da tela.
- `area`: dashboard, transactions, goals, categories, couple, settings ou
  shared.
- `primaryTask`: tarefa principal que a tela precisa apoiar.
- `baselineFlows`: fluxos F00-F11 que podem regredir.
- `states`: estados de interface aplicaveis.
- `reviewStatus`: not-started, inventoried, changed, validated ou deferred.

**Validation rules**:
- Deve possuir uma tarefa primaria clara.
- Deve listar estados relevantes antes da implementacao.
- Deve identificar informacoes essenciais que nao podem ser removidas.

## Visual Element Review

Registro de decisao sobre um elemento visual existente.

**Fields**:
- `screenId`: Reviewed Screen associada.
- `elementName`: nome descritivo do elemento.
- `elementType`: card, chart, badge, icon, helper-text, summary, control,
  state-message ou layout-block.
- `currentPurpose`: funcao atual percebida.
- `decision`: keep, remove, consolidate, reorder, rewrite ou defer.
- `reason`: decisao financeira, orientacao, seguranca, auditoria,
  rastreabilidade, tarefa, redundancia ou decoracao.
- `risk`: none, low, medium ou high.
- `testNeeded`: booleano para alteracoes renderizadas com risco.

**Validation rules**:
- Toda decisao remove/consolidate/rewrite/defer precisa de justificativa.
- Elementos com risco medio ou alto precisam de teste ou validacao manual
  documentada.

## Essential Financial Information

Informacao que deve permanecer perceptivel apos a limpeza.

**Fields**:
- `kind`: amount, date, category, type, responsible, visibility, status,
  progress, action, audit-context ou shared-context.
- `label`: texto ou contexto visivel.
- `screenId`: tela onde aparece.
- `requiredFor`: decision, orientation, security, audit, traceability ou task.
- `accessibilityRequirement`: label, heading, table-header, text-alternative,
  focus-order ou status-text.

**Validation rules**:
- Nao pode depender apenas de cor, icone, posicao visual, hover ou tooltip.
- Deve continuar disponivel em mobile e navegacao por teclado quando aplicavel.

## Financial Context Indicator

Sinal que explica escopo individual/compartilhado, responsavel, visibilidade ou
ownership.

**Fields**:
- `contextType`: individual, shared, responsible, visibility, ownership ou
  permission.
- `displayPattern`: texto, agrupamento, coluna, label, status ou descricao.
- `riskIfRemoved`: interpretacao incorreta, exposicao indevida, perda de
  auditoria ou erro de acao.

**Validation rules**:
- Deve permanecer claro em dashboard, transacoes, metas e convites/parceiro.
- Remocao sem substituto equivalente e regressao bloqueante.

## Interface State

Estado de uma tela ou componente apos limpeza visual.

**Fields**:
- `stateType`: loading, empty, error, success, permission-unavailable,
  no-shared-relationship, session-related ou populated.
- `messagePurpose`: orientar, informar, recuperar, confirmar ou bloquear.
- `safeMessageRequired`: booleano.
- `actionAvailable`: nenhuma, retry, create, edit, navigate ou dismiss.

**Validation rules**:
- Mensagens devem ser especificas, objetivas e seguras.
- Estados nao podem revelar existencia, quantidade ou ownership de dados
  inacessiveis.

## Deferred Cleanup Candidate

Elemento mantido temporariamente porque a remocao tem risco.

**Fields**:
- `screenId`: tela associada.
- `elementName`: elemento adiado.
- `reasonDeferred`: risco financeiro, risco de permissao, auditoria,
  acessibilidade, dependencia futura ou falta de cobertura.
- `requiredBeforeRemoval`: teste, decisao de produto, clarificacao, feature
  futura ou validacao manual.

**Validation rules**:
- Deve ter motivo claro e condicao objetiva para revisao futura.
- Nao deve virar acumulador de itens sem decisao.

## State Transitions

```text
Reviewed Screen: not-started -> inventoried -> changed -> validated
Reviewed Screen: inventoried -> deferred
Visual Element Review: identified -> classified -> changed -> validated
Visual Element Review: identified -> classified -> deferred
Interface State: baseline-captured -> simplified -> validated
```
