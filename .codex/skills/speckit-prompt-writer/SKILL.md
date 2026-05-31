# Speckit Prompt Writer Skill

## Finalidade

Esta skill cria prompts profissionais para acompanhar os comandos do GitHub Spec Kit:

- `/speckit.constitution`
- `/speckit.specify`
- `/speckit.plan`

Use esta skill quando o usuário quiser transformar uma ideia de projeto, feature, produto, website, app ou sistema em prompts estruturados para o fluxo Spec-Driven Development do Spec Kit.

A skill não implementa código. Ela gera prompts de alta qualidade para orientar o agente/coding assistant durante cada etapa.

---

## Quando usar

Use quando o usuário pedir algo como:

- "crie um prompt para speckit"
- "me ajude a rodar /speckit.constitution"
- "faça a especificação para /speckit.specify"
- "crie o plano para /speckit.plan"
- "transforme essa ideia em prompts do Spec Kit"
- "monte constitution, specify e plan para este projeto"

---

## Princípio central da skill

Cada comando tem uma função diferente. Nunca misture as responsabilidades.

### `/speckit.constitution`

Define os princípios obrigatórios que governam as próximas fases do projeto.

Deve responder:

- Quais valores técnicos, de produto e experiência são inegociáveis?
- Que tipo de qualidade o projeto deve preservar?
- O que deve ser considerado erro ou violação?
- Como as próximas decisões devem ser avaliadas?

Pode incluir:

- princípios de produto
- princípios de UX/UI
- princípios de conteúdo
- princípios técnicos
- padrões de qualidade
- regras de manutenção
- restrições globais
- prioridades de negócio
- critérios de decisão

Não deve virar especificação detalhada de feature.
Não deve definir telas específicas demais, fluxos completos ou tarefas de implementação.
Pode mencionar restrições técnicas globais somente quando forem princípios do projeto.

---

### `/speckit.specify`

Define o que precisa ser construído e por que isso importa, sem definir tecnologia.

Deve responder:

- Qual é o objetivo do produto ou feature?
- Quem é o usuário?
- Quais problemas são resolvidos?
- Quais seções, fluxos ou capacidades são necessárias?
- Que comportamentos são esperados?
- Quais regras de negócio precisam existir?
- Quais critérios tornam a entrega aceitável?

Pode incluir:

- objetivo principal
- público-alvo
- necessidades do usuário
- problemas e oportunidades
- jornadas/fluxos principais
- seções obrigatórias
- requisitos funcionais
- requisitos de conteúdo
- requisitos de experiência
- critérios de aceitação
- restrições de negócio

Não pode incluir:

- framework
- linguagem
- banco de dados
- biblioteca de UI
- ORM
- ferramenta de formulário
- provedor de deploy
- arquitetura técnica específica
- detalhes de implementação

Exemplos de termos proibidos nesta fase, salvo se o usuário pedir revisão explícita de uma especificação já técnica:

- React
- Next.js
- Vue
- Angular
- TailwindCSS
- ShadcnUI
- Prisma
- Supabase
- PostgreSQL
- Vite
- React Hook Form
- Zod
- Docker

---

### `/speckit.plan`

Define como a solução será implementada tecnicamente.

Deve responder:

- Qual stack será usada?
- Qual arquitetura será adotada?
- Como os arquivos e componentes serão organizados?
- Como lidar com dados, estado, validação, integrações e formulários?
- Como atender SEO, acessibilidade, performance, segurança e manutenção?
- Quais critérios técnicos validam a qualidade da entrega?

Pode incluir:

- framework
- linguagem
- arquitetura
- organização de pastas
- componentes
- UI library
- estratégia de estilo
- SEO técnico
- acessibilidade
- performance
- segurança
- armazenamento de dados
- integrações
- validação
- testes, quando aplicável
- deploy, quando aplicável
- critérios técnicos de qualidade

Deve respeitar a constituição e a especificação já criadas.

---

## Processo de geração

Ao receber um pedido, siga este fluxo:

1. Identifique o tipo de entrega:
   - somente constitution
   - somente specify
   - somente plan
   - os três prompts completos
   - revisão de prompts existentes

