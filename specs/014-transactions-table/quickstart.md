# Quickstart: F14 - Tabela de transacoes com TanStack Table

## 1. Preparacao

Confirme que esta na branch da feature:

```bash
git status --short --branch
```

Instale a dependencia exigida pela F14 se ela ainda nao estiver em
`package.json`:

```bash
npm install @tanstack/react-table
```

## 2. Comandos de validacao

Execute antes de abrir PR:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## 3. Roteiro funcional

### Lista populada

1. Acesse a rota privada de transacoes.
2. Confirme que transacoes autorizadas aparecem em estrutura tabular ou
   compacta responsiva.
3. Verifique titulo, valor, tipo, categoria, data, responsavel, visibilidade e
   acoes.
4. Confirme que transacoes individuais e compartilhadas continuam
   diferenciadas.

### Filtros

1. Filtre por mes.
2. Filtre por categoria.
3. Filtre por responsavel.
4. Filtre por tipo.
5. Pesquise por texto.
6. Combine filtros e confirme que os resultados permanecem coerentes.
7. Use "Limpar filtros" em estado sem resultados e confirme que o mes permanece
   preservado.

### Ordenacao

1. Ordene por data.
2. Inverta a direcao da data.
3. Ordene por valor.
4. Inverta a direcao do valor.
5. Confirme que filtros ativos continuam aplicados.
6. Confirme que a ordenacao ativa e perceptivel visualmente e por semantica.

### Carregar mais

1. Use um conjunto com mais de 50 transacoes autorizadas ou mock equivalente.
2. Clique em "Carregar mais".
3. Confirme que os itens anteriores continuam visiveis.
4. Confirme que novas linhas entram sem duplicacao.
5. Confirme que a ordenacao local permanece previsivel sobre o conjunto
   carregado.

## 4. Estados da lista

Verifique:

- `loading`: loading claro antes de resultados.
- `loading_more`: itens anteriores preservados e progresso anunciado.
- `error`: erro seguro com acao de tentar novamente.
- `empty_month`: mes sem transacoes autorizadas.
- `no_matches`: filtros sem resultado e acao para limpar filtros.
- `ready`: lista populada com campos essenciais.

## 5. Permissoes, privacidade e auditoria

1. Teste usuario com transacoes individuais e compartilhadas.
2. Confirme que dados fora do escopo autorizado nao aparecem.
3. Confirme que acoes de editar/excluir respeitam permissoes atuais.
4. Confirme que mensagens nao revelam existencia de transacoes inacessiveis.
5. Quando edicao/exclusao forem acionadas, confirme que fluxos de validacao e
   auditoria existentes nao regrediram.

## 6. Responsividade

### Desktop

- Tabela deve exibir cabecalhos claros.
- Valores e datas devem estar alinhados para leitura.
- Acoes devem ser faceis de encontrar sem competir com dados financeiros.

### Tablet

- A tabela deve permanecer legivel ou reduzir densidade sem ocultar dados
  essenciais.
- Filtros e sort devem continuar acessiveis.

### Mobile

- Nao deve haver rolagem horizontal obrigatoria no fluxo principal.
- Apresentacao compacta deve manter titulo, valor, tipo, categoria, data,
  responsavel, visibilidade e acoes.
- Conteudo longo deve quebrar, truncar com criterio ou reorganizar sem
  sobreposicao.
- A tabela/lista deve coexistir com a navegacao compacta da F13.

## 7. Acessibilidade

Validacao manual:

1. Navegue somente por teclado pelos filtros.
2. Navegue pelos cabecalhos ordenaveis.
3. Acione sort por teclado.
4. Navegue pelas acoes de cada transacao.
5. Acione "Carregar mais".
6. Confirme foco visivel em todos os controles.
7. Confirme nomes acessiveis especificos para acoes.
8. Confirme que sort, erro, vazio e sem resultados nao dependem apenas de cor
   ou icone.

Validacao automatizada esperada:

- `getByRole`/`getByLabelText` encontram filtros, sort e acoes.
- Testes verificam estado de sort ativo.
- Testes verificam campos essenciais no modo responsivo quando possivel.

## 8. Fora de escopo para esta validacao

- Criar novo cadastro de transacoes.
- Alterar schema, migrations, RPC, RLS ou Prisma.
- Introduzir TanStack Query ou mudar refetch global.
- Criar graficos, dashboard novo, importacao bancaria ou nova navegacao.
- Criar suite E2E pesada sem justificativa.
