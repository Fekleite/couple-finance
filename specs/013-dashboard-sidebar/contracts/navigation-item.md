# Contract: Navigation Item

## Purpose

Garantir que cada item da navegacao autenticada tenha destino claro, seguro,
acessivel e coerente com os modulos existentes.

## Required Fields

- Identificador estavel
- Label visivel
- Destino privado existente
- Relacao com rotas filhas ou dinamicas
- Estado de disponibilidade
- Nome acessivel quando necessario
- Icone opcional com funcao clara

## Rules

- O destino deve existir em `PRIVATE_ROUTES` ou ser explicitamente documentado
  como indisponivel/oculto.
- O item deve ter texto visivel; icone sozinho nao e suficiente.
- O item nao deve exibir contagens, valores, status de parceiro ou dados
  privados.
- Itens inexistentes, como Configuracoes no estado atual, devem ser ocultados
  ou registrados como fora de escopo.
- Itens de acao, como registrar transacao, devem ser diferenciados de destinos
  principais se forem mantidos na navegacao.

## Pass Criteria

- Todos os itens principais disponiveis levam ao destino esperado.
- Nenhum item cria pagina nova implicitamente.
- Nenhum item revela dados financeiros ou permissao interna.
- Labels permanecem compreensiveis em desktop e mobile.
