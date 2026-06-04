# Research: F06 - Lista e filtros de transacoes

## Decision: Usar RPC de leitura dedicada com `security invoker`

**Rationale**: A consulta precisa produzir itens, opcoes historicas autorizadas,
estado seguro do mes e cursor sob o mesmo conjunto de regras. A RPC publica
`list_financial_transactions` valida parametros e delega a consulta a SQL
`security invoker`, portanto toda leitura de `financial_transactions` continua
sujeita a RLS da F05. A resposta coordenada reduz discrepancias entre chamadas
e impede que o cliente construa facetas ou estados a partir de dados amplos.

**Alternatives considered**: Consultas diretas encadeadas pela Data API foram
rejeitadas porque espalham normalizacao, paginacao e derivacao de opcoes no
cliente. RPC `security definer` foi rejeitada porque ampliaria a superficie
privilegiada sem necessidade.

## Decision: Retornar um documento coordenado sem contagens

**Rationale**: A RPC retorna `items`, `next_cursor`, `has_more`,
`has_authorized_month_data`, `category_options` e `responsible_options`.
`has_authorized_month_data` usa apenas `exists` sobre o mes autorizado antes dos
filtros adicionais. Assim, a interface distingue mes vazio de filtros sem
correspondencia sem retornar quantidade nem inferir linhas bloqueadas.

**Alternatives considered**: Consultas separadas foram rejeitadas por poderem
observar snapshots diferentes. Retornar contagens foi rejeitado por estar fora
de escopo e criar uma superficie adicional de inferencia.

## Decision: Opcoes derivam do mes autorizado, nao dos filtros adicionais

**Rationale**: Categorias e responsaveis sao valores distintos presentes nas
transacoes autorizadas do mes selecionado antes dos filtros adicionais. Isso
mantem opcoes estaveis enquanto a pessoa combina criterios e preserva contexto
historico, inclusive categoria inativa ou responsavel que perdeu elegibilidade
para novos registros. As opcoes nao possuem contagens.

**Alternatives considered**: Usar somente categorias ativas e memberships
atuais foi rejeitado porque apagaria contexto historico. Recalcular opcoes apos
cada filtro foi rejeitado por instabilidade e por transformar ausencia de
opcao em faceta implicita.

## Decision: Busca textual normalizada no banco com funcao imutavel limitada

