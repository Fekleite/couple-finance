# Research: F00 - Configuracao inicial do app

## Decision: Usar React + Vite + TypeScript estrito como base da SPA

**Rationale**: A constitution e o contexto do produto definem esta stack como
padrao. Vite reduz configuracao inicial, TypeScript estrito fortalece manutencao
e React sustenta evolucao para autenticacao, convite, dashboard e fluxos
financeiros futuros.

**Alternatives considered**: Next.js foi rejeitado por adicionar decisoes de SSR
e roteamento que nao sao necessarias para a F00. CRA foi rejeitado por ser uma
base menos atual e menos adequada ao fluxo moderno com Vite.

## Decision: Configurar TailwindCSS e Shadcn/ui desde a fundacao

**Rationale**: TailwindCSS viabiliza uma interface mobile-first com tokens
consistentes e foco visivel sem criar uma camada visual pesada. Shadcn/ui prepara
componentes acessiveis e customizaveis para features futuras, mas a F00 deve
usar apenas o necessario para layout, botoes e estados basicos.

**Alternatives considered**: CSS Modules puros foram rejeitados por aumentar
trabalho de padronizacao visual inicial. Bibliotecas de componentes fechadas
foram rejeitadas por reduzirem controle sobre acessibilidade, tema e linguagem
visual.

## Decision: Usar React Router com rotas publicas e estrutura preparada para protegidas

**Rationale**: A especificacao exige navegacao base e diferenciacao conceitual
entre areas publicas e futuras areas autenticadas. React Router atende a SPA sem
introduzir backend, auth ou persistencia. Rotas protegidas devem existir apenas
como organizacao futura, sem fluxo falso de login ou dashboard.

**Alternatives considered**: Roteamento manual por estado foi rejeitado por nao
representar rotas reais e dificultar not-found. Implementar auth guards reais foi
rejeitado porque autenticacao pertence a F01.

## Decision: Criar componentes reutilizaveis de loading, error e empty

**Rationale**: Estados reutilizaveis reduzem ambiguidade nas proximas features e
ja atendem aos criterios de simplicidade, feedback, acessibilidade e confianca.
Cada estado deve expor titulo, mensagem e acao opcional, mantendo semantica e
hierarquia claras.

**Alternatives considered**: Criar estados diretamente em cada pagina foi
rejeitado por gerar duplicacao e inconsistencia. Criar um sistema de estados
complexo foi rejeitado por ser prematuro para a F00.

## Decision: Nao configurar Supabase, TanStack Query, React Hook Form, Zod ou Recharts agora

**Rationale**: Essas bibliotecas sao previstas para features futuras, mas a F00
nao possui formularios complexos, consultas, graficos, autenticacao ou dados
persistentes. Evita-se aumento de bundle, configuracao falsa e confusao sobre
capacidades disponiveis.

**Alternatives considered**: Instalar tudo desde o inicio foi rejeitado por
contrariar simplicidade e performance. Criar mocks financeiros foi rejeitado
porque poderia sugerir funcionalidades fora de escopo.

## Decision: Validar qualidade por lint, format check, typecheck e build

**Rationale**: A fundacao precisa garantir consistencia antes das features de
produto. ESLint, Prettier, Husky e lint-staged devem proteger o padrao local,
enquanto `typecheck` e `build` validam TypeScript estrito e configuracao Vite.

**Alternatives considered**: Depender apenas de revisao manual foi rejeitado por
risco de regressao. Introduzir uma suite E2E completa nesta feature foi
considerado util, mas pode ser adiado se comprometer a simplicidade da F00.

## Decision: Documentar contratos de UI em vez de contratos de API

**Rationale**: A F00 expoe experiencia de usuario e estrutura de rotas, nao API
externa. Contratos de rotas e estados tornam testavel o comportamento esperado
sem inventar endpoints ou schema de banco.

**Alternatives considered**: OpenAPI foi rejeitado porque nao ha backend.
Contratos de banco foram rejeitados porque nao ha persistencia nesta feature.
