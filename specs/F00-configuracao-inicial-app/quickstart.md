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

## Home Page Acceptance Checklist

- Confirmar que a tela inicial mostra o nome `Couple Finance`.
- Confirmar que a proposta fala de organizacao financeira para casais.
- Confirmar que a linguagem e acolhedora, simples, transparente e sem
  julgamento.
- Confirmar que a tela comunica clareza, privacidade e simplicidade.
- Confirmar que a tela deixa autenticacao, transacoes, dashboard, metas,
  graficos e persistencia como funcionalidades ainda nao disponiveis.
- Confirmar que nao ha dados financeiros reais, simulados ou persistidos.

## Home Page Copy Review

- Revisar se os textos em portugues soam naturais para uma primeira visita.
- Revisar se a copia diferencia claramente fundacao atual de funcionalidades
  futuras.
- Revisar se nenhuma chamada visual sugere que areas protegidas ja podem ser
  acessadas.

## Route Navigation Review

- Acessar `/` e confirmar que a rota renderiza dentro do layout publico.
- Acessar `/rota-inexistente` e confirmar mensagem clara de pagina nao
  encontrada.
- Confirmar que a acao `Voltar ao inicio` retorna para `/` em uma acao.
- Confirmar que a navegacao publica cabe em mobile sem sobreposicao.
- Confirmar que areas futuras aparecem como planejadas, sem rota protegida
  funcional.

## Feedback State Review

- Confirmar que loading possui titulo, mensagem, indicador visual e texto
  acessivel.
- Confirmar que empty comunica ausencia esperada de conteudo, sem erro tecnico.
- Confirmar que error usa linguagem acolhedora e acao clara quando aplicavel.
- Confirmar que nenhum estado usa dados financeiros reais ou simulados.

## Responsive And Accessibility Review

- Validar mobile, tablet e desktop para `/`, estados de feedback e not-found.
- Navegar apenas com teclado por todos os links e botoes.
- Confirmar foco visivel em links, botoes e itens de navegacao.
- Confirmar nomes acessiveis nos controles interativos.
- Confirmar regioes semanticas `header`, `nav`, `main`, `section` e hierarquia
  de headings.
- Confirmar legibilidade com texto ampliado e sem conteudo essencial cortado.

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

## Implementation Notes

- Fundacao criada com React, Vite, TypeScript estrito, TailwindCSS via plugin
  do Vite, React Router, Shadcn/ui button base, ESLint, Prettier, Husky,
  lint-staged e Vitest.
- Rotas implementadas: `/` e catch-all not-found.
- Areas protegidas futuras aparecem apenas como indicadores planejados.
- Componentes reutilizaveis criados: loading, empty e error.
- Validacoes executadas em 2026-05-31: `npm run lint`, `npm run format:check`,
  `npm run typecheck` e `npm run build`.
