# Feature Specification: F05 - Registro de transacoes

**Feature Branch**: `005-register-transactions`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "F05 - Permitir que pessoas autenticadas registrem receitas e despesas com titulo, valor, tipo, data, categoria padrao, responsavel, visibilidade individual ou compartilhada e observacao opcional, respeitando o vinculo do casal, o isolamento de dados e uma experiencia mobile-first acessivel."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar transacao individual (Priority: P1)

Como pessoa autenticada, quero registrar uma receita ou despesa individual com
seus dados essenciais para acompanhar minhas movimentacoes sem expo-las ao meu
parceiro ou parceira.

**Why this priority**: O registro individual entrega o habito central do produto
para qualquer pessoa autenticada, inclusive quem nao possui vinculo de casal
ativo.

**Independent Test**: Pode ser testado por uma pessoa autenticada que preenche
uma transacao individual valida, confirma o registro e verifica que a
confirmacao identifica corretamente tipo, valor, categoria, responsavel e
visibilidade sem disponibilizar o registro a outra pessoa.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada preenche titulo, valor positivo, tipo, data e categoria padrao validos, **When** confirma uma transacao individual, **Then** o sistema registra a movimentacao com a propria pessoa como responsavel e apresenta uma confirmacao clara.
2. **Given** uma transacao individual registrada, **When** o parceiro, uma pessoa nao relacionada ou qualquer contexto compartilhado tenta acessa-la ou inferir sua existencia, **Then** o sistema nao disponibiliza nem sugere o registro.
3. **Given** uma pessoa sem vinculo de casal ativo, **When** registra uma transacao, **Then** ela consegue concluir normalmente o fluxo individual.

---

### User Story 2 - Registrar transacao compartilhada (Priority: P2)

Como membro ativo de um casal, quero registrar uma receita ou despesa no espaco
compartilhado e indicar o membro responsavel para que ambos entendam a
visibilidade e a responsabilidade da movimentacao.

**Why this priority**: O registro compartilhado transforma o controle individual
em uma experiencia financeira de casal, preservando transparencia sobre quem
criou, quem e responsavel e quem pode acessar.

**Independent Test**: Pode ser testado com dois membros ativos do mesmo espaco:
um deles registra uma transacao compartilhada, escolhe um membro ativo como
responsavel e ambos conseguem acessar o registro, enquanto pessoas externas nao
conseguem.

**Acceptance Scenarios**:

1. **Given** uma pessoa pertence a um espaco compartilhado ativo, **When** escolhe visibilidade compartilhada, **Then** o sistema permite selecionar como responsavel somente um dos membros ativos desse mesmo espaco.
2. **Given** uma pessoa confirma uma transacao compartilhada valida, **When** o registro e concluido, **Then** ambos os membros ativos podem acessa-lo e identificar sua visibilidade, seu responsavel e quem o criou.
3. **Given** uma pessoa sem vinculo ativo ou apenas com convite pendente, recusado, cancelado, expirado ou indisponivel, **When** tenta registrar uma transacao compartilhada, **Then** o sistema bloqueia a acao com orientacao segura.
4. **Given** uma pessoa tenta selecionar como responsavel alguem externo, inativo ou pertencente a outro espaco, **When** confirma a transacao, **Then** o sistema bloqueia o registro sem revelar informacoes privadas.

---

### User Story 3 - Corrigir dados invalidos e concluir com confianca (Priority: P3)

Como pessoa registrando uma movimentacao, quero receber validacoes claras,
preservar meus dados apos falhas recuperaveis e evitar registros duplicados para
concluir a tarefa com confianca.

**Why this priority**: Erros de valor, categoria, permissao ou envio podem
comprometer a confianca financeira se criarem registros incorretos, duplicados
ou ambiguos.

**Independent Test**: Pode ser testado submetendo combinacoes invalidas, uma
falha recuperavel e confirmacoes repetidas, verificando orientacao por campo,
preservacao segura dos dados e criacao de no maximo uma transacao.

**Acceptance Scenarios**:

1. **Given** um campo obrigatorio ausente ou invalido, **When** a pessoa tenta confirmar, **Then** o sistema nao registra a transacao e indica como corrigir cada problema relevante.
2. **Given** uma categoria selecionada fica indisponivel antes da confirmacao, **When** a pessoa envia o formulario, **Then** o sistema exige uma nova escolha e nao substitui automaticamente a categoria por "Outros".
3. **Given** uma falha recuperavel impede o registro, **When** o sistema informa o problema, **Then** preserva os dados que ainda sao seguros e permite nova tentativa.
4. **Given** uma confirmacao esta em andamento, **When** a pessoa toca ou aciona repetidamente a confirmacao, **Then** o sistema cria no maximo uma transacao.

