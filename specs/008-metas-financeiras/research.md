# Research: F09 - Metas financeiras

## Decision: Criar rota privada propria em `/app/goals`

**Rationale**: Metas possuem ciclo de vida, formulario e acoes de mutacao. Uma
rota propria reduz densidade no dashboard, preserva foco mobile-first e permite
URL estavel para consultar, criar e revisar objetivos. O dashboard pode oferecer
um link para metas, mas nao deve incorporar resumo ou graficos nesta feature.

**Alternatives considered**: Embutir metas em `/app` foi rejeitado por competir
com dashboard, convite e acoes financeiras. Criar rotas detalhadas por meta foi
rejeitado para o MVP porque lista e formulario modal/drawer resolvem as jornadas
principais sem ampliar superficie de navegacao.

## Decision: Criar `src/features/goals`

**Rationale**: Metas sao um dominio proprio, diferente de transacoes e
dashboard. A pasta dedicada organiza tipos, schemas, servicos, progresso,
mensagens, estado, hook, lista, formulario e componentes de apresentacao. A
pagina de rota permanece fina e pode importar somente `GoalView` e `useGoals`.

**Alternatives considered**: Colocar metas em `src/features/dashboard` foi
rejeitado por acoplar mutacoes a uma experiencia de leitura. Colocar em
`transactions` foi rejeitado porque progresso de metas nao deriva de transacoes
nesta feature.

## Decision: Criar tabela `public.financial_goals`

**Rationale**: Metas precisam persistir nome, valores, prazo, status e
visibilidade independentemente de transacoes. A tabela permite RLS direta,
constraints simples e indices previsiveis por proprietario, espaco
compartilhado, status e atualizacao.

**Alternatives considered**: Reutilizar `financial_transactions` foi rejeitado
porque metas nao sao movimentacoes financeiras. Armazenar metas em JSON de
perfil foi rejeitado por dificultar RLS, constraints, ordenacao e auditoria
futura.

## Decision: Usar valores em centavos inteiros e prazo `date`

**Rationale**: O projeto ja usa `amount_cents` para dinheiro. Metas usam
`target_amount_cents` e `current_amount_cents` como `bigint`, evitando floats.
`deadline_date` e `date` opcional, preservando data civil sem timezone.

**Alternatives considered**: `numeric` decimal foi rejeitado por divergir dos
helpers atuais. `timestamptz` para prazo foi rejeitado por risco de deslocar a
data exibida.

## Decision: Permitir metas sem prazo com `deadline_date null`

**Rationale**: A especificacao assume metas sem prazo permitidas. `null`
representa ausencia explicita de prazo e a interface comunica "sem prazo" sem
confundir com atraso. A ordenacao coloca metas com prazo primeiro e metas sem
prazo depois, mantendo atualizacao como desempate.

**Alternatives considered**: Tornar prazo obrigatorio foi rejeitado porque
criaria friccao para objetivos continuos. Usar uma data sentinela foi rejeitado
por ambiguidade e risco de bugs.

## Decision: Status fechado `active`, `completed`, `archived`

**Rationale**: Os tres estados cobrem o MVP: acompanhar, reconhecer conclusao e
retirar da lista ativa sem excluir. Metas concluidas e arquivadas preservam
contexto e ficam acessiveis em filtro/aba simples separada das ativas.

**Alternatives considered**: Excluir definitivamente foi rejeitado por risco de
perda acidental. Status adicionais como `paused` ou `overdue` foram rejeitados
porque atraso e atingimento sao derivados de valores e prazo, nao lifecycle.

## Decision: Bloquear mudanca de visibilidade no MVP

**Rationale**: Converter individual para compartilhada pode expor historico
privado; converter compartilhada para individual pode remover contexto do outro
membro. Para reduzir risco, a visibilidade fica imutavel apos criacao. A pessoa
pode arquivar uma meta e criar outra com a visibilidade correta.

**Alternatives considered**: Permitir conversao com confirmacao foi rejeitado
por aumentar complexidade de UX, autorizacao e testes. Permitir somente shared
para individual foi rejeitado por perda de contexto compartilhado.

## Decision: Permitir nomes duplicados dentro do escopo

**Rationale**: Nomes duplicados como "Viagem" ou "Reserva" sao plausiveis e
nao violam privacidade. O sistema valida tamanho e normalizacao, mas nao bloqueia
duplicidade; prazo, visibilidade e valores ajudam a distinguir metas.

**Alternatives considered**: Unique por proprietario ou espaco foi rejeitado
por gerar friccao e mensagens que nao agregam valor financeiro ao MVP.

## Decision: Consultas diretas sob RLS para listagem e RPCs para mutacoes

**Rationale**: Listagem de metas autorizadas e simples e pode usar `select` em
`financial_goals` com RLS. Mutacoes precisam normalizar campos, derivar
`created_by_user_id` de `auth.uid()`, validar membership ativa para metas
compartilhadas, impedir mudanca de visibilidade e aplicar transicoes seguras;
RPCs finas concentram essas regras no banco.

