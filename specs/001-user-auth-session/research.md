# Research: F01 - Autenticacao e sessao do usuario

## Decision: Usar Supabase Auth com `@supabase/supabase-js` no frontend

**Rationale**: Supabase Authentication e a stack padrao definida na constitution
para identidade, sessao persistente e preparacao futura para RLS. O cliente
oficial JavaScript expoe os metodos necessarios para cadastro, login com senha,
logout, recuperacao, atualizacao de senha e observacao de mudancas de sessao.
A documentacao atual de React recomenda variaveis `VITE_SUPABASE_URL` e
`VITE_SUPABASE_PUBLISHABLE_KEY`, evitando chaves secretas no cliente.

**Alternatives considered**: Auth proprio foi rejeitado por aumentar risco e
escopo. Provedores externos como Clerk/Auth0 foram rejeitados porque exigiriam
integracao adicional com RLS e desviariam da stack padrao. Login social e magic
link foram rejeitados porque a spec limita a F01 a e-mail e senha.

## Decision: Centralizar o cliente Supabase em `src/lib/supabase.ts`

**Rationale**: Um unico modulo para `createClient` evita duplicacao de
configuracao e reduz risco de espalhar detalhes de ambiente. O modulo deve ler
apenas variaveis publicas Vite e falhar de forma clara em desenvolvimento se
estiverem ausentes.

**Alternatives considered**: Criar cliente diretamente nas paginas foi rejeitado
por acoplamento e repeticao. Criar multiplos clientes por feature foi rejeitado
por complexidade desnecessaria.

## Decision: Criar camada fina `auth-service.ts`

**Rationale**: Formularios e paginas devem chamar funcoes de dominio como
`signUpWithEmail`, `signInWithEmail`, `signOut`, `sendPasswordRecovery` e
`updatePassword`, sem conhecer detalhes de resposta do Supabase. Essa camada
normaliza erros em mensagens seguras e facilita testes.

**Alternatives considered**: Usar chamadas Supabase diretamente em componentes
foi rejeitado por espalhar tratamento de erro. Uma camada generica de repository
foi rejeitada porque a feature nao acessa banco proprio.

## Decision: Gerenciar sessao com `AuthProvider`, `useAuth` e eventos de auth

**Rationale**: A aplicacao precisa saber se a sessao esta carregando,
autenticada, ausente ou encerrada antes de decidir rotas. O provider deve fazer
a verificacao inicial de sessao, assinar `onAuthStateChange`, limpar a assinatura
no unmount e expor usuario, sessao, status e acoes. Eventos como
`INITIAL_SESSION`, `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`,
`USER_UPDATED` e `PASSWORD_RECOVERY` devem conduzir a UI quando aplicavel.

**Alternatives considered**: Estado local por pagina foi rejeitado porque nao
protege navegacao direta. TanStack Query foi rejeitado nesta feature porque auth
e evento/sessao global, nao consulta remota cacheavel de negocio.

## Decision: Proteger rotas com componentes de guard

**Rationale**: `ProtectedRoute` deve renderizar loading enquanto a sessao e
desconhecida, redirecionar usuarios sem sessao para login e renderizar conteudo
privado apenas quando autenticado. `PublicAuthRoute` deve evitar que usuarios ja
autenticados voltem para login/cadastro sem necessidade.

**Alternatives considered**: Redirecionar apenas dentro das paginas foi rejeitado
porque poderia renderizar conteudo privado antes da verificacao. Middleware de
servidor nao se aplica porque a aplicacao e SPA frontend.

## Decision: Formularios com React Hook Form e Zod

**Rationale**: A stack padrao inclui React Hook Form e Zod. Eles fornecem
validacao tipada, mensagens associaveis a campos, preservacao de valores
nao sensiveis e baixo custo de renderizacao para formularios de auth.

**Alternatives considered**: Validacao manual foi rejeitada por repeticao e
maior risco de inconsistencia. Bibliotecas adicionais foram rejeitadas porque a
stack ja resolve o problema.

## Decision: Recuperacao de senha por e-mail com rota de redefinicao dedicada

**Rationale**: A spec exige solicitacao de recuperacao e definicao de nova senha.
O fluxo deve usar envio de e-mail pelo Supabase e uma rota publica dedicada para
receber o retorno. Ao detectar evento de recuperacao, a UI deve permitir nova
senha e chamar atualizacao do usuario autenticado pelo token de recuperacao.

**Alternatives considered**: Apenas enviar e-mail sem rota de redefinicao foi
rejeitado porque nao completa FR-017. Reset manual por suporte foi rejeitado por
estar fora do produto e da spec.

## Decision: Nao criar tabelas, migrations ou RLS na F01

**Rationale**: A F01 nao persiste dados financeiros nem perfis detalhados. O
Supabase Auth ja mantem usuarios e sessoes no schema gerenciado. RLS sera
obrigatorio quando F03 introduzir isolamento de dados em tabelas expostas.

**Alternatives considered**: Criar tabela `profiles` agora foi rejeitado porque
perfis detalhados estao fora do escopo e criariam obrigacao prematura de RLS.
Criar orcamento individual/compartilhado foi rejeitado por pertencer a F02/F03.

## Decision: Mensagens seguras e mapeamento controlado de erros

**Rationale**: Credenciais invalidas devem usar mensagem generica. Recuperacao
de senha deve confirmar envio condicional sem revelar existencia de conta. Erros
temporarios devem orientar tentativa posterior sem expor payloads ou detalhes do
provedor.

**Alternatives considered**: Mostrar `error.message` bruto do Supabase foi
rejeitado por risco de linguagem inconsistente, vazamento de detalhes e baixa
qualidade de UX.

## Decision: Testes automatizados focados em contratos de auth

**Rationale**: A implementacao deve testar validacao de formularios, guards,
redirecionamentos, estados de loading e mensagens seguras com Vitest/Testing
Library, mockando a camada `auth-service` quando necessario. Validacao manual
continua obrigatoria para o fluxo real com Supabase e e-mails de recuperacao.

**Alternatives considered**: Depender apenas de testes manuais foi rejeitado por
risco em rotas protegidas. Testes end-to-end completos foram adiados para quando
houver ambiente de auth estavel e dados privados mais ricos.

## Supabase documentation checked

- `https://supabase.com/docs/guides/auth/quickstarts/react`
- `https://supabase.com/docs/reference/javascript/auth-api`
- `https://supabase.com/docs/reference/javascript/auth-signinwithpassword`
- `https://supabase.com/docs/reference/javascript/auth-onauthstatechange`
- `https://supabase.com/docs/reference/javascript/auth-getsession`
- `https://supabase.com/docs/guides/auth/passwords`
- `https://supabase.com/changelog?tags=breaking-change`

No breaking change found in the checked changelog items that blocks the planned
frontend Supabase Auth integration for hosted Supabase password auth.
