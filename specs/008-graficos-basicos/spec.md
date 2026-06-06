# Feature Specification: F08 - Graficos basicos

**Feature Branch**: `008-graficos-basicos`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "F08 - Graficos basicos para mostrar gastos por categoria, evolucao mensal e comparativo neutro entre membros do casal, usando somente dados financeiros autorizados e complementando o dashboard financeiro inicial."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver gastos por categoria do mes (Priority: P1)

Como pessoa autenticada, quero visualizar a distribuicao das despesas autorizadas
por categoria no mes selecionado para entender rapidamente quais areas tiveram
maior peso no periodo.

**Why this priority**: Gastos por categoria entregam a leitura visual mais
imediata e acionavel da feature, ajudando a pessoa a compreender o mes sem abrir
relatorios detalhados.

**Independent Test**: Pode ser testado com despesas autorizadas em multiplas
categorias no mes selecionado, verificando que a visualizacao apresenta somente
dados autorizados, identifica categorias e totais com clareza e oferece estado
seguro quando nao ha despesas.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada possui despesas autorizadas em varias categorias no mes selecionado, **When** consulta os graficos basicos, **Then** o sistema mostra a distribuicao de despesas por categoria usando somente transacoes autorizadas.
2. **Given** uma categoria possui o maior total de despesas autorizadas no mes, **When** a visualizacao e apresentada, **Then** a pessoa consegue identificar essa categoria e seu peso relativo sem depender apenas de cor.
3. **Given** o mes selecionado nao possui despesas autorizadas, **When** a area de gastos por categoria termina de carregar, **Then** o sistema apresenta um estado vazio seguro sem sugerir que existem dados inacessiveis.
4. **Given** duas ou mais categorias possuem o mesmo total, **When** a distribuicao e apresentada, **Then** a ordenacao permanece consistente e compreensivel.

---

### User Story 2 - Acompanhar evolucao mensal recente (Priority: P2)

Como pessoa acompanhando o dashboard, quero ver a evolucao mensal recente de
receitas, despesas e saldo para entender tendencias gerais sem montar um
relatorio manual.

**Why this priority**: A evolucao mensal adiciona contexto temporal ao dashboard
inicial e ajuda a diferenciar um mes isolado de um padrao recorrente.

**Independent Test**: Pode ser testado com uma janela curta de meses contendo
receitas, despesas, meses vazios e saldos diferentes, validando que cada mes e
calculado separadamente e que estados positivos, negativos e zerados sao
compreensiveis.

**Acceptance Scenarios**:

1. **Given** existem transacoes autorizadas em meses recentes, **When** a evolucao mensal e exibida, **Then** o sistema apresenta receitas, despesas e saldo por mes usando somente dados autorizados.
2. **Given** um mes da evolucao possui apenas receitas, apenas despesas ou nenhuma movimentacao autorizada, **When** a evolucao e apresentada, **Then** esse mes permanece compreensivel e nao e confundido com falha de carregamento.
3. **Given** um mes possui saldo positivo, negativo ou zero, **When** a pessoa consulta a evolucao, **Then** consegue compreender o resultado sem depender apenas de cor.
4. **Given** a pessoa altera o mes selecionado no dashboard, **When** os graficos sao atualizados, **Then** o mes selecionado fica claro dentro da janela de evolucao.

---

### User Story 3 - Comparar responsabilidades de forma neutra (Priority: P3)

Como pessoa vinculada a um espaco financeiro compartilhado ativo, quero ver um
comparativo neutro entre membros do casal para compreender a distribuicao de
despesas ou responsabilidades compartilhadas sem julgamento pessoal.

**Why this priority**: O comparativo entre membros e valioso para transparencia
do casal, mas precisa vir depois das visualizacoes financeiras basicas porque
tem maior sensibilidade de linguagem, privacidade e interpretacao.

**Independent Test**: Pode ser testado com despesas compartilhadas autorizadas,
responsaveis diferentes e transacoes individuais inacessiveis, verificando que o
comparativo inclui apenas dados compartilhados autorizados e usa linguagem
neutra.

**Acceptance Scenarios**:

1. **Given** uma pessoa possui vinculo compartilhado ativo e despesas compartilhadas autorizadas, **When** consulta o comparativo entre membros, **Then** o sistema mostra a distribuicao de responsabilidades de forma neutra e nao julgadora.
2. **Given** existem transacoes individuais do parceiro ou parceira, **When** o comparativo e calculado, **Then** essas transacoes nao aparecem, nao sao somadas e nao sao sugeridas por graficos, legendas, estados ou mensagens.
3. **Given** uma transacao compartilhada foi criada por uma pessoa e atribuida como responsabilidade de outra, **When** a distincao for necessaria para evitar ambiguidade, **Then** a visualizacao preserva a diferenca entre autoria, responsabilidade e visibilidade.
4. **Given** a pessoa nao possui vinculo compartilhado ativo, **When** consulta os graficos, **Then** o sistema nao sugere a existencia de dados de outra pessoa indisponiveis.

---

