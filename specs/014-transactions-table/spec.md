# Feature Specification: F14 - Tabela de transacoes com TanStack Table

**Feature Branch**: `014-transactions-table`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "Criar a especificacao da feature F14 - Tabela de transacoes com TanStack Table, evoluindo a listagem existente de transacoes para uma tabela estruturada, legivel, escalavel, responsiva e acessivel, preservando filtros, ordenacao, permissoes, isolamento de dados, estados e fluxos financeiros ja existentes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Revisar transacoes em uma tabela clara (Priority: P1)

Como pessoa autenticada que acompanha as financas do casal, quero visualizar minhas transacoes e as transacoes compartilhadas em uma estrutura tabular clara para comparar rapidamente valores, datas, categorias, responsaveis e visibilidade.

**Why this priority**: A listagem de transacoes e um fluxo diario e critico. Sem uma visualizacao clara, o casal perde confianca para conferir gastos, receitas e responsabilidades.

**Independent Test**: Pode ser testado carregando a listagem com transacoes autorizadas de diferentes tipos, categorias, datas, responsaveis e visibilidades; o usuario deve conseguir identificar as informacoes essenciais de cada item sem abrir detalhes adicionais.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada com transacoes autorizadas no periodo atual, **When** ela acessa a listagem de transacoes, **Then** cada transacao mostra titulo, valor, tipo, categoria, data, responsavel, visibilidade ou compartilhamento e acoes disponiveis.
2. **Given** transacoes individuais e compartilhadas aparecem na mesma listagem, **When** a pessoa revisa os registros, **Then** a interface diferencia claramente o contexto individual ou compartilhado sem expor dados fora de sua permissao.
3. **Given** a listagem contem receitas e despesas, **When** a pessoa compara os valores, **Then** tipo e valor sao apresentados de forma consistente e compreensivel para decisao financeira.

---

### User Story 2 - Filtrar e ordenar sem perder contexto (Priority: P2)

Como pessoa que revisa historico financeiro, quero combinar filtros existentes e ordenacao para encontrar transacoes especificas sem perder o contexto dos resultados exibidos.

**Why this priority**: Filtros e ordenacao tornam a listagem util em bases maiores, mas qualquer regressao nesses comportamentos afeta diretamente a confianca no historico financeiro.

**Independent Test**: Pode ser testado aplicando filtros por mes, categoria, responsavel, tipo e texto, depois alternando ordenacao por data e valor; os resultados devem permanecer coerentes com os criterios ativos.

**Acceptance Scenarios**:

1. **Given** a pessoa aplica filtro por mes e categoria, **When** ela ordena os resultados por data, **Then** apenas transacoes que atendem aos filtros permanecem visiveis e sua ordem muda conforme a ordenacao escolhida.
2. **Given** a pessoa aplica busca por texto, **When** nao ha transacoes correspondentes, **Then** a listagem mostra estado sem resultados com orientacao clara para ajustar os filtros.
3. **Given** uma ordenacao por valor ou data esta ativa, **When** a pessoa revisa a tabela, **Then** a ordenacao ativa e perceptivel visualmente e por tecnologias assistivas.

---

### User Story 3 - Usar a listagem em telas pequenas (Priority: P3)

Como pessoa usando celular ou tablet, quero revisar transacoes em uma apresentacao compacta e legivel para acompanhar minhas financas sem rolagem horizontal obrigatoria.

**Why this priority**: A aplicacao tem criterio transversal de responsividade e acessibilidade; a nova listagem nao pode tornar o fluxo principal pior em mobile.

**Independent Test**: Pode ser testado em larguras pequenas com transacoes longas, multiplos filtros e acoes disponiveis; a pessoa deve conseguir ler informacoes essenciais e acionar controles sem sobreposicao ou perda de contexto.

**Acceptance Scenarios**:

1. **Given** a pessoa acessa a listagem em uma tela pequena, **When** ha transacoes com titulos, categorias e responsaveis variados, **Then** titulo, valor, tipo, categoria, data, responsavel, visibilidade e acoes continuam disponiveis sem rolagem horizontal obrigatoria.
2. **Given** controles de filtro e ordenacao estao disponiveis em mobile, **When** a pessoa navega por teclado ou tecnologia assistiva, **Then** todos os controles possuem rotulos compreensiveis, foco perceptivel e ordem de navegacao previsivel.

