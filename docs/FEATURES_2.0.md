# FEATURES 2.0 — Incrementos pós-F00–F11

**Data**: 2026-06-08  
**Projeto**: Plataforma Web de Controle Financeiro para Casais  
**Base considerada**: `CONTEXT.md` e `FEATURES.md`  
**Premissa desta versão**: as features iniciais **F00 a F11 já foram desenvolvidas**. Este documento não redefine o MVP inicial; ele organiza os próximos incrementos sobre a base existente.

---

## 1. Estado atual assumido

A aplicação já possui a base funcional descrita nas features F00–F11:

- app React/Vite/TypeScript com TailwindCSS, Shadcn/ui, rotas e arquitetura feature-based;
- autenticação e sessão de usuário;
- convite e vínculo do casal;
- modelo de permissões e isolamento de dados;
- categorias financeiras padrão;
- registro de transações;
- lista e filtros de transações;
- dashboard financeiro inicial;
- gráficos básicos;
- metas financeiras;
- auditoria simples de alterações financeiras;
- responsividade e acessibilidade base como critério transversal.

A partir desta versão, qualquer nova feature deve ser tratada como **incremento evolutivo**, **refatoração controlada** ou **endurecimento técnico** da aplicação já existente.

---

## 2. Objetivo dos incrementos 2.0

Evoluir a plataforma sem quebrar os fluxos já entregues, melhorando:

- clareza visual da interface;
- consistência da navegação principal;
- qualidade e segurança do processo de Pull Request;
- cobertura de testes unitários;
- listagem de transações com tabela robusta;
- comportamento do TanStack Query;
- camada de persistência com Prisma;
- manutenção futura do código.

O foco da versão 2.0 não é adicionar complexidade visual ou novas áreas de produto sem necessidade. O foco é consolidar a aplicação, reduzir ruído e preparar a base para evolução sustentável.

---

## 3. Princípios de evolução

### 3.1 Incrementalidade

Toda mudança deve preservar o comportamento das features F00–F11, salvo quando o objetivo explícito for substituir uma implementação por outra equivalente ou superior.

### 3.2 Não regressão

Nenhum fluxo já desenvolvido deve ser reescrito sem testes que comprovem equivalência funcional.

### 3.3 Refatoração com propósito

Refatorações só devem ocorrer quando melhorarem clareza, segurança, testabilidade, performance ou consistência arquitetural.

### 3.4 Interface orientada à tarefa

A interface deve priorizar dados e ações que ajudem o casal a tomar decisões financeiras. Elementos visuais sem função clara devem ser removidos.

### 3.5 Qualidade como bloqueio de entrega

Lint, typecheck, testes e build devem bloquear merge em Pull Requests.

---

## 4. Critérios de priorização 2.0

As novas features devem ser priorizadas considerando:

1. **Risco de regressão**: mudanças que protegem o que já existe têm prioridade alta.
2. **Impacto na experiência diária**: transações, dashboard e navegação são fluxos críticos.
3. **Fundação técnica**: Prisma, testes e pipeline reduzem custo de manutenção.
4. **Clareza visual**: reduzir ruído melhora usabilidade imediatamente.
5. **Compatibilidade com segurança existente**: qualquer mudança em dados deve respeitar isolamento por usuário/casal.
6. **Escopo incremental**: cada feature deve ser pequena o suficiente para revisão segura.

---

# 5. Features incrementais 2.0

## F12 — Limpeza visual e remoção de informações desnecessárias

**Tipo**: melhoria de UX e refatoração visual.  
**Descrição**: revisar telas existentes e remover elementos visuais, textos, cards, badges, gráficos, ícones ou blocos informativos que não ajudem diretamente na tomada de decisão financeira.

### Objetivo

Deixar a aplicação mais objetiva, limpa e coerente com o produto financeiro para casais.

### Escopo

- Revisar dashboard, transações, metas, categorias, convites e configurações.
- Remover informações decorativas ou redundantes.
- Reduzir densidade visual quando houver excesso de cards ou textos explicativos.
- Padronizar hierarquia visual entre títulos, ações primárias, filtros, tabelas e estados vazios.
- Preservar informações necessárias para segurança, auditoria e rastreabilidade.

