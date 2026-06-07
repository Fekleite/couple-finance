# Contract: Financial Context Label

## Purpose

Garantir que informacoes financeiras individuais e compartilhadas sejam
identificadas por texto consistente, sem depender apenas de cor ou icone.

## Required Contexts

- Transacao individual ou compartilhada.
- Meta individual ou compartilhada.
- Categoria, responsavel e periodo quando exibidos.
- Dashboard e graficos com dados autorizados.
- Evento de auditoria individual ou compartilhado.

## Rules

- Exibir rotulo textual de visibilidade quando individual e compartilhado
  puderem aparecer no mesmo fluxo.
- Manter formatos consistentes para moeda, data, percentual, status e
  progresso.
- Icone ou badge pode reforcar significado, mas nao substituir texto.
- Responsavel indisponivel deve ter fallback seguro, sem inventar identidade.
- Dados restritos ou inacessiveis nao devem receber rotulo que indique
  ownership, existencia ou quantidade.

## Validation

- Testes de componentes que renderizam visibilidade/status.
- Revisao manual de listas, cards, dashboard, graficos, metas e auditoria.
- Casos com nome longo, valor extenso e dados parciais autorizados.
