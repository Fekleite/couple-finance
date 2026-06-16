# Research: F15 - Configuracao de server state sem refetch automatico ao trocar de janela ou aba

## Decision: nao introduzir TanStack Query nesta F15

**Rationale**: A auditoria de `package.json`, `package-lock.json` e `src/`
mostra que `@tanstack/react-query` nao esta instalado e que nao existem
`QueryClient`, `QueryClientProvider`, `useQuery`, `useMutation`,
`invalidateQueries`, `focusManager` ou `refetchOnWindowFocus`. Os fluxos
remotos atuais usam hooks locais com `useEffect`, services Supabase,
`requestId`, `AbortController`, `retry` explicito e recarregamento por mudanca
de filtro, periodo, contexto de autorizacao ou mutacao. Instalar TanStack Query
sem migrar consultas reais criaria provider/cache sem valor e aumentaria a
complexidade contra o escopo incremental da F15.

**Alternatives considered**:

- Introduzir `@tanstack/react-query` e um Query Client global vazio: rejeitada
  porque nao haveria queries reais a configurar, testar ou invalidar.
- Migrar transacoes, dashboard, metas, categorias, casal e auditoria para
  TanStack Query nesta feature: rejeitada por ser reescrita ampla de server
  state, com alto risco de regressao em permissoes, filtros e auditoria.
- Tratar a F15 como totalmente bloqueada: rejeitada porque o comportamento
  esperado pode ser protegido no padrao atual por testes e contratos sem
  mudanca inutil de dependencia.

## Decision: proteger o padrao atual com testes de regressao contra foco

**Rationale**: Como nao ha TanStack Query nem listeners de foco para dados
remotos, o risco real da F15 e regressao futura: alguem adicionar reload ao
evento `focus`/`visibilitychange` ou migrar para Query Client sem default
correto. A implementacao deve adicionar testes nos hooks remotos relevantes
para confirmar que `window.focus` ou eventos equivalentes nao disparam nova
chamada de service por si so. Os hooks prioritarios sao `useTransactionList`,
`useDashboard`, `useDashboardCharts`, `useGoals`, `useAuditEvents`,
`useCategories` e `useCoupleRelationship`, conforme cobertura existente e risco
de fluxo.

**Alternatives considered**:

- Criar apenas documentacao: rejeitada porque a especificacao exige verificacao
  automatizada ou objetiva.
- Testar somente ausencia de dependencia em `package.json`: rejeitada como
  insuficiente, pois a regressao poderia aparecer por listener manual sem
  TanStack Query.
- Testar todos os services diretamente: rejeitada porque o comportamento de
  foco pertence aos hooks/componentes consumidores, nao aos services puros.

## Decision: manter atualizacoes controladas por retry, filtro/contexto e mutacao

**Rationale**: Os hooks atuais ja distinguem cargas iniciais, mudancas de
filtro/contexto, retries e mutacoes. `useGoals` recarrega apos mutacoes e emite
refresh de auditoria; `useAuditEvents` escuta um evento explicito de auditoria;
`useTransactionForm` atualiza contexto de categorias/relacionamento apos falhas
especificas; transacoes e dashboards recarregam por filtros/periodos/contexto.
A F15 deve preservar esse comportamento e proibir dependencias de foco para
refletir criacao, edicao ou exclusao.

**Alternatives considered**:

- Remover recarregamentos por contexto para evitar qualquer chamada extra:
  rejeitada porque mudanca de usuario, casal, filtro ou periodo precisa limpar
  dados potencialmente revogados.
- Substituir tudo por refresh manual global: rejeitada por piorar UX e
  mascarar a necessidade de atualizacoes controladas apos mutacoes reais.
- Adicionar polling ou intervalos de atualizacao: rejeitada porque contraria o
  objetivo de reduzir chamadas desnecessarias.

## Decision: documentar contrato futuro para TanStack Query

**Rationale**: A constituicao e o roadmap 2.0 citam TanStack Query como stack
padrao futura. Mesmo sem uso atual, a F15 deve deixar claro que qualquer
introducao posterior de Query Client precisa configurar `refetchOnWindowFocus:
false` globalmente, documentar excecoes por query e preservar invalidacoes
controladas apos mutacoes financeiras. Isso resolve a divergencia sem criar
codigo prematuro.

**Alternatives considered**:

- Ignorar TanStack Query por estar ausente: rejeitada porque a F15 existe para
  governar esse comportamento no roadmap.
- Exigir excecoes em arquivo central antes de haver queries: rejeitada porque
  criaria estrutura vazia.
- Registrar a regra apenas em comentarios de codigo: rejeitada porque
  contratos e quickstart sao mais visiveis para proximas fases Spec Kit.

## Decision: sem impacto em persistencia, RLS, Prisma ou camada server-side

**Rationale**: Refetch por foco e atualizacao controlada sao comportamento de
client/server state. A F15 nao requer novas tabelas, migrations, policies, RPCs,
Prisma, repositories server-side ou mudancas de Supabase Auth. O isolamento de
dados continua garantido pelos services/RLS existentes e por testes de
permissao ja associados aos fluxos.

**Alternatives considered**:

- Alterar RPCs para suportar cache server-side: rejeitada por fora de escopo.
- Introduzir Prisma para padronizar consultas antes do Query Client: rejeitada
  por pertencer a F16/F19 e exigir camada server-side segura.
- Criar camada backend para server state: rejeitada por nao ser necessaria para
  impedir refetch por foco no frontend atual.