**Alternatives considered**: RPC unica para tudo foi rejeitada por excesso para
leitura simples. Inserts/updates diretos pelo cliente foram rejeitados porque
espalhariam validacoes sensiveis e transicoes de status.

## Decision: RLS como barreira final de leitura e escrita

**Rationale**: Metas individuais usam `created_by_user_id = auth.uid()`. Metas
compartilhadas exigem `shared_budget_id` com membership ativa em
`budget_members`. Policies de `select` e `update` espelham essa regra; as RPCs
tambem verificam o contexto para retornar falhas seguras.

**Alternatives considered**: Filtrar metas no frontend foi rejeitado por
fragilizar isolamento. `service_role` ou `security definer` sem checks foram
rejeitados por ampliar privilegios.

## Decision: Usar `security definer` privado e wrapper publico `security invoker`

**Rationale**: O padrao ja existe em transacoes: funcoes privadas executam a
mutacao com validacoes explicitas, wrappers publicos expostos a authenticated
mantem superficie pequena. As funcoes fixam `search_path = ''`, usam SQL
estatico e retornam a linha autorizada.

**Alternatives considered**: Policies de insert/update diretas foram rejeitadas
porque nao expressam bem idempotencia, normalizacao e codigos de erro seguros.

## Decision: Reutilizar React Hook Form e Zod

**Rationale**: As dependencias ja estao instaladas e sao usadas em transacoes e
convites. Zod valida nome, dinheiro convertido para centavos, data civil,
visibilidade e status; React Hook Form preserva formularios acessiveis com
mensagens associadas.

**Alternatives considered**: Validacao manual foi rejeitada por duplicar
padroes existentes. Adicionar outra biblioteca foi rejeitado por custo sem
beneficio.

## Decision: Reutilizar helpers de dinheiro e data civil de transacoes

**Rationale**: `parsePtBrCurrencyToCents`, `formatCurrencyFromCents` e
`formatCivilDate` mantem consistencia entre transacoes, dashboard e metas. O
limite monetario segue `MAX_TRANSACTION_AMOUNT_CENTS` salvo se a migration
definir constante equivalente para metas.

**Alternatives considered**: Criar formatadores especificos de metas foi
rejeitado por risco de divergencia visual e de arredondamento.

## Decision: Calcular progresso no dominio frontend e validar invariantes no banco

**Rationale**: O banco persiste valores exatos e constraints; o frontend deriva
percentual, valor restante, valor ultrapassado e estado de prazo para
apresentacao. Essa logica e pura, testavel e nao exige campos persistidos
redundantes.

**Alternatives considered**: Persistir percentual foi rejeitado por
desnormalizacao. Calcular apenas no SQL foi rejeitado por dificultar testes de
apresentacao e mensagens.

## Decision: Exibir progresso acima de 100% como ultrapassado

**Rationale**: O percentual real pode passar de 100%, mas a barra visual fica
limitada a 100% e o texto informa o excedente. Assim a leitura nao quebra layout
e nao esconde que a meta foi ultrapassada.

**Alternatives considered**: Truncar tudo em 100% foi rejeitado por perda de
informacao. Deixar barra extrapolar foi rejeitado por responsividade.

## Decision: Somente a requisicao atual atualiza a interface

**Rationale**: `useGoals` usa identificador monotono e limpa dados ao trocar
sessao ou contexto de relacionamento. Apos criar, editar, concluir ou arquivar,
o hook revalida a lista autorizada e descarta respostas antigas.

**Alternatives considered**: Manter dados antigos durante revalidacao foi
rejeitado quando contexto compartilhado muda, pois poderia preservar dados
revogados. Realtime foi rejeitado por estar fora do escopo.

## Decision: Sem cache persistente ou estado global

**Rationale**: A rota de metas possui superficie pequena e dados sensiveis. O
estado local do hook basta e evita risco de reter metas compartilhadas apos
logout ou revogacao de vinculo.

**Alternatives considered**: TanStack Query foi rejeitado porque nao esta
instalado e exigiria politica de cache por sessao. LocalStorage foi rejeitado
por privacidade.

## Decision: Indices parciais por escopo e status

**Rationale**: A listagem principal filtra metas individuais por
`created_by_user_id` e compartilhadas por `shared_budget_id`, geralmente com
status ativo. Indices parciais para status ativo e indices gerais por
atualizacao sustentam listas e filtros simples sem penalizar mutacoes com
combinacoes excessivas.

**Alternatives considered**: Indices para cada campo isolado foram rejeitados
por redundancia. Snapshot de metas ativas foi rejeitado por complexidade.

## Decision: Estados vazios privados por padrao

**Rationale**: A interface diferencia "voce ainda nao tem metas" e "para metas
compartilhadas, crie um espaco compartilhado ativo" sem sugerir existencia de
metas inacessiveis. Erros usam mensagens genericas e acao de retry.

**Alternatives considered**: Mensagens detalhadas por nao autorizado versus nao
encontrado foram rejeitadas por risco de inferencia.