### User Story 4 - Usar graficos com acessibilidade e seguranca (Priority: P4)

Como pessoa usando celular, teclado, texto ampliado ou tecnologia assistiva,
quero compreender os graficos, seus valores e seus estados por meios visuais e
textuais para acompanhar minhas financas sem depender de desktop ou apenas de
cor.

**Why this priority**: Graficos podem excluir usuarios se forem apenas visuais;
a feature so e aceitavel se preservar legibilidade, privacidade e alternativas
perceptiveis.

**Independent Test**: Pode ser testado navegando pela area de graficos em tela
pequena, por teclado e com tecnologia assistiva, verificando titulos, periodo,
legendas, foco, resumos equivalentes, estados e retry.

**Acceptance Scenarios**:

1. **Given** uma pessoa usa tela pequena ou texto ampliado, **When** consulta os graficos basicos, **Then** valores, categorias, meses, membros, estados e acoes essenciais permanecem legiveis sem rolagem horizontal obrigatoria.
2. **Given** uma pessoa usa teclado ou tecnologia assistiva, **When** navega pelos graficos, **Then** consegue compreender periodo, legendas, valores, estados e resumos equivalentes em ordem logica.
3. **Given** ocorre uma falha temporaria ao atualizar os graficos, **When** o erro e exibido, **Then** a pessoa recebe mensagem segura e uma acao para tentar novamente.
4. **Given** dados compartilhados deixam de estar autorizados enquanto a area de graficos esta aberta, **When** os graficos sao atualizados, **Then** os dados compartilhados anteriormente autorizados deixam de ser considerados.

### Edge Cases

- O mes selecionado nao possui despesas autorizadas.
- O mes selecionado possui despesas em apenas uma categoria.
- Duas ou mais categorias possuem o mesmo total de despesas.
- Categorias historicas nao estao mais disponiveis para novos registros, mas aparecem em transacoes autorizadas.
- A janela de evolucao mensal possui meses sem movimentacoes autorizadas.
- A janela de evolucao mensal possui meses com apenas receitas, apenas despesas, saldo zero ou saldo negativo.
- Pessoa autenticada sem vinculo ativo possui apenas transacoes individuais.
- Pessoa com vinculo ativo possui transacoes individuais e compartilhadas no mesmo mes.
- Convites pendentes, recusados, cancelados, expirados ou indisponiveis existem, mas nao concedem acesso compartilhado.
- O vinculo compartilhado deixa de estar ativo enquanto os graficos estao abertos.
- Existem transacoes individuais do parceiro ou parceira que nao devem afetar graficos, comparativos ou mensagens.
- Existem transacoes compartilhadas de outro espaco financeiro que nao devem afetar graficos.
- Uma transacao compartilhada foi criada por uma pessoa e atribuida como responsabilidade de outra.
- Ha muitas transacoes autorizadas no periodo e os graficos precisam permanecer rapidos e legiveis.
- A pessoa usa tela pequena, texto ampliado, teclado ou tecnologia assistiva.
- Ocorre uma falha temporaria ao atualizar graficos ou trocar o periodo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated person to view basic financial charts within the private dashboard experience.
- **FR-002**: System MUST use the dashboard's selected calendar month as the primary context for current-period charts.
- **FR-003**: System MUST determine a transaction's chart month from its transaction date.
- **FR-004**: System MUST calculate expenses by category using only authorized expense transactions from the selected month.
- **FR-005**: System MUST present category names, monetary totals and relative weight clearly enough to identify the highest expense categories.
- **FR-006**: System MUST handle categories with equal totals using a consistent and predictable order.
- **FR-007**: System MUST present an empty state when the selected month has no authorized expenses, without implying that inaccessible data exists.
- **FR-008**: System MUST present a recent monthly evolution view for authorized income, authorized expenses and balance.
- **FR-009**: System MUST calculate income, expenses and balance separately for each month included in the evolution view.
- **FR-010**: System MUST make months with no authorized movement in the evolution view distinguishable from loading failures.
- **FR-011**: System MUST clearly identify which month is currently selected when it appears in the evolution view.
- **FR-012**: System MUST clearly communicate positive, negative and zero balances without relying only on color.
- **FR-013**: System MUST present income and expense amounts as positive monetary values, with transaction type or chart context explaining the financial direction.
- **FR-014**: System MUST provide a neutral comparison between members only when the person has an active shared financial space and authorized shared data sufficient for comparison.
- **FR-015**: System MUST ensure member comparisons use only authorized shared transactions and never include the partner's individual transactions.
- **FR-016**: System MUST use neutral, non-judgmental language for member comparison, responsibility, spending, deficits, surplus and empty states.
- **FR-017**: System MUST distinguish creator, responsible person and visibility whenever that distinction is needed to avoid ambiguity in shared charts.
- **FR-018**: System MUST include only the current person's individual transactions and shared transactions belonging to their active shared financial space in charts, legends, summaries and states.
- **FR-019**: System MUST exclude inaccessible transactions from chart values, proportions, labels, legends, textual summaries, implicit counts, loading states, empty states and error messages.
- **FR-020**: System MUST prevent pending, declined, cancelled, expired, unavailable, ended or inactive relationship states from granting access to shared chart data.
- **FR-021**: System MUST re-evaluate authorization whenever charts are loaded or refreshed and MUST stop presenting shared chart data after shared access becomes inactive.
- **FR-022**: System MUST preserve historical category and responsible-person context for authorized chart data when those references remain necessary for understanding past transactions.
- **FR-023**: System MUST present safe, actionable loading, empty, unavailable and recoverable error states for each chart area.
- **FR-024**: System MUST provide textual summaries or accessible equivalents that communicate the essential financial meaning of each chart.
- **FR-025**: System MUST provide clear labels, logical focus order, visible focus, keyboard operation and perceivable updates for chart areas, legends, summaries, loading, empty and error states.
- **FR-026**: System MUST keep essential chart consultation usable on small screens without requiring desktop layout or horizontal scrolling.
- **FR-027**: System MUST present currency, dates, categories, responsible people, transaction types and visibility consistently with transaction registration, transaction listing and the initial dashboard.
- **FR-028**: System MUST keep the chart experience understandable and responsive for periods with at least 1,000 authorized transactions.
- **FR-029**: System MUST limit this feature to basic category, monthly evolution and neutral member-comparison charts and MUST NOT introduce transaction mutation, full transaction listing, detailed chart filters, advanced reports, deep drill-down, financial goals, exports, external sharing, custom categories, bank import, recurrence, installments, automatic categorization, detailed audit history, automatic recommendations or predictive alerts.