---

### User Story 4 - Executar acoes respeitando permissoes (Priority: P4)

Como pessoa autenticada, quero que as acoes de editar ou excluir transacoes aparecam e funcionem apenas quando minhas permissoes permitirem, para evitar alteracoes indevidas em dados financeiros.

**Why this priority**: Acoes incorretas em dados financeiros afetam seguranca, auditoria e confianca do casal, especialmente quando existem transacoes individuais e compartilhadas.

**Independent Test**: Pode ser testado com usuarios em diferentes contextos de permissao, verificando que as acoes disponiveis e bloqueadas correspondem as regras existentes.

**Acceptance Scenarios**:

1. **Given** uma transacao que a pessoa pode editar, **When** ela visualiza a linha ou item responsivo correspondente, **Then** a acao de edicao esta disponivel com nome acessivel claro.
2. **Given** uma transacao que a pessoa nao pode excluir, **When** ela visualiza a listagem, **Then** a acao de exclusao nao aparece ou fica indisponivel com feedback adequado, sem permitir alteracao indevida.

### Edge Cases

- Quando nao existem transacoes no periodo ou escopo atual, a listagem deve mostrar estado vazio claro e orientar a proxima acao possivel sem sugerir que houve erro.
- Quando filtros ativos nao retornam resultados, a listagem deve diferenciar "sem resultados para estes filtros" de "sem transacoes cadastradas".
- Quando transacoes possuem titulos, categorias ou nomes de responsavel longos, a apresentacao deve preservar legibilidade sem quebrar o layout.
- Quando ha muitas transacoes, a experiencia deve evitar lentidao perceptivel e manter orientacao sobre quantidade, pagina atual ou progresso de carregamento quando aplicavel.
- Quando uma pessoa nao autenticada tenta acessar a listagem, a protecao de rota existente deve impedir o acesso.
- Quando uma pessoa autenticada nao possui permissao para uma transacao, o item nao deve ser exibido ou deve ocultar a acao restrita conforme as regras existentes.
- Quando ocorre erro ao carregar transacoes, a listagem deve informar o problema de forma segura, sem expor detalhes internos ou dados privados.
- Quando edicao, exclusao ou auditoria sao acionadas a partir da listagem, os fluxos existentes devem preservar rastreabilidade e equivalencia funcional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present authorized transactions in a structured list optimized for scanning and comparison.
- **FR-002**: System MUST show, for each visible transaction, title, amount, type, category, date, responsible person, visibility or sharing context, and available actions when applicable.
- **FR-003**: System MUST preserve existing filters for month, category, responsible person, type, and text search.
- **FR-004**: System MUST allow users to sort transaction results by date and amount when those fields are available for sorting.
- **FR-005**: System MUST keep active filters applied when users change sorting.
- **FR-006**: System MUST clearly communicate active sorting state visually and to assistive technologies.
- **FR-007**: System MUST provide a distinct state for an empty transaction list and a distinct state for filters with no matching results.
- **FR-008**: System MUST preserve loading, error, success, and empty states for the transaction list.
- **FR-009**: System MUST preserve existing authorization rules for viewing, editing, and deleting transactions.
- **FR-010**: System MUST prevent exposure of transactions outside the authenticated user's individual or shared couple scope.
- **FR-011**: System MUST keep edit and delete actions consistent with existing permission and audit behavior.
- **FR-012**: System MUST provide a responsive presentation for desktop, tablet, and mobile without mandatory horizontal scrolling on small screens.
- **FR-013**: System MUST keep transaction information readable when values, titles, categories, or responsible names are long.
- **FR-014**: System MUST make headers, sort controls, filters, and row actions operable by keyboard.
- **FR-015**: System MUST provide accessible names, focus states, and structural cues for headers, controls, transaction rows, and actions.
- **FR-016**: System MUST avoid decorative, redundant, or overly explanatory content that does not support financial review.
- **FR-017**: System MUST preserve navigation context when users move from the list to create, edit, delete, or review a transaction and then return.
- **FR-018**: System MUST support a larger transaction history with a clear experience for paging, progressive loading, or equivalent result management when the volume justifies it.
- **FR-019**: System MUST register the catalog constraint that the technical implementation will use TanStack Table internally in later phases, without making the specification depend on its APIs or component model.
- **FR-020**: System MUST include proportional automated tests for displayed information, filters, sorting, permissions, responsive rendering, accessibility-critical controls, and list states.

