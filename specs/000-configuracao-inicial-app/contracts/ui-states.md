# UI Contract: Feedback States

## Scope

Este contrato define componentes reutilizaveis para estados basicos de feedback
da F00: loading, empty e error.

## Shared Props

- `title`: texto curto e obrigatorio.
- `message`: explicacao amigavel e obrigatoria.
- `actionLabel`: texto opcional para acao.
- `onAction` ou `actionHref`: acao opcional, quando o estado permitir
  recuperacao ou navegacao.

## Loading State

**Purpose**: Comunicar que uma tela ou secao esta carregando.

**Rules**

- Deve evitar linguagem de falha.
- Deve ser perceptivel visualmente sem depender apenas de cor.
- Deve possuir texto acessivel para leitores de tela.

## Empty State

**Purpose**: Comunicar ausencia esperada de conteudo.

**Rules**

- Deve explicar que nao ha conteudo disponivel ainda.
- Nao deve sugerir erro tecnico.
- Pode oferecer uma acao futura somente se essa acao existir na feature atual.

## Error State

**Purpose**: Comunicar erro recuperavel ou indisponibilidade.

**Rules**

- Deve usar linguagem acolhedora e nao culpabilizante.
- Deve explicar o proximo passo.
- Deve incluir acao clara quando houver recuperacao possivel.

## Accessibility Requirements

- Acoes devem ter nomes acessiveis.
- Estados devem manter hierarquia de titulo e mensagem.
- Foco visivel deve existir em qualquer controle.
- Conteudo nao pode depender exclusivamente de cor, icone ou animacao.

## Acceptance Checks

- Um tester consegue identificar loading, empty e error sem explicacao externa.
- Cada estado preserva legibilidade em mobile, tablet e desktop.
- Estados nao usam dados financeiros reais ou simulados como se fossem
  persistidos.
