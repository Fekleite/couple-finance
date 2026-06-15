# Feature Specification: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

**Feature Branch**: `015-disable-focus-refetch`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Configuracao de server state sem refetch automatico ao trocar de janela ou aba"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retornar a aplicacao sem recarregamento visual indevido (Priority: P1)

Como pessoa autenticada revisando suas financas, quero alternar para outra aba ou janela e voltar para a aplicacao sem que as telas entrem em loading, pisquem ou parecam recarregar sem uma acao minha, para manter confianca no que estava analisando.

**Why this priority**: Esta e a principal melhoria de experiencia da F15. A troca de contexto e comum durante revisao financeira, pagamento de contas, consulta a banco externo ou conversa com a pessoa parceira.

**Independent Test**: Pode ser testada abrindo uma tela com dados ja carregados, alternando para outra aba ou janela e retornando, verificando que os dados permanecem estaveis e que nao ha indicador de recarregamento causado apenas pelo foco.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada esta na tela de transacoes com dados carregados, **When** ela alterna para outra aba e retorna, **Then** a lista continua visivel sem entrar em loading ou piscar por causa do retorno de foco.
2. **Given** uma pessoa autenticada esta revisando o dashboard com totais carregados, **When** ela troca de janela rapidamente e volta, **Then** os totais permanecem apresentados de forma estavel ate que haja uma acao explicita ou uma regra justificada de atualizacao.
3. **Given** uma pessoa autenticada esta usando a aplicacao em mobile e deixa o navegador em segundo plano por pouco tempo, **When** ela retorna, **Then** a tela preserva os dados e o contexto visual sem reiniciar a experiencia por causa do foco.

---

### User Story 2 - Atualizar dados apos acoes financeiras explicitas (Priority: P2)

Como pessoa que cria, edita ou exclui dados financeiros, quero que a aplicacao reflita essas mudancas logo apos minhas acoes, para confiar que transacoes, dashboard, metas e historico financeiro continuam coerentes.

**Why this priority**: Reduzir atualizacoes automaticas por foco nao pode impedir que alteracoes financeiras reais atualizem a interface.

**Independent Test**: Pode ser testada realizando uma acao de criacao, edicao ou exclusao e verificando que telas e dados relacionados refletem a mudanca sem depender de trocar de aba ou janela.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada cria uma transacao, **When** a criacao e concluida com sucesso, **Then** a listagem de transacoes e os dados financeiros relacionados exibem a nova informacao por uma atualizacao controlada.
2. **Given** uma pessoa autenticada edita uma transacao existente, **When** a alteracao e concluida com sucesso, **Then** os dados exibidos deixam claro o novo estado sem depender de retorno de foco.
3. **Given** uma pessoa autenticada exclui um dado financeiro permitido, **When** a exclusao e concluida com sucesso, **Then** as telas afetadas removem ou recalculam esse dado de forma controlada.

---

### User Story 3 - Preservar contexto de filtros e navegacao ao alternar abas (Priority: P3)

Como pessoa analisando um subconjunto de dados financeiros, quero voltar para a aplicacao mantendo filtros, ordenacao, pagina carregada e estado visual, para nao perder o raciocinio em andamento.

**Why this priority**: A F15 deve proteger fluxos criticos de revisao, especialmente transacoes, sem alterar o comportamento funcional ja entregue pelas features anteriores.

**Independent Test**: Pode ser testada aplicando filtros e ordenacao em uma tela existente, alternando para outra aba e retornando, verificando que o contexto continua igual e que nenhum dado fora do filtro aparece por recarregamento automatico.

**Acceptance Scenarios**:

1. **Given** uma pessoa filtrou transacoes por mes, categoria, responsavel, tipo ou texto, **When** ela troca de aba e retorna, **Then** os filtros continuam aplicados e os resultados permanecem consistentes.
2. **Given** uma pessoa carregou mais resultados ou ajustou uma ordenacao, **When** ela retorna de outra janela, **Then** pagina carregada, ordenacao e posicao visual nao sao perdidas por uma atualizacao automatica de foco.
3. **Given** uma tela possui necessidade excepcional de atualizar ao recuperar foco, **When** essa excecao existir, **Then** ela deve ser justificada e documentada para que o comportamento seja previsivel.

---

### User Story 4 - Entender falhas de atualizacao explicita (Priority: P4)

Como pessoa que executa uma acao financeira, quero receber estados claros quando uma atualizacao explicita falha, para saber se preciso tentar novamente sem perder contexto ou expor dados indevidos.

**Why this priority**: A mudanca reduz atualizacoes automaticas, mas erros reais em atualizacoes iniciadas por acoes da pessoa usuaria ainda precisam ser visiveis, seguros e acionaveis.

**Independent Test**: Pode ser testada simulando falha apos uma acao explicita e verificando que a tela comunica o erro sem esconder dados autorizados ja exibidos nem revelar informacoes fora do escopo.

**Acceptance Scenarios**:

1. **Given** uma atualizacao controlada falha apos uma acao financeira, **When** a tela exibe o resultado, **Then** a pessoa recebe uma mensagem clara e consegue tentar novamente ou continuar sem perda silenciosa de contexto.
2. **Given** uma atualizacao explicita acontece com sucesso, **When** a tela muda, **Then** tecnologias assistivas e navegacao por teclado continuam recebendo estados compreensiveis.

### Edge Cases

