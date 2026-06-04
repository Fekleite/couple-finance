# Feature Specification: F06 - Lista e filtros de transacoes

**Feature Branch**: `006-list-filter-transactions`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "F06 - Permitir que pessoas autenticadas consultem, compreendam e filtrem por mes, categoria, responsavel, tipo e texto somente as transacoes financeiras que possuem autorizacao para acessar."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar transacoes autorizadas do mes (Priority: P1)

Como pessoa autenticada, quero visualizar as transacoes que posso acessar no mes
selecionado para entender o que aconteceu no periodo sem exposicao de dados
privados.

**Why this priority**: A consulta mensal entrega o valor central da feature e
permite compreender movimentacoes registradas antes mesmo do uso de filtros
adicionais.

**Independent Test**: Pode ser testado com transacoes individuais,
compartilhadas e inacessiveis no mesmo mes, verificando que a pessoa visualiza
somente as autorizadas, ordenadas e com contexto financeiro suficiente.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada possui transacoes autorizadas no mes atual, **When** abre a lista, **Then** o sistema mostra essas transacoes da data mais recente para a mais antiga.
2. **Given** uma lista com transacoes individuais e compartilhadas autorizadas, **When** a pessoa consulta os itens, **Then** cada item apresenta titulo, valor, tipo, data, categoria, responsavel e visibilidade de forma clara.
3. **Given** existem transacoes individuais de outra pessoa ou compartilhadas de outro espaco, **When** a lista e carregada, **Then** essas transacoes nao aparecem, nao entram em qualquer contagem e nao sao sugeridas.
4. **Given** a pessoa seleciona outro mes, **When** a consulta e concluida, **Then** a lista mostra somente as transacoes autorizadas cuja data pertence ao mes selecionado.

---

### User Story 2 - Localizar transacoes com filtros combinados (Priority: P2)

Como pessoa consultando suas movimentacoes, quero combinar filtros de categoria,
responsavel, tipo e texto dentro de um mes para localizar transacoes relevantes
com rapidez.

**Why this priority**: Depois de disponibilizar a lista segura, filtros
combinados tornam periodos movimentados compreensiveis e ajudam a responder
perguntas financeiras concretas.

**Independent Test**: Pode ser testado aplicando isoladamente e em conjunto os
filtros disponiveis, verificando que cada resultado autorizado atende a todos os
criterios ativos.

**Acceptance Scenarios**:

1. **Given** um mes com transacoes autorizadas de categorias, responsaveis e tipos diferentes, **When** a pessoa combina filtros, **Then** cada resultado atende simultaneamente ao mes e a todos os filtros ativos.
2. **Given** transacoes com termos conhecidos no titulo ou na observacao, **When** a pessoa pesquisa esse texto, **Then** o sistema encontra os resultados autorizados correspondentes sem exigir correspondencia de maiusculas, minusculas ou acentuacao.
3. **Given** filtros ativos, **When** a pessoa consulta a lista, **Then** consegue identificar quais filtros estao aplicados e remove-los facilmente.
4. **Given** filtros ativos, **When** a pessoa limpa todos os filtros adicionais, **Then** a lista volta a mostrar todas as transacoes autorizadas do mes selecionado.

---

### User Story 3 - Compreender ausencia, carregamento e falhas (Priority: P3)

Como pessoa consultando transacoes, quero receber estados claros quando nao ha
movimentacoes, quando nenhum filtro corresponde ou quando ocorre uma falha para
saber o que aconteceu e qual acao posso tomar.

**Why this priority**: Estados ambiguos podem levar a conclusoes financeiras
incorretas ou revelar a existencia de informacoes inacessiveis.

**Independent Test**: Pode ser testado com mes vazio, filtros sem
correspondencia, carregamento e falha recuperavel, verificando mensagens seguras
e proximas acoes adequadas.

**Acceptance Scenarios**:

1. **Given** o mes selecionado nao possui transacoes autorizadas, **When** a consulta termina, **Then** o sistema apresenta um estado vazio do periodo sem sugerir dados inacessiveis.
2. **Given** existem transacoes autorizadas no mes, mas nenhuma atende aos filtros ativos, **When** a consulta termina, **Then** o sistema informa que nao encontrou correspondencias e permite limpar ou ajustar filtros.
3. **Given** uma consulta esta em andamento ou falha de forma recuperavel, **When** o estado muda, **Then** a pessoa percebe carregamento ou erro e recebe uma acao segura para continuar.

---

### User Story 4 - Consultar com acessibilidade em telas pequenas (Priority: P4)

