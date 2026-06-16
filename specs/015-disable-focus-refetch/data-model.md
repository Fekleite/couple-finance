# Data Model: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

A F15 nao adiciona modelos persistentes. Este documento descreve entidades
conceituais de comportamento para orientar testes, contratos e futuras tarefas.

## Server State Consumer

Representa um hook ou area da interface que carrega dados remotos autorizados.

**Exemplos atuais**:

- `useTransactionList`
- `useDashboard`
- `useDashboardCharts`
- `useGoals`
- `useAuditEvents`
- `useCategories`
- `useCoupleRelationship`

**Atributos conceituais**:

- `consumerName`: nome do hook ou area.
- `dataScope`: transacoes, dashboard, metas, auditoria, categorias ou casal.
- `authorizationContext`: usuario/casal/escopo que controla dados autorizados.
- `queryContext`: filtros, periodo, status ou invitation id.
- `state`: loading, ready, error, empty, submitting ou estado equivalente.
- `reloadTriggers`: lista de gatilhos permitidos.

**Regras**:

- Deve carregar dados somente para escopo autorizado.
- Deve limpar ou substituir dados quando `authorizationContext` mudar.
- Nao deve recarregar apenas por foco de janela/aba.

## Focus Return Event

Representa o retorno da pessoa usuaria para a aba, janela ou app.

**Atributos conceituais**:

- `eventType`: focus, visibilitychange, retorno de app mobile ou equivalente.
- `durationAway`: curto, longo ou desconhecido.
- `currentView`: tela em que a pessoa estava.
- `existingState`: estado exibido antes do retorno.

**Regras**:

- Nao deve disparar refetch global por si so.
- Deve preservar dados ja exibidos e contexto visual.
- Pode coexistir com uma excecao documentada, mas nao substitui uma acao
  explicita de atualizacao.

## Controlled Update Trigger

Representa uma causa valida para atualizar dados remotos.

**Tipos permitidos**:

- carga inicial do consumidor;
- mudanca de filtro, periodo, status ou rota relevante;
- mudanca de usuario, casal ou contexto de autorizacao;
- retry acionado pela pessoa usuaria;
- criacao, edicao, exclusao, aceite de convite ou mutacao financeira;
- evento explicito de dominio, como refresh de auditoria.

**Regras**:

- Deve ser rastreavel a uma acao, contexto ou evento de dominio claro.
- Deve preservar permissoes e isolamento.
- Deve evitar invalidacao mais ampla que o necessario.

## Remote Data State

Representa o estado exibido por um consumidor de dados remotos.

**Estados esperados**:

- `loading`: primeira carga ou recarga necessaria.
- `ready`: dados autorizados disponiveis.
- `empty`: ausencia autorizada de dados.
- `no_matches`: filtros sem resultados.
- `loading_more`: carregamento incremental.
- `submitting`: mutacao em andamento com dados anteriores preservados quando
  aplicavel.
- `error`: falha recuperavel com mensagem segura.

**Regras**:

- Focus return nao deve trocar `ready` por `loading`.
- Mutacoes podem usar estados de submissao desde que preservem contexto seguro.
- Erros nao podem revelar dados fora do escopo autorizado.

## Refresh Exception

Representa uma decisao explicita de atualizar dados ao recuperar foco.

**Atributos conceituais**:

- `consumerName`: consumidor afetado.
- `reason`: valor para usuario ou risco mitigado.
- `scope`: dado ou tela afetada.
- `privacyReview`: confirmacao de que nao amplia acesso.
- `testCoverage`: teste que comprova comportamento e limites.

**Regras**:

- Deve ser rara e documentada.
- Deve ser localizada, nao global.
- Deve ter teste ou verificacao objetiva.

## Server State Policy

Representa a regra de projeto para server state.

**Regras atuais**:

- O codigo atual nao usa TanStack Query.
- Hooks locais nao devem recarregar por foco de janela/aba.
- Se TanStack Query for introduzido no futuro, o Query Client deve usar
  `refetchOnWindowFocus: false` globalmente.
- Mutacoes financeiras devem atualizar dados por gatilhos controlados.
- Excecoes ao foco devem ser documentadas e testadas.
