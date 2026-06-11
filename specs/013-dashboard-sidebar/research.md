# Research: F13 - Layout principal com sidebar de dashboard

## Decision: Evoluir `AuthenticatedLayout` em vez de criar um novo shell paralelo

**Rationale**: O projeto ja possui `AuthenticatedLayout` dentro de
`ProtectedRoute`, com header de conta, logout, mensagem de sessao, navegacao
privada e `Outlet`. Evoluir esse componente reduz risco de regressao, preserva
testes existentes e evita duplicar protecao de rotas.

**Alternatives considered**:

- Criar um layout autenticado totalmente novo: rejeitado por aumentar migracao
  e duplicacao sem necessidade.
- Mover layout para cada pagina privada: rejeitado por espalhar navegacao e
  aumentar chance de divergencia entre modulos.

## Decision: Centralizar itens de navegacao em configuracao tipada perto do layout

**Rationale**: Hoje os itens estao embutidos em `authenticated-layout.tsx`. A
F13 precisa de rota ativa, subrotas e disponibilidade; uma configuracao pequena
e tipada permite testar labels, destinos e match de rota sem acoplar paginas ao
layout.

**Alternatives considered**:

- Usar `PRIVATE_ROUTES` diretamente no JSX: simples, mas dificulta metadados de
  match, disponibilidade e testes isolados.
- Criar registry global de rotas: rejeitado por ser abstracao maior que o
  escopo da F13.

## Decision: Exibir apenas destinos existentes e seguros

**Rationale**: `PRIVATE_ROUTES` possui `/app`, categorias, transacoes, metas,
auditoria, nova transacao e convite dinamico. Nao ha rota estavel para
Configuracoes ou Parceiro. A F13 deve preparar a configuracao para modulos
disponiveis, mas nao criar paginas fora de escopo.

**Alternatives considered**:

- Criar pagina de Configuracoes: rejeitado por estar explicitamente fora de
  escopo.
- Criar pagina de Parceiro/Convites: rejeitado pelo mesmo motivo; o convite
  dinamico existente deve continuar funcionando sem virar destino principal
  ficticio.

## Decision: Sidebar desktop com navegacao compacta mobile sem nova dependencia

**Rationale**: O projeto ja usa React, TailwindCSS, Radix/Shadcn e Lucide. O
comportamento necessario pode ser implementado com HTML semantico, estado local
simples e componentes existentes. Adicionar biblioteca de sidebar/drawer
aumentaria bundle e manutencao sem ganho claro.

**Alternatives considered**:

- Biblioteca dedicada de sidebar/drawer: rejeitada por dependencia
  desnecessaria.
- Bottom navigation fixa em mobile: adiada; pode reduzir area util e nao
  comportar todos os destinos com labels claros.

## Decision: Rota ativa por `NavLink` e matcher explicito para subrotas

**Rationale**: `NavLink` ja esta em uso e comunica o estado ativo de links. Para
subrotas como `/app/transactions/new`, a configuracao deve permitir que a area
de Transacoes permaneca ativa quando a rota filha for relacionada.

**Alternatives considered**:

- Comparacao manual com `window.location`: rejeitada por fugir do React Router
  e dificultar testes.
- Usar apenas `end`: insuficiente para subrotas e rotas dinamicas.

## Decision: Sem consulta adicional para disponibilidade da navegacao

**Rationale**: A sidebar nao deve revelar dados privados nem depender de dados
financeiros. Itens devem ser definidos a partir de rotas estaveis, sessao ja
validada pelo `ProtectedRoute` e regras simples de disponibilidade existentes.

**Alternatives considered**:

- Buscar relacionamento do casal para montar itens dinamicos: rejeitado para a
  F13 por aumentar acoplamento e risco de estados privados na navegacao.
- Exibir contagens/badges por modulo: rejeitado por ruido visual e risco de
  inferencia de dados.

## Decision: Testes de componente e regressao manual guiada

**Rationale**: A mudanca e de layout/navegacao. Vitest e Testing Library ja
cobrem o padrao atual, incluindo logout e teclado. O plano deve ampliar esses
testes para rota ativa, modo compacto, nomes acessiveis e estados de sessao.

**Alternatives considered**:

- Criar suite E2E: rejeitada para este escopo, pois adicionaria ferramenta e
  custo sem necessidade clara.
- Validar apenas manualmente: rejeitada por risco de regressao em navegacao
  autenticada.
