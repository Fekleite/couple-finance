# Contract: Dashboard Recent Transaction

## Purpose

Representar uma transacao autorizada recente no dashboard sem substituir a lista
completa da F06.

## Fields

- `id`: uuid interno autorizado.
- `title`: titulo autorizado.
- `amount_cents`: valor positivo em centavos.
- `transaction_type`: `income` ou `expense`.
- `transaction_date`: data civil `YYYY-MM-DD`.
- `created_at`: timestamp usado apenas para desempate.
- `category_code`: codigo canonico historico.
- `category_label`: label de categoria atual ou historico.
- `responsible_user_id`: uuid interno autorizado.
- `responsible_label`: `Voce` ou `Pessoa parceira`.
- `created_by_user_id`: uuid interno autorizado.
- `creator_label`: `Voce` ou `Pessoa parceira`.
- `visibility`: `individual` ou `shared`.

## Ordering

```text
transaction_date DESC, created_at DESC, id DESC
```

## Presentation Rules

- Exibir titulo, valor, tipo, data, categoria, responsavel e visibilidade.
- Exibir criador quando a transacao compartilhada tiver criador diferente do
  responsavel e a distincao evitar ambiguidade.
- Nao exibir observacao completa.
- Nao exibir IDs internos na interface.
- Nao oferecer paginacao, busca, filtros ou mutacao no item do dashboard.
