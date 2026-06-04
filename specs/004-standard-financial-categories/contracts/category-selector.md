# Contract: Category Selector

## Purpose

Definir um componente reutilizavel para F05 sem criar formulario ou
persistencia de transacao na F04.

## Interface

```ts
type CategorySelectorProps = {
  categories: StandardFinancialCategory[];
  value?: string;
  applicability?: CategoryApplicability;
  onValueChange: (code: string) => void;
  disabled?: boolean;
  label: string;
  description?: string;
};
```

## Behavior

- Exibir somente categorias ativas.
- Quando `applicability` for informado, incluir categorias compativeis e
  categorias `both`.
- Preservar ordem canonica.
- Comunicar nome, descricao e estado selecionado.
- Manter `Outros` disponivel e por ultimo.
- Nao persistir selecao.
- Nao inferir ou sugerir categoria automaticamente.
- Nao mostrar contadores, valores ou frequencia de uso.

## Accessibility

- Usar controles nativos ou semantica de selecao equivalente.
- Associar o grupo a `label` e descricao quando fornecida.
- Permitir operacao completa por teclado.
- Manter foco visivel e ordem logica.
- Comunicar selecao sem depender apenas de cor ou icone.
- Icones sao decorativos quando nome e descricao ja comunicam significado.

## Feedback States

- Loading e erro pertencem ao consumidor/hook, nao ao componente puro.
- Lista vazia nao renderiza uma escolha falsa.
- Valor desconhecido nao e convertido silenciosamente para `Outros`.
