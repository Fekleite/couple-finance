# Feature Specification: F03 - Modelo de permissoes e isolamento de dados

**Feature Branch**: `003-data-permissions-isolation`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "F03 - Modelo de permissoes e isolamento de dados: garantir que cada pessoa autenticada veja, crie, altere ou remova apenas dados proprios ou dados compartilhados do casal ao qual pertence, com regras claras para estados de vinculo, entidades atuais de casal, entidades financeiras futuras, mensagens seguras, criterios de aceite positivos e negativos, responsividade, acessibilidade e linguagem neutra."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acessar apenas dados permitidos (Priority: P1)

Como pessoa autenticada, quero que o produto mostre somente meus dados individuais e os dados compartilhados do casal ao qual pertenco, para confiar que minhas informacoes financeiras nao serao expostas a terceiros nem ao parceiro quando forem individuais.

**Why this priority**: Esta e a base de confianca do produto. Sem isolamento correto, qualquer feature financeira futura pode expor dados sensiveis.

**Independent Test**: Pode ser testado com usuarios em estados diferentes, validando que cada um ve apenas os dados individuais proprios e, quando houver vinculo ativo, os dados compartilhados do seu casal.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada sem vinculo ativo, **When** ela acessa uma area que lista dados individuais, **Then** o sistema mostra apenas dados individuais pertencentes a ela.
2. **Given** uma pessoa autenticada com vinculo de casal ativo, **When** ela acessa dados compartilhados do casal, **Then** o sistema mostra apenas dados associados ao casal ativo ao qual ela pertence.
3. **Given** uma pessoa autenticada com vinculo de casal ativo, **When** ela acessa seus dados individuais, **Then** o sistema nao mostra esses dados automaticamente ao parceiro.
4. **Given** uma pessoa que nao pertence a um casal, **When** ela tenta acessar dados compartilhados de qualquer casal, **Then** o sistema bloqueia o acesso com mensagem segura e nao revela detalhes do casal.

---

### User Story 2 - Bloquear acesso por estado de vinculo (Priority: P1)

Como pessoa envolvida em convite ou vinculo de casal, quero que minhas permissoes mudem conforme meu estado real de relacionamento, para que um convite pendente ou indisponivel nao conceda acesso indevido.

**Why this priority**: Convites sao a fronteira entre uso individual e uso compartilhado. O acesso compartilhado so deve existir depois de aceite valido e vinculo ativo.

**Independent Test**: Pode ser testado simulando estados sem vinculo, convite enviado, convite recebido, vinculo ativo e vinculo indisponivel, verificando informacoes visiveis e acoes permitidas em cada estado.

**Acceptance Scenarios**:

1. **Given** uma pessoa com convite enviado pendente, **When** ela acessa o estado do convite, **Then** o sistema mostra apenas informacoes necessarias do convite e nao concede acesso aos dados individuais da pessoa convidada.
2. **Given** uma pessoa com convite recebido pendente, **When** ela acessa o convite, **Then** o sistema permite responder ao convite, mas nao mostra dados compartilhados antes do aceite valido.
3. **Given** um convite aceito validamente, **When** o vinculo de casal passa a ativo, **Then** ambos os membros podem acessar o contexto compartilhado desse casal.
4. **Given** um convite recusado, cancelado, expirado ou indisponivel, **When** qualquer pessoa tenta usa-lo para acessar dados compartilhados, **Then** o sistema bloqueia a acao e informa que o convite nao esta disponivel.

---

### User Story 3 - Evitar vazamento indireto (Priority: P2)

Como pessoa usuaria, quero que erros, estados vazios, contadores, filtros, buscas e mensagens nao revelem dados de outras pessoas, para que informacoes financeiras e de relacionamento fiquem privadas mesmo quando uma tentativa falha.

**Why this priority**: Privacidade nao depende apenas de bloquear telas; vazamentos por mensagens e resultados parciais tambem comprometem a seguranca percebida e real.

**Independent Test**: Pode ser testado com tentativas de acessar dados inexistentes, indisponiveis ou pertencentes a outro casal, verificando que as respostas nao confirmam a existencia de usuarios, convites, orcamentos ou dados financeiros.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada tenta acessar um dado de outro casal, **When** o acesso e negado, **Then** a mensagem nao confirma se o dado existe.
2. **Given** uma busca, lista, filtro, contador ou estado vazio poderia incluir dados nao autorizados, **When** o resultado e exibido, **Then** somente dados permitidos entram no resultado ou na contagem.
3. **Given** um convite ou orcamento indisponivel, **When** uma pessoa nao relacionada tenta acessa-lo, **Then** o sistema apresenta mensagem generica e acionavel sem expor nomes, e-mails, saldos, transacoes, metas ou categorias.

---

### User Story 4 - Entender rotulos e limites de visibilidade (Priority: P3)

Como pessoa usuaria, quero entender quando uma informacao e individual, compartilhada ou inacessivel, para tomar decisoes financeiras sem ambiguidade sobre quem pode ver ou alterar cada dado.

