# Research: F14 - Tabela de transacoes com TanStack Table

## Decision: adicionar `@tanstack/react-table`

**Rationale**: A especificacao da F14 registra como restricao catalogada o uso
interno de TanStack Table. O `package.json` atual nao inclui
`@tanstack/react-table`, entao a dependencia deve ser adicionada no plano de
implementacao. Ela fornece modelo tipado de colunas, linhas e ordenacao sem
forcar uma biblioteca visual de data grid, preservando a UI do projeto com
TailwindCSS e componentes locais.

**Alternatives considered**:

- Tabela manual com `<table>` e `map`: rejeitada porque nao cumpre a restricao
  catalogada da F14 e tende a espalhar regras de colunas/sort pela UI.
- Biblioteca completa de data grid: rejeitada por excesso de escopo, custo de
  bundle, maior superficie visual e risco de conflito com a limpeza da F12.
- Virtualizacao junto com a tabela: adiada. A lista atual pagina em 50 itens e
  usa "Carregar mais"; virtualizacao so deve entrar se volume real demonstrar
  necessidade em feature futura.

## Decision: preservar service/RPC e ordenar localmente dados carregados

**Rationale**: A F06 ja implementa `list_financial_transactions` com RLS,
filtros, cursor e pagina de 50 itens. A F14 e uma evolucao de apresentacao; nao
ha requisito para alterar a consulta server-side. Ordenacao por data e valor
deve atuar sobre os itens autorizados e carregados, preservando filtros ativos
e evitando nova migration.

**Alternatives considered**:

- Alterar a RPC para aceitar sort remoto: rejeitada por aumentar risco em RLS,
  cursor e equivalencia de filtros sem necessidade atual.
- Carregar todos os resultados para ordenar globalmente: rejeitado por ampliar
  volume, prejudicar performance e possivelmente mudar expectativa de
  paginacao.
- Remover "Carregar mais": rejeitado porque e comportamento existente da F06 e
  protege listas maiores.

## Decision: criar camada pequena de colunas em `src/features/transactions`

**Rationale**: A definicao de colunas precisa mapear dados financeiros para
cabecalhos, celulas, nomes acessiveis, ordenacao e acoes. Manter isso perto de
`transaction-list-types.ts`, `transaction-money.ts` e testes de transacoes
preserva coesao da feature e evita um componente generico prematuro.

**Alternatives considered**:

- Definir colunas dentro de `transaction-list.tsx`: rejeitada porque acopla UI,
  TanStack Table e formatacao em um arquivo unico.
- Criar tabela generica em `src/components/ui`: rejeitada ate haver segundo
  consumidor real.
- Mover tipos de transacao para uma camada global: rejeitada por ampliar
  refatoracao fora do escopo da F14.

## Decision: manter filtros existentes fora do estado da tabela

**Rationale**: Filtros atuais ja vivem em URL via `parseTransactionFilters` e
`serializeTransactionFilters`, e sao aplicados pela consulta autorizada. A
tabela deve receber `state.items` ja filtrados e adicionar apenas ordenacao e
apresentacao. Isso preserva deep links, reloads, botao limpar filtros e
equivalencia funcional.

**Alternatives considered**:

- Migrar filtros para estado interno da tabela: rejeitada porque quebraria URL,
  deep link e testes existentes.
- Duplicar filtros em TanStack Table e URL: rejeitada por risco de divergencia.
- Alterar nomes de parametros de URL: rejeitada por regressao de links
  existentes.

## Decision: responsividade por tabela ampla e apresentacao compacta mobile

**Rationale**: Os campos obrigatorios da F14 nao cabem confortavelmente em
mobile como tabela horizontal. A solucao deve usar tabela semantica em telas
amplas e apresentacao compacta em telas pequenas, mantendo todos os campos
essenciais com rotulos. Isso cumpre a constituicao mobile-first sem exigir
rolagem horizontal obrigatoria.

**Alternatives considered**:

- Tabela horizontal com overflow em mobile: rejeitada por violar o requisito de
  nao exigir rolagem horizontal obrigatoria.
- Esconder colunas em mobile: rejeitada se remover informacao essencial; so
  pode ocorrer quando a informacao permanecer disponivel em outro agrupamento.
- Manter apenas cards atuais: rejeitada porque nao entrega a evolucao tabular
  nem a camada TanStack Table.

## Decision: acessibilidade como contrato explicito da tabela

**Rationale**: Tabelas financeiras precisam de cabecalhos claros, estado de
ordenacao, foco visivel e acoes nomeadas com contexto. O design deve usar
semantica de tabela em desktop/tablet quando possivel e rotulos explicitos na
apresentacao compacta mobile. Acoes como editar/excluir precisam identificar a
transacao no nome acessivel quando houver varias linhas.

**Alternatives considered**:

- Comunicar sort apenas por icone: rejeitada por depender de percepcao visual.
- Botoes de acao icon-only sem label especifico: rejeitada por acessibilidade e
  risco de ambiguidade.
- Usar cards compactos sem rotulos de campo: rejeitada porque leitores de tela
  perderiam relacao entre valor e significado.

## Decision: acoes por permissao continuam derivadas das regras existentes

**Rationale**: A F14 nao deve redefinir quem pode editar ou excluir. Se a
implementacao atual nao expuser todas as acoes ainda, o plano deve integrar a
tabela ao comportamento existente sem ampliar permissao. Quando a acao nao for
permitida, ela deve ser omitida ou ficar indisponivel com feedback seguro,
conforme padrao atual do projeto.

**Alternatives considered**:

- Criar nova regra de permissao client-side: rejeitada por risco de divergencia
  com a camada autorizada.
- Mostrar acoes e deixar o backend negar: rejeitada por experiencia ruim e
  possivel inferencia indevida.
- Adicionar informacoes sensiveis para explicar bloqueio: rejeitada por risco
  de privacidade.

## Decision: sem mudancas em TanStack Query, Prisma, schema ou RLS

**Rationale**: O `package.json` atual nao inclui TanStack Query, e a F15 cobre
configuracao global de refetch. A F16 cobre Prisma. A F14 nao exige alteracao
de persistencia nem server-side; mexer nesses pontos aumentaria risco sem valor
para a tabela.

**Alternatives considered**:

- Introduzir TanStack Query junto com TanStack Table: rejeitada por misturar
  F14 e F15.
- Introduzir Prisma para tipar consultas: rejeitada por pertencer a F16 e
  exigir camada server-side segura.
- Criar migration para sort remoto: rejeitada por escopo e risco
  desnecessario.
