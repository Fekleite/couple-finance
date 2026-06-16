# Contract: Server State Configuration

## Purpose

Definir a politica tecnica de configuracao de server state para a F15 e para
futuras adocoes de TanStack Query.

## Current State

- `@tanstack/react-query` nao esta instalado.
- Nao existe Query Client global.
- Nao existem queries/mutations TanStack a configurar.
- Dados remotos sao carregados por hooks locais e services Supabase.

## Required Behavior

- Retorno de foco da janela, aba ou app nao deve disparar refetch global.
- Hooks remotos atuais nao devem registrar listeners de `focus` ou
  `visibilitychange` para recarregar dados automaticamente.
- Dados ja exibidos devem permanecer estaveis ate carga inicial, mudanca de
  contexto/filtro, retry explicito ou mutacao controlada.

## Future TanStack Query Rule

Se `@tanstack/react-query` for introduzido em uma feature futura:

- O Query Client deve configurar `refetchOnWindowFocus: false` no default
  global.
- Querys individuais nao devem sobrescrever esse default sem justificativa
  documentada.
- Mutacoes devem atualizar dados relacionados por invalidacao controlada,
  atualizacao direta segura ou estrategia equivalente testavel.

## Verification

- Busca no codigo por `@tanstack/react-query`, `QueryClient`,
  `QueryClientProvider`, `useQuery`, `useMutation`, `invalidateQueries`,
  `focusManager` e `refetchOnWindowFocus`.
- Testes de hooks garantindo que eventos de foco nao chamam services novamente
  sem gatilho permitido.
