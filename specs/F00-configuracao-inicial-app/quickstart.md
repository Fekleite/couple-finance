# Quickstart: F00 - Configuracao inicial do app

## Prerequisites

- Node.js LTS.
- npm como gerenciador padrao, salvo decisao posterior documentada no projeto.

## Initial Setup

```bash
npm install
```

Se a aplicacao ainda nao tiver sido inicializada, criar a base com Vite React +
TypeScript e entao aplicar TailwindCSS, Shadcn/ui, ESLint, Prettier, Husky e
lint-staged conforme o plano.

## Development

```bash
npm run dev
```

Validar a tela inicial em viewports mobile, tablet e desktop. A primeira tela
deve mostrar Couple Finance, explicar o proposito do produto e nao prometer
autenticacao, dashboard, transacoes, metas, graficos ou persistencia.

## Quality Checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Accessibility And UX Review

- Navegar apenas com teclado por todos os controles disponiveis.
- Confirmar foco visivel em links e botoes.
- Confirmar nomes acessiveis em controles interativos.
- Confirmar hierarquia semantica: header, nav, main, headings e sections.
- Testar rota inexistente, como `/rota-inexistente`, e confirmar caminho claro
  de retorno.
- Verificar que loading, empty e error possuem titulo, mensagem e acao quando
  aplicavel.

## Out Of Scope Validation

Durante a revisao, confirmar que a F00 nao implementa:

- cadastro, login, logout ou sessao persistente;
- Supabase, banco, migrations ou RLS;
- transacoes, dashboard, categorias, metas ou graficos;
- dados financeiros reais ou simulacoes que parecam persistidas.
