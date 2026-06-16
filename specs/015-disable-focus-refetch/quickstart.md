# Quickstart: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

## 1. Confirmar descoberta principal

Verifique que TanStack Query nao esta instalado nem em uso:

```bash
rg -n "@tanstack/react-query|QueryClient|QueryClientProvider|useQuery|useMutation|invalidateQueries|focusManager|refetchOnWindowFocus" src package.json package-lock.json
```

Resultado esperado no estado planejado: nenhuma ocorrencia em `src/` ou
`package.json` para React Query. `@tanstack/react-table` pode existir por causa
da F14 e nao deve ser confundido com TanStack Query.

## 2. Revisar hooks remotos prioritarios

Inspecione os consumidores de dados remotos:

```bash
rg -n "useEffect|retry|refresh|load\\(|AbortController|requestId" src/features src/pages
```

Priorize:

- `src/features/transactions/use-transaction-list.ts`
- `src/features/dashboard/use-dashboard.ts`
- `src/features/dashboard/use-dashboard-charts.ts`
- `src/features/goals/use-goals.ts`
- `src/features/audit/use-audit-events.ts`
- `src/features/categories/use-categories.ts`
- `src/features/couple/use-couple-relationship.ts`

## 3. Validar comportamento sem refetch por foco

Para cada hook coberto por teste:

- renderize o hook ou componente com service mockado;
- aguarde a carga inicial;
- dispare evento de foco ou visibilidade;
- confirme que o service nao recebeu nova chamada apenas por foco;
- confirme que retry, filtro, periodo, contexto ou mutacao ainda disparam carga
  quando apropriado.

Exemplo conceitual:

```ts
window.dispatchEvent(new Event("focus"));
document.dispatchEvent(new Event("visibilitychange"));
```

Use o padrao de testes ja existente do hook especifico.

## 4. Validar atualizacoes controladas

Confirme que a F15 nao quebra gatilhos validos:

- retry explicito apos erro;
- mudanca de filtros/periodo/status;
- mudanca real de usuario, casal ou contexto de autorizacao;
- criacao, edicao ou exclusao de transacao quando coberta pelo fluxo atual;
- mutacoes de metas;
- refresh explicito de auditoria.

## 5. Validar privacidade e seguranca

Confirme que nao houve mudancas em:

```bash
git diff -- supabase/migrations src/lib/supabase.ts
```

Revise tambem mensagens de erro e estados pos-atualizacao para garantir que nao
revelam dados fora do escopo autorizado.

## 6. Validar mobile e acessibilidade

Manual:

- abrir transacoes em viewport mobile;
- aplicar filtros e ordenacao;
- alternar para outra aba/app e retornar;
- verificar que nao ha loading/flicker causado apenas pelo retorno;
- acionar retry manual quando houver erro;
- confirmar foco e nomes acessiveis de acoes existentes.

## 7. Comandos finais

Execute antes de concluir a implementacao:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## 8. Regras para TanStack Query futuro

Se uma feature futura introduzir `@tanstack/react-query`:

- criar Query Client em modulo central e testavel;
- configurar `refetchOnWindowFocus: false` globalmente;
- documentar qualquer excecao por query;
- manter invalidacoes controladas apos mutacoes financeiras;
- nao usar foco de janela como substituto para atualizacao pos-mutacao.