**Why this priority**: Clareza de visibilidade reduz conflitos no casal e prepara o uso seguro de transacoes, categorias, metas, saldos, graficos e auditoria.

**Independent Test**: Pode ser testado revisando telas, mensagens e estados com pessoas usuarias, verificando se elas identificam corretamente o escopo de visibilidade de cada informacao.

**Acceptance Scenarios**:

1. **Given** uma informacao individual, **When** ela aparece para a pessoa dona, **Then** o sistema indica que ela pertence somente a essa pessoa.
2. **Given** uma informacao compartilhada, **When** ela aparece para membros ativos do casal, **Then** o sistema indica que ela pertence ao espaco compartilhado do casal.
3. **Given** uma pessoa sem permissao para uma informacao, **When** ela tenta acessa-la, **Then** o sistema explica que a informacao nao esta disponivel para ela sem linguagem acusatoria ou exposicao sensivel.

### Edge Cases

- Convite pendente enviado nao concede acesso aos dados individuais da pessoa convidada nem aos futuros dados compartilhados antes do aceite.
- Convite pendente recebido nao concede acesso ao espaco compartilhado antes do aceite valido.
- Convites recusados, cancelados, expirados, ja aceitos ou indisponiveis nao concedem acesso nem revelam detalhes alem do necessario para orientar a pessoa.
- Pessoa autenticada sem vinculo ativo nao pode listar, contar, filtrar, buscar, alterar ou excluir dados compartilhados de casais.
- Pessoa autenticada vinculada a um casal nao pode acessar dados compartilhados de outro casal.
- Dados individuais de uma pessoa vinculada nao aparecem automaticamente para o parceiro em listas, resumos, filtros, saldos, graficos ou futuras telas financeiras.
- Acoes repetidas, simultaneas ou em carregamento nao podem criar permissao duplicada, estado contraditorio ou exposicao temporaria.
- Estados de carregamento nao devem exibir dados privados antes da confirmacao de permissao.
- Estados vazios devem informar ausencia de dados permitidos, nao ausencia global de dados no produto.
- Mensagens de erro para dado inexistente, removido, indisponivel ou nao autorizado devem ser seguras e nao revelar qual dessas causas ocorreu quando isso puder expor informacao sensivel.
- Em telas pequenas, com texto ampliado, toque, teclado ou tecnologia assistiva, os rotulos de visibilidade e mensagens de permissao devem continuar compreensiveis e acionaveis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST classify user-facing data as individual, shared, or inaccessible for the current authenticated user.
- **FR-002**: System MUST allow a person to view, create, update, and remove their own individual data, subject to the rules of each future financial feature.
- **FR-003**: System MUST prevent individual data from being shown to the partner unless a future feature explicitly changes that data into shared data through a user-visible action.
- **FR-004**: System MUST allow active members of a couple to view shared data belonging to their active shared financial space.
- **FR-005**: System MUST prevent anyone outside an active couple from viewing, listing, searching, counting, changing, or removing that couple's shared data.
- **FR-006**: System MUST prevent a pending, declined, cancelled, expired, unavailable, or otherwise inactive invitation from granting access to shared data.
- **FR-007**: System MUST grant shared access only after a valid invitation acceptance results in an active couple link.
- **FR-008**: System MUST define visible information and allowed actions for these access states: no couple link, sent pending invitation, received pending invitation, active couple link, unavailable invitation, and ended or inactive couple link.
- **FR-009**: System MUST restrict shared budget visibility to active members of that shared budget.
- **FR-010**: System MUST restrict member visibility so a person can see membership information only for their own active couple context or invitations directly involving them.
- **FR-011**: System MUST restrict invitation visibility and actions to the inviter, the invited authenticated person, or a person whose current account is required to respond to that invitation.
- **FR-012**: System MUST apply the same isolation expectations to future categories, transactions, goals, balances, charts, lists, filters, summaries, and audit entries.
- **FR-013**: System MUST ensure lists, filters, search results, totals, counts, charts, and summaries are calculated only from data the current user is allowed to access.
- **FR-014**: System MUST show safe messages for unavailable, unauthorized, nonexistent, removed, expired, or inaccessible resources without confirming sensitive existence details to unauthorized users.
- **FR-015**: System MUST show understandable feedback when an action is blocked because the person lacks permission.
- **FR-016**: System MUST clearly label or contextualize whether visible financial information is individual or shared whenever ambiguity could affect user decisions.
- **FR-017**: System MUST preserve the MVP rule that a person can belong to only one active shared financial space at a time.
- **FR-018**: System MUST preserve the MVP rule that a shared financial space has at most two active members.
- **FR-019**: System MUST keep loading, empty, error, success, and unavailable states private by default until the current person's access has been determined.
- **FR-020**: System MUST support mobile-friendly and accessible permission-related experiences, including clear labels, focus visibility, keyboard operation, perceivable status messages, and text that remains usable with enlarged display settings.
- **FR-021**: System MUST use neutral, non-judgmental language when explaining blocked access, shared visibility, individual visibility, or partner-related permissions.
- **FR-022**: System MUST provide a permission matrix that can be used by later financial features to decide whether each user state can view, create, update, delete, list, search, count, or summarize each data type.