---

### User Story 4 - Registrar transacao em mobile e com acessibilidade (Priority: P4)

Como pessoa usando celular, teclado ou tecnologia assistiva, quero compreender,
preencher e confirmar o registro sem depender de desktop, cor ou ajuda externa.

**Why this priority**: Registrar movimentacoes e uma acao frequente e sensivel
que precisa permanecer simples e confiavel em qualquer forma de interacao.

**Independent Test**: Pode ser testado concluindo o fluxo em tela pequena, com
teclado e com tecnologia assistiva, verificando rotulos, ordem de foco,
mensagens e estados perceptiveis.

**Acceptance Scenarios**:

1. **Given** uma pessoa em tela pequena, **When** preenche e confirma uma transacao, **Then** todos os campos e acoes essenciais permanecem legiveis e acionaveis sem rolagem horizontal.
2. **Given** uma pessoa usa teclado ou tecnologia assistiva, **When** percorre o formulario, **Then** consegue identificar, preencher, validar e confirmar todos os campos em ordem compreensivel.
3. **Given** o formulario apresenta erro, carregamento ou sucesso, **When** o estado muda, **Then** a pessoa percebe a mudanca sem depender apenas de cor ou icones.

### Edge Cases

- O vinculo do casal deixa de estar ativo durante o preenchimento ou a
  confirmacao de uma transacao compartilhada.
- O membro escolhido como responsavel deixa de estar ativo antes da
  confirmacao.
- A pessoa muda a visibilidade de compartilhada para individual depois de
  escolher outra pessoa como responsavel.
- A categoria escolhida fica indisponivel ou desconhecida antes da
  confirmacao.
- O valor e zero, negativo, invalido ou excede o limite monetario aceito pelo
  produto.
- A data informada e invalida.
- O titulo contem somente espacos ou excede o tamanho aceito.
- A observacao opcional fica vazia ou excede o tamanho aceito.
- O envio falha temporariamente depois de a pessoa confirmar.
- A pessoa aciona repetidamente a confirmacao durante lentidao.
- Uma pessoa tenta registrar uma transacao em um contexto individual ou
  compartilhado ao qual nao possui acesso.
- O formulario e usado em tela pequena, com texto ampliado, teclado ou
  tecnologia assistiva.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated person to create a financial transaction classified as either income or expense.
- **FR-002**: System MUST require every transaction to have a title, positive monetary amount greater than zero, type, valid transaction date, one available standard category, responsible person, and visibility.
- **FR-003**: System MUST allow an optional observation to provide additional transaction context.
- **FR-004**: System MUST interpret income or expense through the transaction type and MUST NOT require negative amounts.
- **FR-005**: System MUST associate each transaction with exactly one available standard category.
- **FR-006**: System MUST NOT automatically replace an unavailable or unknown category with "Outros".
- **FR-007**: System MUST allow every authenticated person to create an individual transaction, regardless of couple-link state.
- **FR-008**: System MUST make the creator the responsible person for an individual transaction.
- **FR-009**: System MUST restrict an individual transaction to its creator and MUST NOT expose, count, or imply it to a partner or unrelated person.
- **FR-010**: System MUST allow shared transaction creation only for a person who is an active member of the selected shared financial space.
- **FR-011**: System MUST prevent pending, declined, cancelled, expired, unavailable, ended, or inactive relationship states from granting shared transaction creation access.
- **FR-012**: System MUST allow only an active member of the same shared financial space to be selected as responsible for a shared transaction.
- **FR-013**: System MUST allow both active members of the shared financial space to access a shared transaction created in that space.
- **FR-014**: System MUST preserve and distinguish the transaction creator, responsible person, and visibility.
- **FR-015**: System MUST clearly communicate whether the transaction will be individual or shared before confirmation.
- **FR-016**: System MUST start the form with safe, understandable defaults that do not ambiguously select shared visibility.
- **FR-017**: System MUST require a valid responsible person after any visibility change and MUST NOT silently preserve a person who is no longer eligible.
- **FR-018**: System MUST revalidate category availability, responsible-person eligibility, relationship state, and authorization when the transaction is confirmed.
- **FR-019**: System MUST validate required and invalid fields before creating a transaction and provide actionable guidance associated with the relevant fields.
- **FR-020**: System MUST communicate submission progress and create no more than one transaction from repeated confirmation of the same in-progress submission.
- **FR-021**: System MUST present a successful-registration confirmation that summarizes type, amount, category, responsible person, and visibility and allows the person to begin another registration.
- **FR-022**: System MUST preserve safely reusable entered data after a recoverable failure and allow another attempt.
- **FR-023**: System MUST use safe error messages that do not reveal people, transactions, relationship states, or shared spaces outside the current person's authorization.
- **FR-024**: System MUST use neutral, non-judgmental language for income, expenses, responsibility, visibility, validation, and error states.
- **FR-025**: System MUST present currency, date, category, responsible person, and visibility consistently with the rest of the product.
- **FR-026**: System MUST keep all essential registration actions usable on small screens without horizontal scrolling.
- **FR-027**: System MUST provide clear labels, logical focus order, visible focus, keyboard operation, and perceivable validation, loading, error, and success feedback.
- **FR-028**: System MUST limit this feature to creating transactions and MUST NOT introduce transaction listing, filtering, search, editing, deletion, totals, balances, dashboards, charts, custom categories, automatic categorization, recurrence, scheduling, installments, attachments, bank import, multiple currencies, partner approval, or detailed audit history.

