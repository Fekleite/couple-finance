# Quickstart: F03 - Modelo de permissoes e isolamento de dados

## Prerequisites

- Node.js compativel com o projeto.
- Dependencias instaladas com `npm install`.
- F01 implementada e validada: Supabase Auth, sessao persistente, rotas
  publicas/privadas e logout.
- F02 implementada e validada: `shared_budgets`, `budget_members`,
  `budget_invitations`, RPCs de convite/vinculo, RLS e area privada `/app`.
- Projeto Supabase com e-mail/senha habilitado em Authentication.
- Supabase CLI instalado se a implementacao criar migration incremental.

## Environment

Manter `.env.local` baseado em `.env.example`. Nao commitar valores reais.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/reset-password
```

Regras:

- Usar somente publishable/anon key no frontend.
- Nunca usar `service_role`, secret key ou connection string no cliente.
- Credenciais administrativas para validacao de banco ficam fora do bundle
  frontend e fora do repositorio.

## Planned Implementation

Criar ou ajustar:

1. `src/features/permissions/permission-types.ts`.
2. `src/features/permissions/permission-matrix.ts`.
3. `src/features/permissions/visibility-scope.ts`.
4. `src/features/permissions/permission-messages.ts`.
5. Testes unitarios para matriz, escopos e mensagens.
6. Testes de integracao com estados F02 quando relevante.
7. Migration incremental somente se a revisao de RLS/RPC apontar lacuna real.

## Development

```bash
npm run dev
```

Fluxos manuais esperados:

1. Entrar com usuario A sem vinculo e confirmar que apenas estado permitido
   aparece.
2. Criar convite para usuario B e confirmar que A nao ve dados individuais de
   B.
3. Entrar com usuario B antes de aceitar e confirmar que nao ha acesso
   compartilhado antes do aceite.
4. Aceitar convite e confirmar que A/B veem apenas o espaco compartilhado
   ativo, sem dados financeiros fora de escopo.
5. Entrar com usuario C e tentar acessar link/convite/orcamento de A/B,
   recebendo mensagem segura.
6. Revisar estados vazios e erros para confirmar que comunicam ausencia de
   dados permitidos, nao ausencia global no produto.

## Technical Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

Cobertura automatizada esperada:

- `PermissionState`, `DataScope`, `DataType` e `PermissionAction`.
- Matriz por estado: sem vinculo, convite enviado, convite recebido, vinculo
  ativo, convite indisponivel, vinculo inativo e usuario nao relacionado.
- Acoes `view`, `create`, `update`, `delete`, `list`, `search`, `count` e
  `summarize`.
- Escopos `individual`, `shared`, `inaccessible` e `unknown_loading`.
- Mensagens seguras para recurso inexistente, removido, indisponivel, expirado
  ou nao autorizado.
- Integracao com `RelationshipState` da F02.
- Garantia de que helpers de frontend nao substituem bloqueio por RLS.

## Supabase and RLS Validation

Descobrir comandos antes de executar:

```bash
supabase --help
supabase db --help
supabase migration --help
```

Se houver migration incremental:

```bash
supabase migration new harden_permissions_isolation
supabase db reset
supabase migration list --local
```

Validar com pelo menos tres usuarios:

- Usuario A: remetente e membro do casal.
- Usuario B: destinatario e futuro membro.
- Usuario C: autenticado nao relacionado.

Cenarios obrigatorios:

- A visualiza apenas seu espaco compartilhado, sua membership e convite
  relacionado.
- B visualiza apenas convite enderecado ao e-mail autenticado antes do aceite.
- B nao acessa dados compartilhados antes de aceitar.
- A/B acessam contexto compartilhado apenas depois de membership ativa.
- C nao visualiza detalhes de orcamentos, membros ou convites de A/B.
- Convites recusados, cancelados, expirados, aceitos ou indisponiveis nao
  concedem acesso compartilhado.
- Listas, buscas, contadores e resumos futuros devem ser validados com dados
  autorizados e nao autorizados quando forem implementados.

Checagens de seguranca:

- RLS habilitado em todas as tabelas expostas.
- Policies usam `to authenticated`.
- Policies nao dependem de `user_metadata`.
- UPDATE possui SELECT policy compativel quando aplicavel.
- Funcoes `security definer`, se existirem, possuem `search_path` explicito,
  grants restritos e justificativa.
- Colunas usadas por policies possuem indices apropriados.

## Accessibility and Responsive Validation

- Validar mensagens de permissao por teclado.
- Confirmar foco visivel em links, botoes e controles.
- Confirmar que rotulos de visibilidade nao dependem apenas de cor.
- Confirmar feedback perceptivel por tecnologias assistivas quando aplicavel.
- Testar larguras mobile comuns, tablet e desktop.
- Testar texto ampliado ate 200%.
- Confirmar que estados de carregamento nao exibem dados privados.

## Out of Scope Checks

Durante a revisao, confirmar que a F03 nao introduz:

- Transacoes financeiras.
- Categorias financeiras reais.
- Dashboard financeiro.
- Graficos.
- Metas.
- Auditoria financeira detalhada.
- Mais de dois membros ativos por orcamento.
- Multiplos casais/orcamentos ativos por pessoa.
- Permissoes administrativas avancadas.
- Autorizacao baseada apenas no cliente.
