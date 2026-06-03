# Research: F02 - Convite e vinculo do casal

## Decision: Usar Supabase PostgreSQL com RLS para o vinculo de casal

**Rationale**: A F02 introduz dados de negocio reais: orcamentos
compartilhados, membros e convites. A constituicao exige isolamento via backend
e Row Level Security para dados sensiveis. Supabase recomenda habilitar RLS em
tabelas de schema exposto e usar policies por role, com `auth.uid()` como base
de identidade autenticada.

**Alternatives considered**: Guardar relacionamento apenas em estado local ou
metadata do usuario foi rejeitado porque nao cria isolamento persistente nem
constraints confiaveis. Usar somente validacao frontend foi rejeitado porque
nao protege acesso direto pela Data API.

**Sources checked**:

- Supabase RLS docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase product security index: https://supabase.com/docs/guides/security/product-security

## Decision: Criar tres tabelas persistentes

**Rationale**: `shared_budgets` representa o espaco compartilhado vazio;
`budget_members` representa quem pertence ao espaco e com qual papel minimo;
`budget_invitations` representa consentimento pendente ou resolvido. Essa
separacao permite consultas simples, futuras F03/F05/F09 apontando para
`shared_budget_id`, e constraints especificas para vinculo unico.

**Alternatives considered**: Uma tabela unica de casal foi rejeitada porque
misturaria ciclo de vida de convite, membro e orcamento. Criar tabelas
financeiras futuras agora foi rejeitado por escopo.

## Decision: Normalizar e-mail convidado em coluna propria

**Rationale**: O convite precisa ser enderecado a uma pessoa que talvez ainda
nao tenha conta. Guardar `invitee_email_normalized` em lowercase/trim permite
comparar com `auth.users.email`, bloquear auto-convite e consultar convites
recebidos sem depender de um `invitee_user_id` existente.

**Alternatives considered**: Guardar somente `invitee_user_id` foi rejeitado
porque quebra o caso de pessoa sem conta. Usar e-mail cru para autorizacao foi
rejeitado por risco de caixa, espacos e inconsistencia.

## Decision: Criar RPC transacional para aceitar convite

**Rationale**: Aceite precisa verificar convite pendente, expiracao,
destinatario, inexistencia de outro membro ativo para o usuario, limite de dois
membros ativos e atualizacao do convite para `accepted`. Uma funcao Postgres
transacional reduz corrida e garante resultado unico com constraints. Por
padrao, funcoes devem usar `security invoker`; se for necessario
`security definer`, o plano de implementacao deve definir `set search_path = ''`,
referenciar schemas explicitamente e revogar execucao de roles indevidas.

**Alternatives considered**: Executar inserts/updates separados pelo frontend
foi rejeitado porque abre janela de corrida e estados contraditorios.

**Sources checked**:

- Supabase database functions: https://supabase.com/docs/guides/database/functions
- Supabase security definer troubleshooting: https://supabase.com/docs/guides/troubleshooting/do-i-need-to-expose-security-definer-functions-in-row-level-security-policies-iI0uOw

## Decision: Criar funcoes/RPC tambem para criar convite, recusar e cancelar se RLS ficar complexa

**Rationale**: A criacao do espaco mais convite deve ser consistente: criar
orcamento, criar membro criador e criar convite pendente. Recusa e cancelamento
precisam ser idempotentes e restritos ao destinatario ou remetente. O plano
permite usar operacoes diretas quando policies forem simples, mas recomenda
RPCs transacionais quando a consistencia depender de multiplas tabelas.

**Alternatives considered**: Forcar todas as mutacoes como operacoes diretas foi
rejeitado para o aceite. Forcar Edge Functions foi rejeitado porque nao ha
necessidade externa ou baixa latencia global nesta F02.

## Decision: Nao implementar envio real de e-mail nesta etapa

**Rationale**: A especificacao foca o ciclo de vida do convite e diz que a
entrega por e-mail e esperada, mas nao detalha provedor. Para manter escopo,
a F02 registra convite e permite link/rota testavel para quem recebeu. O plano
deve documentar o ponto de extensao para entrega transacional futura sem
prometer envio real.

**Implementation note**: A implementacao registra `budget_invitations` e expoe
o fluxo por `/app/invites/:invitationId`. A entrega real de e-mail deve ser
adicionada futuramente em ponto separado, preferencialmente por backend/Edge
Function com segredo fora do cliente, sem alterar a regra de autorizacao por
RLS/RPC.

**Alternatives considered**: Integrar servico externo de e-mail agora foi
rejeitado por ampliar superficie de seguranca, variaveis secretas e testes.
Supabase Edge Function foi rejeitada pelo mesmo motivo enquanto nao houver
provedor definido.

## Decision: Evitar TanStack Query na F02 inicial

**Rationale**: A feature precisa de poucas leituras/mutacoes, e a F01 ja usa
provider/hook local para sessao. Hooks proprios com estado explicito conseguem
cobrir loading, erro, sucesso e refetch sem nova dependencia operacional.
TanStack Query fica reservado para listas e dashboards futuros.

**Alternatives considered**: Introduzir TanStack Query agora foi rejeitado
porque aumentaria a complexidade antes de haver volume de consultas ou cache
compartilhado suficiente.

## Decision: RLS com policies por role e indices nas colunas de policy

**Rationale**: Supabase recomenda `to authenticated`, uso de `(select auth.uid())`
em policies e indices nas colunas usadas por policies. A F02 deve indexar
`user_id`, `shared_budget_id`, `inviter_user_id`, `invitee_email_normalized`,
`status` e `expires_at` conforme consultas e policies.

**Alternatives considered**: Policies sem `to authenticated` ou sem indices
foram rejeitadas por custo desnecessario e maior risco de acesso anonimo.

## Decision: Mensagens seguras e estado indisponivel unificado

**Rationale**: Convites inexistentes, expirados, cancelados, recusados, aceitos
ou nao relacionados ao usuario devem explicar indisponibilidade sem revelar
dados financeiros, conta de terceiro ou detalhes internos de RLS. A UI pode
diferenciar casos autorizados, como remetente vendo convite cancelado, mas nao
deve dar detalhes a usuarios nao relacionados.

**Alternatives considered**: Mostrar mensagens tecnicas do Supabase foi
rejeitado por privacidade e UX. Mostrar dados do remetente para qualquer pessoa
com link foi rejeitado por autorizacao.

## Decision: Atualizar `/app` como central de estado do vinculo

**Rationale**: A F01 criou `/app` como area privada minima. A F02 deve evoluir
essa tela para resolver o estado de relacionamento e apresentar a acao certa,
preservando ProtectedRoute e AuthenticatedLayout. Uma rota publica/privada de
convite pode existir para links, mas detalhes so aparecem apos autenticacao e
autorizacao.

**Alternatives considered**: Criar dashboard financeiro inicial foi rejeitado
por escopo. Criar muitas rotas privadas separadas foi rejeitado por aumentar a
navegacao antes de haver features financeiras.
