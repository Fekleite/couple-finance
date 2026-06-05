# Quickstart: F08 - Graficos basicos

## Prerequisites

- Estar na branch `008-graficos-basicos`.
- Ter Supabase local/configurado conforme features F02-F07.
- Ter migrations anteriores aplicadas, incluindo dashboard inicial da F07.
- Confirmar que `package.json` nao exige Recharts para esta feature.

## Development Flow

1. Revisar contratos e plano:

   ```bash
   sed -n '1,240p' specs/008-graficos-basicos/plan.md
   sed -n '1,240p' specs/008-graficos-basicos/data-model.md
   ```

2. Criar migration da RPC:

   ```bash
   ls supabase/migrations
   ```

   Nome esperado: `<timestamp>_basic_financial_charts.sql`.

3. Implementar `public.get_financial_dashboard_charts` como
   `security invoker`, `search_path` fixo, SQL estatico, grants minimos para
   `authenticated` e validacao segura de periodo/janela.

4. Implementar modulos em `src/features/dashboard/`:

   - `dashboard-chart-types.ts`
   - `dashboard-chart-service.ts`
   - `dashboard-chart-state.ts`
   - `dashboard-chart-messages.ts`
   - `accessible-chart-summary.ts`
   - `use-dashboard-charts.ts`
   - `category-expense-chart.tsx`
   - `monthly-evolution-chart.tsx`
   - `member-comparison-chart.tsx`
   - `dashboard-charts-section.tsx`

5. Integrar a secao de graficos ao `dashboard-view.tsx`, usando o mesmo mes
   selecionado da F07.

## Supabase Validation Scenarios

- Usuario sem vinculo ativo ve categoria e evolucao apenas com transacoes
  individuais proprias.
- Usuario com vinculo ativo ve individuais proprias e compartilhadas do espaco
  ativo em categoria/evolucao.
- Comparativo usa apenas despesas compartilhadas autorizadas.
- Transacoes individuais do parceiro nao alteram valores, percentuais,
  legendas, estados ou resumos.
- Transacoes compartilhadas de outro espaco nao alteram graficos.
- Convite pendente, recusado, cancelado, expirado ou indisponivel nao concede
  leitura.
- Vinculo encerrado ou inativo remove dados compartilhados na proxima consulta.
- Mes sem despesas retorna distribuicao vazia segura.
- Evolucao inclui meses sem movimentacao autorizada com valores zerados.
- Categorias com totais iguais seguem ordem deterministica.
- Responsavel diferente do criador nao quebra labels de responsabilidade.

## Frontend Validation Scenarios

- Categoria de maior despesa e identificavel em ate 10 segundos apos
  carregamento.
- Receitas, despesas e saldo da evolucao sao compreensiveis sem depender de
  cor.
- Mes selecionado aparece destacado na evolucao.
- Comparativo usa linguagem neutra e nao julgadora.
- Ausencia de vinculo ativo nao sugere dados de outra pessoa.
- Loading, vazio, indisponivel, erro e retry sao perceptiveis e seguros.
- Trocas rapidas de mes nao permitem que resposta antiga substitua a atual.
- Logout, troca de sessao ou mudanca de relacionamento limpa dados sensiveis.

## Accessibility Review

- Navegar por teclado por periodo, graficos, legendas, resumos e retry.
- Verificar foco visivel em todos os controles.
- Confirmar que tooltips nao sao necessarios para valores essenciais.
- Confirmar que cada grafico possui titulo, contexto de periodo e resumo
  textual equivalente.
- Testar mobile, tablet, desktop e texto ampliado em ate 200%.
- Confirmar ausencia de rolagem horizontal obrigatoria.
- Revisar contraste e evitar significado comunicado apenas por cor.

## Quality Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Manual Privacy Review

- Nenhum erro deve exibir SQL, IDs internos, tokens, detalhes de RLS ou
  existencia de recurso inacessivel.
- Nenhum resumo ou legenda deve mencionar dados bloqueados.
- Comparativo nao deve permitir inferir valores individuais do parceiro.
- Logs de desenvolvimento nao devem registrar valores financeiros ou IDs
  sensiveis.
