# Quickstart: F01 - Autenticacao e sessao do usuario

## Prerequisites

- Node.js compativel com o projeto.
- Dependencias instaladas com `npm install`.
- Projeto Supabase criado e com e-mail/senha habilitado em Authentication.
- URLs de redirecionamento configuradas no Supabase para o ambiente local e
  futuro ambiente de deploy.

## Install planned dependencies

```bash
npm install @supabase/supabase-js react-hook-form zod @hookform/resolvers
```

## Environment

Criar `.env.local` a partir de `.env.example` quando a implementacao existir.
Nao commitar valores reais.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/reset-password
```

Regras:

- Usar somente publishable/anon key no frontend.
- Nunca usar `service_role` ou secret key no cliente.
- Documentar valores esperados, mas nao incluir segredos reais no repositorio.

## Development

```bash
npm run dev
```

Fluxos manuais esperados:

1. Abrir a home publica.
2. Acessar cadastro, criar conta com e-mail e senha validos e confirmar feedback.
3. Entrar com e-mail e senha.
4. Recarregar a aplicacao e confirmar sessao persistente.
5. Abrir rota privada diretamente em janela sem sessao e confirmar bloqueio.
6. Acionar logout e confirmar perda de acesso privado.
7. Solicitar recuperacao de senha e confirmar mensagem neutra.
8. Abrir link de redefinicao e alterar senha.
9. Entrar com a nova senha.

## Technical validation

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Accessibility and responsive validation

- Testar cadastro, login, recuperacao, redefinicao e logout por teclado.
- Confirmar foco visivel em links, campos e botoes.
- Confirmar labels e mensagens de erro associadas aos campos.
- Confirmar feedback global perceptivel por leitores de tela quando aplicavel.
- Testar larguras mobile comuns, tablet e desktop.
- Testar texto ampliado ate 200%.
- Verificar que o teclado virtual nao oculta controles essenciais em mobile.

## Security validation

- Confirmar que conteudo privado nao aparece durante `loading`.
- Confirmar que credenciais invalidas usam mensagem generica.
- Confirmar que recuperacao de senha nao revela se o e-mail existe.
- Confirmar que logout encerra acesso privado no dispositivo atual.
- Confirmar que tokens, senhas e payloads sensiveis nao sao logados.
- Confirmar que `.env.local` nao entra no controle de versao.

## Out of scope checks

Durante a revisao, confirmar que a F01 nao introduz:

- Convite de casal.
- Orcamento compartilhado.
- Transacoes financeiras.
- Dashboard financeiro.
- Metas ou graficos.
- Tabelas de dados financeiros.
- RLS ou migrations sem necessidade real documentada.