Como pessoa usando celular, teclado ou tecnologia assistiva, quero navegar pelos
meses, operar filtros e compreender resultados sem depender de desktop, cor ou
ajuda externa.

**Why this priority**: A consulta de transacoes e frequente e deve permanecer
confiavel independentemente da tela ou forma de interacao.

**Independent Test**: Pode ser testado concluindo a consulta e filtragem em tela
pequena, por teclado e com tecnologia assistiva, verificando foco, rotulos,
ordem, estados e resultados perceptiveis.

**Acceptance Scenarios**:

1. **Given** uma pessoa em tela pequena ou com texto ampliado, **When** navega, filtra e consulta a lista, **Then** todas as informacoes e acoes essenciais permanecem legiveis e acionaveis sem rolagem horizontal.
2. **Given** uma pessoa usa teclado ou tecnologia assistiva, **When** altera mes ou filtros, **Then** consegue operar os controles e perceber a atualizacao dos resultados em ordem compreensivel.
3. **Given** uma transacao e apresentada sem depender apenas de cor ou icone, **When** a pessoa consulta o item, **Then** consegue identificar seu tipo, responsavel e visibilidade.

### Edge Cases

- O mes selecionado nao possui transacoes acessiveis.
- Existem transacoes autorizadas no mes, mas nenhuma corresponde a combinacao
  de filtros.
- A busca textual contem espacos extras, diferencas entre maiusculas e
  minusculas ou acentuacao.
- A pessoa troca rapidamente de mes ou altera varios filtros antes da conclusao
  da consulta anterior.
- O vinculo do casal deixa de estar ativo enquanto a lista compartilhada esta
  aberta ou sendo consultada.
- Uma categoria ou pessoa responsavel deixa de estar disponivel para novos
  registros, mas permanece necessaria para compreender transacoes historicas
  autorizadas.
- Duas transacoes possuem a mesma data e precisam manter ordem consistente.
- Ha muitas transacoes no periodo e a pessoa precisa continuar consultando e
  filtrando com clareza e fluidez.
- Um erro, estado vazio ou opcao de filtro poderia sugerir a existencia de uma
  transacao ou pessoa inacessivel.
- A lista e utilizada em tela pequena, com texto ampliado, teclado ou
  tecnologia assistiva.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated person to view a monthly list of financial transactions they are authorized to access.
- **FR-002**: System MUST initially select the current calendar month and allow the person to select another month.
- **FR-003**: System MUST determine a transaction's month from its transaction date.
- **FR-004**: System MUST include only the current person's individual transactions and shared transactions belonging to their active shared financial space.
- **FR-005**: System MUST exclude inaccessible transactions from lists, search results, filter options, implicit counts, loading states, empty states, and error messages.
- **FR-006**: System MUST prevent pending, declined, cancelled, expired, unavailable, ended, or inactive relationship states from granting access to shared transactions.
- **FR-007**: System MUST re-evaluate authorization when each list or filtered result is requested and MUST stop presenting shared transactions after shared access becomes inactive.
- **FR-008**: System MUST present each transaction's title, positive monetary amount, income or expense type, transaction date, category, responsible person, and individual or shared visibility.
- **FR-009**: System MUST identify the creator of a shared transaction whenever the creator and responsible person differ.
- **FR-010**: System MUST order transactions initially from the most recent transaction date to the oldest and use a consistent order for transactions with the same date.
- **FR-011**: System MUST allow filtering the selected month's authorized transactions by one category.
- **FR-012**: System MUST allow filtering the selected month's authorized transactions by one responsible person.
- **FR-013**: System MUST offer only relevant and authorized people as responsible-person filter options.
- **FR-014**: System MUST allow filtering the selected month's authorized transactions by income or expense type.
- **FR-015**: System MUST allow text search across transaction title and optional observation.
- **FR-016**: System MUST ignore leading and trailing spaces and differences in letter case or accentuation when matching text search.
- **FR-017**: System MUST apply the selected month, category, responsible person, type, and text search together so every result satisfies all active criteria.
- **FR-018**: System MUST make active filters identifiable and allow the person to clear individual filters or all additional filters easily.
- **FR-019**: System MUST preserve historical category and responsible-person context for authorized transactions even when those references are no longer eligible for new transactions.
- **FR-020**: System MUST distinguish a month with no authorized transactions from a filtered search with no matching authorized transactions.
- **FR-021**: System MUST present private-by-default loading, empty, error, and unavailable states with safe and actionable guidance.
- **FR-022**: System MUST prevent an older pending request from replacing the visible results of a more recent month or filter selection.
- **FR-023**: System MUST use neutral, non-judgmental language for income, expenses, responsibility, visibility, filters, and empty states.
- **FR-024**: System MUST present currency, dates, categories, responsible people, transaction types, and visibility consistently with transaction registration.
- **FR-025**: System MUST keep essential list, month-navigation, filtering, clearing, and retry actions usable on small screens without horizontal scrolling.
- **FR-026**: System MUST provide clear labels, logical focus order, visible focus, keyboard operation, and perceivable result, loading, empty, and error updates.
- **FR-027**: System MUST keep list consultation and filtering clear and responsive for at least 1,000 authorized transactions in a selected month.
- **FR-028**: System MUST limit this feature to listing, searching, and filtering authorized transactions and MUST NOT introduce transaction creation, editing, deletion, dedicated detail views, totals, balances, dashboards, charts, reports, exports, imports, recurrence, installments, custom categories, or detailed audit history.

