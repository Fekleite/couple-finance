# Contract: Audit Presentation

## Purpose

Definir como eventos autorizados aparecem para a pessoa de forma clara,
mobile-first, acessivel e neutra.

## Event text requirements

Cada evento deve comunicar por texto:

- Tipo de acao.
- Tipo de item.
- Item afetado por snapshot seguro.
- Autoria, quando disponivel e autorizada.
- Momento da alteracao.
- Visibilidade individual ou compartilhada.

## Summary keys

| Key | Message intent |
|-----|----------------|
| `transaction_created` | Transacao criada |
| `transaction_updated` | Transacao atualizada |
| `transaction_removed` | Transacao removida do fluxo principal |
| `goal_created` | Meta criada |
| `goal_updated` | Meta atualizada |
| `goal_completed` | Meta concluida |
| `goal_archived` | Meta arquivada |

## Actor labels

| State | Label |
|-------|-------|
| `current_user` | `Voce` |
| `authorized_partner` | `Pessoa parceira` |
| `unavailable` | `Autoria indisponivel` |

## Accessibility

- Eventos devem ser itens de lista ou estrutura semantica equivalente.
- Ordem de leitura: acao, item, autoria, momento, visibilidade.
- Badges, icones e cores sao complementares, nunca unicos.
- Foco visivel em qualquer link ou botao.
- Estados de loading, erro e vazio devem ser perceptiveis por texto.

## Prohibited language

- Ranking, placar, culpa, cobranca, vigilancia, suspeita ou comparacao de
  comportamento.
- Logs tecnicos, SQL, RLS, stack traces ou mensagens internas.
