# Feature Specification: F13 - Layout principal com sidebar de dashboard

**Feature Branch**: `013-dashboard-sidebar`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Criar uma especificacao para a feature F13 - Layout principal com sidebar de dashboard. Substituir ou evoluir o menu principal atual para um layout autenticado no estilo dashboard, com navegacao lateral responsiva, preservando F00-F11, a limpeza visual da F12, sessao autenticada, protecao de rotas, acessibilidade, responsividade e navegacao entre Dashboard, Transacoes, Categorias, Metas, Convites/Parceiro e Configuracoes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar pelos modulos autenticados no desktop (Priority: P1)

Como usuario autenticado da plataforma financeira do casal, quero acessar os principais modulos por uma navegacao lateral clara para alternar rapidamente entre visao geral, transacoes, categorias, metas, parceiro e configuracoes sem perder o contexto da minha sessao.

**Why this priority**: A navegacao autenticada e o ponto de entrada recorrente para todos os fluxos financeiros ja existentes; se ela for confusa ou instavel, dashboard, transacoes, metas e configuracoes perdem eficiencia no uso diario.

**Independent Test**: Pode ser testado com um usuario autenticado em tela desktop, validando que os itens principais aparecem, a rota ativa e indicada, cada item leva ao modulo esperado e a sessao permanece ativa durante a navegacao.

**Acceptance Scenarios**:

1. **Given** um usuario autenticado em uma tela desktop, **When** ele acessa a area principal da aplicacao, **Then** uma sidebar lateral apresenta os modulos disponiveis de forma clara e persistente.
2. **Given** um usuario autenticado na pagina de Dashboard, **When** ele seleciona Transacoes na sidebar, **Then** a aplicacao exibe o modulo de Transacoes e preserva a sessao do usuario.
3. **Given** um usuario autenticado em qualquer modulo principal, **When** a rota atual corresponde a um item da navegacao, **Then** esse item e indicado como ativo de forma perceptivel visualmente e por tecnologias assistivas.

---

### User Story 2 - Usar a navegacao em tablet e mobile (Priority: P2)

Como usuario autenticado em tela pequena, quero acessar os mesmos modulos por uma navegacao compacta e facil de operar para consultar ou registrar informacoes financeiras sem depender de uma tela grande.

**Why this priority**: A aplicacao ja possui responsividade como requisito transversal; a nova navegacao nao pode regredir fluxos essenciais em mobile, onde consultas financeiras rapidas sao frequentes.

**Independent Test**: Pode ser testado em larguras de tablet e mobile, validando que a navegacao compacta permite acessar os mesmos destinos principais, nao oculta informacoes financeiras essenciais e nao causa sobreposicao ou rolagem horizontal obrigatoria.

**Acceptance Scenarios**:

1. **Given** um usuario autenticado em uma tela mobile, **When** ele abre a navegacao compacta, **Then** os modulos disponiveis aparecem com nomes compreensiveis e area de toque adequada.
2. **Given** um usuario autenticado em mobile, **When** ele escolhe um modulo na navegacao compacta, **Then** a navegacao fecha ou se recolhe quando apropriado e o conteudo do modulo escolhido fica acessivel.
3. **Given** um usuario autenticado alternando entre tablet e desktop, **When** o tamanho da tela muda, **Then** a navegacao se adapta sem perder rota ativa, sessao ou contexto financeiro visivel.

---

### User Story 3 - Navegar com teclado e tecnologias assistivas (Priority: P3)

Como usuario que navega por teclado ou tecnologia assistiva, quero entender e operar a navegacao principal de forma previsivel para acessar os modulos financeiros com autonomia.

**Why this priority**: Acessibilidade e parte da base F00-F11 e a navegacao principal concentra acesso a areas criticas da aplicacao; a troca de layout precisa preservar orientacao, foco e nomes acessiveis.

**Independent Test**: Pode ser testado usando apenas teclado e uma arvore de acessibilidade, validando ordem de foco, nomes dos itens, indicacao do item atual e operacao da navegacao compacta.

