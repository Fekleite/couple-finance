# Feature Specification: F02 - Convite e vinculo do casal

**Feature Branch**: `002-convite-vinculo-casal`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "Convite e vinculo do casal: permitir que um usuario autenticado crie um espaco financeiro compartilhado, convide outra pessoa por e-mail, acompanhe o estado do convite e vincule os dois membros ao mesmo orcamento compartilhado apos aceite, com privacidade, autorizacao, mobile-first e acessibilidade."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar espaco e enviar convite (Priority: P1)

Como usuario autenticado sem vinculo de casal, quero criar um espaco financeiro compartilhado e convidar minha pessoa parceira por e-mail, para iniciar a organizacao financeira conjunta sem misturar dados de outras pessoas.

**Why this priority**: Este e o primeiro passo que transforma a area autenticada individual em uma experiencia de casal e libera valor para todas as jornadas seguintes.

**Independent Test**: Pode ser testado com um usuario autenticado sem orcamento compartilhado, criando o espaco, informando um e-mail valido e verificando que o convite fica pendente e visivel ao remetente.

**Acceptance Scenarios**:

1. **Given** um usuario autenticado sem orcamento compartilhado, **When** ele cria um espaco compartilhado e informa o e-mail da pessoa convidada, **Then** o sistema registra o espaco, cria um convite pendente e mostra confirmacao clara do envio.
2. **Given** um usuario autenticado que ja pertence a um orcamento compartilhado ativo, **When** ele tenta criar outro espaco ou enviar novo convite como criador, **Then** o sistema bloqueia a acao e explica que so e permitido um orcamento compartilhado ativo por usuario no MVP.
3. **Given** um usuario autenticado sem vinculo, **When** ele informa um e-mail invalido ou vazio, **Then** o sistema nao cria convite e mostra mensagem de validacao associada ao campo.

---

### User Story 2 - Aceitar convite recebido (Priority: P1)

Como pessoa convidada, quero visualizar um convite valido e aceita-lo, para ficar vinculada ao mesmo orcamento compartilhado da pessoa que me convidou.

**Why this priority**: Sem aceite, o convite nao gera o vinculo de casal; esta jornada completa a promessa central da feature.

**Independent Test**: Pode ser testado com um convite pendente enderecado ao usuario autenticado, aceitando-o e confirmando que ambos os membros passam a compartilhar o mesmo orcamento.

**Acceptance Scenarios**:

1. **Given** um convite pendente e valido para o e-mail do usuario autenticado, **When** o usuario aceita o convite, **Then** o sistema vincula esse usuario ao mesmo orcamento compartilhado do remetente e marca o convite como aceito.
2. **Given** uma pessoa convidada sem conta, **When** ela acessa o convite, **Then** o sistema informa que ela precisa criar conta ou entrar para concluir o aceite, sem expor dados financeiros do remetente.
3. **Given** um usuario que ja pertence a outro orcamento compartilhado ativo, **When** ele tenta aceitar um convite, **Then** o sistema bloqueia o aceite e informa que apenas um orcamento compartilhado ativo e permitido no MVP.

---

### User Story 3 - Recusar ou cancelar convite (Priority: P2)

Como pessoa envolvida em um convite, quero recusar um convite recebido ou cancelar um convite enviado, para manter controle sobre vinculos que ainda nao foram aceitos.

**Why this priority**: A jornada reduz constrangimento e risco de vinculos incorretos, mantendo consentimento explicito entre as duas pessoas.

**Independent Test**: Pode ser testado com convites pendentes em dois papeis: pessoa convidada recusando e remetente cancelando, verificando que nenhum vinculo e criado.

**Acceptance Scenarios**:

1. **Given** um convite pendente para o usuario autenticado, **When** ele recusa o convite, **Then** o sistema marca o convite como recusado, nao cria vinculo e mostra confirmacao.
2. **Given** um convite pendente enviado pelo usuario autenticado, **When** ele cancela o convite, **Then** o sistema marca o convite como cancelado, impede aceite futuro e mostra confirmacao.
3. **Given** um convite recusado ou cancelado, **When** alguem tenta aceita-lo, **Then** o sistema informa que o convite nao esta mais disponivel e nao cria vinculo.

---

### User Story 4 - Entender estado do vinculo (Priority: P3)

Como usuario autenticado, quero ver claramente meu estado atual de vinculo, para saber se preciso criar um espaco, aguardar aceite, responder a um convite ou comecar a usar o espaco compartilhado.

**Why this priority**: Clareza de estado evita ambiguidade sobre responsabilidades, convite e acesso, especialmente antes das features financeiras.

**Independent Test**: Pode ser testado simulando os estados sem orcamento, convite enviado, convite recebido, casal vinculado, convite expirado e convite indisponivel.

**Acceptance Scenarios**:

1. **Given** um usuario sem orcamento compartilhado e sem convite pendente, **When** ele acessa a area privada, **Then** o sistema apresenta a opcao principal de criar um espaco compartilhado.
2. **Given** um usuario com convite enviado pendente, **When** ele acessa a area privada, **Then** o sistema mostra o e-mail convidado, o status pendente e a opcao de cancelar.
3. **Given** um usuario vinculado a um orcamento compartilhado, **When** ele acessa a area privada, **Then** o sistema mostra que o espaco compartilhado esta ativo sem exibir dados financeiros ainda nao implementados.

### Edge Cases

