# Feature Specification: F09 - Metas financeiras

**Feature Branch**: `009-metas-financeiras`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "F09 - Metas financeiras: permitir criar metas individuais ou compartilhadas com valor alvo, valor atual, prazo e progresso, preservando privacidade, clareza financeira, acessibilidade e uso mobile-first."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar e acompanhar meta individual (Priority: P1)

Como pessoa autenticada, quero criar uma meta financeira individual com nome, valor alvo, valor atual e prazo para acompanhar meu progresso sem expor essa informacao ao meu parceiro ou parceira.

**Por que esta prioridade**: Metas individuais entregam valor mesmo sem vinculo compartilhado ativo e preservam a separacao essencial entre financas proprias e compartilhadas.

**Teste independente**: Pode ser testada por uma pessoa autenticada sem vinculo compartilhado ativo criando uma meta individual valida, visualizando progresso, valor restante e status, e confirmando que a meta permanece acessivel apenas para ela.

**Acceptance Scenarios**:

1. **Dado** uma pessoa autenticada sem metas, **Quando** ela cria uma meta individual com dados validos, **Entao** a meta aparece na lista de metas autorizadas com valor alvo, valor atual, prazo, progresso e status.
2. **Dado** uma meta individual ativa com valor atual menor que o valor alvo, **Quando** a pessoa consulta a meta, **Entao** o sistema mostra o progresso e quanto falta para atingir o objetivo.
3. **Dado** uma meta individual, **Quando** outra pessoa autenticada tenta visualiza-la, **Entao** a meta nao aparece, nao e contada e nao e sugerida em listas, detalhes, estados ou mensagens.

---

### User Story 2 - Criar e acompanhar meta compartilhada do casal (Priority: P2)

Como pessoa vinculada a um espaco financeiro compartilhado ativo, quero criar uma meta compartilhada para que ambos os membros do casal acompanhem o mesmo objetivo com clareza sobre progresso e prazo.

**Por que esta prioridade**: Metas compartilhadas sao centrais para o posicionamento do produto para casais e reforcam planejamento conjunto sem misturar dados individuais privados.

**Teste independente**: Pode ser testada por uma pessoa com vinculo compartilhado ativo criando uma meta compartilhada valida e verificando que ambos os membros ativos conseguem visualiza-la, enquanto pessoas sem autorizacao nao conseguem inferi-la.

**Acceptance Scenarios**:

1. **Dado** uma pessoa com vinculo compartilhado ativo, **Quando** ela cria uma meta compartilhada valida, **Entao** a meta fica visivel para ambos os membros ativos do mesmo espaco compartilhado.
2. **Dado** uma pessoa sem vinculo compartilhado ativo, **Quando** ela tenta criar uma meta compartilhada, **Entao** o sistema impede a acao e explica de forma segura que e necessario um vinculo compartilhado ativo.
3. **Dado** uma meta compartilhada ativa, **Quando** o vinculo compartilhado de uma pessoa deixa de estar ativo, **Entao** essa pessoa deixa de acessar a meta na proxima atualizacao.

---

### User Story 3 - Editar, concluir e arquivar metas autorizadas (Priority: P3)

Como pessoa autenticada, quero atualizar os valores e o estado de uma meta autorizada para manter o acompanhamento fiel ao momento atual e retirar metas que nao estao mais ativas.

**Por que esta prioridade**: O acompanhamento de metas perde valor se a pessoa nao consegue corrigir valores, concluir objetivos atingidos ou arquivar metas que deixaram de ser relevantes.

**Teste independente**: Pode ser testada editando uma meta autorizada, verificando o novo progresso, concluindo ou arquivando a meta, e confirmando que ela deixa de aparecer como ativa sem perder contexto essencial.

**Acceptance Scenarios**:

1. **Dado** uma meta autorizada ativa, **Quando** a pessoa altera valor alvo, valor atual ou prazo com dados validos, **Entao** o sistema atualiza a meta e recalcula progresso, valor restante e status.
2. **Dado** uma meta autorizada ativa, **Quando** a pessoa conclui a meta, **Entao** ela deixa de aparecer como ativa e preserva os dados essenciais para consulta posterior.
3. **Dado** uma meta autorizada ativa que nao deve mais ser acompanhada, **Quando** a pessoa arquiva a meta, **Entao** ela nao aparece misturada com metas ativas e nao e confundida com exclusao.

---

### Edge Cases