2. Extraia o contexto do usuário:
   - tipo de projeto
   - objetivo comercial ou operacional
   - público-alvo
   - funcionalidades desejadas
   - nível de qualidade esperado
   - restrições
   - stack desejada, apenas para plan
   - tom e idioma

3. Se faltar contexto essencial, faça no máximo uma pergunta.
   Se o projeto for claro o suficiente, avance com suposições explícitas.

4. Gere prompts prontos para colar no comando correspondente.

5. Garanta que cada prompt seja:
   - específico
   - acionável
   - objetivo
   - sem placeholders genéricos
   - em português, salvo pedido contrário
   - coerente com a fase do Spec Kit

---

## Formato de saída padrão

Quando criar os três prompts, use esta estrutura:

```markdown
# Prompts para GitHub Spec Kit

## 1. `/speckit.constitution`

```bash
/speckit.constitution ...
```

## 2. `/speckit.specify`

```bash
/speckit.specify ...
```

## 3. `/speckit.plan`

```bash
/speckit.plan ...
```
```

Quando criar apenas um prompt, entregue somente o bloco daquele comando.

---

## Checklist de qualidade antes de responder

Antes de entregar, valide:

- A constitution cria regras e princípios, não tarefas.
- O specify descreve produto, negócio, usuários, requisitos e aceitação, sem stack.
- O plan contém stack, arquitetura e decisões técnicas.
- O plan não contradiz a constitution.
- O specify não contém ferramentas de implementação.
- Os prompts estão prontos para copiar e colar.
- O texto evita frases genéricas como "crie algo moderno" sem explicar critérios.
- Cada decisão importante tem finalidade clara.
- CTAs, conversão, UX, conteúdo, SEO, acessibilidade, performance e manutenção aparecem quando forem relevantes ao projeto.
- As restrições do usuário foram preservadas.
- Se o usuário disse que não quer testes automatizados, não inclua testes automatizados no plan.

---

## Template: constitution

Use este modelo quando o usuário pedir `/speckit.constitution`:

```bash
/speckit.constitution Crie uma constituição profissional para o desenvolvimento de [TIPO DE PROJETO], com padrão comercial real, foco em resultado e decisões objetivas.

A constituição deve servir como base obrigatória para todas as próximas etapas do projeto e definir princípios para produto, UX, UI, conteúdo, acessibilidade, performance, segurança, manutenção e implementação técnica.

O projeto deve priorizar:
- [PRIORIDADE 1]
- [PRIORIDADE 2]
- [PRIORIDADE 3]
- clareza acima de estética vazia
- experiência mobile-first, quando aplicável
- credibilidade e confiança visíveis
- conversão ou conclusão eficiente dos objetivos principais
- conteúdo específico, útil e sem aparência de placeholder
- estrutura semântica e preparada para descoberta orgânica, quando aplicável
- acessibilidade como requisito de qualidade
- performance como parte da experiência
- organização e manutenção do código
- simplicidade com padrão profissional
- código limpo, consistente e organizado

A constituição deve deixar claro que:
- cada funcionalidade precisa ter objetivo de negócio ou valor claro para o usuário
- a primeira experiência do usuário deve comunicar propósito, profissionalismo e confiança
- ações principais precisam ser visíveis, estratégicas e sem fricção
- confiança deve ser construída com evidências concretas, não presumida
- conteúdos vagos, genéricos ou artificiais não são aceitáveis
- uma interface bonita, mas lenta, confusa, inacessível ou ruim no mobile, é uma falha de qualidade
- hacks, improvisos, duplicação desnecessária e complexidade gratuita não são aceitáveis
- decisões futuras devem ser avaliadas contra estes princípios

Inclua princípios objetivos, critérios de conformidade e exemplos de violações.
[RESTRIÇÕES GLOBAIS DO USUÁRIO]
```

---

## Template: specify

Use este modelo quando o usuário pedir `/speckit.specify`:

