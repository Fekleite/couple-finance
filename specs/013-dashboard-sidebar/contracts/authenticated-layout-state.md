# Contract: Authenticated Layout State

## Purpose

Preservar seguranca, sessao e mensagens do layout autenticado durante a mudanca
para sidebar.

## Covered States

- Sessao carregando
- Usuario autenticado
- Usuario nao autenticado
- Logout em progresso
- Mensagem de sessao
- Modulo indisponivel
- Rota privada sem item ativo

## Rules

- `ProtectedRoute` continua sendo a fronteira de acesso autenticado.
- Sidebar autenticada nao deve aparecer para usuario nao autenticado.
- Logout em progresso deve manter feedback e impedir acao duplicada.
- Mensagens de sessao devem ser seguras e nao revelar dados financeiros.
- Layout deve preservar `Outlet` e conteudo da pagina atual.
- Modulo indisponivel nao deve sugerir dados privados.

## Pass Criteria

- Testes existentes de logout continuam passando.
- Testes cobrem que usuario nao autenticado nao recebe layout privado.
- Mensagens de sessao continuam visiveis quando existirem.
- Navegar entre modulos nao causa perda de sessao.
