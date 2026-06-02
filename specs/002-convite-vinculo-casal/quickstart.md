# Quickstart: F02 - Convite e vinculo do casal

## Prerequisites

- Node.js compativel com o projeto.
- Dependencias instaladas com `npm install`.
- F01 implementada e validada: Supabase Auth, rotas publicas, rota privada
  `/app`, sessao persistente e logout.
- Projeto Supabase criado com e-mail/senha habilitado em Authentication.
- Supabase CLI instalado se a implementacao criar e aplicar migrations locais.

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
- Se testes de banco precisarem de credenciais administrativas, elas ficam fora
  do bundle frontend e fora do repositorio.

## Planned Database Setup

Criar migration para:

1. `shared_budgets`.
2. `budget_members`.
3. `budget_invitations`.
4. Constraints, checks e indices.
5. RLS em todas as tabelas.
6. Policies por role `authenticated`.
7. RPC transacional para aceitar convite e, se necessario, RPCs para criar,
   recusar e cancelar.

Com Supabase CLI, descobrir comandos antes de executar:

```bash
supabase --help
supabase migration --help
supabase db --help
```

Fluxo esperado quando a implementacao existir:

```bash
supabase migration new create_couple_linking
supabase db reset
supabase migration list --local
```

## Development

```bash
npm run dev
```

Fluxos manuais esperados:

1. Entrar com usuario A.
2. Abrir `/app` sem vinculo e confirmar estado para criar espaco.
3. Criar espaco compartilhado e convidar e-mail do usuario B.
4. Confirmar estado de convite enviado, e-mail convidado, expiracao e cancelar.
5. Recriar convite para usuario B.
6. Sair e entrar com usuario B.
7. Abrir convite recebido e aceitar.
8. Confirmar que usuario B ve espaco compartilhado ativo.
9. Entrar novamente com usuario A e confirmar casal vinculado.
10. Repetir com novo convite para validar recusa.
11. Abrir convite inexistente, terminal, expirado e de outro usuario para
    confirmar mensagem segura.

## Technical Validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

Cobertura automatizada esperada:

- Schemas de e-mail e formularios.
- Mapeamento de mensagens seguras.
- Servicos Supabase mockados para criar convite, buscar estado, aceitar,
  recusar e cancelar.
- Hook de relacionamento com estados `loading`, `no_shared_budget`,
  `invitation_sent`, `invitation_received`, `couple_linked`,
  `invitation_unavailable` e `error`.
- Rotas privadas e rota de convite sem renderizar dados antes de autorizacao.
- Formularios e acoes acessiveis por teclado.

## Supabase and RLS Validation

Validar com pelo menos tres usuarios:

- Usuario A remetente.
- Usuario B destinatario.
- Usuario C nao relacionado.

Cenarios obrigatorios:

- A cria orcamento e convite pendente.
- A ve somente seu orcamento/convite enviado.
- B ve somente convite enderecado ao e-mail autenticado.
- C nao ve detalhes do convite de A/B.
- B aceita e exatamente dois membros ativos passam a existir.
- B nao aceita outro convite apos ficar vinculado.
- A nao cria segundo orcamento ativo.
- Convite recusado, cancelado, expirado ou aceito nao cria novo membro.
- Tentativas repetidas de aceite/cancelamento/recusa mantem resultado unico.

Checagens de seguranca:

- RLS habilitado em todas as tabelas F02.
- Policies usam `to authenticated`.
- Policies nao dependem de `user_metadata`.
- Colunas usadas por policies possuem indices quando apropriado.
- Nenhum segredo aparece no frontend ou em logs.
- `UPDATE` possui policy `SELECT` correspondente quando necessario.

## Accessibility and Responsive Validation

- Testar criacao de convite, aceite, recusa e cancelamento por teclado.
- Confirmar foco visivel em links, campos, botoes e acoes destrutivas.
- Confirmar labels e mensagens associadas ao campo de e-mail.
- Confirmar feedback global perceptivel por leitores de tela quando aplicavel.
- Testar larguras mobile comuns, tablet e desktop.
- Testar texto ampliado ate 200%.
- Confirmar que botoes continuam acionaveis com teclado virtual em mobile.

## Out of Scope Checks

Durante a revisao, confirmar que a F02 nao introduz:

- Transacoes financeiras.
- Categorias financeiras.
- Dashboard financeiro.
- Graficos.
- Metas.
- Auditoria financeira detalhada.
- Mais de dois membros ativos por orcamento.
- Permissoes avancadas por papel.
- Envio real de e-mail por provedor externo sem decisao documentada.
