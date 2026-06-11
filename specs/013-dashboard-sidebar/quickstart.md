# Quickstart: F13 - Layout principal com sidebar de dashboard

## Preconditions

- Estar na branch `013-dashboard-sidebar`.
- Confirmar que `.specify/feature.json` aponta para
  `specs/013-dashboard-sidebar`.
- Revisar `spec.md`, `plan.md`, `research.md`, `data-model.md` e contratos.

## Implementation Review Script

1. Inventariar a navegacao atual em:
   - `src/components/layout/authenticated-layout.tsx`
   - `src/components/layout/authenticated-layout.test.tsx`
   - `src/app/routes.ts`
   - `src/app/router.tsx`
2. Confirmar quais destinos privados existem:
   - `/app`
   - `/app/transactions`
   - `/app/transactions/new`
   - `/app/categories`
   - `/app/goals`
   - `/app/audit`
   - `/app/invites/:invitationId`
3. Registrar que Configuracoes e pagina principal de Parceiro/Convites nao
   devem ser criadas na F13 se continuarem ausentes.
4. Definir lista tipada de itens de navegacao e regras de rota ativa.
5. Evoluir o layout autenticado para sidebar desktop e navegacao compacta
   mobile/tablet.
6. Preservar logout, mensagens de sessao, `Outlet` e protecao por
   `ProtectedRoute`.

## Manual Validation

### Desktop

- Acessar `/app` autenticado.
- Confirmar sidebar lateral visivel.
- Navegar para Transacoes, Categorias, Metas e Auditoria se mantida.
- Confirmar rota ativa em cada modulo.
- Confirmar que logout permanece visivel e funcional.

### Tablet/Mobile

- Reduzir viewport para larguras representativas de tablet e mobile.
- Abrir e fechar navegacao compacta.
- Confirmar que os mesmos destinos principais continuam acessiveis.
- Confirmar ausencia de rolagem horizontal obrigatoria.
- Confirmar que conteudo financeiro das paginas continua legivel.

### Keyboard And Accessibility

- Usar `Tab` para percorrer logout, controle compacto e links.
- Confirmar foco visivel.
- Confirmar que item ativo comunica pagina atual.
- Confirmar que menu compacto abre e fecha por teclado.
- Confirmar que icones nao sao o unico meio de identificar destino.

### Security And Privacy

- Tentar acessar rota privada sem sessao.
- Confirmar redirecionamento para login e ausencia de sidebar autenticada.
- Confirmar que a navegacao nao exibe contagens, valores, status de parceiro ou
  dados privados.
- Confirmar que rotas dinamicas de convite continuam acessiveis quando usadas
  por links existentes.

## Automated Validation

Run:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Expected Test Coverage

- Renderizacao do layout autenticado.
- Links principais e labels.
- Rota ativa em rota principal.
- Rota ativa em subrota relacionada.
- Estado de logout em progresso.
- Usuario nao autenticado protegido por `ProtectedRoute`.
- Abertura/fechamento da navegacao compacta quando implementada.
- Operacao basica por teclado e nomes acessiveis.

## Done When

- A sidebar desktop substitui a navegacao horizontal atual.
- Mobile/tablet possuem navegacao compacta utilizavel.
- Modulos existentes continuam acessiveis.
- Configuracoes e Parceiro/Convites nao viram paginas novas nesta feature.
- Protecao de rotas e sessao permanecem preservadas.
- Testes e validacoes obrigatorias passam.

## Implementation Notes

- Inventario revisado em `src/components/layout/authenticated-layout.tsx`,
  `src/components/layout/authenticated-layout.test.tsx`, `src/app/routes.ts` e
  `src/app/router.tsx`.
- A navegacao privada foi centralizada em
  `src/components/layout/private-navigation.tsx`.
- A F13 manteve os destinos existentes: `/app`, `/app/transactions`,
  `/app/transactions/new`, `/app/categories`, `/app/goals`, `/app/audit` e
  suporte seguro a `/app/invites/:invitationId` sem item agregado falso.
- Configuracoes e Parceiro/Convites continuam fora de escopo enquanto nao
  houver rotas estaveis no produto.
- A navegacao compacta usa controle de abrir/fechar, fecha apos selecao de
  destino e preserva foco ao fechar manualmente.
- Validacao focada executada: `npm run test:run --
  src/components/layout/private-navigation.test.tsx
  src/components/layout/authenticated-layout.test.tsx
  src/features/auth/protected-route.test.tsx`.
- Typecheck focado de implementacao executado via `npm run typecheck`.
- Validacao final executada em 2026-06-10:
  - `npm run lint`: PASS.
  - `npm run format:check`: PASS apos formatar
    `src/features/auth/protected-route.test.tsx`.
  - `npm run typecheck`: PASS.
  - `npm run test:run`: PASS, 97 arquivos de teste e 247 testes.
  - `npm run build`: PASS, com aviso nao bloqueante de chunk acima de 500 kB.
- Revisao manual guiada pelo quickstart: desktop, tablet/mobile, teclado,
  foco, rota ativa e acesso nao autenticado cobertos por combinacao de testes
  de componente, revisao de markup semantico e validacao das rotas existentes.