**Acceptance Scenarios**:

1. **Given** um usuario autenticado usando teclado, **When** ele percorre a navegacao principal, **Then** cada item navegavel recebe foco visivel em ordem previsivel.
2. **Given** uma rota ativa, **When** uma tecnologia assistiva anuncia a navegacao, **Then** o item correspondente comunica que representa a pagina atual.
3. **Given** a navegacao compacta em mobile, **When** ela e aberta e fechada por teclado, **Then** o foco permanece controlado e retorna para um ponto previsivel da interface.

---

### User Story 4 - Ver apenas navegacao aplicavel ao estado da conta (Priority: P4)

Como usuario autenticado, quero ver uma navegacao coerente com minha sessao, permissoes e disponibilidade dos modulos para evitar acessar areas indisponiveis ou fora do meu contexto atual.

**Why this priority**: A plataforma possui convite, vinculo de casal, permissoes e isolamento de dados; a navegacao deve refletir esses limites sem expor informacoes inacessiveis.

**Independent Test**: Pode ser testado com estados de sessao e conta diferentes, validando que itens indisponiveis sao ocultados ou comunicados de forma segura, sem revelar dados privados nem quebrar a protecao de rotas.

**Acceptance Scenarios**:

1. **Given** um usuario nao autenticado, **When** ele tenta acessar uma rota autenticada, **Then** a navegacao autenticada nao e exibida e o acesso protegido e preservado.
2. **Given** um usuario autenticado sem vinculo completo de casal quando isso limitar algum modulo, **When** ele visualiza a navegacao, **Then** a interface comunica apenas as acoes ou destinos apropriados para seu estado.
3. **Given** um modulo indisponivel para o usuario atual, **When** a navegacao e renderizada, **Then** o usuario nao recebe acesso indevido nem informacoes financeiras de outro contexto.

### Edge Cases

