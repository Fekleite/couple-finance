# Data Model: F01 - Autenticacao e sessao do usuario

## Scope

A F01 nao cria tabelas de aplicacao, migrations, dados financeiros ou perfis
detalhados. Credenciais, usuarios autenticaveis e sessao persistente ficam sob
responsabilidade do Supabase Auth. Este modelo descreve as entidades
conceituais que a UI e os contratos precisam respeitar.

## User Account

Representa uma pessoa que pode acessar o Couple Finance de forma privada.

**Source of truth**: Supabase Auth.

**Fields**

- `id`: identificador unico do usuario no Supabase Auth.
- `email`: e-mail usado para cadastro, login e recuperacao.
- `status`: estado conceitual da conta para a UI (`pending_confirmation`,
  `active`, `unavailable`).
- `authEligibility`: indica se a conta pode iniciar sessao pelo fluxo de e-mail
  e senha.

**Validation rules**

- E-mail e obrigatorio e deve ter formato valido.
- Senha e obrigatoria nos fluxos de cadastro, login e redefinicao.
- Senha de cadastro/redefinicao deve atender aos criterios minimos comunicados
  na UI e aceitos pelo Supabase.
- Mensagens de login nao devem revelar qual campo esta incorreto.

**Relationships**

- Pode ter zero ou uma `Session` ativa no contexto do navegador atual.
- Podera ser associado futuramente a um orcamento individual ou compartilhado,
  mas essa associacao nao e criada nesta feature.

## Session

Representa o acesso autenticado atual no dispositivo/navegador.

**Source of truth**: Supabase Auth client session.

**Fields**

- `status`: `loading`, `authenticated`, `unauthenticated`, `expired`,
  `ending` ou `error`.
- `user`: referencia ao `User Account` quando autenticado.
- `startedAt`: momento conceitual em que a sessao foi reconhecida.
- `expiresAt`: expiracao informada pelo provedor quando disponivel.
- `lastEvent`: ultimo evento relevante de auth recebido.

**State transitions**

- `loading` -> `authenticated`: sessao valida encontrada.
- `loading` -> `unauthenticated`: nenhuma sessao valida encontrada.
- `unauthenticated` -> `authenticated`: login, cadastro com acesso imediato ou
  recuperacao concluida.
- `authenticated` -> `ending`: usuario acionou logout.
- `ending` -> `unauthenticated`: logout concluido.
- `authenticated` -> `expired`: sessao deixa de ser valida durante uso.
- `expired` -> `unauthenticated`: usuario e conduzido ao login.
- qualquer estado -> `error`: falha temporaria ao verificar ou alterar sessao.

**Validation rules**

- Conteudo privado so pode renderizar no estado `authenticated`.
- Enquanto `loading` ou `ending`, a UI deve exibir feedback e bloquear acoes que
  poderiam duplicar submissao.

## Password Recovery Request

Representa a solicitacao de recuperacao e a posterior redefinicao de senha.

**Source of truth**: Supabase Auth e estado local temporario da UI.

**Fields**

- `email`: e-mail informado para receber instrucoes.
- `requestStatus`: `idle`, `submitting`, `sent`, `temporary_error`.
- `recoveryStatus`: `idle`, `validating_link`, `ready`, `updating`,
  `updated`, `invalid_or_expired`, `temporary_error`.
- `redirectPath`: rota publica que recebe o retorno do provedor.

**Validation rules**

- E-mail e obrigatorio e deve ter formato valido para solicitar recuperacao.
- A confirmacao de envio deve ser neutra: "se houver conta associada".
- Nova senha e obrigatoria, deve atender aos criterios minimos e deve ser
  confirmada se a UI incluir campo de confirmacao.
- Links invalidos ou expirados devem explicar o problema e oferecer nova
  solicitacao.

## Private Area

Representa areas da aplicacao que exigem usuario autenticado.

**Source of truth**: Definicao de rotas e `ProtectedRoute`.

**Fields**

- `path`: caminho privado, inicialmente `/app` ou equivalente definido na rota.
- `requiredSessionStatus`: sempre `authenticated`.
- `fallbackPath`: rota de login para usuarios sem sessao.
- `loadingState`: estado exibido durante verificacao de sessao.

**Validation rules**

- Deve bloquear acesso direto por URL sem sessao.
- Nao deve renderizar conteudo privado antes da verificacao de sessao.
- Deve preservar destino pretendido quando isso melhorar a experiencia e nao
  criar risco de loop de redirecionamento.

## Out of scope data

- Perfil detalhado de usuario.
- Orcamento individual ou compartilhado.
- Convites de casal.
- Transacoes, categorias, metas, graficos e auditoria financeira.
- Tabelas em Supabase PostgreSQL e politicas RLS.
