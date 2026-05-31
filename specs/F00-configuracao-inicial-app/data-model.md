# Data Model: F00 - Configuracao inicial do app

## Persistencia

A F00 nao cria entidades persistentes, tabelas, migrations, storage local,
integracao Supabase ou dados financeiros reais. A feature entrega apenas a
fundacao visual e navegavel da aplicacao.

## Conceitos de UI

### Public Route

Representa uma rota acessivel sem autenticacao.

**Fields**

- `path`: caminho publico, como `/`.
- `title`: titulo semantico da pagina.
- `description`: resumo curto do objetivo da tela.
- `status`: `available` para rotas entregues na F00.

**Validation Rules**

- Deve possuir titulo unico e compreensivel.
- Deve renderizar dentro do layout base.
- Deve ser acessivel por teclado quando houver controles.

### Future Protected Area

Representa apenas uma area planejada para features futuras autenticadas.

**Fields**

- `label`: nome da area futura.
- `intendedFeature`: feature futura relacionada, como F01 ou F07.
- `status`: sempre `planned` na F00.

**Validation Rules**

- Nao pode permitir acesso real a dashboard, transacoes, metas, graficos ou
  dados financeiros.
- Nao pode sugerir que autenticacao ou persistencia ja existem.

### Feedback State

Representa um estado reutilizavel de interface.

**Fields**

- `variant`: `loading`, `empty` ou `error`.
- `title`: mensagem principal visivel.
- `message`: explicacao curta e acolhedora.
- `actionLabel`: texto opcional para uma acao de recuperacao.
- `actionTarget`: destino ou callback opcional para a acao.

**Validation Rules**

- `loading` deve comunicar espera, nao falha.
- `empty` deve comunicar ausencia esperada de conteudo.
- `error` deve indicar proximo passo claro.
- Qualquer acao deve ter nome acessivel e foco visivel.

## Relationships

- Uma `Public Route` usa o layout base e pode usar zero ou mais
  `Feedback State`.
- Uma `Future Protected Area` pode aparecer na navegacao apenas como indicacao
  planejada, sem rota funcional protegida.
- `Feedback State` nao depende de dados financeiros nem de backend.

## State Transitions

Nao ha transicoes de estado persistente. Estados de UI podem alternar entre
loading, empty, error e conteudo conforme paginas futuras adotarem os
componentes, mas a F00 so precisa demonstrar e disponibilizar os componentes.
