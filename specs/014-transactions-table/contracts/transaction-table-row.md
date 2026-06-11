# Contract: Transaction Table Row

## Purpose

Define a linha de transacao consumida pela tabela da F14 sem alterar o contrato
de dados autorizado da F06.

## Input

Cada row deriva de `TransactionListItemData` existente.

Required fields:

- `id`
- `title`
- `amountCents`
- `transactionType`
- `transactionDate`
- `createdAt`
- `categoryCode`
- `categoryLabel`
- `createdByUserId`
- `creatorLabel`
- `responsibleUserId`
- `responsibleLabel`
- `visibility`

## Rules

- A tabela so recebe linhas retornadas pela consulta autorizada.
- Nenhuma linha pode ser criada a partir de dados parciais que ocultem valor,
  tipo, categoria, data, responsavel ou visibilidade.
- Campos devem preservar significado financeiro atual.
- O mapeamento para UI deve usar helpers existentes de moeda e data.
- A linha precisa fornecer contexto suficiente para nomes acessiveis de acoes,
  como editar ou excluir a transacao pelo titulo.

## Tests

- Renderiza todos os campos essenciais de uma linha populada.
- Diferencia Receita/Despesa e Individual/Compartilhada.
- Preserva responsavel e criador quando a transacao compartilhada foi criada
  por pessoa diferente da responsavel.
- Lida com titulo, categoria e responsavel longos sem quebrar a apresentacao.