- Retorno ao navegador apos poucos segundos nao deve disparar recarregamento visual causado apenas por foco.
- Retorno ao navegador apos um periodo longo deve preservar o comportamento padrao de nao atualizar apenas por foco, salvo se houver regra explicitamente justificada para uma tela ou dado especifico.
- Dados ja carregados devem permanecer visiveis quando nao houver acao explicita de atualizacao, evitando substituicao por estados de loading vazios.
- Criacao, edicao e exclusao devem continuar refletindo mudancas financeiras relevantes mesmo sem troca de aba.
- Filtros, ordenacao, pagina carregada e contexto visual nao devem ser perdidos por alternancia de foco.
- Erros de atualizacao apos acoes explicitas devem ser comunicados sem expor dados privados, compartilhados indevidos ou detalhes internos.
- Telas de transacoes, dashboard, metas, categorias e auditoria devem preservar permissao, visibilidade individual/compartilhada e isolamento de dados.
- A experiencia deve permanecer estavel em desktop, tablet e mobile, incluindo navegadores mobile que pausam a aplicacao em segundo plano.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST NOT refresh remote financial data globally only because the browser window, tab, or app view regained focus.
- **FR-002**: The system MUST preserve already displayed authorized data when a user returns to the app without performing an explicit financial action.
- **FR-003**: Users MUST be able to switch away from and back to transaction, dashboard, goal, category, and audit views without losing visible context caused only by focus changes.
- **FR-004**: The system MUST preserve active filters, ordering, loaded page context, and visible state in transaction-related views when the user returns from another tab or window.
- **FR-005**: The system MUST still update affected financial views after successful create, edit, or delete actions.
- **FR-006**: The system MUST communicate loading, success, and error states only when an update is actually triggered by an explicit user action or a documented exception.
- **FR-007**: The system MUST document any exception that intentionally refreshes data when focus returns, including the user value and affected area.
- **FR-008**: The system MUST ensure exceptions do not broaden data access, bypass authorization, or expose individual/shared financial information outside the existing scope.
- **FR-009**: The system MUST keep edit and delete action availability consistent with existing permissions after any controlled update.
- **FR-010**: The system MUST preserve existing registration, listing, filtering, editing, deletion, dashboard, goal, and audit flows unless an intentional equivalent behavior is documented and tested.
- **FR-011**: The system MUST provide clear recovery options when a controlled update fails after a user action.
- **FR-012**: The system MUST maintain mobile-friendly and accessible behavior for all visible update, success, and error states.
- **FR-013**: The system MUST include automated or objective verification that returning focus alone does not trigger the global refresh behavior.
- **FR-014**: The system MUST include automated or objective verification that create, edit, and delete actions still refresh affected financial information correctly.
- **FR-015**: The system MUST avoid changes to financial data models, authentication, couple membership, authorization rules, persistence schema, and data isolation.

### Constitution Alignment *(mandatory)*

- **Incremental Baseline**: Reuses the existing authenticated app, transactions, filters, dashboard, goals, audit, permissions, and data isolation behavior. The feature changes only the refresh experience around server-state data and must not rewrite existing financial flows.
- **Simplicity & Visual Clarity**: Reduces unexplained loading states, flicker, and redundant visual churn. Existing screens should feel calmer without adding new cards, explanations, or decorative interface elements.
- **Financial Transparency**: Preserves visible values, dates, responsible person, categories, and individual/shared context already shown by existing features. The feature must not make data appear newer or older than the actual controlled update state suggests.
- **Mobile & Accessibility**: Returning from another app or browser tab on mobile must keep context stable. Loading, success, and error states after explicit actions must remain keyboard-operable and understandable to assistive technologies.
- **Security & Privacy**: Existing authorization, privacy boundaries, couple membership, and individual/shared visibility rules continue to govern every displayed or refreshed item.
- **Testing & PR Pipeline**: Verification must cover no-refresh-on-focus behavior, controlled updates after create/edit/delete, preservation of filters/context, error states, and relevant regression paths. Standard lint, typecheck, tests, and build remain expected for delivery.
- **Performance, Query & Data Clarity**: The expected experience is fewer unnecessary background calls and no focus-triggered global refresh. Controlled refreshes after financial mutations remain required so totals, lists, and related views stay coherent.
- **Prisma & Data Layer Impact**: No schema, migration, repository, service boundary, server-side data access, or persistence change is expected for this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In the primary tested financial views, returning to the app from another tab or window results in zero user-visible loading states caused only by the focus change.
- **SC-002**: 100% of tested create, edit, and delete financial actions update their directly affected views without requiring the user to switch tabs, reload the page, or navigate away and back.
- **SC-003**: 100% of tested transaction filter and ordering contexts remain unchanged after switching away from and back to the app.
- **SC-004**: Documented exceptions for focus-based refresh, if any, include the affected area, user value, and reason for exception.
- **SC-005**: Regression checks confirm that private, shared, and partner-scoped financial data remain visible only to authorized users after controlled updates.
- **SC-006**: In manual or automated review across desktop, tablet, and mobile viewports, no core financial screen shows flicker or unexpected blank/loading replacement solely from focus return.
- **SC-007**: Error-state verification confirms that failed controlled updates produce understandable user-facing feedback in 100% of tested failure scenarios.

## Assumptions

- The default behavior for all existing remote-data screens should be to keep data stable when focus returns.
- A "controlled update" means an update caused by an explicit user action, such as creating, editing, deleting, retrying, refreshing intentionally, or completing another documented workflow.
- No focus-based refresh exception is required unless a specific screen has a clear user-facing need that outweighs the predictability goal.
- Existing authentication, authorization, financial permissions, audit behavior, and individual/shared data rules remain the source of truth.
- Existing mobile and accessibility expectations from prior features continue to apply to all affected states.
