# Feature Specification: F07 - Dashboard financeiro inicial

**Feature Branch**: `007-dashboard-financeiro-inicial`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "F07 - Dashboard financeiro inicial para exibir saldo, receitas do mes, despesas do mes, economia do mes e ultimas transacoes autorizadas para pessoas autenticadas, respeitando visibilidade individual e compartilhada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver resumo financeiro do mes (Priority: P1)

Como pessoa autenticada, quero ver saldo, receitas, despesas e economia do mes
selecionado para entender rapidamente a situacao financeira do periodo com base
somente nos dados que posso acessar.

**Why this priority**: Os indicadores mensais entregam o valor central do
dashboard e permitem uma leitura imediata antes de qualquer exploracao adicional.

**Independent Test**: Pode ser testado com receitas, despesas e transacoes
inacessiveis no mesmo mes, verificando que os indicadores refletem apenas dados
autorizados e comunicam resultado positivo, negativo ou zerado.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada possui receitas e despesas autorizadas no mes atual, **When** abre o dashboard, **Then** o sistema mostra saldo, receitas do mes, despesas do mes e economia do mes calculados somente com transacoes autorizadas.
2. **Given** o resultado financeiro do mes e positivo, negativo ou zero, **When** os indicadores sao apresentados, **Then** a pessoa consegue compreender o estado do periodo sem depender apenas de cor.
3. **Given** existem transacoes individuais de outra pessoa ou compartilhadas de outro espaco financeiro, **When** o dashboard e calculado, **Then** essas transacoes nao aparecem, nao sao somadas e nao sao sugeridas por qualquer indicador ou mensagem.
4. **Given** a pessoa seleciona outro mes, **When** a atualizacao termina, **Then** todos os indicadores refletem somente transacoes autorizadas cuja data pertence ao mes selecionado.

---

### User Story 2 - Consultar ultimas transacoes do periodo (Priority: P2)

Como pessoa acompanhando o dashboard, quero ver as ultimas transacoes autorizadas
do mes para entender quais movimentacoes recentes explicam o resumo financeiro.

**Why this priority**: Transacoes recentes dao contexto aos indicadores sem
transformar o dashboard em uma lista completa ou relatorio detalhado.

**Independent Test**: Pode ser testado com varias transacoes autorizadas no mes,
verificando que apenas um resumo curto das mais recentes aparece com contexto
financeiro suficiente.

**Acceptance Scenarios**:

1. **Given** o mes selecionado possui transacoes autorizadas, **When** o dashboard e exibido, **Then** o sistema mostra uma lista curta das transacoes autorizadas mais recentes.
2. **Given** uma ultima transacao e apresentada, **When** a pessoa consulta o item, **Then** consegue identificar titulo, valor, tipo, data, categoria, responsavel e visibilidade.
3. **Given** uma transacao compartilhada possui criador diferente da pessoa responsavel, **When** essa distincao for necessaria para evitar ambiguidade, **Then** o dashboard preserva a clareza entre autoria, responsabilidade e visibilidade.
4. **Given** ha muitas transacoes no mes, **When** o dashboard apresenta movimentacoes recentes, **Then** a tela continua resumida e nao substitui a lista completa de transacoes.

---

### User Story 3 - Lidar com ausencia, falhas e mudancas de acesso (Priority: P3)

Como pessoa consultando o dashboard, quero receber estados claros quando nao ha
movimentacoes, quando ocorre uma falha ou quando o acesso compartilhado muda
para saber o que aconteceu sem expor informacoes privadas.

**Why this priority**: Estados ambiguos podem causar conclusoes financeiras
incorretas ou revelar indiretamente dados inacessiveis.

**Independent Test**: Pode ser testado com mes sem transacoes autorizadas, falha
recuperavel e encerramento de vinculo compartilhado, verificando mensagens
seguras e proximas acoes adequadas.

**Acceptance Scenarios**:

1. **Given** o mes selecionado nao possui transacoes autorizadas, **When** o dashboard termina de carregar, **Then** os indicadores e mensagens comunicam ausencia de movimentacao sem sugerir dados inacessiveis.
2. **Given** ocorre uma falha temporaria ao carregar ou atualizar o dashboard, **When** o erro e apresentado, **Then** a pessoa recebe uma mensagem segura e uma acao para tentar novamente.
3. **Given** o vinculo compartilhado deixa de estar ativo, **When** o dashboard e atualizado, **Then** transacoes compartilhadas anteriormente autorizadas deixam de contribuir para indicadores e ultimas transacoes.

---

