# Quickstart: F07 - Dashboard financeiro inicial

## Prerequisites

- Estar na branch `007-dashboard-financeiro-inicial`.
- Ter ambiente local configurado para React/Vite e Supabase.
- F01-F06 implementadas, incluindo `public.financial_transactions`, RLS,
  categorias, registro de transacoes e lista mensal autorizada.

## Implementation Outline

1. Criar migration `supabase/migrations/<timestamp>_financial_dashboard_initial.sql`.
2. Adicionar RPC `public.get_financial_dashboard` como `security invoker`.
3. Validar que a RPC usa intervalo civil, RLS, agregacoes autorizadas e limite
   pequeno de recentes.
4. Criar `src/features/dashboard/` com tipos, servico, hook/controller,
   indicadores, item recente, mensagens e view.
5. Atualizar `/app` para renderizar o dashboard e preservar caminhos para
   transacoes, nova transacao e categorias.
6. Atualizar rotas, testes de rota e contexto de autorizacao quando necessario.

## Supabase Validation

### Positive scenarios

- Pessoa autenticada com receitas e despesas individuais no mes atual recebe:
  - receitas somadas;
  - despesas somadas;
  - saldo correto;
  - resultado `positive`, `negative` ou `zero`;
  - ate 5 transacoes recentes.
- Pessoa com vinculo ativo recebe indicadores incluindo transacoes
  compartilhadas do mesmo `shared_budget_id`.
- Transacao compartilhada criada por uma pessoa e atribuida a outra preserva
  responsavel, criador quando relevante e visibilidade.
- Categoria historica/inativa continua aparecendo nos itens recentes
  autorizados.

### Negative/privacy scenarios

- Transacao individual de outra pessoa nao contribui para indicadores nem
  recentes.
- Transacao compartilhada de outro espaco financeiro nao contribui para
  indicadores nem recentes.
- Convite pendente, recusado, cancelado, expirado ou vinculo encerrado nao
  concede acesso compartilhado.
- Mes sem transacoes autorizadas retorna indicadores zerados e lista vazia sem
  contagens.
- Revogacao de vinculo remove dados compartilhados na proxima consulta.
- Falhas de RPC nao retornam SQL, IDs internos, detalhes de RLS ou existencia
  de recursos inacessiveis.

## Frontend Validation

- `/app` inicia no mes civil atual quando `month` esta ausente.
- `month=YYYY-MM` valido atualiza indicadores e recentes.
- `month` invalido e normalizado para o mes atual sem chamada insegura.
- Trocas rapidas de mes nao permitem que resposta antiga substitua a nova.
- Retry reexecuta a consulta atual e mantem mensagem segura.
- Logout, troca de usuario ou mudanca de relacionamento limpam dados antes de
  nova leitura.
- O link para `/app/transactions` existe quando a rota estiver disponivel, mas
  o dashboard nao implementa filtros ou lista completa.

## Automated Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Suggested Test Coverage

- `dashboard-summary.test.ts`: soma, saldo, resultado positivo/negativo/zero e
  formatacao.
- `dashboard-state.test.ts`: transicoes, limpeza em contexto sensivel e retry.
- `dashboard-service.test.ts`: contrato da RPC, falhas seguras e mapeamento de
  resposta.
- `use-dashboard.test.tsx`: concorrencia, troca de mes, retry e limpeza por
  sessao/relacionamento.
- `dashboard-indicator-card.test.tsx`: labels, texto de resultado, nao
  depender apenas de cor.
- `dashboard-recent-transaction.test.tsx`: conteudo exigido, autoria quando
  relevante e sem observacao completa.
- `dashboard-view.test.tsx`: estados loading, ready, empty e error.
- `private-home-page.test.tsx`: rota `/app`, titulo, parametros de mes e links.
- `dashboard-migration.test.ts`: RPC, grants, `search_path`, RLS, isolamento,
  revogacao e ausencia de contagens.

## Manual Review

- Mobile: verificar indicadores empilhados, lista curta, alvos de toque e sem
  rolagem horizontal.
- Tablet/desktop: verificar largura, hierarquia e leitura rapida.
- Teclado: navegar por periodo, indicadores, retry, transacoes recentes e link
  para lista completa.
- Leitor de tela quando disponivel: confirmar nomes de regioes, significado dos
  indicadores e anuncio moderado de atualizacao.
- Texto ampliado ate 200%: confirmar que valores e labels nao se sobrepoem.
- Privacidade: revisar estados vazios, erro e perda de acesso sem inferencias.
- Clareza financeira: confirmar que receitas, despesas, saldo e
  economia/deficit sao distinguiveis em ate poucos segundos.