- O que acontece quando a pessoa autenticada ainda nao possui nenhuma meta?
- O que acontece quando a pessoa nao possui vinculo compartilhado ativo e tenta criar meta compartilhada?
- O que acontece quando convites estao pendentes, recusados, cancelados, expirados ou indisponiveis?
- O que acontece quando um vinculo compartilhado e encerrado enquanto metas compartilhadas estao abertas?
- O que acontece quando o valor atual e zero?
- O que acontece quando o valor atual e igual ao valor alvo?
- O que acontece quando o valor atual e maior que o valor alvo?
- O que acontece quando o prazo venceu e o progresso esta incompleto?
- O que acontece quando uma meta nao possui prazo?
- O que acontece quando o nome da meta e muito curto, muito longo ou duplicado?
- O que acontece quando valores monetarios sao muito pequenos, muito altos ou possuem casas decimais?
- Como o sistema lida com falhas temporarias ao criar, carregar, editar, concluir ou arquivar metas?
- Como a experiencia permanece compreensivel em telas pequenas, com texto ampliado, teclado ou tecnologias assistivas?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve permitir que uma pessoa autenticada crie uma meta financeira individual com nome, valor alvo, valor atual, visibilidade, informacao de prazo e status ativo.
- **FR-002**: O sistema deve permitir que uma pessoa autenticada com espaco financeiro compartilhado ativo crie uma meta financeira compartilhada visivel para membros ativos desse mesmo espaco.
- **FR-003**: O sistema deve impedir que uma pessoa sem espaco financeiro compartilhado ativo crie uma meta compartilhada.
- **FR-004**: O sistema deve mostrar a cada pessoa autenticada apenas suas metas individuais e as metas compartilhadas que ela esta autorizada a acessar.
- **FR-005**: O sistema deve impedir que metas inacessiveis aparecam, sejam contadas, sugeridas ou inferidas por listas, detalhes, estados vazios, carregamentos, erros, mensagens ou resumos.
- **FR-006**: O sistema deve identificar claramente se cada meta e individual ou compartilhada.
- **FR-007**: O sistema deve mostrar as informacoes essenciais da meta: nome, visibilidade, valor alvo, valor atual, situacao de prazo, progresso, valor restante e status.
- **FR-008**: O sistema deve calcular o progresso da meta de forma consistente a partir do valor atual dividido pelo valor alvo.
- **FR-009**: O sistema deve comunicar metas com valor atual abaixo do valor alvo como em andamento e mostrar quanto falta.
- **FR-010**: O sistema deve comunicar metas com valor atual igual ou maior que o valor alvo como atingidas ou ultrapassadas sem depender apenas de cor.
- **FR-011**: O sistema deve exigir que o valor alvo seja positivo.
- **FR-012**: O sistema deve impedir que o valor atual seja negativo.
- **FR-013**: O sistema deve permitir que o valor atual seja zero.
- **FR-014**: O sistema deve tratar prazos como datas civis e diferenciar metas sem prazo de metas atrasadas.
- **FR-015**: O sistema deve comunicar metas incompletas com prazo vencido usando linguagem neutra e nao julgadora.
- **FR-016**: O sistema deve permitir que uma pessoa autorizada edite informacoes essenciais de uma meta ativa, incluindo nome, valores, prazo e status quando permitido.
- **FR-017**: O sistema deve recalcular e atualizar progresso, valor restante e status apos mudancas autorizadas de valores ou prazo.
- **FR-018**: O sistema deve permitir que uma pessoa autorizada marque uma meta como concluida.
- **FR-019**: O sistema deve permitir que uma pessoa autorizada arquive uma meta para que ela nao apareca misturada com metas ativas.
- **FR-020**: O sistema deve preservar contexto essencial de metas concluidas e arquivadas quando elas permanecerem disponiveis para consulta.
- **FR-021**: O sistema deve evitar converter uma meta individual em compartilhada quando isso puder expor contexto privado sem confirmacao clara.
- **FR-022**: O sistema deve evitar converter uma meta compartilhada em individual de modo que remova contexto do outro membro ativo sem comunicacao adequada.
- **FR-023**: O sistema deve interromper acesso a metas compartilhadas quando o relacionamento compartilhado da pessoa deixar de estar ativo.
- **FR-024**: O sistema deve oferecer estados vazios seguros para ausencia de metas, ausencia de relacionamento compartilhado ativo e ausencia de metas compartilhadas.
- **FR-025**: O sistema deve oferecer mensagens de validacao claras e associadas aos campos invalidos ou ausentes durante criacao e edicao.
- **FR-026**: O sistema deve oferecer comportamentos claros de sucesso, falha e tentativa novamente para criar, carregar, editar, concluir e arquivar metas.
- **FR-027**: O sistema deve usar linguagem neutra, motivadora e colaborativa, evitando culpa, competicao, cobranca ou julgamento entre membros.
- **FR-028**: O sistema deve apresentar valores monetarios, datas, percentuais, status e visibilidade de forma consistente com o restante da experiencia financeira privada.
- **FR-029**: O sistema deve oferecer as jornadas essenciais de metas em telas pequenas sem exigir layout desktop ou rolagem horizontal.
- **FR-030**: O sistema deve oferecer navegacao por teclado, foco visivel, rotulos, descricoes e compreensao por tecnologias assistivas para listas, formularios, progresso, status, visibilidade, mensagens e acoes.
- **FR-031**: O sistema nao deve oferecer aconselhamento financeiro automatico, alertas preditivos, recomendacoes de investimento, compartilhamento externo, comentarios em metas, anexos, historico detalhado de contribuicoes ou comparacoes gamificadas nesta feature.
- **FR-032**: O sistema nao deve criar, editar, excluir ou vincular automaticamente transacoes financeiras como parte da gestao de metas.

