# Research: F08 - Graficos basicos

## Decision: Evoluir `src/features/dashboard` em vez de criar feature separada

**Rationale**: Os graficos da F08 dependem do mes selecionado, dos indicadores
e da leitura privada do dashboard F07. Mantê-los em `src/features/dashboard`
preserva a experiencia como uma tela unica e evita uma navegacao analitica
prematura. A modularidade vem de arquivos dedicados para servico, hook, estado,
componentes de grafico e resumos acessiveis.

**Alternatives considered**: Criar `src/features/charts` foi rejeitado porque
sugeriria uma superficie independente de relatorios. Criar rota `/app/charts`
foi rejeitado porque fragmentaria uma consulta que deve complementar o
dashboard inicial.

## Decision: Usar RPC dedicada `public.get_financial_dashboard_charts`

**Rationale**: A F08 precisa retornar tres agregacoes sob o mesmo periodo,
sessao e conjunto de regras RLS: categorias do mes, evolucao mensal e
comparativo compartilhado. Uma RPC `security invoker` dedicada valida entradas,
usa SQL estatico, fixa `search_path` e deixa a RLS aplicar autorizacao antes de
qualquer soma, percentual, legenda ou estado. Separar a RPC da F07 evita
alargar o contrato do dashboard inicial e permite testar a superficie de
graficos isoladamente.

**Alternatives considered**: Estender `get_financial_dashboard` foi rejeitado
por misturar indicadores iniciais com visualizacoes futuras e aumentar o custo
de uma consulta simples. Consultas diretas separadas foram rejeitadas por risco
de snapshots divergentes e por espalhar regras de inferencia no cliente.

## Decision: Retornar os tres graficos em uma resposta coordenada

**Rationale**: `category_distribution`, `monthly_evolution` e
`member_comparison` devem representar o mesmo contexto de autorizacao. Uma
resposta unica com `period`, `evolution_window`, `generated_at` e estados por
grafico evita inconsistencia quando o usuario troca mes ou quando o vinculo
compartilhado muda durante a consulta.

**Alternatives considered**: Tres RPCs separadas foram rejeitadas porque poderiam
produzir graficos de autorizacoes diferentes. Retornar transacoes brutas para
agregar no frontend foi rejeitado por privacidade, desempenho e manutencao.

## Decision: Mes civil usa contrato `YYYY-MM` e janela de seis meses encerrada no mes selecionado

**Rationale**: A F08 reutiliza `transaction-month` da F06-F07. A consulta recebe
`month_start` e deriva uma janela curta de seis meses, incluindo o mes
selecionado e cinco meses anteriores. Isso facilita leitura de tendencia sem
virar relatorio historico. Todos os filtros usam `transaction_date` com inicio
inclusivo e proximo mes exclusivo, sem timestamps locais.

**Alternatives considered**: Janela de doze meses foi rejeitada por densidade
mobile. Janela com meses futuros foi rejeitada por nao haver previsao de
recorrencia. `extract(month)` foi rejeitado por prejudicar indices.

## Decision: Distribuicao por categoria usa despesas autorizadas e pesos derivados do total autorizado

**Rationale**: O grafico de categoria soma apenas despesas autorizadas do mes
selecionado. Cada item inclui `category_code`, `category_label`,
`expense_cents`, `weight_basis_points` e `rank`. Percentuais usam base inteira
em basis points para evitar erros de ponto flutuante. A ordenacao e por
`expense_cents desc`, `category_label asc`, `category_code asc`, garantindo
empates previsiveis e categorias historicas compreensiveis.

**Alternatives considered**: Incluir receitas foi rejeitado porque a historia
principal e gasto por categoria. Exibir categorias zeradas foi rejeitado por
ruido e por sugerir catalogo completo como dado do periodo.

## Decision: Evolucao mensal calcula receitas, despesas e saldo em centavos

**Rationale**: Cada ponto da serie contem mes, label, `income_cents`,
`expense_cents`, `balance_cents`, `result_meaning` e
`has_authorized_month_data`. Receitas e despesas permanecem positivas na
apresentacao, e o saldo comunica positivo, negativo ou zero por texto e
estrutura. Meses sem movimentacao autorizada aparecem com valores zerados e
estado textual de ausencia, nao como falha.

**Alternatives considered**: Calcular tendencia estatistica ou previsao foi
rejeitado por estar fora do escopo. Ocultar meses vazios foi rejeitado porque
quebraria a leitura temporal.

## Decision: Comparativo entre membros usa somente despesas compartilhadas autorizadas por responsavel

**Rationale**: O comparativo deve comunicar distribuicao de responsabilidades,
nao desempenho pessoal. A RPC agrega apenas transacoes `shared` autorizadas do
espaco ativo e agrupa por `responsible_user_id`, com labels seguros `Voce` e
`Pessoa parceira`. Quando criador e responsavel diferem, o resumo acessivel pode
mencionar que responsabilidade e autoria sao conceitos distintos, sem listar
transacoes individuais.

