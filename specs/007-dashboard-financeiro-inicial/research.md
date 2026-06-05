# Research: F07 - Dashboard financeiro inicial

## Decision: Usar RPC de dashboard dedicada com `security invoker`

**Rationale**: O dashboard precisa retornar totais autorizados e transacoes
recentes sob o mesmo periodo, mesma sessao e mesmas regras de RLS. A RPC
`public.get_financial_dashboard` valida mes e limite, executa SQL estatico como
`security invoker` e deixa a RLS de `public.financial_transactions` aplicar
autorizacao antes de qualquer soma ou item retornado. Isso reduz discrepancias
entre chamadas e evita que o cliente calcule indicadores a partir de um conjunto
amplo.

**Alternatives considered**: Consultas diretas separadas via Data API foram
rejeitadas por espalhar agregacao, labels e estados entre chamadas sujeitas a
snapshots diferentes. RPC `security definer` foi rejeitada porque ampliaria
privilegios sem necessidade.

## Decision: Retornar indicadores e transacoes recentes em uma operacao coordenada

**Rationale**: A resposta contem `period`, `indicators`,
`recent_transactions` e `generated_at`, com `has_authorized_month_data` dentro
de `indicators`. Os indicadores e os itens recentes derivam da mesma CTE
autorizada. `has_authorized_month_data` usa `exists` sobre o mes autorizado e
nao retorna quantidade. Assim, a interface distingue mes vazio de falha
recuperavel sem expor contagens ou facetas.

**Alternatives considered**: Duas RPCs foram rejeitadas porque totais e lista
curta poderiam divergir durante mudancas de acesso. Retornar contagens foi
rejeitado por estar fora do escopo e por ampliar superficie de inferencia.

## Decision: Mes civil usa contrato `YYYY-MM` e intervalo inclusivo/exclusivo

**Rationale**: O frontend reutiliza `transaction-month` da F06 para representar
mes como `YYYY-MM`, `startDate` e `nextStartDate`. A RPC filtra
`transaction_date >= month_start` e `transaction_date < next_month_start`.
Nenhum `Date` local ou timestamp participa do contrato financeiro.

**Alternatives considered**: Filtrar por `extract(month)` foi rejeitado por
prejudicar indices e exigir ano separado. Timestamps locais foram rejeitados por
risco de deslocar datas civis.

## Decision: Manter mes selecionado na URL e dados remotos no hook

**Rationale**: A rota `/app` usa query string `month=YYYY-MM` para permitir
voltar, avancar e compartilhar somente o periodo, que nao contem resultado
financeiro. Valores invalidos sao normalizados para o mes atual. Indicadores,
itens recentes, estados e identificador de requisicao ficam em `useDashboard`.

**Alternatives considered**: Estado totalmente local foi rejeitado por piorar
navegacao. Persistir totais ou itens na URL foi rejeitado por privacidade e
fragilidade.

## Decision: Calcular receitas, despesas, saldo e resultado com inteiros em centavos

**Rationale**: `amount_cents` ja representa valores positivos. A RPC soma
receitas e despesas separadamente com `coalesce(sum(...), 0)`, calcula
`balance_cents = income_cents - expense_cents` e classifica o resultado como
`positive`, `negative` ou `zero`. O frontend formata com helpers de
`transaction-money` e usa texto para comunicar economia, deficit ou equilibrio.

**Alternatives considered**: Calcular saldo no frontend foi rejeitado porque
duplicaria regra financeira e dependeria de dados amplos. Criar regra separada
para "economia" foi rejeitado porque introduziria metas ou contabilidade fora
do escopo; nesta feature, economia/deficit e a leitura do saldo mensal.

## Decision: Limitar transacoes recentes a 5 itens

**Rationale**: Cinco itens explicam o resumo sem transformar o dashboard em
lista completa. O limite e suficiente para contexto rapido em mobile, mantem a
rota leve e deixa a exploracao detalhada para `/app/transactions`.

**Alternatives considered**: Dez ou mais itens foram rejeitados por ocupar a
tela inicial e competir com a F06. Paginacao foi rejeitada por estar fora de
escopo e por descaracterizar o dashboard.