### Fora de escopo

- Criar novo design system completo.
- Alterar regras de negócio.
- Remover dados essenciais de permissões, responsáveis, valores ou visibilidade.

### Dependências

- F00–F11 concluídas.
- Inventário das telas existentes.

### Critérios de aceite

- Cada tela deve ter apenas informações com função clara.
- Cards e gráficos redundantes devem ser removidos ou consolidados.
- Estados vazios, loading e erro devem continuar claros.
- Acessibilidade base não pode regredir.
- Deve haver testes unitários ou de componente quando a alteração afetar comportamento renderizado.

### Prioridade sugerida

Alta.

---

## F13 — Layout principal com sidebar de dashboard

**Tipo**: melhoria de navegação e layout.  
**Descrição**: substituir ou evoluir o menu principal atual para um layout lateral no estilo dashboard, com sidebar responsiva.

### Objetivo

Criar uma navegação mais consistente para a aplicação autenticada, especialmente conforme o número de módulos cresce.

### Escopo

- Criar layout autenticado com sidebar lateral em desktop.
- Incluir links para Dashboard, Transações, Categorias, Metas, Convites/Parceiro e Configurações, conforme módulos disponíveis.
- Indicar rota ativa.
- Permitir sidebar colapsável quando fizer sentido.
- Em mobile, adaptar para drawer, bottom navigation ou menu compacto, mantendo usabilidade.
- Preservar proteção de rotas autenticadas.

### Fora de escopo

- Criar novas páginas de produto.
- Redesenhar profundamente todos os componentes internos.

### Dependências

- F01 autenticação.
- F07 dashboard.
- F11 responsividade/acessibilidade.

### Critérios de aceite

- Usuário autenticado deve navegar entre módulos por uma sidebar clara.
- A rota ativa deve ser perceptível visualmente e por acessibilidade.
- O layout deve funcionar em desktop, tablet e mobile.
- A navegação deve ser operável por teclado.
- Não deve haver perda de contexto de sessão ao navegar.
- Devem existir testes para renderização do layout e itens de navegação principais.

### Prioridade sugerida

Alta.

---

## F14 — Tabela de transações com TanStack Table

**Tipo**: evolução de feature existente.  
**Descrição**: substituir a visualização atual da listagem de transações por uma tabela estruturada usando **TanStack Table**.

### Objetivo

Tornar a listagem de transações mais escalável, legível e preparada para filtros, ordenação, paginação e futuras interações.

### Escopo

- Usar TanStack Table para renderizar transações.
- Exibir colunas essenciais:
  - título;
  - valor;
  - tipo;
  - categoria;
  - data;
  - responsável;
  - visibilidade ou compartilhamento;
  - ações.
- Manter filtros já existentes por mês, categoria, responsável, tipo e texto.
- Adicionar ordenação quando fizer sentido, especialmente por data e valor.
- Preparar paginação ou virtualização se a quantidade de dados justificar.
- Garantir renderização adequada em mobile, com tabela responsiva ou alternativa em cards compactos.

### Fora de escopo

- Criar cadastro de transações do zero.
- Alterar modelo financeiro.
- Adicionar importação bancária.

### Dependências

- F05 registro de transações.
- F06 lista e filtros de transações.
- F03 permissões e isolamento de dados.

### Critérios de aceite

- A listagem deve usar TanStack Table internamente.
- Filtros existentes devem continuar funcionando.
- Ordenação não deve quebrar os filtros.
- Ações de editar/excluir devem respeitar permissões existentes.
- A tabela deve ser acessível, com cabeçalhos corretos e navegação viável por teclado.
- Devem existir testes unitários para definição de colunas, filtros e renderização dos estados principais.

### Prioridade sugerida

Muito alta.

---

## F15 — Configuração do TanStack Query sem refetch ao trocar de janela ou aba

