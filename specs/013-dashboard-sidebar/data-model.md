# Data Model: F13 - Layout principal com sidebar de dashboard

Esta feature nao cria persistencia. O modelo abaixo descreve entidades
conceituais e estados de interface usados pelo layout autenticado.

## Authenticated Layout

Representa o shell visual da area privada.

### Fields

- `userSummary`: nome, email e avatar ja disponiveis no estado de autenticacao.
- `sessionStatus`: estado atual da sessao.
- `navigationItems`: lista de Navigation Item disponiveis.
- `activeRouteMatch`: relacao entre rota atual e item ativo.
- `responsiveMode`: modo visual atual da navegacao.
- `contentRegion`: area principal que renderiza a pagina privada atual.

### Relationships

- Contem muitos Navigation Items.
- Usa um Active Route Match por rota atual.
- Usa um Responsive Navigation Mode por viewport.
- Depende de estado de autenticacao ja existente.

### Validation Rules

- Nao deve renderizar sidebar autenticada para usuario nao autenticado.
- Deve preservar `Outlet` e conteudo principal das rotas protegidas.
- Deve manter logout seguro e feedback de encerramento de sessao.

## Navigation Item

Representa um destino principal na area autenticada.

### Fields

- `id`: identificador estavel do item.
- `label`: nome visivel e compreensivel.
- `to`: destino privado existente.
- `icon`: icone opcional com funcao de reconhecimento.
- `matchPaths`: rotas principais, filhas ou dinamicas que ativam o item.
- `availability`: estado que determina se o item e exibido ou habilitado.
- `ariaLabel`: nome acessivel quando o label visivel nao for suficiente.

### Relationships

- Aponta para uma rota privada existente.
- Pode agrupar subrotas relacionadas no mesmo item ativo.

### Validation Rules

- Deve usar rotas existentes e seguras.
- Nao deve conter contagens financeiras ou dados privados.
- Deve ter label textual mesmo quando houver icone.
- Itens indisponiveis nao podem revelar dados ou permissoes internas.

## Active Route Match

Representa qual item de navegacao corresponde a rota atual.

### Fields

- `currentPath`: caminho atual.
- `activeItemId`: item correspondente quando houver.
- `isExact`: indica match exato.
- `isRelatedSubroute`: indica match por subrota relacionada.

### State Transitions

- `none` -> `exact`: usuario acessa rota principal.
- `exact` -> `related`: usuario acessa subrota de um modulo.
- `related` -> `none`: usuario acessa rota privada sem item principal
  correspondente.

### Validation Rules

- `/app` deve ativar Dashboard/Inicio apenas de forma exata.
- `/app/transactions/new` deve permanecer relacionado a Transacoes ou acao de
  registro conforme decisao final de navegacao.
- Rotas dinamicas de convite devem continuar acessiveis sem criar item falso.

## Responsive Navigation Mode

Representa como a navegacao e exibida conforme viewport.

### Values

- `desktop-sidebar`: sidebar lateral persistente.
- `compact-closed`: navegacao compacta fechada.
- `compact-open`: navegacao compacta aberta.

### Validation Rules

- Modo desktop deve manter area principal legivel.
- Modo compacto aberto deve ser fechavel por teclado.
- Modo compacto fechado deve manter controle de abertura acessivel.
- Mudanca de viewport nao deve perder sessao, rota ativa ou conteudo.

## Authenticated Layout State

Representa estados globais relevantes ao layout.

### Values

- `authenticated`: usuario valido, layout privado renderizado.
- `ending`: logout em progresso, controle de sair desabilitado.
- `message`: mensagem segura de sessao exibida no layout.
- `unauthenticated`: tratado por `ProtectedRoute`, sem sidebar autenticada.
- `loading`: tratado por `ProtectedRoute` ou estado existente, sem exposicao de
  dados privados.

### Validation Rules

- Mensagens nao devem revelar dados financeiros.
- Logout deve impedir intencao duplicada.
- Estado nao autenticado nao deve renderizar itens privados.

## Navigation Availability State

Representa se um item pode aparecer ou ser acionado.

### Values

- `available`: item exibido e acionavel.
- `hidden`: item nao aparece porque o modulo nao existe ou nao e aplicavel.
- `disabled-neutral`: item aparece sem acao apenas se houver motivo seguro e
  claro.

### Validation Rules

- Preferir `hidden` para modulos inexistentes como Configuracoes na base atual.
- Nao usar `disabled-neutral` para sugerir dados, permissoes ou status privado.
- Availability deve ser determinada sem consultas financeiras adicionais.