### Permission Matrix

| Access state | Individual data | Shared budget and member context | Invitations | Future shared financial data |
|--------------|-----------------|----------------------------------|-------------|------------------------------|
| No couple link | Can access own individual data only | Cannot access shared couple context | Can start or receive invitation flows allowed by the invitation feature | Cannot access shared financial data |
| Sent pending invitation | Can access own individual data only | Can see own pending shared setup state, not the invitee's private data | Can view and cancel the invitation they sent | Cannot access shared financial data before valid acceptance |
| Received pending invitation | Can access own individual data only | Cannot access shared couple context before acceptance | Can view and respond to invitation addressed to them | Cannot access shared financial data before valid acceptance |
| Active couple link | Can access own individual data only | Can access shared context for their active couple | Can see relevant completed or current invitation context for their couple when needed | Can access shared financial data belonging to their active couple |
| Unavailable invitation | Can access own individual data only | Cannot gain shared access from this invitation | Can see safe unavailable-state guidance only | Cannot access shared financial data |
| Ended or inactive couple link | Can access own individual data only | Cannot access active shared context unless a future feature defines historical access rules | Cannot use inactive relationship state to gain access | Cannot access active shared financial data |
| Unrelated authenticated user | Can access own individual data only | Cannot access another couple's context | Cannot view or act on unrelated invitations | Cannot access another couple's shared financial data |

### Key Entities

- **Authenticated Person**: A signed-in user whose access is evaluated for each product state, action, and visible result.
- **Individual Data**: Information owned by one authenticated person and not automatically visible to their partner.
- **Shared Financial Space**: The couple's shared context created by the invitation and linking feature; it is accessible only to active members.
- **Couple Member**: A person with a membership state in a shared financial space, such as creator, invited participant, active member, or inactive member.
- **Invitation**: A request to join a shared financial space. Its state determines whether the recipient can respond, but it does not grant shared access before valid acceptance.
- **Permission State**: The current access posture for a person, derived from authentication, invitation status, couple membership, and whether the requested data is individual, shared, or inaccessible.
- **Future Financial Record**: Any later category, transaction, goal, balance, chart result, list item, filter result, summary, or audit entry that must inherit the isolation model.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature gives each state clear allowed actions and safe blocked-action feedback, reducing confusion about what the person can do next.
- **Financial Transparency**: The feature explicitly separates individual data, shared couple data, and inaccessible data so future financial views do not blur ownership or visibility.
- **Mobile & Accessibility**: Permission labels, blocked-action messages, loading states, and empty states must work on small screens, with keyboard access, visible focus, perceivable feedback, and readable text.
- **Security & Privacy**: The feature defines privacy boundaries for users, couples, invitations, shared context, and future financial records, including protection against indirect disclosure.
- **Performance & Data Clarity**: User-facing lists, counts, filters, summaries, and charts must be based only on permitted data and should avoid flicker or temporary exposure during loading.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authorization validation scenarios prevent unrelated authenticated users from viewing, listing, searching, counting, changing, or removing another person's or another couple's data.
- **SC-002**: 100% of pending, declined, cancelled, expired, unavailable, or inactive invitation scenarios fail to grant shared financial access.
- **SC-003**: 100% of future financial-data acceptance scenarios can classify each requested item as individual, shared, or inaccessible for the current person.
- **SC-004**: At least 90% of usability-test participants can correctly identify whether sample information is individual, shared, or unavailable after reviewing the product labels and messages.
- **SC-005**: At least 95% of blocked-access messages in review are judged understandable without revealing names, e-mails, balances, transactions, goals, categories, or existence of unrelated private data.
- **SC-006**: All primary permission states can be reviewed on a mobile-sized screen without horizontal scrolling or hidden primary actions.
- **SC-007**: All permission-related messages and actions are operable by keyboard and provide perceivable status feedback.
- **SC-008**: No list, filter, count, summary, chart, or empty state in validation scenarios includes data outside the current person's allowed visibility.

## Assumptions

- Authentication and session behavior already exist from F01.
- Invitation and couple-link states already exist from F02 and remain the source of the user's relationship state.
- The MVP supports one active shared financial space per person and at most two active members per shared financial space.
- This feature defines the product permission model for current couple-linking data and for future financial records; it does not introduce transactions, categories, goals, dashboards, charts, or audit screens.
- Historical access after an ended or inactive couple link is not part of the MVP unless a future feature specifies explicit retention and viewing rules.
- When a safer message conflicts with a more specific message, the safer message wins.
- Product copy should prefer calm, neutral wording such as "Esta informacao nao esta disponivel para voce" over accusatory language.
