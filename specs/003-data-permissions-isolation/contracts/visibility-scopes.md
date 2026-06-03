# Contract: Visibility Scopes

## Purpose

Padronizar como a interface classifica informacoes visiveis como individuais,
compartilhadas, indisponiveis ou ainda em verificacao.

## Types

```ts
type VisibilityScope =
  | "individual"
  | "shared"
  | "inaccessible"
  | "unknown_loading";

type VisibilityLabel = {
  scope: VisibilityScope;
  label: string;
  description: string;
};
```

## Labels

| Scope | Label intent | Description intent |
|-------|--------------|--------------------|
| `individual` | So voce | A informacao pertence a pessoa atual |
| `shared` | Espaco compartilhado | A informacao pertence ao casal ativo |
| `inaccessible` | Indisponivel | A pessoa atual nao pode acessar esta informacao |
| `unknown_loading` | Verificando acesso | Nenhum dado privado deve aparecer ainda |

## Rules

- Rotulos nao podem depender apenas de cor.
- `unknown_loading` nao mostra nomes, e-mails, saldos, categorias, metas,
  transacoes ou identificadores privados.
- `inaccessible` usa mensagem segura e nao confirma existencia de recurso para
  usuarios nao relacionados.
- `shared` so aparece depois de membership ativa confirmada.
- `individual` nao implica que parceiro possa ver a informacao.