### User Story 4 - Usar dashboard em telas pequenas e com acessibilidade (Priority: P4)

Como pessoa usando celular, teclado ou tecnologia assistiva, quero consultar
periodo, indicadores e ultimas transacoes com clareza para acompanhar o mes sem
depender de desktop, cor ou ajuda externa.

**Why this priority**: O dashboard e uma tela frequente e precisa ser confiavel
para diferentes tamanhos de tela e formas de interacao.

**Independent Test**: Pode ser testado completando a consulta do dashboard e a
troca de mes em tela pequena, por teclado e com tecnologia assistiva, verificando
rotulos, foco, ordem, estados e comunicacao de mudancas.

**Acceptance Scenarios**:

1. **Given** uma pessoa usa uma tela pequena ou texto ampliado, **When** consulta o dashboard, **Then** periodo, indicadores, estados e ultimas transacoes permanecem legiveis e acionaveis sem rolagem horizontal.
2. **Given** uma pessoa usa teclado ou tecnologia assistiva, **When** navega pelo dashboard e altera o mes, **Then** consegue compreender a ordem dos controles e perceber a atualizacao dos dados.
3. **Given** indicadores financeiros sao apresentados, **When** a pessoa consulta seus significados, **Then** consegue distinguir receitas, despesas, saldo e economia sem depender apenas de cor ou icones.

### Edge Cases

- O mes selecionado nao possui transacoes autorizadas.
- O mes possui apenas receitas autorizadas.
- O mes possui apenas despesas autorizadas.
- O saldo do mes e exatamente zero.
- O resultado do mes e negativo.
- Pessoa autenticada sem vinculo ativo possui apenas transacoes individuais.
- Pessoa com vinculo ativo possui transacoes individuais e compartilhadas no mesmo mes.
- Convites pendentes, recusados, cancelados, expirados ou indisponiveis existem, mas nao concedem acesso compartilhado.
- O vinculo compartilhado deixa de estar ativo enquanto o dashboard esta aberto.
- Existem transacoes individuais do parceiro ou parceira que nao devem afetar indicadores da pessoa atual.
- Existem transacoes compartilhadas de outro espaco financeiro que nao devem afetar indicadores.
- Uma transacao compartilhada foi criada por uma pessoa e atribuida como responsabilidade de outra.
- Ha muitas transacoes no mes e o dashboard precisa permanecer resumido e compreensivel.
- Uma categoria ou pessoa responsavel historica deixa de estar disponivel para novos registros, mas permanece necessaria para compreender transacoes autorizadas.
- O dashboard e utilizado em tela pequena, com texto ampliado, teclado ou tecnologia assistiva.
- Ocorre uma falha temporaria ao atualizar o mes ou os indicadores.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated person to view an initial financial dashboard for a selected calendar month.
- **FR-002**: System MUST initially select the current calendar month and allow the person to select another month.
- **FR-003**: System MUST determine a transaction's dashboard month from its transaction date.
- **FR-004**: System MUST calculate monthly income from authorized income transactions in the selected month.
- **FR-005**: System MUST calculate monthly expenses from authorized expense transactions in the selected month.
- **FR-006**: System MUST calculate the monthly balance as authorized income minus authorized expenses for the selected month.
- **FR-007**: System MUST present monthly savings or deficit as an understandable reading of the selected month's result.
- **FR-008**: System MUST clearly communicate whether the selected month's result is positive, negative or zero without relying only on color.
- **FR-009**: System MUST include only the current person's individual transactions and shared transactions belonging to their active shared financial space in dashboard indicators and recent transactions.
- **FR-010**: System MUST exclude inaccessible transactions from indicators, recent transactions, implicit counts, loading states, empty states and error messages.
- **FR-011**: System MUST prevent pending, declined, cancelled, expired, unavailable, ended or inactive relationship states from granting access to shared dashboard data.
- **FR-012**: System MUST re-evaluate authorization whenever the dashboard is loaded or refreshed and MUST stop presenting shared dashboard data after shared access becomes inactive.
- **FR-013**: System MUST present a short list of the most recent authorized transactions from the selected month.
- **FR-014**: System MUST order recent transactions from the most recent transaction date to the oldest and use a consistent order for transactions with the same date.
- **FR-015**: System MUST present each recent transaction's title, positive monetary amount, income or expense type, transaction date, category, responsible person and individual or shared visibility.
- **FR-016**: System MUST identify the creator of a shared transaction whenever the creator and responsible person differ and that distinction is needed to avoid ambiguity.
- **FR-017**: System MUST preserve historical category and responsible-person context for authorized recent transactions even when those references are no longer eligible for new transactions.
- **FR-018**: System MUST distinguish a selected month with no authorized transactions from a recoverable loading or update failure.
- **FR-019**: System MUST present private-by-default loading, empty, unavailable and error states with safe and actionable guidance.
- **FR-020**: System MUST use neutral, non-judgmental language for income, expenses, savings, deficit, responsibility, visibility and empty states.
- **FR-021**: System MUST present currency, dates, categories, responsible people, transaction types and visibility consistently with transaction registration and transaction listing.
- **FR-022**: System MUST keep essential dashboard consultation, month selection, recent-transaction review and retry actions usable on small screens without horizontal scrolling.
- **FR-023**: System MUST provide clear labels, logical focus order, visible focus, keyboard operation and perceivable updates for indicators, recent transactions, loading, empty and error states.
- **FR-024**: System MUST keep the dashboard clear and responsive for months with at least 1,000 authorized transactions while presenting only a concise recent-transaction summary.
- **FR-025**: System MUST limit this feature to the initial monthly dashboard and MUST NOT introduce transaction creation, editing, deletion, full transaction listing, detailed filters, charts, visual comparisons between members, financial goals, exports, imports, recurrence, installments, custom categories, detailed audit history, automatic recommendations or predictive alerts.

