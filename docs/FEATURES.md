# Features iniciais para o GitHub Spec Kit

**Data**: 2026-05-31  
**Base**: `.specify/memory/constitution.md` e `docs/CONTEXT.md`

## Objetivo principal do produto

Permitir que casais controlem receitas, despesas, metas e evolução financeira em uma plataforma web simples, transparente e mobile-first, mantendo separação clara entre finanças individuais e compartilhadas.

O produto deve reduzir ambiguidade sobre saldos, responsáveis e visibilidade dos dados. Por isso, segurança, privacidade, convite de casal e rastreabilidade financeira são pré-condições para qualquer dashboard, gráfico ou fluxo avançado.

## Critérios de priorização

As features abaixo foram avaliadas com base nos princípios da constitution:

- **Segurança e privacidade**: proteção de dados financeiros, autenticação, autorização e isolamento por usuário/casal.
- **Valor para o usuário**: capacidade de resolver uma necessidade real do casal com pouca fricção.
- **Transparência financeira**: clareza sobre informação individual, compartilhada, responsável e contexto.
- **Mobile-first e acessibilidade**: viabilidade de uso em telas pequenas, teclado e tecnologias assistivas.
- **Dependências**: pré-requisitos técnicos ou de produto para implementação segura.
- **Esforço**: complexidade relativa para especificar, implementar e validar.

## Features numeradas

### F00 - Configuração inicial do app

**Descrição**: estruturar React, Vite, TypeScript, TailwindCSS, Shadcn/ui, rotas, tema, layout base e ferramentas de qualidade.

- **Impacto**: Alto.
- **Valor para o usuário**: cria a fundação para entregar as demais features com consistência, performance e acessibilidade.
- **Dependências**: decisões de stack já definidas na constitution.
- **Esforço**: Médio.
- **Observação**: é uma fundação técnica, não necessariamente a primeira feature de produto do Spec Kit.

### F01 - Autenticação e sessão do usuário

**Descrição**: permitir cadastro, login, logout, recuperação de senha e sessão persistente.

- **Impacto**: Muito alto.
- **Valor para o usuário**: permite uso privado e seguro da aplicação.
- **Dependências**: F00, Supabase Auth, rotas públicas/privadas e estado de sessão.
- **Esforço**: Médio.
- **Prioridade sugerida**: primeira feature de produto.
- **Status atual**: implementada na branch `001-user-auth-session`, incluindo
  rotas `/login`, `/sign-up`, `/forgot-password`, `/reset-password` e `/app`.

### F02 - Convite e vínculo do casal

**Descrição**: permitir criar um orçamento compartilhado, convidar outra pessoa, aceitar convite e vincular membros ao mesmo orçamento.

- **Impacto**: Muito alto.
- **Valor para o usuário**: torna o produto realmente voltado a casais e viabiliza transparência compartilhada.
- **Dependências**: F01, perfis, modelo de casal/orçamento e regras de acesso.
- **Esforço**: Alto.

### F03 - Modelo de permissões e isolamento de dados

**Descrição**: definir regras para garantir que cada usuário veja apenas dados próprios ou do casal ao qual pertence.

- **Impacto**: Muito alto.
- **Valor para o usuário**: garante confiança e evita exposição de dados financeiros.
- **Dependências**: F01, F02, Supabase PostgreSQL e RLS.
- **Esforço**: Alto.

### F04 - Categorias financeiras padrão

**Descrição**: disponibilizar categorias iniciais para moradia, alimentação, transporte, saúde, lazer, compras, educação, investimentos, contas e outros.

- **Impacto**: Médio.
- **Valor para o usuário**: reduz esforço de cadastro e padroniza a análise financeira.
- **Dependências**: F03 para persistência segura, quando houver dados no backend.
- **Esforço**: Baixo.

### F05 - Registro de transações

**Descrição**: permitir criar receitas e despesas com valor, data, categoria, responsável, tipo e visibilidade individual/compartilhada.

- **Impacto**: Muito alto.
- **Valor para o usuário**: entrega o hábito central do produto, que é registrar movimentações financeiras.
- **Dependências**: F01, F03 e F04.
- **Esforço**: Médio.

### F06 - Lista e filtros de transações

**Descrição**: permitir visualizar transações por mês, categoria, responsável, tipo e texto.

- **Impacto**: Alto.
- **Valor para o usuário**: ajuda o casal a entender o que aconteceu no período.
- **Dependências**: F05, categorias e consultas seguras.
- **Esforço**: Médio.

### F07 - Dashboard financeiro inicial

**Descrição**: exibir saldo, receitas do mês, despesas do mês, economia do mês e últimas transações.