### Key Entities *(include if feature involves data)*

- **Meta financeira**: Objetivo financeiro acompanhado por uma pessoa ou casal. Seus atributos principais incluem nome, visibilidade, valor alvo, valor atual, prazo, progresso, status e informacoes essenciais para entender seu ciclo de vida.
- **Visibilidade da meta**: Indica se a meta e individual ou compartilhada. Metas individuais pertencem apenas a pessoa proprietaria; metas compartilhadas pertencem a um espaco financeiro compartilhado ativo.
- **Status da meta**: Indica se uma meta esta ativa, concluida ou arquivada. O status controla como a meta aparece na experiencia sem implicar exclusao.
- **Espaco financeiro compartilhado**: Contexto de relacionamento ativo que permite aos dois membros do casal acessar metas compartilhadas.
- **Pessoa autorizada**: Pessoa autenticada que solicita acesso a informacoes ou acoes de meta, avaliada conforme propriedade individual ou relacionamento compartilhado ativo.

### Constitution Alignment *(mandatory)*

- **Simplicity & UX**: A feature mantem criacao e revisao de metas focadas em campos essenciais: nome, valores, prazo, visibilidade, progresso e status.
- **Financial Transparency**: A feature distingue claramente metas individuais de metas compartilhadas e comunica progresso, valor restante, situacao de prazo e status sem ambiguidade.
- **Mobile & Accessibility**: Listas, formularios, indicadores de progresso, mensagens de status e acoes de metas devem funcionar em telas pequenas, com navegacao por teclado, foco visivel, rotulos e significado textual equivalente.
- **Security & Privacy**: Metas individuais permanecem privadas para a pessoa proprietaria; metas compartilhadas ficam limitadas a membros ativos do mesmo espaco financeiro compartilhado; metas inacessiveis nao podem ser expostas nem inferidas.
- **Performance & Data Clarity**: Listas e atualizacoes de metas devem permanecer rapidas e compreensiveis, com moeda, datas civis, percentuais, status, carregamento e erros consistentes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% das pessoas em avaliacao de usabilidade conseguem criar uma meta individual valida em ate 2 minutos sem ajuda externa.
- **SC-002**: Pelo menos 90% das pessoas com relacionamento compartilhado ativo conseguem identificar corretamente se uma meta e individual ou compartilhada antes de salva-la.
- **SC-003**: Pelo menos 90% das pessoas conseguem explicar quanto falta para atingir uma meta ativa em ate 10 segundos apos visualizar a lista ou detalhe.
- **SC-004**: 100% dos cenarios de autorizacao excluem metas inacessiveis de listas, detalhes, contagens, estados vazios, carregamentos, resumos e mensagens de erro.
- **SC-005**: 100% dos cenarios sem relacionamento compartilhado ativo impedem criacao e acesso a metas compartilhadas.
- **SC-006**: Pessoas conseguem concluir as jornadas principais de consultar, criar, editar, concluir e arquivar metas em tela pequena sem rolagem horizontal.
- **SC-007**: Pessoas usando navegacao por teclado ou tecnologias assistivas conseguem entender campos, progresso, status, visibilidade, mensagens e acoes disponiveis para metas.
- **SC-008**: Pessoas conseguem entender progresso, status e situacao de prazo da meta por texto, estrutura ou resumos equivalentes, sem depender apenas de cor.

## Assumptions

- A pessoa ja esta autenticada antes de acessar metas.
- O produto ja possui o conceito de espaco financeiro compartilhado ativo para casais.
- Metas compartilhadas ficam disponiveis apenas para membros ativos do mesmo espaco financeiro compartilhado.
- Metas sem prazo sao permitidas e tratadas separadamente de metas atrasadas.
- Excluir metas definitivamente fica fora do MVP; conclusao e arquivamento cobrem as principais necessidades de ciclo de vida.
- O progresso da meta e acompanhado manualmente pelo campo de valor atual nesta feature, nao derivado automaticamente de transacoes.
- Valores monetarios usam a mesma moeda e os mesmos padroes de formatacao ja usados na experiencia financeira privada.
- A feature usa portugues brasileiro, tom neutro e linguagem financeira nao julgadora.
