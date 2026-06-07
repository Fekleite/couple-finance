# Feature Specification: F10 - Auditoria simples de alteracoes financeiras

**Feature Branch**: `010-financial-audit`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "Auditoria simples de alteracoes financeiras em transacoes e metas, com autoria, momento, acao e contexto seguro para dados autorizados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar alteracoes autorizadas recentes (Priority: P1)

Como pessoa autenticada, quero consultar um historico simples de alteracoes financeiras recentes para entender o que mudou em transacoes e metas que eu posso acessar.

**Why this priority**: Esta e a entrega minima de valor da auditoria: reduzir duvidas sobre mudancas financeiras importantes sem expor dados privados ou exigir relatorios complexos.

**Independent Test**: Pode ser testada criando ou alterando transacoes e metas autorizadas e verificando se a pessoa visualiza apenas eventos permitidos, com acao, item, autoria, momento e contexto seguro.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada com eventos de transacoes e metas autorizadas, **When** ela abre a auditoria, **Then** ela ve uma lista de eventos recentes com tipo de acao, tipo de item, autoria, momento e contexto seguro.
2. **Given** uma pessoa autenticada sem eventos autorizados, **When** ela abre a auditoria, **Then** ela ve um estado vazio seguro que nao sugere a existencia de eventos inacessiveis.
3. **Given** uma falha temporaria ao carregar eventos, **When** a pessoa consulta a auditoria, **Then** ela recebe uma mensagem segura e uma acao para tentar novamente quando apropriado.

---

### User Story 2 - Rastrear alteracoes compartilhadas do casal (Priority: P2)

Como pessoa vinculada a um espaco financeiro compartilhado ativo, quero ver alteracoes importantes feitas em transacoes e metas compartilhadas para manter transparencia com meu parceiro ou parceira.

**Why this priority**: A auditoria compartilhada reforca confianca entre membros do casal, mas depende da base de consulta segura e autorizada da historia principal.

**Independent Test**: Pode ser testada com duas pessoas vinculadas ao mesmo espaco compartilhado, alternando autoria de alteracoes e verificando que ambas veem apenas eventos compartilhados autorizados e eventos individuais proprios.

**Acceptance Scenarios**:

1. **Given** duas pessoas com vinculo compartilhado ativo, **When** uma delas cria, edita, conclui, arquiva ou remove do fluxo principal uma transacao ou meta compartilhada, **Then** ambas podem visualizar o evento compartilhado com autoria, momento, tipo de acao, tipo de item e contexto seguro.
2. **Given** uma pessoa sem vinculo compartilhado ativo, **When** ela consulta a auditoria, **Then** ela nao ve eventos compartilhados nem mensagens que sugiram dados de outra pessoa.
3. **Given** um vinculo compartilhado que deixou de estar ativo, **When** os eventos sao atualizados, **Then** eventos compartilhados antes autorizados deixam de aparecer para a pessoa que perdeu acesso.

---

### User Story 3 - Preservar privacidade de eventos individuais (Priority: P3)

Como pessoa autenticada, quero que eventos sobre meus dados individuais continuem privados para que a auditoria nao revele informacoes pessoais ao parceiro ou parceira.

**Why this priority**: A auditoria so aumenta confianca se nao enfraquecer a separacao entre informacoes individuais e compartilhadas.

**Independent Test**: Pode ser testada criando alteracoes em transacoes e metas individuais de uma pessoa e verificando que outra pessoa nao consegue ver, contar, inferir ou receber sugestoes sobre esses eventos.

**Acceptance Scenarios**:

1. **Given** uma transacao individual de outra pessoa, **When** eventos de auditoria sao consultados, **Then** nenhum evento relacionado aparece, e nenhum estado ou mensagem indica sua existencia.
2. **Given** uma meta individual de outra pessoa, **When** eventos de auditoria sao consultados, **Then** nenhum evento relacionado aparece, e nenhum estado ou mensagem indica sua existencia.
3. **Given** um evento individual proprio, **When** a pessoa proprietaria consulta a auditoria, **Then** ela ve o evento correspondente sem que ele seja exposto a outra pessoa.

---

### User Story 4 - Entender eventos com acessibilidade e linguagem neutra (Priority: P4)

Como pessoa usando celular, teclado, texto ampliado ou tecnologia assistiva, quero compreender a auditoria sem depender de cor, icones ou layout de desktop.

