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

## Implemented Label Wording

| Scope | Label | Description |
|-------|-------|-------------|
| `individual` | So voce | Esta informacao fica visivel somente para voce. |
| `shared` | Espaco compartilhado | Esta informacao pertence ao espaco compartilhado do casal. |
| `inaccessible` | Indisponivel | Esta informacao nao esta disponivel para voce. |
| `unknown_loading` | Verificando acesso | Estamos verificando seu acesso antes de mostrar qualquer informacao. |

## Mobile and Accessibility Notes

- O componente `VisibilityLabel` usa icone, texto e `aria-label`, sem depender
  apenas de cor.
- O rotulo usa texto curto, quebra de linha permitida e largura maxima do
  container para telas pequenas.
- Estados de convite recebido e convite indisponivel mostram limite de acesso
  antes de qualquer acao de aceite, recusa ou retry.
