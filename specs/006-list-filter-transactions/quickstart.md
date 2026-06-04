# Quickstart: F06 - Lista e filtros de transacoes

## Prerequisites

- Node.js compativel com o projeto e dependencias instaladas.
- F01-F05 implementadas e validadas.
- Projeto Supabase com Authentication configurado.
- Supabase CLI e Docker disponiveis para validacao local.

## Environment

Manter `.env.local` baseado em `.env.example`. Usar somente publishable/anon
key no frontend; nunca expor `service_role`, secret key ou connection string.

## Planned Implementation

1. Criar migration `list_filter_financial_transactions`.
2. Criar normalizacao textual privada, indices compostos e RPC de leitura
   `security invoker`.
3. Evoluir `src/features/transactions` com mes, filtros, consulta, servico,
   hook, controles, itens, lista, mensagens e testes.
4. Criar rota autenticada `/app/transactions` e entrada discreta na area
   privada.
5. Reutilizar moeda, tipos, visibilidade, categorias e labels seguros.
6. Adicionar testes unitarios, integracao frontend e contratos de migration.

## Development

```bash
npm run dev
```

Fluxos manuais:

1. Abrir a lista e confirmar o mes civil atual.
2. Navegar para outro mes e retornar usando voltar/avancar do navegador.
3. Combinar categoria, responsavel, tipo e texto; remover filtros individuais.
4. Limpar todos os filtros adicionais e preservar o mes.
5. Distinguir mes vazio de filtros sem correspondencia.
6. Carregar mais de uma pagina e confirmar ordem estavel sem duplicatas.
7. Alterar filtros rapidamente e confirmar que somente o resultado final fica
   visivel.
8. Revogar membership compartilhada e confirmar que a proxima consulta remove
   itens e opcoes compartilhadas.

## Supabase Migration and Validation

Descobrir os comandos disponiveis antes de executar:

```bash
supabase --help
supabase db --help
supabase migration --help
```

Aplicar e revisar localmente:

```bash
supabase db reset
supabase migration list --local
```

Validar migration:

- A RPC publica usa `security invoker`, SQL estatico e `search_path` seguro.
- `anon` nao executa a RPC; `authenticated` possui somente a execucao
  necessaria e `SELECT` sob RLS.
- A funcao de normalizacao e privada, imutavel, possui apenas os grants
  necessarios ao `security invoker` e permanece fora dos schemas expostos pela
  Data API.
- Periodo usa `transaction_date >= inicio` e `< proximo mes`.
- Filtros opcionais usam `AND`.
- Busca ignora caixa, acentuacao e espacos externos; `%`, `_` e `\` sao
  tratados literalmente.
- Entrada de busca acima de 100 caracteres, periodo invalido, limite invalido
  ou cursor parcial falham com seguranca.
- Ordem usa `transaction_date desc, created_at desc, id desc`.
- Cursor nao duplica nem pula linhas do conjunto estavel.
- Pagina retorna no maximo 50 itens no fluxo normal e nunca mais de 100.
- `has_authorized_month_data`, opcoes e itens derivam somente de linhas
  autorizadas.
- Categorias e responsaveis historicos autorizados aparecem sem contagens.
- RLS exclui individual de outra pessoa e shared sem membership ativa.
- Revogacao de membership remove shared da consulta seguinte.

## Technical Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
git diff --check
```

Cobertura automatizada esperada:

- Mes civil atual, anterior, seguinte e virada de ano.
- Parsing e serializacao segura da query string.
- Normalizacao e limites da busca.
- Semantica `AND` dos filtros.
- Limpeza individual e geral sem alterar mes.
- Ordem e cursor deterministas.
- Mapeamento da resposta coordenada e falhas seguras.
- Requisicao antiga nao substitui a mais recente.
- Carregar mais preserva itens e bloqueia duplicacao local.
- Estados loading, ready, empty_month, no_matches e error.
- Item apresenta contexto financeiro sem IDs ou observacao.
- Controles e lista acessiveis.
- Rota privada e ausencia de totais, detalhes ou mutacoes.
- Migration, indices, grants, RPC e RLS.

## Accessibility and Responsive Validation

- Testar mobile, tablet e desktop sem rolagem horizontal.
- Navegar por mes, filtros, busca, limpeza, retry e carregar mais somente por
  teclado.
- Confirmar labels, foco visivel e retorno de foco do painel de filtros.
- Confirmar estados e atualizacoes perceptiveis por leitor de tela quando
  disponivel, sem anuncios excessivos.
- Confirmar que tipo, responsavel e visibilidade nao dependem de cor.
- Testar texto ampliado ate 200%.
- Localizar uma transacao conhecida por mes e filtros em ate 45 segundos.

## Privacy Review

- Resultados, opcoes, estados e `has_authorized_month_data` derivam somente de
  linhas autorizadas.
- Busca nao confirma termo em transacao inacessivel.
- Pessoa parceira nao le nem infere transacao individual.
- Pessoa externa ou membership inativa nao le shared.
- Opcoes nao exibem e-mail, nome inventado, contagem ou pessoa externa.
- Revogacao limpa resultados compartilhados na proxima revalidacao.
- Mensagens nao exibem erros crus, IDs privados ou detalhes de outro espaco.
- Logs nao contem filtros, observacao, valores, resultados, tokens ou IDs.

## Performance Review

- Validar resposta em ate um segundo sob uso normal com 1.000 linhas
  autorizadas no mes.
- Confirmar paginas de 50 e ausencia de carregamento integral.
- Revisar plano de execucao para periodo, RLS, ordem e cursor.
- Confirmar que mudancas rapidas nao acumulam resultados nem requests
  obsoletos visiveis.
- Nao adicionar indice textual, virtualizacao ou cache complexo sem medicao.

## Out of Scope Checks

Confirmar que F06 nao introduz:

- Criacao, edicao, exclusao, detalhe ou observacao completa.
- Contagem, total, saldo, economia, agregacao, dashboard, grafico ou relatorio.
- Exportacao, importacao, recorrencia, parcelas ou anexos.
- Categorias personalizadas, perfis, nomes customizados ou auditoria.
- TanStack Query, React Hook Form, Zod, Recharts ou dependencia adicional sem
  justificativa.

## Implementation Validation - 2026-06-04

- `npm run lint`: passou.
- `npm run format:check`: passou.
- `npm run typecheck`: passou.
- `npm run test:run`: passou com 49 arquivos e 141 testes.
- `npm run build`: passou.
- `git diff --check`: passou.
- Revisao estatica confirmou RPC `security invoker`, grants minimos, cursor
  composto, opcoes autorizadas e ausencia de contagens/agregacoes no frontend.
- `supabase db reset` nao foi concluido porque o Docker Desktop nao estava em
  execucao. Validacao local de migration, plano, matriz RLS, revogacao e
  desempenho com 1.000 linhas permanece pendente.
- Revisao manual em viewport mobile, zoom de 200%, teclado e leitor de tela
  permanece pendente em ambiente interativo.
