# Contract: Accessible Financial Summary

## Purpose

Comunicar o significado essencial de graficos, indicadores, cards, badges e
listas financeiras por texto ou estrutura equivalente.

## Fields

| Field | Type | Rule |
|-------|------|------|
| `sourceId` | `string` | Componente ou secao de origem |
| `sourceType` | `chart \| indicator \| card \| list \| badge` | Tipo de origem |
| `headline` | `string` | Principal leitura financeira |
| `details` | `string[]` | Valores, periodo, categoria, responsavel ou status |
| `privacyNote` | `string?` | Nota segura quando houver dado parcial/autorizado |

## Rules

- Nao depender apenas de cor, icone, hover, tooltip, legenda visual, posicao ou
  tamanho.
- Usar os mesmos formatos de moeda, data, percentual e visibilidade do app.
- Manter linguagem neutra e nao julgadora.
- Resumo deve refletir somente dados autorizados.
- Quando nao houver dados, usar estado vazio seguro em vez de sugerir dados
  ocultos.

## Validation

- Testes para presenca do resumo textual em graficos e indicadores.
- Revisao manual com leitor de tela quando disponivel.
- Casos com valores zerados, altos, parciais ou ausentes.
