# Contract: Transaction Action Availability

## Purpose

Definir como a tabela apresenta acoes por transacao sem enfraquecer permissoes,
auditoria ou isolamento de dados.

## Actions

- `edit`
- `delete`

## Rules

- Acoes so aparecem ou ficam habilitadas quando regras existentes permitirem.
- A F14 nao cria nova matriz de permissao.
- Se uma acao estiver indisponivel, a UI deve ocultar ou bloquear de forma
  neutra, sem revelar dados sensiveis.
- Nomes acessiveis devem identificar a transacao, por exemplo usando o titulo.
- Ao acionar edicao ou exclusao, fluxos existentes de validacao, permissao e
  auditoria devem continuar valendo.

## Tests

- Linha com permissao mostra acao esperada.
- Linha sem permissao nao permite executar acao restrita.
- Acoes possuem nome acessivel especifico.
- Acionar uma acao preserva o fluxo existente de edicao/exclusao.
- Falhas de permissao usam mensagem segura.