**Rationale**: A migration cria `private.normalize_transaction_search(text)`,
uma funcao SQL `immutable`, com `btrim`, `lower`, `translate` para caracteres
acentuados do portugues e colapso de espacos. Como a RPC usa
`security invoker`, `authenticated` recebe `usage` no schema privado e
`execute` somente nessa funcao pura, que permanece fora dos schemas expostos
pela Data API. A RPC limita a entrada normalizada a 100 caracteres e usa
correspondencia literal `LIKE` com escape de `%`, `_` e `\` sobre titulo e
observacao autorizados. Para o limite de 1.000 linhas por mes, a busca ocorre
depois do periodo e RLS sem exigir extensao ou indice textual nesta feature.

**Alternatives considered**: `unaccent` foi rejeitado porque adiciona extensao
e sua volatilidade dificulta indice de expressao seguro. Full-text search e
`pg_trgm` foram rejeitados por exceder a busca literal simples do MVP.

## Decision: Mes civil usa intervalo inclusivo/exclusivo

**Rationale**: O frontend representa o mes como `YYYY-MM` e deriva
`month_start` e `next_month_start` como strings `YYYY-MM-DD`. A RPC filtra
`transaction_date >= month_start` e `transaction_date < next_month_start`.
Nenhum `Date` com timezone participa do contrato financeiro.

**Alternatives considered**: Filtrar por `extract(month)` foi rejeitado por
prejudicar uso de indice e exigir ano separado. Timestamps foram rejeitados
porque a data da transacao e civil.

## Decision: Paginar por cursor composto e paginas de 50

**Rationale**: A ordem canonica e
`transaction_date desc, created_at desc, id desc`. O cursor carrega os tres
valores do ultimo item e a pagina seguinte usa comparacao lexicografica
equivalente. A RPC busca 51 linhas, retorna no maximo 50 e usa a linha extra
somente para definir `has_more`, sem expor contagem.

**Alternatives considered**: Offset foi rejeitado porque insercoes podem causar
duplicacao ou salto entre paginas e offsets altos desperdicam trabalho.
Carregar 1.000 itens de uma vez foi rejeitado por custo de rede, renderizacao e
acessibilidade.

## Decision: Filtros canonicos ficam na URL; cursor e paginas ficam locais

**Rationale**: `month`, `category`, `responsible`, `type` e `q` usam query
string para permitir voltar, avancar e compartilhar o estado de consulta sem
dados financeiros do resultado. Valores invalidos sao removidos ou substituidos
por defaults seguros. Cursor, itens carregados e estados remotos permanecem no
hook e reiniciam quando filtros canonicos mudam.

**Alternatives considered**: Estado inteiramente local foi rejeitado por perder
navegacao historica. Persistir resultados ou cursor na URL foi rejeitado por
fragilidade e exposicao desnecessaria.

## Decision: Usar servico e hook locais sem TanStack Query

**Rationale**: Uma rota, uma RPC e filtros na URL nao justificam nova
dependencia. `useTransactionList` usa identificador monotono de requisicao e
`AbortController` quando suportado; somente a requisicao atual pode substituir
estado. Troca de sessao ou filtros limpa itens imediatamente e inicia consulta
nova sem cache compartilhado.

**Alternatives considered**: TanStack Query foi rejeitado porque nao esta
instalado e exigiria politica de cache, chaves por sessao e invalidacao por
revogacao para uma superficie pequena.

## Decision: Revalidar acesso em toda RPC e limpar antes de refetch

**Rationale**: A RLS avalia membership ativa em cada consulta. Alterar mes,
filtro, retry ou carregar mais chama novamente a RPC. Mudanca de sessao ou
relacionamento conhecida pelo frontend limpa resultados antes da nova leitura.
Se o vinculo foi revogado, a proxima resposta omite compartilhadas e as opcoes
derivadas delas sem explicar qual recurso deixou de existir.

**Alternatives considered**: Manter resultados anteriores durante revalidacao
foi rejeitado porque poderia preservar informacao compartilhada revogada.
Realtime foi rejeitado por nao ser necessario para o escopo.

## Decision: Resolver labels historicos na resposta autorizada

**Rationale**: A RPC associa `category_code` ao catalogo canonico, inclusive
categorias inativas, e rotula responsaveis/criadores como `Voce` ou
`Pessoa parceira` somente depois de a transacao passar pela RLS. IDs continuam
no contrato interno para filtros, mas nunca aparecem como texto da interface.

**Alternatives considered**: Consultar categorias ativas separadamente foi
rejeitado porque pode perder nome historico. Exibir e-mail ou criar perfil foi
rejeitado por privacidade e escopo.

## Decision: Adicionar indices compostos pelos filtros reais, sem indice textual

**Rationale**: A migration adiciona indices parciais de leitura por
`created_by_user_id` e `shared_budget_id`, ambos com
`transaction_date desc, created_at desc, id desc`, para sustentar RLS, periodo,
ordem e cursor. Indices menores para categoria, responsavel ou tipo nao sao
adicionados antes de medicao; com no maximo 1.000 linhas autorizadas no mes, os
filtros restantes sao baratos apos reduzir por escopo e periodo.

**Alternatives considered**: Indexar toda combinacao foi rejeitado por custo de
escrita e redundancia. Indice de busca foi rejeitado porque a busca mensal
limitada nao demonstra necessidade.

## Decision: Renderizacao paginada sem virtualizacao

**Rationale**: A lista renderiza paginas de 50 e oferece `Carregar mais`.
Elementos semanticos permanecem no DOM, preservando leitura, foco e navegacao.
Memoizacao fica restrita a funcoes puras ou componentes com custo medido.

**Alternatives considered**: Virtualizacao foi rejeitada porque adiciona
complexidade de foco e leitor de tela sem necessidade no volume atual. Scroll
infinito automatico foi rejeitado por dificultar controle e contexto.

## Decision: Grants minimos e falhas seguras

**Rationale**: `authenticated` mantem `SELECT` na tabela sob RLS, recebe
`EXECUTE` na RPC publica e somente os grants minimos para a funcao pura privada
de normalizacao usada pelo `security invoker`. A RPC valida datas, filtros,
limite e cursor, usa SQL estatico e retorna falha generica para parametros
invalidos ou indisponibilidade. Nenhuma funcao privilegiada, `service_role`,
SQL dinamico ou erro cru e necessario.

**Alternatives considered**: Montar SQL dinamico foi rejeitado por risco e
complexidade. Expor motivos detalhados de ausencia foi rejeitado por inferencia.