- Convite inexistente, expirado, cancelado, recusado ou ja aceito deve mostrar mensagem segura e compreensivel sem revelar informacoes financeiras.
- Usuario autenticado que nao e remetente nem destinatario do convite nao pode visualizar, aceitar, recusar ou cancelar esse convite.
- Convite para e-mail que pertence ao proprio remetente deve ser bloqueado com mensagem clara.
- Convite para usuario ja vinculado a outro orcamento compartilhado ativo deve permanecer indisponivel para aceite.
- Tentativas repetidas de aceite, recusa ou cancelamento devem manter um unico resultado consistente e nao criar vinculos duplicados.
- Estados de carregamento devem preservar privacidade e nao exibir informacoes de convite ou vinculo antes da confirmacao de autorizacao.
- Em telas pequenas, todas as acoes essenciais devem permanecer visiveis, acionaveis por toque e navegaveis por teclado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated user with no active shared budget to create one shared couple budget.
- **FR-002**: System MUST allow the creator of a shared budget to invite one other person by e-mail.
- **FR-003**: System MUST limit each active shared budget to a maximum of two active members in the MVP.
- **FR-004**: System MUST prevent a user from belonging to more than one active shared budget at the same time.
- **FR-005**: System MUST prevent a user who already belongs to an active shared budget from creating another active shared budget.
- **FR-006**: System MUST create invitations with explicit states: pending, accepted, declined, cancelled, and expired.
- **FR-007**: System MUST allow the invited authenticated user to accept a valid pending invitation addressed to them.
- **FR-008**: System MUST link the invited user to the same shared budget as the inviter when a valid invitation is accepted.
- **FR-009**: System MUST allow the invited authenticated user to decline a valid pending invitation addressed to them.
- **FR-010**: System MUST allow the inviter to cancel a pending invitation they sent.
- **FR-011**: System MUST prevent declined, cancelled, expired, invalid, or already accepted invitations from creating a couple link.
- **FR-012**: System MUST make pending invitations expire after 7 calendar days.
- **FR-013**: System MUST inform unauthenticated invite recipients that they need to sign in or create an account before accepting or declining an invitation.
- **FR-014**: System MUST show the current relationship state for each authenticated user: no shared budget, invitation sent, invitation received, couple linked, or invitation unavailable.
- **FR-015**: System MUST show clear success, error, loading, empty, and unavailable-action messages for all invitation and linking flows.
- **FR-016**: System MUST identify who sent the invitation and the shared space being joined without exposing balances, transactions, goals, categories, or other financial details.
- **FR-017**: System MUST ensure only authorized users can view, accept, decline, or cancel invitations related to them.
- **FR-018**: System MUST block invitations sent to the inviter's own e-mail address.
- **FR-019**: System MUST handle repeated accept, decline, and cancel attempts consistently without creating duplicate links or contradictory invitation states.
- **FR-020**: System MUST keep the completed couple link available as the shared context for future financial features.
- **FR-021**: System MUST clearly identify whether the user is acting as inviter, invitee, or linked member in invitation-related screens.
- **FR-022**: System MUST provide mobile-friendly and accessible behavior for all essential journeys, including labels, validation messages, focus visibility, keyboard navigation, and perceivable feedback.

### Key Entities

- **Shared Budget**: Represents the couple's shared financial space. It has a lifecycle state, a creator, up to two active members in the MVP, and will be the shared context for future transactions, goals, dashboards, and permissions.
- **Budget Member**: Represents a user's membership in a shared budget. It identifies the user, the shared budget, membership status, and whether the member is the creator or invited participant.
- **Invitation**: Represents a request for another person to join a shared budget. It includes inviter, invited e-mail, related shared budget, current state, creation date, expiration date, and final response date when applicable.
- **Relationship State**: Represents the user's current product state for this feature: no shared budget, invitation sent, invitation received, couple linked, or invitation unavailable.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature keeps the primary journey short: create shared space, invite by e-mail, accept or decline, then confirm the linked state. Each state has one clear next action.
- **Financial Transparency**: The feature establishes the shared context required for later financial data while explicitly avoiding balances, transactions, goals, and comparisons in this scope.
- **Mobile & Accessibility**: Invitation creation, response, cancellation, and state review must work on small screens, with clear labels, validation, focus order, keyboard support, and perceivable feedback.
- **Security & Privacy**: Invitation visibility and actions are restricted to the inviter and the invited user. Invalid or unauthorized access must use safe messages and must not expose financial data.
- **Performance & Data Clarity**: Users should see relationship and invitation states quickly and without flicker, especially before any private shared context is displayed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of users in usability testing can create a shared space and send an invitation in under 2 minutes on a mobile-sized screen.
- **SC-002**: 90% of invited authenticated users can understand the invitation and accept or decline it in under 1 minute.
- **SC-003**: 100% of invalid, expired, cancelled, declined, already accepted, or unauthorized invitation attempts avoid exposing balances, transactions, goals, or other financial details.
- **SC-004**: 100% of accepted valid invitations result in exactly two active members linked to one shared budget.
- **SC-005**: 0 duplicate active couple links are created during repeated accept, decline, cancel, or retry attempts in validation scenarios.
- **SC-006**: Users can identify their current state, no shared budget, invitation sent, invitation received, couple linked, or invitation unavailable, without external help in at least 90% of tested sessions.
- **SC-007**: All primary invitation flows can be completed with keyboard navigation and visible focus indicators.
- **SC-008**: All invitation forms and action results include perceivable success, error, loading, and validation feedback.

## Assumptions

- Users must already have authentication and session capabilities available from F01.
- The MVP supports only couples with two active members in a shared budget.
- Each user can belong to only one active shared budget at a time.
- Pending invitations expire after 7 calendar days if not accepted, declined, or cancelled.
- The shared budget created in this feature is an empty container for future financial data; no transactions, categories, goals, charts, or dashboard values are introduced here.
- Invitation delivery by e-mail is part of the expected user experience, but the specification focuses on the user-facing invitation lifecycle rather than how the message is delivered.
- Text should use neutral, welcoming, non-judgmental language for both partners.
