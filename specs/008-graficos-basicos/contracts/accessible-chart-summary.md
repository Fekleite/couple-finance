# Contract: Accessible Chart Summary

## Purpose

Garantir que o sentido essencial de cada grafico seja compreensivel sem
interpretacao visual exclusiva.

## Summary

| Field | Type | Rule |
|-------|------|------|
| `chartId` | `category \| evolution \| member_comparison` | Grafico relacionado |
| `periodLabel` | `string` | Periodo ou janela |
| `headline` | `string` | Principal leitura |
| `details` | `string[]` | Valores essenciais |
| `privacyNote` | `string?` | Nota segura quando util |

## Rules

- Usar portugues brasileiro.
- Manter linguagem neutra e nao julgadora.
- Nao mencionar dados inacessiveis.
- Nao depender de cor, icone, hover, tooltip, posicao ou tamanho.
- Ser associado semanticamente ao grafico correspondente.