### Key Entities *(include if feature involves data)*

- **Chart Period**: The selected calendar month used as the main context for category and comparison charts.
- **Authorized Chart Transaction**: A financial transaction that remains accessible to the current authenticated person and may contribute to chart values.
- **Category Expense Distribution**: The selected month's authorized expenses grouped by financial category, including total and relative weight.
- **Monthly Evolution Point**: A month in the recent evolution window with authorized income, expenses and balance.
- **Member Responsibility Comparison**: A neutral representation of authorized shared expenses or responsibilities associated with members of the active shared financial space.
- **Chart Presentation State**: The state of each chart area, such as loading, populated, empty, unavailable shared access or recoverable error.
- **Accessible Chart Summary**: A textual or equivalent representation that communicates the essential meaning of a chart without requiring visual interpretation alone.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature adds only three basic visualizations and keeps them tied to the dashboard context instead of creating an advanced reporting surface.
- **Financial Transparency**: Categories, income, expenses, balance, responsibility and individual or shared visibility remain distinct and understandable.
- **Mobile & Accessibility**: Chart consultation, legends, summaries, states and retry actions work on small screens, by keyboard and with assistive technologies.
- **Security & Privacy**: Charts, legends, summaries, states and messages include only authorized data and do not reveal inaccessible people, transactions or shared spaces.
- **Performance & Data Clarity**: Chart values remain clear and responsive for busy periods while preserving consistent currency, dates, ordering and financial meaning.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of usability-review participants can identify the selected month's highest authorized expense category within 10 seconds after charts finish loading.
- **SC-002**: At least 90% of participants can explain whether recent income, expenses and balance improved, worsened or stayed generally stable without external help.
- **SC-003**: At least 90% of participants with shared financial data interpret the member comparison as a neutral distribution of responsibilities rather than a personal judgment.
- **SC-004**: 100% of authorization validation scenarios exclude inaccessible data from chart values, proportions, labels, legends, summaries, empty states, loading states and error messages.
- **SC-005**: 100% of period-change validation scenarios recalculate chart values using only authorized transactions whose transaction dates belong to the corresponding months.
- **SC-006**: At least 95% of chart consultations for periods with up to 1,000 authorized transactions present updated charts within one second under normal usage conditions.
- **SC-007**: The complete chart consultation journey can be completed on a mobile-sized screen without horizontal scrolling and by keyboard without an inaccessible essential action.
- **SC-008**: Accessibility review confirms that the essential meaning of each chart is perceivable through text, structure or equivalent summaries without relying only on color, icons or visual position.

## Assumptions

- Authentication and session behavior from F01 are available before chart consultation.
- Couple-link and shared financial space states from F02 remain the source of active membership.
- Permission and isolation rules from F03 apply to every chart value, legend, summary and interface state.
- The standard category catalog from F04 remains the source of category labels, including historical references.
- Transaction records and their read authorization from F05 are available and preserve amount, type, date, category, creator, responsible person and visibility.
- Monthly transaction consultation behavior from F06 remains the product reference for month boundaries, authorization boundaries and financial formatting.
- The initial dashboard from F07 provides the selected month context and the basic financial concepts that these charts complement.
- The monthly evolution uses a short recent window suitable for dashboard comprehension rather than a full historical report.
- Member comparison is limited to authorized shared financial context and does not evaluate personal merit, blame or fairness.
- Product copy and financial formatting use Brazilian Portuguese and the product's single MVP currency.
