# UI Contract: Routes

## Scope

Este contrato descreve as rotas e a navegacao expostas pela F00. A feature nao
introduz API publica, endpoints de backend ou contrato de banco de dados.

## Public Routes

### `/`

**Purpose**: Apresentar Couple Finance e comunicar a proposta de organizacao
financeira para casais com clareza, privacidade e simplicidade.

**Must show**

- Nome do produto: `Couple Finance`.
- Mensagem clara sobre organizacao financeira para casais.
- Linguagem acolhedora, simples, transparente e sem julgamento.
- Indicacao honesta de que a fundacao prepara funcionalidades futuras.

**Must not show**

- Transacoes reais ou simuladas como existentes.
- Dashboard financeiro funcional.
- Metas, graficos, convite de casal ou autenticacao como disponiveis.
- Dados sensiveis ou exemplos que parecam pertencer a pessoas reais.

**Accessibility**

- Deve ter um unico `h1` principal.
- Navegacao deve estar em `nav` com nome acessivel.
- Conteudo principal deve estar em `main`.
- Links e botoes devem aceitar teclado e exibir foco visivel.

## Not Found Route

### `*`

**Purpose**: Recuperar usuarios que acessam rota invalida.

**Must show**

- Mensagem compreensivel de pagina nao encontrada.
- Explicacao curta sem culpar o usuario.
- Acao clara para voltar para `/`.

**Accessibility**

- Acao de retorno deve ser alcancavel por teclado.
- Foco visivel deve estar presente.
- A pagina deve possuir titulo semantico claro.

## Future Protected Areas

Areas autenticadas podem ser representadas na arquitetura como preparacao para
F01+, mas nao devem ser rotas funcionais nesta feature. Qualquer item visual que
mencione area futura deve deixar claro que ainda esta planejado.

## Acceptance Checks

- A partir de uma rota invalida, o usuario volta para a tela inicial em no
  maximo duas acoes.
- Nenhuma rota sugere que funcionalidades financeiras completas ja existem.
- A navegacao funciona em telas pequenas sem sobreposicao ou conteudo cortado.
