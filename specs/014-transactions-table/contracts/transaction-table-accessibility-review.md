# Contract: Transaction Table Accessibility Review

## Purpose

Definir criterios minimos de acessibilidade para a tabela e sua alternativa
compacta.

## Requirements

- Tabela ampla deve ter cabecalhos compreensiveis.
- Colunas ordenaveis devem expor nome e estado de ordenacao.
- Filtros existentes devem manter labels e operacao por teclado.
- Acoes por transacao devem ter nomes acessiveis especificos.
- Foco visivel deve estar presente em filtros, sort, load more e acoes.
- Estados loading, loading more, erro, vazio e sem resultados devem ser
  perceptiveis.
- Mobile compacto deve rotular campos para evitar valores sem contexto.
- Tipo, valor, visibilidade, permissao e ordenacao nao podem depender apenas de
  cor ou icone.

## Manual Review

- Navegar somente por teclado pelos filtros, cabecalhos ordenaveis, linhas,
  acoes e botao carregar mais.
- Confirmar que a ordenacao ativa e compreensivel sem olhar apenas para cor.
- Confirmar que leitores de tela encontram cabecalhos ou rotulos suficientes.
- Confirmar foco apos acionar controles de ordenacao e carregar mais.
- Confirmar que estados vazios e erros nao expoem detalhes internos.

## Tests

- Queries por role/name encontram filtros, cabecalhos ordenaveis e acoes.
- Estado de sort ativo e verificavel.
- Botao "Carregar mais" anuncia progresso quando `loading_more`.
- Estado sem resultados possui acao de limpar filtros acessivel.