**Alternatives considered**: Incluir transacoes individuais do usuario foi
rejeitado porque confundiria comparativo compartilhado com visao pessoal. Usar
criador como criterio principal foi rejeitado porque a especificacao enfatiza
responsabilidade financeira.

## Decision: Dados individuais entram em categoria e evolucao, mas nunca no comparativo

**Rationale**: Categoria e evolucao representam a visao autorizada da pessoa no
dashboard, incluindo suas transacoes individuais e transacoes compartilhadas do
casal ativo. O comparativo entre membros tem natureza sensivel e deve se
restringir a dados compartilhados autorizados, impedindo inferencia sobre
financas individuais do parceiro.

**Alternatives considered**: Usar somente dados compartilhados em todos os
graficos foi rejeitado porque pessoas sem vinculo ativo perderiam valor da
feature. Misturar individual e compartilhado no comparativo foi rejeitado por
privacidade.

## Decision: Usar Shadcn/UI Chart com Recharts e texto persistente

**Rationale**: A F08 usa o componente `chart` do Shadcn/UI para manter
consistencia com o design system. Esse componente usa Recharts por baixo, entao
`recharts` passa a ser dependencia explicita. Valores monetarios, pesos,
legendas e leitura de saldo continuam em texto persistente fora de tooltips para
preservar acessibilidade, testes e clareza mobile.

**Alternatives considered**: Manter graficos manuais em HTML/CSS/SVG foi
rejeitado apos a decisao de padronizar a experiencia visual no Shadcn/UI Chart.
Canvas foi rejeitado porque exigiria mais trabalho para equivalentes acessiveis.

## Decision: Tooltips sao complementares, nunca fonte essencial

**Rationale**: Valores monetarios, labels, pesos e leitura de saldo aparecem em
texto persistente proximo aos graficos e nos resumos acessiveis. Tooltips podem
melhorar hover em desktop, mas nao sao necessarios para entender categoria, mes,
membro ou valor.

**Alternatives considered**: Tooltips como unica camada de detalhes foram
rejeitados por falhar em teclado, mobile e leitores de tela.

## Decision: Paleta funcional com multiplos sinais sem dependencia exclusiva de cor

**Rationale**: Os graficos usam cores do design system combinadas com texto,
ordem, labels, marcadores e valores. Receita, despesa, saldo e responsabilidade
recebem estilos distintos, mas a interpretacao sempre aparece em texto.

**Alternatives considered**: Paleta monocromatica foi rejeitada por reduzir
escaneabilidade. Codificar significado apenas por vermelho/verde foi rejeitado
por acessibilidade e linguagem financeira potencialmente alarmista.

## Decision: Hook local com identificador monotono e limpeza em contexto sensivel

**Rationale**: `useDashboardCharts` espelha o padrao da F07: parametro de mes
vem da URL/dashboard, dados remotos ficam no hook, e somente a requisicao atual
pode atualizar estado. Mudanca de sessao, relacionamento, retry ou mes limpa
dados compartilhados antes da nova leitura quando o contexto e sensivel.

**Alternatives considered**: TanStack Query foi rejeitado porque nao esta
instalado e exigiria politica robusta de cache por sessao, invalidaçao por
revogacao e limpeza em logout para uma superficie pequena.

## Decision: Estados por grafico dentro de uma resposta segura

**Rationale**: A resposta pode classificar cada visualizacao como `ready`,
`empty`, `unavailable_shared` ou `error` sem revelar dados inacessiveis. Um mes
sem despesas autorizadas nao sugere transacoes bloqueadas; ausencia de vinculo
ativo nao sugere a existencia de outra pessoa.

**Alternatives considered**: Um unico estado global foi rejeitado porque a
categoria pode estar vazia enquanto a evolucao ainda tem dados. Estados com
contagens foram rejeitados por ampliar inferencia.

## Decision: Indices complementares so quando nao cobertos por F06-F07

**Rationale**: As migrations anteriores ja priorizam periodo e escopo. A F08
deve revisar indices existentes e adicionar apenas complementos comprovados,
como parciais por `transaction_type = 'expense'` com `category_code` e
`responsible_user_id` para compartilhadas. Evitar combinacoes redundantes reduz
custo de escrita.

**Alternatives considered**: Criar indices para toda combinacao de periodo,
categoria, responsavel e visibilidade foi rejeitado por redundancia. Snapshot
mensal foi rejeitado por consistencia e autorizacao.

## Decision: Grants minimos e falhas neutras

**Rationale**: `authenticated` recebe `EXECUTE` na RPC. A funcao valida datas e
limites, usa `security invoker`, `search_path` fixo, SQL estatico e falha de
forma segura. O frontend converte erros para mensagens neutras, sem SQL, IDs,
detalhes de RLS ou existencia de recursos.

**Alternatives considered**: `security definer` foi rejeitado por ampliar
privilegios sem necessidade. Mensagens detalhadas de autorizacao foram
rejeitadas por inferencia.