### Key Entities *(include if feature involves data)*

- **Transaction**: A financial record visible to the authenticated person when permitted. Key attributes for this feature are title, amount, type, category, date, responsible person, visibility or sharing context, and allowed actions.
- **Transaction Filter Set**: The active criteria used to narrow visible transactions, including month, category, responsible person, type, and text.
- **Sort State**: The active ordering applied to visible transaction results, especially by date or amount.
- **Transaction List State**: The user-facing state of the list, including loading, error, empty, no results after filters, populated results, and larger result sets.
- **Transaction Permission Context**: The relationship between the authenticated person, the transaction scope, and the actions allowed for that transaction.

### Constitution Alignment *(mandatory)*

- **Incremental Baseline**: Reuses F05 transaction registration, F06 list and filters, F03 permissions and isolation, F09 audit behavior, and F11 responsive/accessibility baseline. The feature changes the list presentation while preserving existing financial flows.
- **Simplicity & Visual Clarity**: Prioritizes essential transaction data, filters, sorting, and actions. Decorative cards, redundant text, and non-functional visual elements are out of scope.
- **Financial Transparency**: Keeps amount, type, category, date, responsible person, and individual/shared context visible enough for confident review and comparison.
- **Mobile & Accessibility**: Requires small-screen behavior without mandatory horizontal scrolling, keyboard operation, accessible headers, named controls, clear focus, and understandable states.
- **Security & Privacy**: Preserves authenticated access, transaction visibility boundaries, action permissions, and safe error messages.
- **Testing & PR Pipeline**: Requires automated coverage for displayed fields, filters, sorting, permission-sensitive actions, responsive states, and main list states, plus the normal lint, typecheck, test, and build gates.
- **Performance, Query & Data Clarity**: Larger lists must remain usable through clear result management and responsive feedback. The feature must not introduce confusing refetch, duplicated rows, hidden rows, inconsistent currency, or ambiguous dates.
- **Prisma & Data Layer Impact**: No schema, migration, Prisma, repository, service, persistence, authentication, or permission model change is expected. Any later technical plan that finds such impact must justify it explicitly and preserve data isolation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a representative transaction list, users can identify title, amount, type, category, date, responsible person, sharing context, and available actions for a transaction in under 10 seconds.
- **SC-002**: 100% of existing filters for month, category, responsible person, type, and text continue to return results consistent with the pre-feature behavior for the same authorized data.
- **SC-003**: Users can apply at least one filter and then sort by date or amount without losing the active filter criteria.
- **SC-004**: On mobile-width screens, users can review the essential information for each transaction without mandatory horizontal scrolling.
- **SC-005**: Keyboard-only users can reach filters, sort controls, transaction actions, and list feedback states without blocked or hidden focus.
- **SC-006**: Permission-restricted edit or delete actions are unavailable for 100% of transactions where the authenticated person lacks the required permission.
- **SC-007**: Empty, loading, error, populated, and no-results states are each covered by automated or documented verification.
- **SC-008**: No existing flow for transaction registration, filtering, editing, deletion, audit recording, authentication, or couple data isolation regresses during acceptance testing.

## Assumptions

- The existing transaction list, filters, permissions, audit behavior, and navigation routes are already present and remain the source of product behavior.
- The default scope of the list continues to follow the current product behavior for authorized individual and shared couple transactions.
- Date, amount, currency, type, category, responsible person, and visibility labels use the same business meaning already established in F00-F11.
- The feature does not introduce new financial calculations, new transaction fields, import flows, analytics views, or charts.
- If transaction volume requires paging or progressive loading, the user-facing behavior should prioritize clarity and continuity over exposing implementation details.
- The later technical plan must respect the cataloged requirement to use TanStack Table internally while keeping this specification focused on user-visible outcomes.
