# Quickstart: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

## 1. Confirmar descoberta principal

Verifique que TanStack Query nao esta instalado nem em uso:

```bash
rg -n "@tanstack/react-query|QueryClient|QueryClientProvider|useQuery|useMutation|invalidateQueries|focusManager|refetchOnWindowFocus" src package.json package-lock.json
```

Resultado esperado no estado planejado: nenhuma ocorrencia em `package.json` ou
`package-lock.json` para React Query. Apos a implementacao da F15, ocorrencias
em `src/` devem estar restritas a `src/lib/server-state-policy.md` e
`src/lib/server-state-policy.test.ts`, que documentam e testam a politica.
`@tanstack/react-table` pode existir por causa da F14 e nao deve ser confundido
com TanStack Query.

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

## 9. Notas da implementacao F15

A implementacao confirmou que `@tanstack/react-query` continua ausente e que os
hooks remotos atuais ja nao dependem de retorno de foco para recarregar dados.
Nao houve necessidade de alterar os hooks de producao; a F15 adicionou politica
tecnica e testes de regressao para preservar o comportamento.

Cobertura adicionada:

- transacoes: retorno de foco sem nova chamada, preservacao de filtros e erro
  mantido ate retry explicito;
- dashboard: retorno de foco sem nova chamada, preservacao de periodo e erro
  mantido ate retry explicito;
- graficos do dashboard: retorno de foco sem nova chamada e preservacao de
  periodo;
- metas: preservacao de filtro de status e recarregamentos controlados apos
  create/update/complete/archive;
- categorias: retorno de foco sem nova chamada e erro mantido ate refresh
  explicito;
- auditoria: retorno de foco sem nova chamada, refresh somente pelo evento de
  dominio e erro mantido ate retry;
- casal: retorno de foco sem nova chamada e refresh controlado apos create
  invite/accept invite;
- politica: varredura automatizada contra introducao de React Query sem plano,
  `refetchOnWindowFocus`, `focusManager` e listeners globais de foco.

Confirmacao de seguranca/persistencia:

- `supabase/migrations/` permanece fora do escopo da F15;
- `src/lib/supabase.ts` permanece fora do escopo da F15;
- nenhuma mudanca de schema, RLS, Supabase Auth, Prisma ou persistencia foi
  necessaria.
