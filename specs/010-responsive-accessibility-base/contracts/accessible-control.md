# Contract: Accessible Control

## Purpose

Definir o minimo para que controles essenciais sejam compreensiveis e operaveis
por teclado e tecnologias assistivas.

## Fields

| Field | Type | Rule |
|-------|------|------|
| `role` | `string` | Role nativo ou ARIA coerente |
| `name` | `string` | Nome acessivel claro |
| `description` | `string?` | Ajuda ou contexto quando necessario |
| `errorMessage` | `string?` | Associada ao campo invalido |
| `focusVisible` | `boolean` | Obrigatorio |
| `keyboardReachable` | `boolean` | Obrigatorio |
| `state` | `enabled \| disabled \| loading \| invalid` | Estado perceptivel |

## Rules

- Preferir HTML semantico nativo.
- Botao de icone deve possuir nome acessivel.
- Icone decorativo deve usar `aria-hidden="true"`.
- Campo de formulario deve possuir label ou nome acessivel equivalente.
- Campo invalido deve usar associacao semantica com erro e nao depender apenas
  de cor.
- Ordem de foco deve acompanhar a tarefa.
- Foco visivel nao pode ser removido sem substituto equivalente.

## Validation

- Testing Library por role/name quando viavel.
- `user-event` para tabulacao e acionamento quando o componente tiver fluxo
  interativo.
- Revisao manual de foco em navegador real.
