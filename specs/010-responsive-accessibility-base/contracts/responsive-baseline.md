# Contract: Responsive Baseline

## Purpose

Garantir que fluxos essenciais do MVP funcionem em telas pequenas, tablet e
desktop sem rolagem horizontal obrigatoria ou perda de controles principais.

## Applies To

- Paginas publicas de autenticacao e recuperacao.
- Layout privado e navegacao.
- Convite/vinculo, categorias, transacoes, dashboard, graficos, metas e
  auditoria.
- Componentes compartilhados de UI, feedback e layout.

## Rules

- Usar abordagem mobile-first.
- Conteudo principal deve caber em largura estreita sem rolagem horizontal
  obrigatoria.
- Elementos em linha devem poder empilhar quando necessario.
- Containers com texto, valores ou nomes longos devem usar constraints que
  permitam quebra, como `min-w-0`, `max-w-*`, `break-words` ou equivalente.
- Acoes principais devem permanecer alcancaveis com teclado virtual aberto
  quando aplicavel.
- Alvos de toque devem ser confortaveis e nao depender de precisao excessiva.
- Layout tablet e desktop deve preservar hierarquia sem esconder informacao
  essencial.

## Validation

- Revisao manual em mobile, tablet e desktop.
- Casos com nomes longos, valores monetarios extensos, datas longas, texto
  ampliado e listas com muitos itens.
- Testes de componentes para presenca de conteudo, controles e estados
  essenciais quando viavel.
