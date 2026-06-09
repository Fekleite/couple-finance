# Quickstart: F12 - Limpeza visual e remocao de informacoes desnecessarias

## 1. Preparar contexto

Leia:

- `specs/012-visual-cleanup/spec.md`
- `specs/012-visual-cleanup/plan.md`
- `specs/012-visual-cleanup/research.md`
- `specs/012-visual-cleanup/contracts/`
- `specs/010-responsive-accessibility-base/quickstart.md`

## 2. Rodar checks iniciais

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## 3. Inventariar telas

Para cada tela em escopo, registre elementos como manter, remover, consolidar,
reordenar, reescrever ou adiar:

- Dashboard
- Transacoes
- Metas
- Categorias
- Convites/parceiro
- Configuracoes, se existir no estado atual da aplicacao

Use os contratos:

- `contracts/visual-cleanup-audit.md`
- `contracts/essential-financial-information.md`
- `contracts/deferred-cleanup-candidate.md`

## 4. Implementar por fatias pequenas

Prioridade recomendada:

1. Componentes compartilhados de feedback e UI, quando houver repeticao real.
2. Dashboard.
3. Transacoes.
4. Metas.
5. Categorias.
6. Convites/parceiro e configuracoes.

Cada fatia deve preservar informacao essencial e ter teste quando alterar
renderizacao condicional, mensagem, permissao, acessibilidade ou acao.

## 5. Validar estados

Para telas alteradas, valide:

- Loading
- Empty
- Error
- Success
- Permission unavailable
- No shared relationship
- Session-related states

Use `contracts/safe-interface-state.md`.

## 6. Validar responsividade e acessibilidade

Para cada tela alterada:

- conferir mobile, tablet e desktop;
- percorrer a tela por teclado;
- verificar foco visivel;
- verificar headings, labels e nomes acessiveis;
- testar nomes longos, valores altos, categorias extensas e mensagens longas;
- confirmar que cor, icone ou badge nao sao o unico meio de comunicar contexto.

Use `contracts/responsive-accessible-review.md`.

## 7. Rodar checks finais

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## 8. Definicao de pronto

A F12 esta pronta quando:

- 100% das telas em escopo possuem inventario.
- Remocoes e consolidacoes possuem justificativa.
- Informacoes essenciais continuam visiveis e compreensiveis.
- Estados continuam claros, acionaveis quando possivel e seguros.
- Mobile, tablet, desktop, teclado e foco foram validados.
- Testes cobrem alteracoes de renderizacao com risco.
- Todos os checks finais passam.

## 9. Notas da implementacao

- [x] T070 A implementacao removeu icones decorativos dos estados compartilhados, consolidou o indicador duplicado do dashboard, compactou metadados de transacoes e metas, e reescreveu mensagens de categorias, convites/parceiro e auditoria.
- Dashboard: resultado financeiro ficou no card de saldo; o card separado de "Economia do mes" foi removido.
- Transacoes: tipo, categoria, data, responsavel, visibilidade e criador continuam visiveis em leitura compacta.
- Metas: o progresso duplicado foi reduzido para resumo textual e barra `progressbar` acessivel.
- Estados: loading, empty e error preservam roles, `aria-live`, acoes e mensagens seguras sem icones decorativos.
- Validacao final em 2026-06-09: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run` e `npm run build` passaram. A suite teve 96 arquivos e 239 testes. O build manteve o aviso conhecido de chunk acima de 500 kB.