**Tipo**: melhoria de performance e experiência.  
**Descrição**: ajustar a configuração global do TanStack Query para evitar refetch automático quando o usuário troca de janela ou aba.

### Objetivo

Reduzir chamadas desnecessárias, evitar flicker de interface e melhorar previsibilidade da aplicação.

### Escopo

- Configurar `refetchOnWindowFocus: false` globalmente.
- Revisar queries existentes para garantir que não sobrescrevam essa configuração sem justificativa.
- Documentar exceções quando alguma query realmente precisar de refetch ao focar a janela.
- Manter invalidações manuais após criação, edição ou exclusão de dados.

### Fora de escopo

- Remover TanStack Query da aplicação.
- Substituir gerenciamento de server state.
- Criar estratégia offline-first.

### Dependências

- F00 configuração do app.
- F05, F06, F07, F09 ou qualquer feature que use server state.

### Critérios de aceite

- Trocar de aba ou janela não deve disparar refetch automático global.
- Criação, edição e exclusão ainda devem atualizar dados corretamente via invalidação controlada.
- Deve haver teste ou verificação automatizada cobrindo configuração padrão do Query Client.
- Exceções devem estar documentadas no código ou em documentação técnica.

### Prioridade sugerida

Alta.

---

## F16 — Introdução do Prisma como ORM

**Tipo**: evolução arquitetural e infraestrutura de dados.  
**Descrição**: introduzir **Prisma** como ORM para modelagem, migrações e acesso seguro ao banco de dados PostgreSQL.

### Objetivo

Padronizar a camada de dados, melhorar tipagem, migrações, manutenção do schema e evolução futura da persistência.

### Escopo

- Instalar e configurar Prisma.
- Criar `schema.prisma` refletindo o modelo atual:
  - users/profiles;
  - couples;
  - couple_members;
  - invitations;
  - transactions;
  - goals;
  - audit/event logs, se já existir.
- Definir migrations compatíveis com o banco atual.
- Criar Prisma Client apenas em ambiente backend/server-side.
- Criar camada de repositórios ou services para acesso a dados.
- Preservar Supabase Auth como mecanismo de identidade, se esta continuar sendo a decisão do projeto.
- Validar compatibilidade com políticas de segurança, permissões e isolamento de dados.

### Fora de escopo

- Expor Prisma diretamente no frontend.
- Remover autenticação existente.
- Reescrever toda a aplicação em outro framework sem decisão específica.
- Ignorar RLS ou regras de autorização já existentes.

### Dependências

- F01 autenticação.
- F02 vínculo do casal.
- F03 isolamento de dados.
- Banco PostgreSQL existente.

### Pontos de atenção

- Prisma não substitui autorização de negócio.
- A camada de API/backend deve validar usuário autenticado e escopo de acesso.
- Caso o projeto continue 100% frontend com Supabase direto, será necessário introduzir uma camada server-side antes de usar Prisma de forma segura.

### Critérios de aceite

- Prisma configurado com schema representando o modelo atual.
- Migrações executáveis e versionadas.
- Nenhum segredo de banco exposto no frontend.
- Acesso a dados encapsulado em services/repositories.
- Testes unitários cobrindo pelo menos os mapeamentos e regras da camada de dados adicionada.
- Documentação clara sobre relação entre Supabase Auth, PostgreSQL, Prisma e autorização.

### Prioridade sugerida

Muito alta, mas deve ser planejada com cuidado por impactar a arquitetura.

---

## F17 — Pipeline de Pull Request com lint, testes, typecheck e build

**Tipo**: qualidade contínua e DevOps.  
**Descrição**: criar pipeline automatizado para validar cada Pull Request antes de merge.

### Objetivo

Reduzir regressões e garantir que incrementos futuros não quebrem a aplicação.

### Escopo

- Criar workflow de CI, preferencialmente GitHub Actions.
- Executar em Pull Requests para branches principais.
- Validar:
  - instalação de dependências;
  - formatação, se aplicável;
  - lint;
  - typecheck;
  - testes unitários;
  - build.
- Publicar status claro no Pull Request.
- Falha em qualquer etapa deve bloquear merge, conforme configuração do repositório.

