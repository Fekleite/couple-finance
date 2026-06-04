# Feature Specification: F04 - Categorias financeiras padrao

**Feature Branch**: `004-standard-financial-categories`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "F04 - Categorias financeiras padrao para o Couple Finance. Disponibilizar um conjunto inicial de categorias financeiras padrao para reduzir o esforco de cadastro, padronizar a analise financeira e preparar a experiencia para o registro de transacoes, cobrindo moradia, alimentacao, transporte, saude, lazer, compras, educacao, investimentos, contas e outros, com nomes claros, descricoes curtas, suporte a dados individuais e compartilhados, e sem categorias personalizadas no MVP."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar categorias padrao (Priority: P1)

Como pessoa autenticada, quero encontrar uma lista inicial de categorias financeiras claras para classificar futuras movimentacoes sem precisar criar categorias manualmente.

**Why this priority**: A lista padrao e o valor minimo da feature. Sem categorias disponiveis e compreensiveis, as proximas features de transacoes, filtros e analises nao terao uma linguagem comum.

**Independent Test**: Pode ser testada ao disponibilizar a lista padrao para uma pessoa autenticada e verificar que todas as categorias minimas aparecem com nome, finalidade e identificacao estavel.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada, **When** ela acessa um fluxo que precisa escolher categoria, **Then** o sistema apresenta categorias padrao para moradia, alimentacao, transporte, saude, lazer, compras, educacao, investimentos, contas e outros.
2. **Given** uma categoria padrao apresentada, **When** a pessoa consulta seu significado, **Then** o sistema comunica uma descricao curta e compreensivel para usuarios nao tecnicos.
3. **Given** categorias padrao ja usadas em registros futuros, **When** o texto exibido de uma categoria evoluir, **Then** a identidade da categoria permanece estavel para historico, filtros e analises.

---

### User Story 2 - Escolher categoria com clareza em mobile (Priority: P2)

Como pessoa registrando uma movimentacao futura, quero escolher rapidamente uma categoria em tela pequena, com rotulos curtos e apoio suficiente para diferenciar opcoes parecidas.

**Why this priority**: A feature existe para reduzir friccao. Se a escolha for lenta ou ambigua, a padronizacao nao melhora a experiencia real de registro financeiro.

**Independent Test**: Pode ser testada em uma visualizacao mobile simulada, confirmando que nomes cabem nos controles, foco e selecao sao perceptiveis, e "Outros" funciona como fallback quando nenhuma categoria especifica se aplica.

**Acceptance Scenarios**:

1. **Given** uma pessoa em tela pequena, **When** ela visualiza as categorias, **Then** os nomes permanecem legiveis, acionaveis e sem truncamento que prejudique a compreensao.
2. **Given** uma pessoa navegando por teclado ou tecnologia assistiva, **When** ela percorre e seleciona categorias, **Then** o foco, o nome e o estado selecionado sao perceptiveis sem depender apenas de cor.
3. **Given** uma movimentacao que nao se encaixa claramente nas categorias especificas, **When** a pessoa precisa classifica-la, **Then** a categoria "Outros" esta disponivel como fallback claro.

---

### User Story 3 - Usar categorias em contextos individuais e compartilhados (Priority: P3)

Como membro de um casal ou pessoa usando o produto individualmente, quero que as mesmas categorias padrao possam apoiar dados individuais e compartilhados sem expor informacoes financeiras indevidas.

**Why this priority**: As categorias devem sustentar o modelo de visibilidade ja definido pelo produto e preparar futuras analises sem misturar dados inacessiveis.

**Independent Test**: Pode ser testada verificando que categorias sao comuns e neutras, nao pertencem a um membro especifico, e sua exibicao nao sugere existencia de transacoes fora do escopo autorizado.

**Acceptance Scenarios**:

1. **Given** uma pessoa usando o produto individualmente, **When** ela associa uma futura movimentacao individual a uma categoria, **Then** a classificacao nao sugere dados compartilhados ou dados de outra pessoa.
2. **Given** uma pessoa vinculada a um espaco compartilhado, **When** ela associa uma futura movimentacao compartilhada a uma categoria, **Then** a classificacao respeita apenas o contexto compartilhado autorizado.
3. **Given** uma tela, contador, lista ou mensagem relacionada a categorias, **When** existem dados financeiros fora do escopo autorizado, **Then** o sistema nao revela nem sugere a existencia desses dados.

### Edge Cases