- O que acontece quando a sessao ainda esta carregando e a aplicacao ainda nao sabe se deve exibir a navegacao autenticada?
- Como a interface se comporta quando um usuario nao autenticado tenta acessar diretamente uma rota protegida?
- O que acontece quando o usuario esta autenticado, mas ainda nao concluiu o vinculo de casal e alguns modulos dependem desse estado?
- Como a navegacao se adapta quando a tela e estreita, o texto do item e longo ou a orientacao do dispositivo muda?
- O que acontece quando a rota atual nao corresponde a nenhum item principal da navegacao?
- Como a navegacao evita expor modulos, nomes, contagens ou estados que possam sugerir dados financeiros sem autorizacao?
- Como estados vazios, carregamento e erro das paginas internas continuam compreensiveis apos a mudanca do layout principal?
- Quais fluxos F00-F11 podem regredir com a troca da navegacao, especialmente autenticacao, transacoes, dashboard, metas, convites, configuracoes e acessibilidade?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST apresentar uma navegacao principal autenticada no estilo dashboard para usuarios com sessao valida.
- **FR-002**: A navegacao principal MUST incluir acesso aos modulos Dashboard, Transacoes, Categorias, Metas, Convites/Parceiro e Configuracoes quando esses modulos estiverem disponiveis para o usuario.
- **FR-003**: O sistema MUST indicar a rota ativa de forma visualmente perceptivel e semanticamente compreensivel para tecnologias assistivas.
- **FR-004**: Usuarios MUST conseguir alternar entre os modulos principais sem perda de sessao, retorno indevido para autenticacao ou reset desnecessario do contexto autenticado.
- **FR-005**: O layout MUST apresentar uma sidebar lateral persistente ou facilmente acessivel em desktop.
- **FR-006**: O layout MUST oferecer uma navegacao compacta adequada para tablet e mobile, preservando acesso aos mesmos destinos principais quando aplicaveis.
- **FR-007**: A navegacao compacta MUST evitar sobreposicao incoerente com conteudo financeiro, rolagem horizontal obrigatoria e bloqueio de acoes essenciais da pagina atual.
- **FR-008**: A navegacao MUST ser operavel por teclado, com ordem de foco previsivel, foco visivel e comportamento claro para abrir, fechar ou recolher a navegacao quando aplicavel.
- **FR-009**: O sistema MUST fornecer nomes acessiveis compreensiveis para os itens de navegacao e comunicar corretamente o item que representa a pagina atual.
- **FR-010**: O sistema MUST preservar a protecao de rotas autenticadas ao exibir, ocultar ou adaptar a navegacao principal.
- **FR-011**: O sistema MUST respeitar permissoes, estado de sessao, vinculo do casal e disponibilidade dos modulos ao decidir quais destinos exibir ou habilitar.
- **FR-012**: O sistema MUST tratar o estado de carregamento da sessao sem exibir informacoes privadas ou uma navegacao autenticada incorreta.
- **FR-013**: O sistema MUST evitar elementos decorativos, textos redundantes ou excesso visual na navegacao que nao ajudem o usuario a localizar modulos e executar tarefas financeiras.
- **FR-014**: O sistema MUST preservar informacoes financeiras essenciais dentro das paginas existentes, sem remove-las ou reclassifica-las como parte da mudanca de layout.
- **FR-015**: O sistema MUST manter estados vazios, loading e erro das paginas internas compreensiveis apos a evolucao do layout principal.
- **FR-016**: O sistema MUST preservar comportamento equivalente dos fluxos F00-F11 impactados pela navegacao, incluindo autenticacao, dashboard, transacoes, categorias, metas, convites/parceiro e configuracoes.
- **FR-017**: O sistema MUST incluir verificacoes automatizadas proporcionais para renderizacao do layout autenticado, itens principais de navegacao, indicacao de rota ativa, adaptacao responsiva essencial e preservacao da navegacao protegida.
- **FR-018**: O sistema MUST manter a navegacao compreensivel quando a rota atual for uma subpagina, detalhe ou estado interno relacionado a um modulo principal.
- **FR-019**: O sistema MUST oferecer comportamento seguro para itens indisponiveis, usando ocultacao ou comunicacao neutra sem revelar dados financeiros ou permissoes internas indevidas.
- **FR-020**: O sistema MUST nao criar novas paginas de produto, novas regras financeiras, novo modelo de permissoes, novas areas de dados ou novos modulos como parte desta feature.

### Key Entities

- **Item de Navegacao Principal**: Representa um destino de alto nivel da area autenticada, com nome visivel, destino, estado ativo, disponibilidade e significado acessivel.
- **Layout Autenticado**: Estrutura de tela que envolve os modulos protegidos e fornece navegacao principal, area de conteudo e comportamento responsivo.
- **Estado da Sessao**: Condicao do usuario em relacao a autenticacao, carregamento, acesso permitido e continuidade da experiencia.
- **Estado de Disponibilidade do Modulo**: Condicao que determina se um modulo deve aparecer, estar habilitado ou ser comunicado como indisponivel com base no estado da conta e permissoes.
- **Contexto de Rota Atual**: Relacao entre a pagina exibida e o item de navegacao que deve ser indicado como ativo.

### Constitution Alignment *(mandatory)*

