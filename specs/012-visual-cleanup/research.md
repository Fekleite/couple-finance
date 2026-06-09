# Research: F12 - Limpeza visual e remocao de informacoes desnecessarias

## Decision: Implementar uma auditoria visual por tela antes de editar UI

**Rationale**: A F12 remove elementos existentes. Sem inventario, ha risco de
apagar informacao que parece redundante visualmente mas carrega significado de
permissao, auditoria, compartilhamento ou estado financeiro.

**Alternatives considered**:
- Remover elementos diretamente durante implementacao: rejeitado por aumentar
  risco de regressao silenciosa.
- Criar novo design system: rejeitado por estar fora do escopo incremental.

## Decision: Usar classificacao manter/remover/consolidar/reordenar/reescrever/adiar

**Rationale**: A classificacao permite decisoes verificaveis e cria historico
para itens mantidos ou adiados por risco. Ela tambem transforma limpeza visual
em criterio testavel, nao em preferencia estetica.

**Alternatives considered**:
- Checklist binario manter/remover: rejeitado porque muitos itens precisam ser
  consolidados ou reescritos, nao apenas apagados.
- Auditoria puramente visual: rejeitada por nao capturar seguranca, auditoria e
  acessibilidade.

## Decision: Nao adicionar dependencias

**Rationale**: O projeto ja possui React, TailwindCSS, Shadcn/ui, Radix, Lucide,
Recharts, Vitest e Testing Library. A F12 e uma revisao de UI existente e pode
ser entregue com componentes, estilos e testes atuais.

**Alternatives considered**:
- Storybook para revisao visual: rejeitado por custo e escopo maior que a
  necessidade da feature.
- Playwright/Cypress para validacao visual ampla: rejeitado para F12 por custo
  de introducao; revisao manual guiada e testes de componente sao suficientes.
- Axe automatizado: rejeitado como dependencia nova; validacoes acessiveis
  praticas podem ser cobertas com Testing Library e revisao manual.

## Decision: Priorizar componentes compartilhados somente quando houver repeticao real

**Rationale**: Estados, cards, alertas e controles compartilhados ja existem.
Ajustar componentes comuns reduz duplicacao quando o problema e transversal,
mas abstracoes novas para casos isolados aumentariam manutencao.

**Alternatives considered**:
- Refatorar todos os cards e blocos em um sistema novo: rejeitado por ser
  redesign e design system novo.
- Ajustar tudo localmente nas features: rejeitado quando o mesmo problema
  aparece em estados ou componentes compartilhados.

## Decision: Preservar server state e camada de dados sem alteracoes

**Rationale**: A especificacao define F12 como limpeza visual. Mudar queries,
services, RLS, schema, Prisma ou comportamento global do TanStack Query criaria
risco desnecessario e misturaria escopos de features futuras.

**Alternatives considered**:
- Aproveitar F12 para reorganizar queries ou services: rejeitado por nao ser
  necessario para reduzir ruido visual.
- Introduzir Prisma: rejeitado explicitamente como fora de escopo da F12.

## Decision: Testar renderizacao alterada em vez de snapshot visual amplo

**Rationale**: A F12 altera conteudo e hierarquia. Testes de componente com
Testing Library verificam se informacoes essenciais continuam presentes e se
elementos redundantes deixam de disputar atencao, sem acoplar a suite a pixels.

**Alternatives considered**:
- Snapshots grandes de telas: rejeitados por baixa utilidade e alta
  fragilidade.
- Apenas QA manual: rejeitado quando ha permissao, estados condicionais,
  informacao financeira ou acessibilidade envolvidos.

## Decision: Validacao manual guiada para responsividade, teclado e densidade visual

**Rationale**: Algumas propriedades da F12, como escaneabilidade, densidade e
prioridade visual, exigem revisao humana. O quickstart define roteiro objetivo
para mobile, tablet, desktop, teclado, foco, texto longo e estados.

**Alternatives considered**:
- Automatizar toda revisao visual: rejeitado por custo e dependencia nova.
- Validar apenas desktop: rejeitado por violar F11 e a constituicao
  mobile-first.
