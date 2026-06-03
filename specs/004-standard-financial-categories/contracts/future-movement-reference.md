# Contract: Future Movement Category Reference

## Purpose

Definir como F05-F08 devem reutilizar a F04 sem antecipar movimentacoes.

## Future Persistence Contract

```sql
category_code text not null
  references public.standard_financial_categories (code)
```

## Rules

- O registro guarda `category_code`, nunca nome ou descricao como identidade.
- A chave estrangeira valida que o code existe.
- Categoria inativa permanece valida para historico.
- Novos seletores omitem categorias inativas por padrao.
- Renomear categoria nao altera registros existentes.
- A categoria nao define ownership ou visibilidade.
- Registros individuais continuam protegidos por `user_id`.
- Registros compartilhados continuam protegidos por `shared_budget_id`.
- Filtros, contadores, dashboards e graficos aplicam primeiro o escopo
  autorizado da F03 e somente depois agrupam por `category_code`.
- Code inexistente ou desconhecido usa mensagem segura e nao e convertido
  automaticamente para `other`.

## Out of Scope for F04

- Criar tabela de movimentacoes.
- Definir valor, data, responsavel ou tipo completo de movimentacao.
- Criar filtros, agregacoes, dashboard ou grafico.
- Categorizar automaticamente.