### Key Entities

- **Financial Transaction**: A recorded income or expense. Its essential
  attributes are title, positive amount, type, transaction date, one standard
  category, creator, responsible person, visibility, optional observation and
  creation time.
- **Transaction Visibility**: The authorized context of a transaction. It is
  either individual, accessible only to its creator, or shared, accessible to
  active members of one shared financial space.
- **Transaction Creator**: The authenticated person who submits the transaction
  and remains identifiable independently from the responsible person.
- **Responsible Person**: The person associated with responsibility for the
  transaction. It is always the creator for individual transactions and one
  active member of the same shared space for shared transactions.
- **Standard Financial Category**: An available standard classification reused
  from the product category catalog. Exactly one category classifies each
  transaction without determining ownership or visibility.
- **Shared Financial Space**: The active couple context in which authorized
  members may create and access shared transactions.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature keeps the frequent registration flow focused
  on essential fields, provides clear validation and confirmation, and supports
  immediate retry after recoverable failure.
- **Financial Transparency**: Every transaction identifies its type, category,
  creator, responsible person and individual or shared visibility without
  conflating those concepts.
- **Mobile & Accessibility**: The complete registration journey works on small
  screens, by keyboard and with assistive technologies, with clear labels,
  logical focus and perceivable status feedback.
- **Security & Privacy**: Individual transactions remain private to their
  creator; shared transactions require active membership; all authorization is
  revalidated at confirmation; messages do not disclose inaccessible data.
- **Performance & Data Clarity**: Repeated confirmation creates no duplicate,
  submission state is communicated promptly, and monetary values, dates,
  categories and responsibility remain consistent and understandable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of participants can register a valid common transaction on a mobile-sized screen in under 60 seconds without external help.
- **SC-002**: 100% of successfully created transactions contain a valid title, positive amount, type, date, available standard category, eligible responsible person, and explicit visibility.
- **SC-003**: 100% of authorization validation scenarios prevent unauthorized people from creating, accessing, counting, or inferring individual or shared transactions.
- **SC-004**: 100% of repeated-confirmation validation scenarios create no more than one transaction for the same in-progress submission.
- **SC-005**: At least 90% of usability-review participants correctly identify whether a sample transaction will be individual or shared, who is responsible, and who created it before confirming.
- **SC-006**: 100% of invalid-field review scenarios block creation and provide understandable corrective guidance for every relevant field.
- **SC-007**: The complete registration flow can be completed on a mobile-sized screen without horizontal scrolling and by keyboard without an inaccessible essential action.
- **SC-008**: Accessibility review confirms that labels, focus, validation, loading, error and success states are perceivable without relying only on color or icons.
- **SC-009**: Privacy review finds zero registration messages or states that reveal or imply transactions, people or shared spaces outside the current person's authorization.

## Assumptions

- Authentication and session behavior from F01 are available before transaction
  registration.
- Couple-link and shared financial space states from F02 remain the source of
  active membership.
- Permission and isolation rules from F03 apply to every transaction action and
  state.
- The standard category catalog from F04 is the only category source for this
  feature.
- Product copy and financial formatting use Brazilian Portuguese and the
  product's single MVP currency.
- The product defines reasonable accepted lengths and monetary boundaries
  consistently during planning without changing the business rules in this
  specification.
- Transaction listing, filtering, editing and deletion are delivered by later
  features; successful creation only requires a confirmation summary and the
  option to begin another registration.
