# Contract: Transaction Authorization

## Creation Matrix

| Context | Individual | Shared |
|---------|------------|--------|
| Authenticated, no active link | Allow | Deny safely |
| Pending invitation | Allow | Deny safely |
| Active member | Allow | Allow own active budget |
| Removed/inactive/unrelated | Allow own individual | Deny safely |

## Read Matrix

- Individual: somente `created_by_user_id`.
- Shared: somente membership ativa do `shared_budget_id`.
- Responsabilidade isolada nao concede leitura.
- Convite nao concede leitura.
- Categorias permanecem referencia global e nao concedem leitura.

## Database Enforcement

- RLS `SELECT to authenticated`.
- Sem grants/policies de mutacao direta.
- RPC revalida autorizacao no momento da confirmacao.
- Policy e consultas usam `(select auth.uid())` e colunas indexadas.
- Funcao privilegiada fica em schema privado com privilegios minimos.

## Safe Failure

Para contexto fora da autorizacao, nao diferenciar budget inexistente, inativo,
de outro casal ou membership removida. Retornar orientacao neutra para revisar
visibilidade e tentar novamente.
