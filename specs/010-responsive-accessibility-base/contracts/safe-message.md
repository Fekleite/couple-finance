# Contract: Safe Message

## Purpose

Garantir que mensagens de interface orientem a pessoa sem revelar dados
financeiros inacessiveis ou detalhes internos.

## Rules

- Usar portugues brasileiro claro, neutro, colaborativo e nao julgador.
- Nao usar linguagem de culpa, vigilancia, ranking ou competicao entre membros.
- Nao revelar existencia, quantidade, dono, valor, categoria, meta, transacao,
  evento ou status de dados inacessiveis.
- Nao expor SQL, RLS, stack trace, token, politica interna ou infraestrutura.
- Quando houver proxima acao clara, apresentar acao segura, como tentar
  novamente, voltar ou corrigir campo.
- Estados vazios devem explicar ausencia de dados disponiveis/autorizados sem
  insinuar que ha dados ocultos.
- Mensagens de permissao devem ser indistinguiveis entre recurso inexistente,
  removido e nao autorizado quando necessario para privacidade.

## Validation

- Revisao por feature de mensagens em `auth`, `couple`, `permissions`,
  `categories`, `transactions`, `dashboard`, `goals` e `audit`.
- Testes de mensagens sensiveis quando houver branching de estado.
- Revisao manual dos cenarios de erro, vazio, permissao e sessao expirada.
