# Research: F11 - Responsividade e acessibilidade base

## Decision: F11 sera uma feature transversal sem modulo financeiro novo

**Rationale**: A especificacao exige endurecer fluxos existentes do MVP. Criar
`src/features/accessibility` ou uma rota propria introduziria uma fronteira
artificial, distante dos componentes e mensagens que realmente precisam ser
ajustados.

**Alternatives considered**:
- Criar feature nova de acessibilidade: rejeitado por aumentar acoplamento e
  nao possuir dados ou fluxo proprio.
- Fazer redesign amplo: rejeitado por violar escopo, simplicidade e risco de
  regressao.

## Decision: Priorizar componentes compartilhados antes de ajustes locais

**Rationale**: `Button`, `Input`, `Field`, estados de feedback e layouts sao
usados por muitos fluxos. Corrigir foco, largura, semantica, quebra de texto,
status e estados nesses pontos reduz repeticao e evita divergencia.

**Alternatives considered**:
- Corrigir tela por tela primeiro: rejeitado por gerar duplicacao.
- Criar design system novo: rejeitado porque os componentes Shadcn/ui atuais ja
  fornecem base suficiente.

## Decision: Nao adicionar dependencias novas para acessibilidade ou E2E

**Rationale**: O projeto ja possui Testing Library, user-event, Vitest e
Shadcn/Radix. A F11 pode validar roles, labels, mensagens, interacoes por
teclado viaveis e regressao de componentes com a stack atual, complementando
com revisao manual de mobile, zoom, leitor de tela e contraste.

**Alternatives considered**:
- Adicionar axe: util, mas fora do escopo sem necessidade comprovada.
- Adicionar Playwright/Cypress: rejeitado por custo de suite E2E nesta fase.
- Adicionar Storybook: rejeitado por ser infraestrutura maior que a entrega.

## Decision: Responsividade sera validada por baseline e revisao manual

**Rationale**: JSDOM nao mede layout real. O plano deve usar CSS mobile-first,
constraints, `min-w-0`, quebra de texto, stacks responsivos e revisao manual em
viewports pequenos, tablet e desktop para garantir ausencia de rolagem
horizontal obrigatoria e sobreposicao critica.

**Alternatives considered**:
- Testes automatizados de pixel/layout: rejeitados sem navegador real no setup.
- Somente inspecao visual informal: rejeitada por nao gerar criterio
  reutilizavel.

## Decision: Foco visivel fica como regra global com validacao local

**Rationale**: `globals.css` ja aplica `outline-ring/50` e componentes como
`Input` usam `focus-visible:ring`. A F11 deve consolidar foco visivel em todos
os controles, links, botoes, campos, retry, navegacao e dialogos, sem remover
outline nativo sem substituto.

**Alternatives considered**:
- Estilos de foco especificos por feature: rejeitado por inconsistencia.
- Remover outline e depender de cor: rejeitado por acessibilidade.

## Decision: Formularios continuam usando Field, React Hook Form e Zod

**Rationale**: Os formularios existentes ja usam stack padrao. A F11 deve
garantir `label`, `aria-describedby`, `aria-invalid`, `role=alert` ou
equivalente, preservacao segura de dados digitados e mensagens especificas
associadas ao campo.

**Alternatives considered**:
- Trocar biblioteca de formulario: rejeitado por risco e falta de beneficio.
- Validacao apenas visual: rejeitada por nao atender tecnologia assistiva.

## Decision: Estados de interface usarao componentes de feedback existentes

**Rationale**: `EmptyState`, `ErrorState` e `LoadingState` sao pontos naturais
para padronizar titulo, mensagem, retry, regioes de status e mensagens seguras.
Estados locais podem existir quando precisam de contexto de dominio.

**Alternatives considered**:
- Criar camada global de state machine: rejeitado por complexidade.
- Mensagens inline ad hoc em cada tela: rejeitado por risco de divergencia.

## Decision: Graficos devem manter resumo textual equivalente

**Rationale**: A F08 ja criou contrato de `Accessible Chart Summary`. A F11
generaliza o criterio para graficos, indicadores, cards e listas que comuniquem
informacao financeira por cor, icone, posicao ou forma visual.

**Alternatives considered**:
- Depender somente de legenda/tooltip: rejeitado por hover e visual exclusivo.
- Remover graficos em mobile: rejeitado por reduzir valor ja entregue.

## Decision: Mensagens seguras permanecem responsabilidade das features

**Rationale**: Privacidade depende do dominio. `auth`, `couple`,
`permissions`, `transactions`, `dashboard`, `goals` e `audit` conhecem o
contexto e devem expor mensagens que nao revelem existencia, contagem,
proprietario, valor, categoria, meta, transacao, evento ou status inacessivel.

**Alternatives considered**:
- Um catalogo unico de mensagens para todo o app: rejeitado por perder
  nuance de dominio.
- Mensagens tecnicas vindas de services/Supabase: rejeitado por privacidade e
  experiencia.

## Decision: Navegacao privada deve expor areas essenciais sem depender de desktop

**Rationale**: `AuthenticatedLayout` concentra cabecalho e navegacao privada.
A F11 deve garantir que links essenciais sejam alcancaveis, nomeados, com foco
visivel e quebra/empilhamento adequados em mobile.

**Alternatives considered**:
- Nova arquitetura de navegacao completa: rejeitada por escopo.
- Manter apenas link minimo existente: rejeitado porque F11 exige acesso claro
  aos fluxos essenciais.

## Decision: Sem mudancas de banco ou autorizacao

**Rationale**: A feature trata apresentacao, semantica e estados. Qualquer
mudanca em Supabase, RLS ou ownership ampliaria risco e violaria a regra de
preservar limites existentes.

**Alternatives considered**:
- Criar tabelas para checklist de acessibilidade: rejeitado por ser artefato de
  planejamento, nao dado de produto.
- Mudar queries para contagens/resumos adicionais: rejeitado por risco de
  inferencia de dados inacessiveis.