```bash
/speckit.specify Crie a especificação de [PRODUTO/FEATURE/PÁGINA/SISTEMA], com foco em [OBJETIVO PRINCIPAL] e em entregar valor real para o usuário e para o negócio.

A especificação deve descrever o que precisa ser construído e por que isso é importante, sem definir tecnologias, frameworks, bibliotecas, banco de dados, arquitetura técnica ou detalhes de implementação.

O projeto deve atender [PÚBLICO-ALVO], que precisa:
- [NECESSIDADE 1]
- [NECESSIDADE 2]
- [NECESSIDADE 3]
- entender rapidamente o valor da solução
- concluir as ações principais com clareza e pouca fricção

A solução deve transmitir:
- profissionalismo
- clareza
- confiança
- organização
- coerência com o posicionamento do negócio
- facilidade de uso
- sensação de produto real, completo e bem estruturado

A especificação deve incluir:
- objetivo principal
- perfil do público
- problemas que a solução resolve
- principais necessidades do usuário
- principais fluxos ou jornadas do usuário
- seções, áreas ou capacidades obrigatórias
- objetivo de cada seção ou capacidade
- requisitos funcionais
- requisitos de conteúdo
- requisitos de experiência
- regras de negócio
- critérios de aceitação

A solução deve contemplar, no mínimo:
- [SEÇÃO/CAPACIDADE 1]
- [SEÇÃO/CAPACIDADE 2]
- [SEÇÃO/CAPACIDADE 3]
- [SEÇÃO/CAPACIDADE 4]
- [SEÇÃO/CAPACIDADE 5]

A especificação também deve garantir que:
- o usuário entenda a proposta em poucos segundos
- as ações principais sejam evidentes
- o conteúdo seja específico, útil e sem aparência de placeholder
- a experiência mobile seja considerada prioridade, quando aplicável
- exista base para descoberta orgânica/SEO, quando relevante
- a solução tenha critérios de qualidade claros e verificáveis

Escreva em português, com estrutura clara, requisitos objetivos, fluxos principais do usuário e critérios de aceitação bem definidos.
```

---

## Template: plan

Use este modelo quando o usuário pedir `/speckit.plan`:

```bash
/speckit.plan Crie um plano técnico para implementar [PRODUTO/FEATURE/PÁGINA/SISTEMA] com foco em qualidade visual, performance, acessibilidade, segurança, SEO/descoberta orgânica quando aplicável e manutenção a longo prazo.

A implementação deve usar:
- [FRAMEWORK]
- [LINGUAGEM]
- [UI/STYLING]
- [BIBLIOTECAS PRINCIPAIS]
- sempre considerando versões atuais e compatíveis

A arquitetura deve seguir uma abordagem moderna, organizada e escalável, com separação clara entre layout, seções, componentes reutilizáveis, elementos compartilhados de interface, dados, validações e integrações.

O plano deve considerar:
- componentização por responsabilidade
- estrutura escalável para evolução futura
- organização limpa de arquivos e pastas
- foco em mobile-first, quando aplicável
- semântica adequada
- estratégia de SEO técnico/local, quando aplicável
- acessibilidade mínima obrigatória
- otimização de imagens e assets
- performance como requisito técnico
- segurança na manipulação de dados, formulários e integrações
- tipagem padronizada
- código limpo e fácil de manter

Defina uma arquitetura adequada para implementar:
- [MÓDULO/SEÇÃO 1]
- [MÓDULO/SEÇÃO 2]
- [MÓDULO/SEÇÃO 3]
- [MÓDULO/SEÇÃO 4]
- [MÓDULO/SEÇÃO 5]

Também inclua no plano:
- organização sugerida de pastas
- estratégia para componentes reutilizáveis
- organização dos estilos
- padronização de tipagem
- tratamento de assets e imagens
- estratégia de dados e estado
- estratégia básica para formulários e validações
- critérios técnicos de qualidade
- validações essenciais de responsividade, acessibilidade e fluxos principais
- estratégia de deploy, se fizer sentido
[POLÍTICA DE TESTES DO USUÁRIO]
[RESTRIÇÕES TÉCNICAS OU DE NEGÓCIO]
```

---

## Regras de revisão

Quando revisar prompts existentes, responda com:

1. Diagnóstico por fase.
2. Problemas encontrados.
3. Riscos práticos.
4. Versão corrigida.
5. Checklist final.

Erros graves a sinalizar:

