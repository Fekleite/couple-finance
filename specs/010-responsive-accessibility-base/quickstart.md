# Quickstart: F11 - Responsividade e acessibilidade base

## Prerequisites

- Node.js e npm conforme o projeto.
- Supabase configurado para os fluxos existentes, quando testes locais
  dependerem de variaveis de ambiente.
- Branch `011-responsive-accessibility-base`.

## Development Commands

```bash
npm install
npm run dev
```

## Required Validation Commands

F11 uses the existing project toolchain only. No new accessibility, browser E2E,
or visual-regression dependency is required for this feature.

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

Focused automated coverage should stay in Vitest and Testing Library for:

- shared button, input, field, feedback-state, and layout semantics;
- auth form labels, invalid states, and safe messages;
- transaction form/list controls, safe retry, and input preservation;
- dashboard indicators, charts, text equivalents, and authorized empty/error
  states;
- goals progress/actions and audit event/state semantics.

## Essential Flow Review

Percorra os fluxos abaixo em mobile, tablet e desktop:

- Login, cadastro, recuperacao de senha e redefinicao de senha.
- Area privada inicial e navegacao privada.
- Convite/vinculo do casal e estados sem vinculo ativo.
- Categorias financeiras.
- Registro de transacao.
- Lista e filtros de transacoes.
- Dashboard e ultimas transacoes.
- Graficos basicos.
- Metas financeiras.
- Auditoria financeira.

Para cada fluxo, valide:

- Nao ha rolagem horizontal obrigatoria.
- Conteudo, controles e acoes principais permanecem visiveis e acionaveis.
- Texto longo, valores altos, datas longas e nomes extensos quebram linha de
  forma legivel.
- Texto ampliado ou zoom alto nao causa sobreposicao critica.
- Estados de loading, saving, success, empty, erro e retry sao perceptiveis.
- Mensagens nao revelam dados inacessiveis.

## Keyboard Review

Para cada fluxo essencial:

- Use `Tab` e `Shift+Tab` para percorrer todos os controles interativos.
- Confirme que o foco e visivel e segue ordem logica.
- Acione botoes e links com teclado.
- Confirme que retry, cancelamento e confirmacao sao alcancaveis.
- Confirme que foco retorna para contexto logico apos dialogo ou acao.

## Form Review

Para login, cadastro, recuperacao, redefinicao, transacao e metas:

- Campo possui label claro ou nome acessivel equivalente.
- Erro de validacao fica associado ao campo.
- Campo invalido nao depende apenas de cor.
- Mensagem explica como corrigir.
- Dados digitados sao preservados apos erro quando seguro.
- Estado de envio/salvamento e perceptivel.

## Chart And Financial Summary Review

Para dashboard e graficos:

- Grafico ou indicador possui resumo textual equivalente.
- Periodo, valor, categoria, responsavel, visibilidade e tendencia essencial
  aparecem em texto quando relevantes.
- Cor, icone, legenda visual, tooltip, hover ou posicao nao sao o unico canal
  de significado.
- Dados parciais ou vazios autorizados nao sugerem dados inacessiveis.

## Safe Message Review

Provoque ou simule:

- Lista sem resultado.
- Falha temporaria de carregamento.
- Falha temporaria de salvamento.
- Sessao expirada.
- Pessoa sem vinculo compartilhado ativo.
- Permissao indisponivel.
- Vinculo compartilhado revogado durante navegacao.

Confirme que a mensagem:

- Usa tom neutro, colaborativo e nao julgador.
- Oferece proxima acao quando houver.
- Nao revela existencia, quantidade, dono, valor, categoria, meta, transacao,
  evento ou status inacessivel.
- Nao expoe SQL, RLS, stack trace, token ou detalhe de infraestrutura.

## Manual Accessibility Pass

Quando disponivel, valide com leitor de tela do sistema:

- Titulo e landmark principal de cada pagina.
- Nome dos controles de navegacao.
- Labels e erros de formulario.
- Estados de carregamento, erro, vazio e sucesso.
- Resumos textuais de graficos.

Tambem valide contraste e foco visivel em tema atual.

## Acceptance Gate

A F11 esta pronta para tasks quando:

- Todos os contratos em `contracts/` foram considerados na decomposicao.
- Nenhum fluxo essencial depende exclusivamente de desktop.
- Nenhum estado ou mensagem cria inferencia de dado inacessivel.
- Todos os checks tecnicos obrigatorios estao planejados.

## Acceptance Gate Results

- `npm run typecheck`: passed on 2026-06-08.
- `npm run test:run`: passed on 2026-06-08.
- `npm run lint`: passed on 2026-06-08.
- `npm run format:check`: passed on 2026-06-08.
- `npm run build`: passed on 2026-06-08.
- Manual mobile/tablet/desktop review: recorded in
  `checklists/f11-essential-flows.md` for essential flows and safe states.
