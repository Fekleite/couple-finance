# Research: F10 - Auditoria simples de alteracoes financeiras

## Decision: Criar rota privada propria em `/app/audit`

**Rationale**: Auditoria tem jornada propria de consulta recente e nao deve
competir com dashboard, lista de transacoes ou metas. Uma rota dedicada oferece
ponto de entrada claro, reduz densidade em telas existentes e preserva espaco
mobile para eventos escaneaveis.

**Alternatives considered**: Embutir auditoria no dashboard foi rejeitado por
adicionar peso a uma tela de resumo. Colocar auditoria dentro de transacoes e
metas foi rejeitado porque a feature cruza os dois dominios.

## Decision: Criar `src/features/audit`

**Rationale**: Auditoria possui tipos, mensagens, servico, hook, componentes e
regras de apresentacao especificas. A pasta dedicada evita misturar rastreio de
eventos com mutacoes de transacoes ou metas, mantendo pagina de rota fina.

**Alternatives considered**: Colocar componentes em `transactions` e `goals` foi
rejeitado por duplicar logica de evento. Colocar em `dashboard` foi rejeitado
por acoplar consulta sensivel a uma tela agregada.

## Decision: Criar tabela `public.financial_audit_events`

**Rationale**: Eventos precisam sobreviver a arquivamento, conclusao ou remocao
do item principal, com snapshot seguro e autorizacao propria. Uma tabela
dedicada permite RLS, constraints, grants e indices por escopo/momento.

**Alternatives considered**: Armazenar eventos em JSON dentro de transacoes ou
metas foi rejeitado por dificultar consulta cruzada e RLS. Logs tecnicos foram
rejeitados porque nao sao produto, nao possuem RLS adequada e exporiam detalhes
indevidos.

## Decision: Usar consulta direta sob RLS para listagem recente

**Rationale**: A listagem recente e simples: selecionar eventos autorizados,
ordenar por `occurred_at desc, id desc` e limitar a 50. RLS em
`financial_audit_events` impede vazamento mesmo se filtros de frontend falharem.

**Alternatives considered**: RPC exclusiva para leitura foi rejeitada por
complexidade desnecessaria no MVP. View foi considerada, mas fica opcional
porque views exigem cuidado adicional com `security_invoker` para preservar RLS.

## Decision: Registrar eventos por funcoes SQL chamadas dentro das RPCs de mutacao

**Rationale**: As transacoes ja sao criadas por RPC e metas sao criadas,
editadas, concluidas e arquivadas por RPCs. Chamar uma funcao privada
`private.record_financial_audit_event` dentro dessas mutacoes garante
atomicidade: mutacao financeira e evento confirmam ou falham juntos.

**Alternatives considered**: Triggers genericas foram rejeitadas porque teriam
dificuldade para distinguir campos relevantes, linguagem de snapshot e autoria
segura. Registro pelo frontend foi rejeitado por nao ser atomico e por permitir
eventos faltantes.

## Decision: Ajustar a F10 somente para acoes existentes

**Rationale**: Transacoes possuem criacao no MVP e podem ter edicao/remocao
somente se ja existirem no momento da implementacao. Metas possuem criacao,
edicao, conclusao e arquivamento. A auditoria deve registrar esses eventos sem
criar novos fluxos financeiros.

**Alternatives considered**: Implementar exclusao ou arquivamento de transacoes
para auditar foi rejeitado por ampliar escopo. Auditar interacoes canceladas foi
rejeitado pela especificacao.

## Decision: Persistir snapshot seguro em colunas tipadas

**Rationale**: O evento precisa explicar o item mesmo quando ele sair da lista
principal. Campos como `subject_label`, `subject_amount_cents`,
`subject_date`, `subject_status` e `summary_key` permitem renderizacao segura,
testavel e sem JSON arbitrario.