**Why this priority**: Auditoria financeira envolve informacoes sensiveis; a experiencia precisa ser clara, inclusiva e nao acusatoria para evitar novas ambiguidades.

**Independent Test**: Pode ser testada consultando a auditoria em tela pequena, com navegacao por teclado e com leitura textual dos eventos, estados e acoes disponiveis.

**Acceptance Scenarios**:

1. **Given** a pessoa usa tela pequena, **When** consulta a auditoria, **Then** todas as informacoes essenciais permanecem legiveis e nenhuma acao essencial exige desktop ou rolagem horizontal obrigatoria.
2. **Given** a pessoa navega por teclado ou tecnologia assistiva, **When** percorre a auditoria, **Then** ela consegue compreender acao, item, autoria, momento, visibilidade, estados e mensagens disponiveis.
3. **Given** eventos compartilhados sao exibidos, **When** a pessoa le a lista, **Then** a linguagem comunica transparencia e colaboracao sem culpa, cobranca, ranking ou julgamento pessoal.

### Edge Cases

- Pessoa autenticada sem nenhum evento de auditoria individual.
- Pessoa autenticada sem vinculo compartilhado ativo consultando apenas eventos individuais proprios.
- Pessoa com vinculo compartilhado ativo consultando eventos individuais proprios e eventos compartilhados autorizados.
- Pessoa tentando acessar evento de transacao individual do parceiro ou parceira.
- Pessoa tentando acessar evento de meta individual do parceiro ou parceira.
- Pessoa tentando acessar evento compartilhado depois que o vinculo compartilhado deixou de estar ativo.
- Transacao compartilhada criada por um membro e editada por outro membro ativo.
- Meta compartilhada criada por um membro e concluida ou arquivada por outro membro ativo.
- Item afetado foi arquivado, concluido ou removido da lista principal, mas o evento ainda precisa manter contexto autorizado.
- Autor da alteracao nao esta mais vinculado ao casal, mas o evento compartilhado permanece visivel para membros que continuam autorizados.
- Nome, apelido ou identificacao do autor esta indisponivel ou nao deve ser exposto alem do permitido.
- Muitos eventos recentes existem e a lista precisa permanecer compreensivel.
- Dois eventos acontecem em momentos proximos e precisam aparecer em ordem previsivel.
- Falha temporaria ao registrar evento de auditoria durante uma alteracao financeira importante.
- Falha temporaria ao carregar eventos de auditoria.
- Pessoa usando tela pequena, texto ampliado, teclado ou tecnologia assistiva.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST register a simple audit event when an authorized transaction is created.
- **FR-002**: System MUST register a simple audit event when an authorized transaction is edited in financially or contextually important fields.
- **FR-003**: System MUST register a simple audit event when an authorized transaction is excluded, cancelled, archived, or removed from the main user flow, if that action exists in the product.
- **FR-004**: System MUST register a simple audit event when an authorized financial goal is created.
- **FR-005**: System MUST register a simple audit event when an authorized financial goal is edited in important fields such as name, target value, current value, deadline, allowed visibility, or status.
- **FR-006**: System MUST register a simple audit event when an authorized financial goal is completed or archived.
- **FR-007**: Users MUST be able to consult recent audit events that they are authorized to access.
- **FR-008**: Each visible audit event MUST identify the action type, affected item type, moment of change, and safe context of the affected item.
- **FR-009**: Each visible audit event MUST identify the author when authorship is available and authorized to display.
- **FR-010**: System MUST provide a safe fallback message when authorship is unavailable or cannot be displayed without revealing private information.
- **FR-011**: System MUST clearly identify whether audit information is individual or shared.
- **FR-012**: System MUST preserve authorization and privacy boundaries for all financial audit data.
- **FR-013**: System MUST show events about individual transactions only to the person authorized to access those transactions.
- **FR-014**: System MUST show events about individual goals only to the owner of those goals.
- **FR-015**: System MUST show events about shared transactions or goals only to active members of the same shared financial space.
- **FR-016**: System MUST NOT grant access to shared audit events through pending, refused, cancelled, expired, unavailable, ended, or inactive relationships.
- **FR-017**: System MUST NOT reveal inaccessible audit data through lists, detail views, counters, empty states, loading states, error messages, summaries, ordering, or inferred differences.
- **FR-018**: System MUST allow a person without an active shared relationship to view audit events for their own individual data when such events exist.
- **FR-019**: System MUST stop showing previously authorized shared audit events to a person once that person's shared relationship is no longer active.
- **FR-020**: System MUST preserve enough authorized context to explain an event even when the affected item no longer appears in the main list, as long as the person remains authorized to see that context.
- **FR-021**: System MUST focus audit registration on financially or contextually relevant saved changes, not on visual interactions or cancelled actions.
- **FR-022**: System MUST NOT create visible audit events for opening screens, changing filters, sorting lists, navigating, or cancelling a form without saving.
- **FR-023**: System MUST communicate edits simply and MUST NOT require a complete field-by-field difference view for this feature.
- **FR-024**: System MUST present moments of change consistently and without ambiguity for users.
- **FR-025**: System MUST provide mobile-friendly and accessible behavior for essential audit journeys.
- **FR-026**: System MUST use neutral, objective, and non-accusatory language, avoiding surveillance tone, blame, charges, rankings, or competitive comparisons.
- **FR-027**: System MUST provide clear loading, error, retry, empty, and permission-unavailable states.
- **FR-028**: If a user can navigate from an event to the affected item, System MUST enforce the user's current authorization and fail safely if access is no longer available.