- **Impacto**: Alto.
- **Valor para o usuário**: oferece visão rápida da situação financeira do casal.
- **Dependências**: F05, F06, filtros por período e regras de visibilidade.
- **Esforço**: Médio.

### F08 - Gráficos básicos

**Descrição**: mostrar gastos por categoria, evolução mensal e comparativo neutro entre membros do casal.

- **Impacto**: Médio.
- **Valor para o usuário**: facilita compreensão visual e tomada de decisão.
- **Dependências**: F05, F07 e agregações consistentes.
- **Esforço**: Médio.

### F09 - Metas financeiras

**Descrição**: permitir criar metas individuais ou compartilhadas com valor alvo, valor atual, prazo e progresso.

- **Impacto**: Alto.
- **Valor para o usuário**: ajuda o casal a planejar objetivos concretos.
- **Dependências**: F01, F02, F03 e, opcionalmente, F07 para exibição resumida.
- **Esforço**: Médio.

### F10 - Auditoria simples de alterações financeiras

**Descrição**: registrar autoria e contexto básico de alterações importantes em transações e metas.

- **Impacto**: Médio.
- **Valor para o usuário**: aumenta confiança e rastreabilidade entre os membros.
- **Dependências**: F05, F09, autenticação e modelo de eventos.
- **Esforço**: Médio.

### F11 - Responsividade e acessibilidade base

**Descrição**: garantir navegação mobile, foco visível, labels, mensagens de erro e estados vazios/carregamento/erro.

- **Impacto**: Muito alto.
- **Valor para o usuário**: torna os fluxos essenciais usáveis e confiáveis desde o MVP.
- **Dependências**: F00, design system, componentes base e validação de formulários.
- **Esforço**: Médio.
- **Observação**: deve ser tratada como critério transversal de aceite em todas as features, não como entrega tardia isolada.

## Análise de dependências

O fluxo recomendado para reduzir risco é:

1. **F00** - Configuração inicial do app.
2. **F01** - Autenticação e sessão do usuário.
3. **F02** - Convite e vínculo do casal.
4. **F03** - Modelo de permissões e isolamento de dados.
5. **F04** - Categorias financeiras padrão.
6. **F05** - Registro de transações.
7. **F06** - Lista e filtros de transações.
8. **F07** - Dashboard financeiro inicial.
9. **F08** - Gráficos básicos.
10. **F09** - Metas financeiras.
11. **F10** - Auditoria simples de alterações financeiras.

**F11** deve acompanhar todas as etapas como critério transversal: responsividade, acessibilidade, clareza de estados e qualidade técnica não devem ser tratadas como uma feature tardia. Elas devem entrar como critérios de aceite em cada feature do MVP.

## Recomendação de primeira feature

### Feature recomendada: F01 - Autenticação e sessão do usuário

**Escopo delimitado**

- Permitir cadastro com e-mail e senha.
- Permitir login com e-mail e senha.
- Permitir logout.
- Manter sessão persistente ao recarregar a aplicação.
- Proteger rotas autenticadas.
- Exibir estados de carregamento, erro, validação e sucesso.
- Garantir formulário acessível, mobile-first e com feedback claro.
- Preparar a base para associar o usuário a um futuro orçamento individual ou compartilhado.

**Fora de escopo nesta primeira feature**

- Convite de casal.
- Criação de orçamento compartilhado.
- Transações financeiras.
- Dashboard.
- Metas.
- Login social.

## Justificativa objetiva

Autenticação e sessão devem ser a primeira feature porque dados financeiros são sensíveis e a constitution define segurança, privacidade e autorização como prioridades máximas. Sem identidade de usuário confiável, não é possível implementar convite de casal, isolamento de dados, transações, metas ou dashboard de forma segura.

Além disso, essa feature é pequena o bastante para iniciar o fluxo do Spec Kit com escopo claro, critérios mensuráveis e baixo risco de ambiguidade. Ela cria a fundação necessária para o restante do MVP sem misturar regras financeiras complexas no primeiro ciclo.

## Próxima feature sugerida

Depois da autenticação, a próxima feature deve ser **Convite e vínculo do casal**, pois ela transforma a aplicação de um controle financeiro individual em uma experiência compartilhada. Essa segunda etapa deve definir o modelo de casal/orçamento, membros vinculados, aceite de convite e regras iniciais de autorização.

## Observações para specs futuras

- Toda feature deve explicitar se os dados são individuais, compartilhados ou ambos.
- Toda feature com dados financeiros deve incluir requisitos de autorização e isolamento.
- Fluxos frequentes devem ser testáveis em mobile.
- Formulários devem ter labels, mensagens de erro e navegação por teclado.
- Dashboards e gráficos devem priorizar clareza sobre densidade visual.
- Comparativos entre membros do casal devem usar linguagem neutra e não julgadora.
