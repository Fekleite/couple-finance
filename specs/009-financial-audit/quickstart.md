# Quickstart: F10 - Auditoria simples de alteracoes financeiras

## Prerequisites

- Dependencias instaladas com `npm install`.
- Variaveis Supabase locais configuradas conforme features anteriores.
- Banco local com migrations de F02-F09 aplicadas.
- Branch ativa: `010-financial-audit`.

## Development flow

1. Criar migration Supabase para `financial_audit_events`:

   ```bash
   supabase migration new create_financial_audit_events
   ```

2. Implementar na migration:

   - Tabela `public.financial_audit_events`.
   - RLS habilitado.
   - Grants explicitos para `authenticated`.
   - Funcoes privadas de registro com `search_path = ''`.
   - Ajustes nas RPCs de transacoes e metas para registrar eventos atomicos.
   - Indices por `owner_user_id`, `shared_budget_id`, `occurred_at` e `id`.

3. Criar feature frontend:

   ```text
   src/features/audit/
   src/pages/audit-page.tsx
   ```

4. Adicionar rota privada `/app/audit` e entrada de navegacao coerente com o
   layout atual.

## Supabase validation scenarios

### Individual transaction event

1. Autenticar usuario A.
2. Criar transacao individual pela RPC existente.
3. Verificar que um evento `transaction/created/individual` foi criado.
4. Consultar eventos como usuario A e confirmar visibilidade.
5. Consultar como usuario B e confirmar ausencia total do evento.

### Shared transaction event

1. Criar budget compartilhado ativo entre usuarios A e B.
2. Criar transacao compartilhada como A.
3. Consultar auditoria como A e B.
4. Confirmar mesmo evento autorizado, com autoria segura.
5. Encerrar ou inativar o vinculo de B.
6. Confirmar que B nao ve mais o evento compartilhado.

### Goal events

1. Criar meta individual e confirmar evento `goal/created`.
2. Editar meta ativa e confirmar evento `goal/updated`.
3. Concluir meta e confirmar evento `goal/completed`.
4. Arquivar meta e confirmar evento `goal/archived`.
5. Repetir com meta compartilhada e dois membros ativos.

### Atomicity

1. Simular falha na criacao do evento durante mutacao financeira em ambiente de
   teste.
2. Confirmar que a mutacao financeira tambem falha ou que a operacao inteira
   retorna estado seguro sem persistencia parcial.
3. Simular falha da mutacao financeira.
4. Confirmar que nenhum evento orfao foi persistido.

### Privacy and inference

1. Usuario B tenta consultar evento individual de A.
2. Confirmar que listas, estados vazios, erros e contagens nao sugerem o
   evento.
3. Usuario sem vinculo ativo consulta auditoria.
4. Confirmar que somente eventos individuais proprios aparecem.

## Frontend validation scenarios

- Lista com eventos individuais e compartilhados autorizados.
- Estado vazio sem eventos.
- Estado vazio sem vinculo compartilhado ativo.
- Falha temporaria de carregamento com retry.
- Evento com autoria atual: exibe `Voce`.
- Evento compartilhado com autoria de outro membro: exibe rotulo seguro.
- Evento com autoria indisponivel: nao inventa identidade.
- Evento cujo item nao esta mais na lista principal: preserva snapshot seguro.
- Mobile estreito sem rolagem horizontal.
- Navegacao por teclado com foco visivel.
- Texto ampliado ate 200%.

## Required commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:run
npm run build
```

## Manual review checklist

- A linguagem parece transparencia e confianca, nao vigilancia.
- Eventos individuais de outra pessoa nao aparecem nem sao inferiveis.
- Eventos compartilhados desaparecem apos perda de vinculo ativo.
- Cada evento comunica acao, item, autoria, momento e visibilidade por texto.
- Datas e horarios sao compreensiveis.
- Estados de loading, vazio, erro e retry sao seguros.
- Interface funciona em mobile, tablet e desktop.
- Foco visivel e ordem de teclado fazem sentido.
- Nenhuma mensagem revela SQL, RLS, IDs privados ou detalhes internos.