### Key Entities

- **Financial Transaction**: An authorized recorded income or expense displayed
  in the list with title, positive amount, type, transaction date, category,
  creator, responsible person, visibility and optional observation.
- **Transaction Filter Set**: The current consultation criteria composed of one
  selected month and optional category, responsible person, type and text
  filters; every visible result must satisfy the complete set.
- **Authorized Transaction Result**: A transaction that matches the active
  filter set and remains accessible to the current authenticated person.
- **Responsible-Person Filter Option**: A person who is relevant to the current
  person's authorized transaction context and may be selected without exposing
  unrelated people.
- **Transaction List State**: The current state of the consultation, such as
  loading, populated, empty month, no filter matches, recoverable error or
  unavailable shared access.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature starts with the current month, keeps filters
  identifiable and removable, and distinguishes empty periods from searches
  without matches.
- **Financial Transparency**: Every result keeps type, category, creator when
  relevant, responsible person and individual or shared visibility clear
  without conflating those concepts.
- **Mobile & Accessibility**: Month navigation, filters, results and status
  messages work on small screens, by keyboard and with assistive technologies.
- **Security & Privacy**: Lists, searches, options, counts and all interface
  states contain only authorized transactions and do not reveal inaccessible
  people or records.
- **Performance & Data Clarity**: Results remain clear and responsive for busy
  months, use consistent ordering and preserve understandable historical
  context.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of participants can locate a known transaction by month and filters in under 45 seconds without external help.
- **SC-002**: 100% of authorization validation scenarios exclude inaccessible transactions from results, searches, filter options, implicit counts, empty states, loading states, and error messages.
- **SC-003**: 100% of combined-filter validation scenarios return only authorized transactions that satisfy every active criterion.
- **SC-004**: At least 90% of usability-review participants correctly identify whether each sample transaction is income or expense, individual or shared, and who is responsible.
- **SC-005**: At least 95% of consultations containing up to 1,000 authorized transactions present updated results within one second after the person changes a month or filter under normal usage conditions.
- **SC-006**: 100% of empty-state review scenarios correctly distinguish a month without authorized transactions from filters without matching results and offer an appropriate next action.
- **SC-007**: The complete monthly consultation and filtering journey can be completed on a mobile-sized screen without horizontal scrolling and by keyboard without an inaccessible essential action.
- **SC-008**: Accessibility review confirms that controls, active filters, result changes, loading, empty and error states are perceivable without relying only on color or icons.
- **SC-009**: In 100% of rapid-change validation scenarios, the final visible results correspond to the person's most recent month and filter selection.

## Assumptions

- Authentication and session behavior from F01 are available before transaction
  consultation.
- Couple-link and shared financial space states from F02 remain the source of
  active membership.
- Permission and isolation rules from F03 apply to every list, search, option,
  count and state.
- The standard category catalog from F04 remains the source of category labels,
  including historical references.
- Transaction records and their read authorization from F05 are available and
  preserve title, amount, type, date, category, creator, responsible person,
  visibility and optional observation.
- The selected month remains mandatory while category, responsible person, type
  and text are optional filters.
- Category, responsible-person and type filters accept one value each; people
  can clear or replace that value.
- Text search matches title and observation, ignores outer spaces, letter case
  and accentuation, and does not require advanced query syntax.
- Product copy and financial formatting use Brazilian Portuguese and the
  product's single MVP currency.
- Transaction creation remains accessible through the existing F05 journey,
  but adding a creation action to the list is not required by this feature.
