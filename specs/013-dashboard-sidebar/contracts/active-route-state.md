# Contract: Active Route State

## Purpose

Garantir que a navegacao indique corretamente o modulo atual, inclusive em
subrotas.

## Required Behavior

- `/app` ativa o item de Dashboard/Inicio.
- `/app/transactions` ativa Transacoes.
- `/app/transactions/new` deve ativar Transacoes ou um item de acao de registro
  conforme a decisao final do layout.
- `/app/categories` ativa Categorias.
- `/app/goals` ativa Metas.
- `/app/audit` ativa Auditoria se ela permanecer na navegacao privada.
- Rotas de convite dinamico devem continuar acessiveis e nao precisam criar item
  principal se nao houver pagina agregadora de Convites/Parceiro.

## Rules

- A rota ativa deve ser perceptivel visualmente.
- A rota ativa deve ser comunicada por semantica apropriada.
- Subrotas relacionadas nao devem deixar a navegacao sem contexto.
- Rota privada sem item principal deve manter layout funcional sem estado ativo
  enganoso.

## Pass Criteria

- Testes cobrem rota principal e ao menos uma subrota.
- Pessoas conseguem identificar o modulo atual em ate 3 segundos.
- Leitores de tela conseguem perceber qual item corresponde a pagina atual.
