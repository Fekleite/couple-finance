# Quickstart: F09 - Metas financeiras

## Prerequisites

- Branch ativa: `009-metas-financeiras`.
- Spec em `specs/008-metas-financeiras/spec.md`.
- Supabase local ou remoto configurado conforme features F02-F07.
- Dependencias instaladas com `npm install`.

## Implementation Steps

1. Criar migration `supabase/migrations/<timestamp>_create_financial_goals.sql`.
2. Criar `public.financial_goals` com constraints, trigger `set_updated_at`,
   RLS, grants, indices e funcoes/RPCs de mutacao.
3. Criar `src/features/goals/` com tipos, schemas, progresso, mensagens,
   servico Supabase, estado/hook, lista, formulario, cards e view.
4. Criar `src/pages/goals-page.tsx` e testes.
5. Registrar `PRIVATE_ROUTES.goals` em `src/app/routes.ts` e rota protegida em
   `src/app/router.tsx`.
6. Adicionar entrada de navegacao ou link a partir da area privada sem
   transformar o dashboard em resumo de metas.
7. Cobrir testes de dominio, UI, servico, hook, migration e rotas.

## Supabase Validation

### Positive scenarios

- Pessoa autenticada cria meta individual valida.
- A mesma pessoa lista a meta individual.
- Outra pessoa autenticada nao lista nem acessa a meta individual.
- Pessoa com membership ativa cria meta compartilhada.
- Ambos os membros ativos do mesmo budget listam a meta compartilhada.
- Membro ativo edita nome, valores e prazo de meta ativa autorizada.
- Membro ativo conclui meta autorizada e ela sai da lista ativa.
- Membro ativo arquiva meta autorizada e ela nao aparece misturada com ativas.

### Negative scenarios

- Pessoa sem membership ativa tenta criar meta compartilhada.
- Pessoa removida do budget tenta listar ou mutar meta compartilhada.
- Convite pendente, recusado, cancelado, expirado ou indisponivel nao concede
  acesso.
- Tentativa de alterar `visibility` ou `shared_budget_id` em edicao falha.
- Valor alvo zero ou negativo falha.
- Valor atual negativo falha.
- Nome vazio, com espacos externos ou maior que o limite falha.
- Meta inexistente e meta nao autorizada retornam falha segura equivalente.

## Frontend Validation

- Listagem inicial mostra somente metas autorizadas.
- Estado vazio individual nao sugere metas de outra pessoa.
- Pessoa sem budget ativo ve meta compartilhada indisponivel com mensagem
  segura.
- Formulario associa erros a nome, valor alvo, valor atual, prazo e
  visibilidade.
- Progresso mostra percentual, valor restante e status textual.
- Valor atual igual ao alvo comunica meta atingida.
- Valor atual maior que alvo comunica ultrapassagem.
- Meta sem prazo nao aparece como atrasada.
- Meta com prazo vencido e progresso incompleto usa linguagem neutra.
- Concluir e arquivar pedem confirmacao visual adequada e revalidam a lista.
- Respostas antigas nao substituem dados apos troca de sessao/contexto.

## Accessibility Review

- Navegar por teclado por lista, filtros/abas, formulario, dialogs e acoes.
- Confirmar foco visivel em todos os controles.
- Confirmar labels e mensagens de erro associadas aos campos.
- Confirmar resumo textual de progresso por meta.
- Confirmar que cor, barra ou icone nao sao o unico sinal de progresso, prazo,
  status ou visibilidade.
- Testar mobile, tablet, desktop, texto ampliado ate 200% e alto contraste
  quando disponivel.

## Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Manual Review Checklist

- Fluxo de criar meta individual em ate 2 minutos.
- Fluxo de criar meta compartilhada com budget ativo.
- Bloqueio seguro de meta compartilhada sem budget ativo.
- Edicao recalcula progresso e valor restante.
- Conclusao e arquivamento preservam contexto e removem da lista ativa.
- Revogacao de vinculo compartilhado remove metas compartilhadas na proxima
  atualizacao.
- Mensagens usam portugues brasileiro neutro, motivador e sem julgamento.
- Nenhuma lista, erro, loading, vazio ou resumo infere metas inacessiveis.
