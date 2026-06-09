# Inventario de limpeza visual - F12

## Validacao inicial

- [x] T001 Baseline executado em 2026-06-09: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:run` e `npm run build` passaram antes das alteracoes. O build manteve apenas o aviso existente de chunk acima de 500 kB.
- [x] T018 Nenhuma tarefa da F12 exige mudanca de schema, Supabase RLS, Prisma, services, repositories, queries ou regras de autorizacao. Qualquer necessidade desse tipo deve ser tratada como fora de escopo.

## Criterios de decisao

Classificacao usada por tela: manter, remover, consolidar, reordenar, reescrever ou adiar.

Informacoes nunca removidas: valores, datas, categorias, tipo, responsavel, visibilidade, status, progresso, acoes disponiveis, contexto individual/compartilhado, permissao, auditoria e mensagens seguras de estado.

## Dashboard

- [x] T008 Revisao concluida.
- Titulo, periodo, controles de mes, totais de receitas, despesas, saldo, significado do resultado, graficos autorizados e transacoes recentes: manter.
- Card separado de "Economia do mes": consolidar no card de saldo por duplicar o mesmo valor.
- Descricoes longas de cabecalho e graficos: reescrever/remover quando repetirem contexto ja exposto por titulo, periodo e labels.
- Lista de recentes: reordenar para leitura compacta preservando tipo, data, categoria, responsavel, visibilidade e criador quando diferente.
- [x] T029 Decisao registrada: dashboard deve ficar com tres indicadores principais e o resultado textual acoplado ao saldo.

## Transacoes

- [x] T009 Revisao concluida.
- Titulo, valor, tipo, categoria, data, responsavel, visibilidade, criador quando diferente, filtros, limpar filtros e paginacao: manter.
- Labels de metadados repetidos em linhas longas: consolidar em grupos compactos.
- Texto de busca extenso e container de filtros com peso visual alto: reescrever/reduzir.
- [x] T039 Decisao registrada: lista deve preservar contexto financeiro completo sem depender de badges, cor ou icones.

## Metas

- [x] T010 Revisao concluida.
- Nome, visibilidade, status, progresso, valor atual, valor alvo, prazo e acoes: manter.
- Percentual duplicado no topo e no resumo: consolidar em um resumo textual e uma barra acessivel.
- Alertas de meta compartilhada e ajuda de formulario repetidos: manter apenas onde orientam acao segura.
- [x] T047 Decisao registrada: card de meta deve expor progresso uma vez em texto visivel e uma vez como `progressbar` acessivel.

## Categorias

- [x] T011 Revisao concluida.
- Nome, descricao operacional da categoria e codigo estavel: manter por manutencao e rastreabilidade.
- Textos de loading/empty/error: reescrever para serem objetivos, sem promessa de dados financeiros.
- Explicacoes decorativas ou totais financeiros: nao existem e nao devem ser adicionados.

## Convites e parceiro

- [x] T012 Revisao concluida.
- Status do convite/vinculo, pessoa convidada ou convidante, nome do espaco, expiracao, acoes e mensagens seguras: manter.
- Textos que dizem "proximas features" ou explicam demais o fluxo: reescrever para contexto atual.
- Sinais de permissao/indisponibilidade: manter, sem revelar existencia de dados inacessiveis.

## Configuracoes

- [x] T013 Revisao concluida.
- Nao ha tela dedicada de configuracoes nesta versao. A informacao de conta/sessao aparece no layout autenticado e o logout deve ser preservado.
- Candidato adiado: criar configuracoes reais esta fora do escopo da F12.

## Candidatos adiados

- [x] T069 Reconciliacao: nao remover `VisibilityLabel` dos cards de convite/parceiro enquanto ele for o sinal mais claro de escopo/permissionamento.
- Manter graficos do dashboard nesta feature; remocao ou troca de visualizacao exige decisao de produto e cobertura especifica futura.

## Validacao final

- [x] T071 `npm run lint` passou em 2026-06-09.
- [x] T072 `npm run format:check` passou em 2026-06-09.
- [x] T073 `npm run typecheck` passou em 2026-06-09.
- [x] T074 `npm run test:run` passou em 2026-06-09 com 96 arquivos e 239 testes.
- [x] T075 `npm run build` passou em 2026-06-09. O aviso de chunk acima de 500 kB permanece conhecido e nao foi introduzido pela F12.