- specify contendo stack.
- constitution com tarefas detalhadas.
- plan sem decisões técnicas.
- plan contradizendo restrições do usuário.
- prompts genéricos demais.
- ausência de critérios de aceitação no specify.
- ausência de critérios técnicos no plan.
- ausência de princípios verificáveis na constitution.

---

## Exemplo de uso: website comercial de petshop

```bash
/speckit.constitution Crie uma constituição profissional para o desenvolvimento de um website completo de petshop, com padrão comercial real e foco em resultado.

A constituição deve servir como base para todas as próximas etapas do projeto e definir princípios obrigatórios para produto, UX, UI, conteúdo e implementação técnica.

O projeto deve priorizar:
- credibilidade e confiança imediata
- geração de contato e conversão
- experiência mobile-first
- clareza acima de estética vazia
- design profissional e consistente
- SEO local e estrutura semântica
- acessibilidade como requisito
- performance como parte da qualidade
- organização e manutenção do código
- simplicidade com padrão profissional
- código limpo e organizado

A constituição deve deixar claro que:
- cada funcionalidade precisa ter objetivo de negócio
- o site deve transmitir profissionalismo já na primeira tela
- CTAs importantes precisam ser visíveis e estratégicos
- confiança não pode ser presumida, ela deve ser construída com prova visível
- conteúdos vagos, genéricos ou com cara de placeholder não são aceitáveis
- um site bonito, mas lento, confuso ou ruim no mobile, é um fracasso
- hacks, improvisos e complexidade desnecessária não são aceitáveis

Não deve ter testes automatizados.
```

```bash
/speckit.specify Crie a especificação de uma página completa, profissional e comercial para um petshop, com foco em transmitir confiança, apresentar os serviços e produtos do negócio e aumentar a geração de contatos e agendamentos.

A especificação deve descrever o que precisa ser construído e por que isso é importante para o usuário e para o negócio, sem definir tecnologias, frameworks ou detalhes de implementação.

Inclua objetivo principal, público, necessidades do usuário, fluxos principais, seções obrigatórias, objetivo de cada seção, requisitos funcionais, requisitos de conteúdo, requisitos de experiência e critérios de aceitação.

A home page deve contemplar, no mínimo:
- seção principal com proposta clara, prova de valor e CTA
- seção institucional explicando o petshop
- seção de diferenciais
- seção de serviços
- seção de produtos em destaque
- seção de prova social ou depoimentos
- seção de perguntas frequentes
- seção de contato com dados visíveis
- rodapé com informações completas

Garanta que o usuário entenda a proposta do negócio em poucos segundos, que o contato seja simples e sem fricção, que os CTAs principais sejam evidentes, que a página seja coerente com um negócio premium e confiável, que o conteúdo não tenha cara de placeholder, que a experiência mobile seja prioridade e que haja espaço para SEO local e descoberta orgânica.
```

```bash
/speckit.plan Crie um plano técnico para implementar uma página completa e profissional de petshop com foco em qualidade visual, performance, SEO, acessibilidade, segurança e manutenção a longo prazo.

A implementação deve usar:
- React JS com Vite
- TypeScript
- TailwindCSS
- ShadcnUI para componentes e UI
- versões atuais e compatíveis

A arquitetura deve seguir uma abordagem moderna e organizada, com separação clara entre layout, seções da página, componentes reutilizáveis e elementos compartilhados de interface.

O plano deve considerar componentização por responsabilidade, estrutura escalável para evolução futura, organização limpa de arquivos e pastas, foco em mobile-first, boa semântica HTML, otimização de imagens, metadados e estrutura base para SEO local, performance como requisito técnico, acessibilidade mínima obrigatória em toda interface e segurança.

A home será inicialmente uma página comercial completa com conteúdo estático, mas a arquitetura deve permitir crescimento futuro para CMS, painel administrativo ou dados dinâmicos sem refatoração caótica.

Defina uma arquitetura adequada para implementar header, hero section, seção institucional, diferenciais, serviços, produtos em destaque, depoimentos, FAQ, contato e footer.

Inclua estratégia para componentes reutilizáveis, organização dos estilos, padronização de tipagem, tratamento de assets e imagens, estratégia básica para formulários, critérios técnicos de qualidade e validações essenciais de responsividade, acessibilidade e fluxos principais.

Não inclua testes automatizados.
```