### Fora de escopo

- Deploy automatizado para produção.
- Testes end-to-end completos, salvo se já existirem.
- Integração com provedores externos de monitoramento.

### Dependências

- F00 tooling base.
- Test runner configurado.
- Scripts consistentes em `package.json`.

### Critérios de aceite

- Todo Pull Request deve executar pipeline automaticamente.
- O pipeline deve falhar quando lint, typecheck, testes ou build falharem.
- Scripts devem ser reproduzíveis localmente.
- O README ou documentação técnica deve explicar como rodar as validações localmente.

### Prioridade sugerida

Muito alta.

---

## F18 — Política de testes unitários para tudo que for criado

**Tipo**: qualidade de engenharia.  
**Descrição**: estabelecer e aplicar a regra de que todo novo código criado deve ter testes unitários proporcionais ao risco e à lógica envolvida.

### Objetivo

Criar uma base confiável para evolução contínua, evitando regressões em regras financeiras, permissões, filtros e componentes críticos.

### Escopo

- Definir padrão de testes unitários por camada:
  - componentes;
  - hooks;
  - services;
  - validações Zod;
  - formatadores;
  - permissões;
  - filtros;
  - colunas de tabela;
  - regras financeiras.
- Criar utilitários de teste compartilhados.
- Documentar convenções de nomeação e localização dos testes.
- Exigir testes para toda feature incremental.
- Adicionar cobertura mínima progressiva, se fizer sentido.

### Fora de escopo

- Exigir 100% de cobertura artificial.
- Criar testes frágeis focados em detalhes internos sem valor.
- Substituir testes de integração ou E2E quando eles forem mais adequados.

### Dependências

- F00 tooling base.
- F17 pipeline de Pull Request.

### Critérios de aceite

- Toda nova regra de negócio deve ter teste unitário.
- Todo novo hook com lógica deve ter teste.
- Componentes com estados condicionais relevantes devem ter teste.
- Bugs corrigidos devem receber teste de regressão.
- O pipeline deve executar os testes automaticamente.

### Prioridade sugerida

Muito alta.

---

## F19 — Revisão da arquitetura de dados e serviços após Prisma

**Tipo**: refatoração arquitetural controlada.  
**Descrição**: reorganizar acesso a dados para usar uma camada clara de services/repositories compatível com Prisma e com as regras de segurança já existentes.

### Objetivo

Evitar acoplamento entre componentes React, queries, regras de domínio e persistência.

### Escopo

- Criar ou revisar camada de repositories para entidades principais.
- Criar services de domínio quando houver regra financeira ou autorização contextual.
- Manter TanStack Query consumindo funções de serviço, não detalhes diretos de persistência.
- Padronizar erros retornados pela camada de dados.
- Garantir que permissões sejam validadas antes de operações sensíveis.

### Fora de escopo

- Reescrever todos os componentes sem necessidade.
- Alterar UX das telas.
- Criar microserviços.

### Dependências

- F16 Prisma.
- F03 permissões.
- F05/F06 transações.
- F09 metas.

### Critérios de aceite

- Componentes não devem conhecer detalhes de Prisma.
- Hooks de query devem chamar services claros.
- Regras de permissão devem ser testáveis isoladamente.
- Erros devem ser tratados de forma consistente na UI.
- Testes unitários devem cobrir services críticos.

### Prioridade sugerida

Alta.

---

## F20 — Consolidação dos critérios de aceite transversais 2.0

**Tipo**: governança de produto e engenharia.  
**Descrição**: atualizar a documentação do projeto para que toda feature futura siga critérios comuns de UX, segurança, testes, acessibilidade e performance.

### Objetivo

Evitar que novas features sejam especificadas de forma incompleta ou desalinhada com a base já construída.

### Escopo

- Criar checklist padrão para specs futuras.
- Incluir critérios obrigatórios:
  - dados individuais/compartilhados;
  - autorização e escopo de acesso;
  - testes unitários;
  - comportamento mobile;
  - acessibilidade;
  - estados de loading, vazio e erro;
  - impacto em TanStack Query;
  - impacto em Prisma/schema;
  - impacto no pipeline.