- A lista de categorias esta temporariamente indisponivel: o sistema deve apresentar uma mensagem segura, compreensivel e sem detalhes privados ou tecnicos.
- Uma categoria especifica parece se sobrepor a outra: o sistema deve usar descricoes curtas para orientar a escolha sem exigir conhecimento financeiro especializado.
- A pessoa tenta usar "Outros" para um caso coberto por categoria especifica: o sistema deve manter "Outros" disponivel, mas a lista e as descricoes devem favorecer a escolha mais precisa.
- Categorias aparecem em uma area que ainda nao possui transacoes: o sistema deve mostrar a lista ou o estado apropriado sem sugerir movimentacoes inexistentes.
- Categorias sao usadas por pessoas em relacao individual ou compartilhada: a categoria em si permanece comum e neutra, enquanto a visibilidade dos dados financeiros continua respeitando o contexto autorizado.
- A interface e usada com texto ampliado, teclado ou tecnologia assistiva: nomes, descricoes, foco e selecao continuam perceptiveis e operaveis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a standard financial category list available to authenticated users.
- **FR-002**: System MUST include at minimum these standard categories: Moradia, Alimentacao, Transporte, Saude, Lazer, Compras, Educacao, Investimentos, Contas and Outros.
- **FR-003**: System MUST provide each standard category with a short display name and concise description that explains typical usage.
- **FR-004**: System MUST keep each standard category identifiable in a stable way so future history, filters and analyses are not broken by display text changes.
- **FR-005**: System MUST make standard categories usable for both individual and shared financial contexts.
- **FR-006**: System MUST NOT make standard categories belong exclusively to one couple member or one person's private context.
- **FR-007**: System MUST allow a future financial movement to reference one standard category.
- **FR-008**: System MUST present category names and selection states in a way that is understandable on small screens.
- **FR-009**: System MUST make category navigation and selection operable by keyboard and perceivable by assistive technologies.
- **FR-010**: System MUST communicate selected category state without relying only on color.
- **FR-011**: System MUST include "Outros" as a fallback category when no specific category fits.
- **FR-012**: System MUST avoid encouraging "Outros" as the primary choice when a more specific category reasonably applies.
- **FR-013**: System MUST use neutral, non-judgmental language for category names, descriptions, empty states and error messages.
- **FR-014**: System MUST define safe empty, loading and unavailable states for category access.
- **FR-015**: System MUST NOT reveal or imply the existence of financial records outside the current person's authorized individual or shared context through category lists, counters, messages or states.
- **FR-016**: System MUST keep categories prepared for future filtering, dashboard summaries and category-based visual analysis.

### Key Entities *(include if feature involves data)*

- **Standard Financial Category**: A reusable classification option for future financial movements. Key attributes include stable identity, display name, short description, intended usage examples, and whether the category commonly applies to income, expenses or both.
- **Category Usage Context**: The authorized setting in which a category may be applied to future financial data. It can be individual or shared, but the category itself remains standard and does not become private to one person.
- **Future Financial Movement**: A planned later record such as an income or expense that can reference one standard category while preserving its own visibility and ownership rules.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: The feature removes setup work by offering a ready-to-use list and keeps names short, familiar and easy to choose.
- **Financial Transparency**: Categories create a common vocabulary for future financial records while preserving the distinction between individual, shared and inaccessible information.
- **Mobile & Accessibility**: Category names, descriptions, focus states and selected states must work in compact screens and remain operable with keyboard and assistive technologies.
- **Security & Privacy**: Category presentation must not leak, count or imply financial data outside the authorized context.
- **Performance & Data Clarity**: The category list is bounded, stable and suitable for fast selection, future filters and category-based summaries without ambiguity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A person can identify and select an appropriate category from the standard list in under 30 seconds during a future transaction-classification flow.
- **SC-002**: The standard list covers at least 90% of common household income and expense classification examples used in product acceptance review.
- **SC-003**: 100% of the minimum required categories are available with a display name, concise description and stable identity.
- **SC-004**: In usability review, at least 90% of participants can distinguish between similar categories, such as Moradia, Contas and Compras, without external help.
- **SC-005**: Category selection remains usable at mobile viewport sizes, with all category names legible and actionable without horizontal scrolling.
- **SC-006**: Accessibility review confirms category navigation, focus indication and selected state are perceivable without relying only on color.
- **SC-007**: Privacy review finds zero category-related screens, messages or counters that reveal or imply inaccessible financial records.

## Assumptions

- Users are authenticated before accessing category selection in product flows.
- Categories are standard product vocabulary for the MVP, not user-customized data.
- Category customization may be considered in a later feature, but is outside this feature.
- Future transaction, filter, dashboard and chart features will reuse these categories instead of redefining a separate category vocabulary.
- Category examples are guidance for user understanding and do not create automatic classification rules in this feature.
- The product language remains Brazilian Portuguese for category names and user-facing copy in this MVP.