### Key Entities *(include if feature involves data)*

- **Financial Dashboard Period**: The selected calendar month used to calculate indicators and choose recent transactions.
- **Dashboard Indicator Set**: The authorized monthly income, expenses, balance and savings or deficit reading shown for the selected month.
- **Authorized Dashboard Transaction**: A transaction in the selected month that remains accessible to the current authenticated person and may contribute to indicators or recent transactions.
- **Recent Transaction Summary**: A short, ordered representation of authorized transactions with title, amount, type, date, category, responsible person and visibility.
- **Dashboard State**: The current presentation state, such as loading, populated, empty month, unavailable shared access or recoverable error.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The dashboard starts with the current month, uses a small set of essential indicators and keeps recent transactions concise.
- **Financial Transparency**: Income, expenses, balance, savings or deficit, responsibility and individual or shared visibility remain distinct and understandable.
- **Mobile & Accessibility**: Month selection, indicators, recent transactions and status messages work on small screens, by keyboard and with assistive technologies.
- **Security & Privacy**: Indicators, recent transactions, states and messages contain only authorized data and do not reveal inaccessible people, transactions or shared spaces.
- **Performance & Data Clarity**: Monthly totals and recent transactions remain clear and responsive for busy months while preserving consistent currency, dates and ordering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of participants can identify the selected month's balance, income and expenses within 10 seconds after the dashboard finishes loading.
- **SC-002**: At least 90% of participants can explain whether the selected month is positive, negative or zero without external help.
- **SC-003**: 100% of authorization validation scenarios exclude inaccessible transactions from indicators, recent transactions, implicit counts, empty states, loading states and error messages.
- **SC-004**: 100% of month-change validation scenarios recalculate indicators and recent transactions using only authorized transactions whose transaction date belongs to the selected month.
- **SC-005**: At least 95% of dashboard consultations for months with up to 1,000 authorized transactions present updated indicators and recent transactions within one second under normal usage conditions.
- **SC-006**: At least 90% of usability-review participants can identify why the most recent transactions shown explain the monthly summary without opening a full report.
- **SC-007**: The complete dashboard consultation and month-selection journey can be completed on a mobile-sized screen without horizontal scrolling and by keyboard without an inaccessible essential action.
- **SC-008**: Accessibility review confirms that indicators, result meanings, recent transactions, loading, empty and error states are perceivable without relying only on color or icons.

## Assumptions

- Authentication and session behavior from F01 are available before dashboard consultation.
- Couple-link and shared financial space states from F02 remain the source of active membership.
- Permission and isolation rules from F03 apply to every indicator, recent transaction and interface state.
- The standard category catalog from F04 remains the source of category labels, including historical references.
- Transaction records and their read authorization from F05 are available and preserve title, amount, type, date, category, creator, responsible person, visibility and optional observation.
- Monthly transaction consultation behavior from F06 is available as the product reference for month selection, authorization boundaries, financial formatting and recent transaction presentation.
- The dashboard uses one selected calendar month at a time; detailed filters by category, responsible person, type or text remain part of transaction listing rather than this dashboard.
- The recent-transaction area is intentionally short and summarizes only the most recent authorized transactions from the selected month.
- Product copy and financial formatting use Brazilian Portuguese and the product's single MVP currency.
