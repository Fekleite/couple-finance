# Data Model: F14 - Tabela de transacoes com TanStack Table

## Transaction Table Row

Representa uma transacao autorizada pronta para apresentacao tabular.

**Source**: `TransactionListItemData` retornado pela consulta existente.

**Fields**:

- `id`: identificador estavel da transacao.
- `title`: titulo exibido e usado para nome acessivel de acoes.
- `amountCents`: valor em centavos, formatado como moeda.
- `transactionType`: `income` ou `expense`, exibido como Receita ou Despesa.
- `transactionDate`: data civil da transacao.
- `createdAt`: data de criacao usada pelo cursor existente.
- `categoryCode`: codigo da categoria.
- `categoryLabel`: nome exibido da categoria.
- `createdByUserId`: pessoa criadora.
- `creatorLabel`: "Voce" ou "Pessoa parceira".
- `responsibleUserId`: pessoa responsavel.
- `responsibleLabel`: "Voce" ou "Pessoa parceira".
- `visibility`: `individual` ou `shared`.

**Validation Rules**:

- A linha so pode representar transacao retornada pela consulta autorizada.
- Campos financeiros essenciais nao podem ser removidos da apresentacao.
- Valores e datas devem usar os formatadores existentes.
- `visibility` deve continuar distinguindo Individual e Compartilhada.

## Transaction Column Definition

Define como cada campo essencial e renderizado, ordenado e anunciado.

**Columns**:

- `title`: titulo da transacao.
- `amount`: valor monetario, alinhado para comparacao.
- `type`: Receita ou Despesa.
- `category`: categoria financeira.
- `date`: data civil formatada.
- `responsible`: responsavel.
- `visibility`: Individual ou Compartilhada, incluindo criador quando relevante.
- `actions`: acoes permitidas para a transacao.

**Validation Rules**:

- Colunas de `date` e `amount` devem suportar ordenacao.
- Cabecalhos ordenaveis devem expor estado ativo.
- Celulas nao devem depender apenas de cor, icone ou posicao.
- `actions` nao deve aparecer como dado financeiro ordenavel.

## Transaction Sort State

Representa a ordenacao ativa da tabela.

**Fields**:

- `column`: `transactionDate`, `amountCents` ou nenhum.
- `direction`: `asc`, `desc` ou nenhum.

**Default State**:

- Preservar expectativa atual de transacoes recentes primeiro, usando data
  decrescente quando a implementacao precisar explicitar estado inicial.

**Transitions**:

- Nenhum sort -> data desc ou coluna escolhida desc.
- Coluna desc -> mesma coluna asc.
- Coluna asc -> nenhum sort ou retorno ao estado padrao, conforme padrao
  adotado e testado.
- Troca de coluna -> nova coluna com direcao padrao documentada.

**Validation Rules**:

- Ordenacao opera apenas sobre itens carregados e autorizados.
- Filtros ativos permanecem aplicados quando sort muda.
- Estado ativo deve ser perceptivel visualmente e por acessibilidade.

## Transaction Filter State

Representa os filtros existentes da F06.

**Fields**:

- `month`
- `categoryCode`
- `responsibleUserId`
- `transactionType`
- `searchText`

**Validation Rules**:

- A F14 nao altera nomes, semantica ou serializacao dos filtros.
- Filtros continuam em URL.
- Limpar filtros adicionais preserva o mes.
- Sort nao deve modificar filtros.

## Transaction List State

Representa o estado user-facing da listagem.

**States**:

- `loading`
- `error`
- `empty_month`
- `no_matches`
- `ready`
- `loading_more`

**Validation Rules**:

- Cada estado existente deve continuar com mensagem clara.
- `no_matches` deve permitir limpar filtros.
- `loading_more` deve manter itens anteriores visiveis e anunciar progresso.
- Erros nao podem expor detalhes internos ou dados privados.

## Transaction Action Availability

Representa quais acoes podem ser apresentadas para uma linha.

**Actions**:

- `edit`: disponivel apenas quando regras existentes permitirem.
- `delete`: disponivel apenas quando regras existentes permitirem.
- `unavailable`: estado omitido ou bloqueado com feedback seguro.

**Validation Rules**:

- A F14 nao cria nova regra de permissao.
- Acoes devem ter nomes acessiveis com contexto da transacao.
- Acoes bloqueadas nao podem revelar detalhes sensiveis.
- Fluxos de auditoria existentes para mudancas financeiras nao podem regredir.

## Responsive Transaction Presentation

Representa a forma visual da listagem por viewport.

**Modes**:

- `table`: telas amplas com cabecalhos e colunas essenciais.
- `compact`: telas pequenas com campos rotulados e acoes acessiveis, sem
  rolagem horizontal obrigatoria.

**Validation Rules**:

- Todos os campos essenciais devem permanecer disponiveis em ambos os modos.
- Conteudo longo deve quebrar, truncar com criterio ou reorganizar sem perda de
  contexto financeiro.
- Filtros, sort e acoes devem permanecer operaveis por teclado.
- O layout deve conviver com a sidebar/drawer da F13 sem sobreposicao incoerente.
