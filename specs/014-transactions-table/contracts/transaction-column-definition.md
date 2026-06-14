# Contract: Transaction Column Definition

## Purpose

Definir as colunas essenciais da tabela, seus cabecalhos, celulas, ordenacao e
responsabilidades de acessibilidade.

## Columns

| Column | Required | Sortable | Content |
|--------|----------|----------|---------|
| `title` | Yes | No | Titulo da transacao |
| `amount` | Yes | Yes | Valor formatado em moeda |
| `type` | Yes | No | Receita ou Despesa |
| `category` | Yes | No | Categoria financeira |
| `date` | Yes | Yes | Data civil formatada |
| `responsible` | Yes | No | Voce ou Pessoa parceira |
| `visibility` | Yes | No | Individual ou Compartilhada, com criador quando relevante |
| `actions` | Yes | No | Acoes permitidas por permissao |

## Rules

- Cabecalhos devem ser curtos, claros e consistentes.
- Colunas ordenaveis devem usar controle acionavel e comunicar direcao ativa.
- Valor deve usar alinhamento e formatacao que favorecam comparacao.
- A coluna de acoes nao deve ser usada para ordenacao.
- Colunas nao devem introduzir badges decorativos ou texto redundante.
- Em mobile, a apresentacao compacta pode reorganizar colunas em campos
  rotulados, mas nao pode remover informacao essencial.

## Tests

- Definicao contem todas as colunas obrigatorias.
- `amount` e `date` sao ordenaveis.
- Cabecalhos e celulas renderizam texto esperado.
- Acoes possuem nomes acessiveis especificos.
- Nenhuma coluna essencial desaparece no modo compacto.