- **Incremental Baseline**: A F13 evolui a navegacao principal sobre a base F00-F11 sem recriar paginas, regras financeiras, autenticacao, permissoes ou dados. Fluxos de login, sessao, dashboard, transacoes, categorias, metas, convite/parceiro, configuracoes e acessibilidade devem manter comportamento equivalente.
- **Simplicity & Visual Clarity**: A navegacao deve priorizar destinos e orientacao, evitando textos explicativos redundantes, ornamentos, badges sem funcao ou densidade visual que dificulte encontrar tarefas financeiras.
- **Financial Transparency**: A feature nao altera valores, datas, responsaveis, categorias, visibilidade ou informacoes compartilhadas/individuais. A navegacao deve preservar o acesso claro aos modulos que exibem esses dados sem esconder contexto financeiro essencial.
- **Mobile & Accessibility**: A navegacao deve funcionar em desktop, tablet e mobile, com foco visivel, ordem de teclado previsivel, nomes acessiveis, indicacao semantica da rota atual e alternativa compacta utilizavel em telas pequenas.
- **Security & Privacy**: A navegacao autenticada so deve aparecer para usuarios com sessao valida e deve respeitar protecao de rotas, permissoes, isolamento de dados e estados de vinculo do casal sem revelar informacoes privadas por itens, textos ou estados indisponiveis.
- **Testing & PR Pipeline**: Devem existir verificacoes automatizadas para renderizacao do layout, itens principais, rota ativa, estados de sessao relevantes, navegacao compacta essencial e operacao basica por teclado. A entrega deve cumprir as validacoes obrigatorias de qualidade do projeto.
- **Performance, Query & Data Clarity**: A mudanca de layout nao deve alterar regras de atualizacao de dados, totais, datas, moedas, estados de carregamento ou comportamento de busca dos modulos existentes. A navegacao deve evitar recarregamentos desnecessarios ou perda perceptivel de contexto ao alternar modulos.
- **Prisma & Data Layer Impact**: A F13 nao deve alterar estruturas de dados, persistencia, regras de armazenamento, servicos de dados ou limites entre cliente e servidor. Qualquer necessidade de dados deve vir dos estados ja existentes de sessao, permissoes e disponibilidade dos modulos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste de aceitacao, um usuario autenticado consegue acessar Dashboard, Transacoes, Categorias, Metas, Convites/Parceiro e Configuracoes a partir da navegacao principal em ate 2 interacoes por modulo em desktop.
- **SC-002**: Em larguras representativas de mobile, tablet e desktop, 100% dos itens principais disponiveis permanecem acessiveis sem rolagem horizontal obrigatoria ou sobreposicao incoerente com o conteudo.
- **SC-003**: Em teste por teclado, 100% dos itens navegaveis da navegacao principal podem receber foco visivel, ser acionados e comunicar a rota ativa de forma verificavel.
- **SC-004**: Ao alternar entre pelo menos 5 modulos autenticados em sequencia, a sessao do usuario permanece ativa e nenhum fluxo protegido redireciona indevidamente para autenticacao.
- **SC-005**: Pelo menos 90% dos cenarios de regressao definidos para os fluxos F00-F11 impactados pela navegacao passam sem alteracao de comportamento observavel, e qualquer diferenca restante e documentada como intencional.
- **SC-006**: A especificacao de aceite da feature e satisfeita sem introduzir novas paginas de produto, novos modulos financeiros ou mudancas de regras financeiras.
- **SC-007**: Usuarios conseguem identificar visualmente o modulo atual em ate 3 segundos durante uma avaliacao manual de usabilidade nas principais rotas autenticadas.
- **SC-008**: Todas as verificacoes automatizadas exigidas para layout, navegacao principal e rota ativa passam antes da feature ser considerada pronta para planejamento tecnico.

## Assumptions

- A area autenticada ja possui rotas ou destinos equivalentes para Dashboard, Transacoes, Categorias, Metas, Convites/Parceiro e Configuracoes.
- O layout de navegacao atual pode ser substituido ou evoluido desde que preserve protecao de rotas e equivalencia funcional dos fluxos existentes.
- A disponibilidade dos modulos deve seguir o estado atual do produto; a F13 nao cria novos modulos nem transforma paginas indisponiveis em paginas completas.
- Em mobile, a solucao pode usar uma experiencia compacta apropriada desde que mantenha acesso aos destinos principais e seja operavel por teclado e tecnologias assistivas.
- A feature nao altera dados financeiros, permissoes, modelo de casal, auditoria, persistencia ou regras de negocio.
- A F12 orienta reducao de ruido visual; portanto, a navegacao da F13 deve ser objetiva e nao deve adicionar conteudo promocional, explicativo ou decorativo sem funcao.
