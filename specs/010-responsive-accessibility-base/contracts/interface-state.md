# Contract: Interface State

## Purpose

Padronizar estados de carregamento, salvamento, sucesso, vazio, erro,
permissao indisponivel, ausencia de vinculo compartilhado, sessao expirada e
retry.

## State Types

| State | Required Content |
|-------|------------------|
| `loading` | Texto ou estrutura indicando carregamento |
| `saving` | Feedback de envio/salvamento e bloqueio seguro de duplicidade |
| `success` | Confirmacao objetiva do resultado |
| `empty` | Explicacao segura da ausencia de dados autorizados |
| `recoverable_error` | Problema compreensivel e acao de recuperacao quando houver |
| `permission_unavailable` | Mensagem segura sem detalhes internos |
| `no_shared_relationship` | Orientacao para uso individual ou vinculo, sem inferencia |
| `session_expired` | Orientacao para entrar novamente |
| `retrying` | Feedback de tentativa em andamento |

## Rules

- Todo estado deve ter texto perceptivel.
- Estados com erro recuperavel devem oferecer retry quando apropriado.
- Formularios devem preservar dados digitados apos erro quando seguro.
- Estados vazios nao devem sugerir dados inacessiveis.
- Estados de permissao nao devem diferenciar inexistente, removido e nao
  autorizado quando isso vazar informacao.
- Anuncios para tecnologias assistivas devem ser usados com criterio para
  evitar ruido.

## Validation

- Testes de renderizacao de cada estado relevante.
- Testes de retry quando houver acao.
- Revisao de privacidade das mensagens.