## Decision: Ordenar recentes por `transaction_date`, `created_at` e `id`

**Rationale**: O dashboard reutiliza a ordem canonica da F06:
`transaction_date desc, created_at desc, id desc`. Isso torna a lista curta
deterministica e consistente com a lista completa.

**Alternatives considered**: Ordenar somente por data foi rejeitado porque
transacoes do mesmo dia poderiam alternar. Ordenar por valor foi rejeitado por
confundir "recentes" com analise financeira.

## Decision: Reutilizar labels historicos autorizados

**Rationale**: A RPC associa categorias ao catalogo padrao, inclusive inativas,
e deriva responsavel/criador como `Voce` ou `Pessoa parceira` somente depois da
transacao passar pela RLS. Isso preserva contexto historico sem criar perfis,
nomes customizados ou diretorio de pessoas.

**Alternatives considered**: Usar apenas categorias ativas foi rejeitado porque
apagaria historico. Exibir e-mail, nome de perfil ou ID foi rejeitado por
privacidade e escopo.

## Decision: Usar hook/controller local sem TanStack Query

**Rationale**: Uma rota, uma RPC e um parametro de mes nao justificam nova
dependencia. `useDashboard` usa identificador monotono e `AbortController`
quando suportado; somente a requisicao atual pode atualizar indicadores,
recentes e estado. Mudanca de sessao ou contexto de relacionamento limpa dados
antes da proxima leitura.

**Alternatives considered**: TanStack Query foi rejeitado porque nao esta
instalado e exigiria politica de cache por sessao, invalidaçao por revogacao e
limpeza em logout para uma superficie pequena.

## Decision: Revalidar acesso em toda consulta e limpar dados antes de refetch sensivel

**Rationale**: RLS avalia membership ativa em cada RPC. Trocar mes, retry,
sessao ou relacionamento chama novamente a RPC. Se o vinculo compartilhado for
revogado, a proxima resposta omite compartilhadas de indicadores e recentes;
quando o frontend percebe troca de sessao/relacionamento, descarta dados
anteriores antes de buscar.

**Alternatives considered**: Manter dados antigos enquanto revalida foi
rejeitado porque poderia preservar informacao compartilhada revogada. Realtime
foi rejeitado por nao ser necessario para o escopo.

## Decision: Adicionar indice somente se a F06 nao cobrir agregacao mensal

**Rationale**: Os indices da F06 por `created_by_user_id` e `shared_budget_id`
com `transaction_date desc, created_at desc, id desc` sustentam periodo, escopo
e recentes. O plano permite adicionar indices parciais complementares por
`transaction_type` apenas se a analise da migration mostrar lacuna real para
agregacoes mensais. Evitar redundancia preserva custo de escrita.

**Alternatives considered**: Criar indices para toda combinacao de tipo,
responsavel e categoria foi rejeitado por redundancia. Criar snapshot mensal
foi rejeitado por complexidade, consistencia e risco de autorizacao.

## Decision: Grants minimos e falhas seguras

**Rationale**: `authenticated` recebe `EXECUTE` na RPC publica e mantem leitura
da tabela sob RLS. A funcao valida datas e limite, usa `search_path` fixo, SQL
estatico e retorna documento seguro. O servico frontend converte falhas para
mensagens neutras, sem SQL, IDs, existencia de recursos ou detalhes de RLS.

**Alternatives considered**: SQL dinamico foi rejeitado por risco. Mensagens
detalhadas de autorizacao foram rejeitadas por inferencia.

## Decision: Renderizacao simples sem graficos, memoizacao pesada ou virtualizacao

**Rationale**: O frontend renderiza quatro indicadores e ate cinco itens; o
trabalho caro fica no banco. Componentes pequenos e funcoes puras bastam para
clareza e teste. Acessibilidade e leitura financeira importam mais que
otimizacoes prematuras.

**Alternatives considered**: Recharts, virtualizacao e memoizacao ampla foram
rejeitados porque a F07 nao entrega graficos nem listas longas.
