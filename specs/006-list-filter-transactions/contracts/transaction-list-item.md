# Contract: Transaction List Item

## Required content

- Titulo.
- Valor positivo formatado em `pt-BR`.
- Tipo em texto: receita ou despesa.
- Data civil formatada.
- Nome da categoria canonica.
- Responsavel: `Voce` ou `Pessoa parceira`.
- Visibilidade individual ou compartilhada.
- Criador quando compartilhada e criador diferente do responsavel.

## Rules

- Nao exibir observacao completa, IDs, espaco compartilhado, chave de
  idempotencia ou erro interno.
- Nao exibir saldo, total, contagem ou acao de mutacao.
- Tipo, responsavel e visibilidade nao dependem apenas de cor ou icone.
- Categoria inativa continua com label historico compreensivel.
- O item possui estrutura semantica suficiente para ser compreendido
  isoladamente por tecnologia assistiva.
- A ordem visual prioriza titulo e valor, mantendo contexto financeiro legivel
  em mobile e texto ampliado.