### Key Entities *(include if feature involves data)*

- **Audit Event**: A user-visible record of a relevant saved change to a financial transaction or goal. It includes the action type, affected item type, author when displayable, moment of change, visibility context, and a safe summary of the affected item.
- **Financial Transaction**: A revenue or expense record that may be individual or shared and can generate audit events when important saved changes occur.
- **Financial Goal**: An individual or shared financial objective that can generate audit events when created, edited, completed, or archived.
- **Actor**: The authenticated person who performed the audited action, or a safe unavailable-author state when authorship cannot be displayed.
- **Shared Financial Space**: The active shared context for a couple. It determines whether shared transactions, goals, and their audit events are visible to a person.
- **Visibility Context**: The individual or shared classification that determines who may access an item and its related audit events.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature keeps auditing focused on recent, important financial changes with concise event summaries, avoiding advanced reports, field-by-field histories, approval workflows, or excessive interaction tracking.
- **Financial Transparency**: Events explain who changed what, when, and in which individual or shared context, reducing ambiguity around financial responsibility while using neutral language.
- **Mobile & Accessibility**: Audit consultation must work on small screens, by keyboard, with visible focus, readable labels, clear states, and text that does not depend only on color, icon, or visual position.
- **Security & Privacy**: Audit events must follow the same authorization boundaries as the underlying transactions and goals, and must not reveal inaccessible data through messages, summaries, counts, empty states, or inferred differences.
- **Performance & Data Clarity**: The audit list must remain easy to scan with predictable ordering, consistent dates and times, clear item/action labels, and responsive loading behavior for recent events.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of users in usability evaluation can identify who performed a recent financial change within 10 seconds after viewing the audit list.
- **SC-002**: At least 90% of users can explain which item changed and what type of action occurred within 15 seconds after viewing an audit event.
- **SC-003**: At least 90% of users linked to a couple interpret the audit experience as transparency and trust support, not as ranking, blame, or personal judgment.
- **SC-004**: 100% of authorization scenarios exclude inaccessible audit events from lists, detail views, counters, empty states, loading states, and error messages.
- **SC-005**: 100% of inactive shared relationship scenarios prevent viewing shared audit events that are no longer authorized.
- **SC-006**: Important authorized changes to transactions and goals produce understandable events with authorship, moment, item type, action type, and safe context.
- **SC-007**: Users can consult audit events successfully on mobile-sized screens, by keyboard, and with assistive technologies without losing essential information.
- **SC-008**: Users can distinguish individual audit events from shared audit events before acting on or interpreting the event.

## Assumptions

- Audit events are intended for product transparency and user trust, not for legal, regulatory, forensic, fraud monitoring, or compliance-grade evidence.
- The feature covers important saved changes to transactions and goals only; authentication, invitations, categories, dashboard, charts, filters, navigation, and unsaved interactions are outside scope.
- If an action does not exist in previous features, such as a specific removal or archival action for transactions, F10 does not need to introduce that action solely to audit it.
- A recent-events experience is sufficient for this feature; advanced search, export, notifications, detailed filters, and field-by-field differences are outside scope.
- The audit experience should preserve enough authorized context for human understanding, but should not reveal more detail than the user could access from the underlying financial item.