**Alternatives considered**: Snapshot JSON livre foi rejeitado por dificultar
constraints e auditoria de privacidade. Consultar sempre o item original foi
rejeitado porque o item pode nao estar mais acessivel ou visivel.

## Decision: Usar escopo explicito individual ou compartilhado no evento

**Rationale**: `visibility`, `owner_user_id` e `shared_budget_id` permitem RLS
direta e evitam inferencia por join com itens que podem mudar. Eventos
individuais exigem `owner_user_id`; eventos compartilhados exigem
`shared_budget_id` ativo para leitura.

**Alternatives considered**: Derivar autorizacao sempre do item original foi
rejeitado por fragilidade quando o item e arquivado/removido. Usar apenas
`actor_user_id` foi rejeitado porque autoria nao define acesso.

## Decision: Autoria usa referencia ao usuario e rotulo seguro derivado no frontend

**Rationale**: `actor_user_id` registra quem realizou a acao. A interface exibe
`Voce`, `Pessoa parceira` ou `Autoria indisponivel` conforme contexto
autorizado, sem depender de perfis ou e-mails.

**Alternatives considered**: Persistir e-mail ou nome vindo do cliente foi
rejeitado por privacidade e confiabilidade. Inventar nomes foi rejeitado por
ambiguidade.

## Decision: Usar `timestamptz` para o momento do evento

**Rationale**: Auditoria registra um instante, nao uma data civil. `occurred_at`
usa `timestamptz default now()` e o frontend formata de modo consistente para a
pessoa, com texto claro e sem ambiguidade.

**Alternatives considered**: `date` foi rejeitado por perder horario.
Timestamp enviado pelo cliente foi rejeitado por nao ser confiavel.

## Decision: Eventos de edicao registram resumo simples, nao diff completo

**Rationale**: A especificacao exige comunicar edicoes de forma compreensivel,
mas nao campo a campo. `summary_key` e snapshot atual autorizado bastam para
dizer que a transacao ou meta foi atualizada sem expor historico privado.

**Alternatives considered**: Persistir antes/depois de todos os campos foi
rejeitado por risco de vazamento, complexidade de UX e custo de testes.

## Decision: Grants explicitos e RLS habilitado na tabela de auditoria

**Rationale**: Em Supabase, tabelas no schema `public` precisam de RLS e grants
intencionais. A migration revoga privilegios padrao, concede apenas `SELECT`
para `authenticated` na tabela e `EXECUTE` apenas nas funcoes publicas
necessarias. Funcoes privadas fixam `search_path = ''`.

**Alternatives considered**: Depender de grants implicitos foi rejeitado por
variar com configuracao da Data API. `service_role` foi rejeitado para o fluxo
da aplicacao.

## Decision: Sem nova dependencia npm

**Rationale**: A F10 e uma lista textual com formatação simples. React, Lucide,
helpers existentes, Supabase client, Vitest e Testing Library bastam.

**Alternatives considered**: TanStack Query, virtualizacao, bibliotecas de data,
diff viewer e realtime foram rejeitados por complexidade sem necessidade real.

## Decision: Somente a requisicao mais recente atualiza a interface

**Rationale**: `useAuditEvents` deve descartar respostas antigas, limpar dados
ao trocar sessao ou contexto compartilhado e revalidar apos mutacoes auditadas.
Isso evita manter eventos compartilhados revogados em memoria de apresentacao.

**Alternatives considered**: Cache persistente foi rejeitado por privacidade.
Realtime foi rejeitado por estar fora do escopo e aumentar superficie de
autorizacao.

## Decision: Estados vazios e erros sao privados por padrao

**Rationale**: Mensagens nao diferenciam "sem eventos" de eventos inacessiveis.
Falhas temporarias oferecem retry sem expor SQL, RLS, IDs ou detalhes internos.

**Alternatives considered**: Mensagens especificas para nao autorizado,
inexistente ou removido foram rejeitadas por risco de inferencia.
