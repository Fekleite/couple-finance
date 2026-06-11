# Contract: Navigation Accessibility Review

## Purpose

Garantir que a navegacao autenticada seja compreensivel e operavel por teclado
e tecnologias assistivas.

## Required Checks

- Landmark de navegacao com nome claro
- Controle de abrir/fechar menu compacto com nome acessivel
- Foco visivel em todos os itens acionaveis
- Ordem de foco previsivel
- Indicacao semantica da pagina atual
- Labels textuais para itens com icones
- Retorno de foco apos fechar menu compacto quando aplicavel
- Ausencia de informacao comunicada apenas por cor, icone, hover ou posicao

## Rules

- O primeiro foco dentro do layout deve seguir ordem logica entre acoes de conta,
  navegacao e conteudo principal.
- Itens de navegacao devem ser links quando levam a rotas.
- Botoes devem ser usados para abrir/fechar menu ou executar logout.
- O modo compacto nao deve prender foco indevidamente.

## Pass Criteria

- Testes ou revisao manual cobrem navegacao por teclado.
- Rota ativa e anunciada por semantica apropriada.
- Todos os controles possuem nome acessivel.
- Foco continua visivel em desktop e mobile.
