# Contract: Member Responsibility Comparison

## Purpose

Representar de forma neutra a distribuicao de responsabilidades em despesas
compartilhadas autorizadas.

## Comparison

| Field | Type | Rule |
|-------|------|------|
| `status` | `ready \| empty \| unavailable_shared` | Estado seguro |
| `basis` | `responsible_user` | Criterio do MVP |
| `members` | `MemberComparisonItem[]` | Itens seguros |
| `summary` | `string` | Texto neutro |

## MemberComparisonItem

| Field | Type | Rule |
|-------|------|------|
| `memberKey` | `self \| partner` | Identidade de apresentacao |
| `memberLabel` | `Voce \| Pessoa parceira` | Label sem nome customizado |
| `expenseCents` | `number` | Despesas compartilhadas autorizadas |
| `weightBasisPoints` | `number` | Peso de 0 a 10000 |

## Privacy Rules

- Nunca incluir transacoes individuais do parceiro.
- Nunca sugerir dados de outra pessoa quando nao houver vinculo ativo.
- Responsabilidade nao concede acesso por si so.
- Linguagem nao deve atribuir culpa, desempenho, merito ou cobranca.