- Atualizar documentação de contribuição.

### Fora de escopo

- Criar novas features de produto.
- Repriorizar o roadmap inteiro sem necessidade.

### Dependências

- F12–F19.

### Critérios de aceite

- Existe checklist reutilizável para novas specs.
- Toda feature nova deve declarar impacto em dados, UI, testes e segurança.
- O checklist deve ser fácil de copiar para prompts do Spec Kit.

### Prioridade sugerida

Média.

---

# 6. Ordem recomendada de implementação

A ordem sugerida considera baixo risco, ganho rápido e preparação técnica:

1. **F17 — Pipeline de Pull Request com lint, testes, typecheck e build**  
   Protege a base antes das refatorações.

2. **F18 — Política de testes unitários para tudo que for criado**  
   Define a régua de qualidade para todos os incrementos seguintes.

3. **F15 — Configuração do TanStack Query sem refetch ao trocar de janela ou aba**  
   Mudança pequena, de impacto direto e baixo risco.

4. **F12 — Limpeza visual e remoção de informações desnecessárias**  
   Melhora UX sem alterar regras centrais.

5. **F13 — Layout principal com sidebar de dashboard**  
   Organiza a navegação para crescimento da aplicação.

6. **F14 — Tabela de transações com TanStack Table**  
   Evolui um fluxo crítico já existente.

7. **F16 — Introdução do Prisma como ORM**  
   Deve ser feita com planejamento por impactar arquitetura e persistência.

8. **F19 — Revisão da arquitetura de dados e serviços após Prisma**  
   Consolida a nova camada de dados.

9. **F20 — Consolidação dos critérios de aceite transversais 2.0**  
   Formaliza o padrão para os próximos ciclos.

---

# 7. Recomendações para uso com GitHub Spec Kit

## 7.1 Como tratar F00–F11

As features F00–F11 devem ser consideradas **baseline concluído**. Portanto, ao criar specs novas, não peça para implementar novamente autenticação, dashboard, metas, transações ou permissões do zero.

Use linguagem como:

> A aplicação já possui F00–F11 implementadas. Esta feature deve ser incremental e preservar os fluxos existentes.

## 7.2 Como especificar novas features

Cada spec incremental deve responder:

- O que já existe e será reaproveitado?
- O que será alterado?
- O que não pode regredir?
- Quais testes precisam ser adicionados?
- Quais permissões ou regras de dados são afetadas?
- A feature altera schema, Prisma, query ou UI?
- Como o comportamento mobile será validado?

## 7.3 Prompt base recomendado

```text
Considere que as features F00 a F11 já foram desenvolvidas e fazem parte do baseline da aplicação.

Especifique apenas o incremento da feature [NOME/ID], preservando os fluxos existentes de autenticação, vínculo de casal, permissões, transações, dashboard, metas, auditoria, responsividade e acessibilidade.

Inclua requisitos funcionais, requisitos não funcionais, critérios de aceite, testes unitários obrigatórios, riscos de regressão e impactos em dados, UI, TanStack Query, Prisma e pipeline de PR quando aplicável.
```

---

# 8. Definição de pronto 2.0

Uma feature incremental só deve ser considerada pronta quando:

- preserva os fluxos existentes aplicáveis;
- possui testes unitários para nova lógica;
- passa em lint, typecheck, testes e build;
- não introduz chamadas desnecessárias de dados;
- respeita isolamento de usuário/casal;
- mantém acessibilidade mínima;
- funciona em mobile;
- possui estados de loading, vazio e erro quando aplicável;
- documenta exceções técnicas relevantes;
- não adiciona ruído visual sem propósito.

---

# 9. Observação final

A versão 2.0 deve ser entendida como uma etapa de consolidação e maturidade. O produto já possui o conjunto inicial F00–F11; agora o objetivo é fortalecer a base, melhorar a experiência e preparar a aplicação para crescer sem perder simplicidade, segurança e manutenibilidade.
