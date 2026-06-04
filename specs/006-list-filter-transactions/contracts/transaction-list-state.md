# Contract: Transaction List State

## States

### `loading`

- Usado na primeira consulta e apos mudanca de filtros, sessao ou contexto.
- Nao mantem resultados potencialmente obsoletos visiveis.

### `ready`

- Exibe pagina(s), opcoes autorizadas, filtros ativos e eventual
  `Carregar mais`.

### `loading_more`

- Preserva itens atuais.
- Impede segunda continuacao simultanea.
- Comunica progresso sem mover foco inesperadamente.

### `empty_month`

- `has_authorized_month_data` e falso.
- Orientacao neutra; nao sugere transacoes inacessiveis nem exige criacao.

### `no_matches`

- `has_authorized_month_data` e verdadeiro e itens filtrados estao vazios.
- Permite ajustar, remover ou limpar filtros.

### `error`

- Mensagem segura e acao de retry.
- Nao exibe resultados possivelmente revogados ou erros crus.

## Concurrency

- Cada consulta recebe identificador monotono.
- Somente a consulta atual pode substituir estado.
- Alterar filtros invalida paginas e cursor anteriores.
- Mudanca conhecida de sessao ou relacionamento limpa itens antes da
  revalidacao.
