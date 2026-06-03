# Research: F03 - Modelo de permissoes e isolamento de dados

## Decision: Tratar Supabase PostgreSQL/RLS como autoridade final

**Rationale**: A constituicao exige isolamento real de dados. Helpers de
frontend podem orientar rotulos, acoes e estados, mas qualquer leitura ou
mutacao sensivel deve ser protegida por RLS, constraints e RPCs quando a
operacao envolver mais de uma tabela.

**Alternatives considered**: Autorizar apenas no cliente foi rejeitado porque
nao protege acesso direto pela Data API. Guardar permissoes em `user_metadata`
foi rejeitado porque metadata editavel nao e fonte confiavel de autorizacao.

## Decision: Criar `src/features/permissions` para regras puras

**Rationale**: F01 ja cuida de sessao e F02 ja cuida de vinculo. Uma feature
separada de permissoes permite que F04-F10 usem a mesma matriz sem copiar
condicionais por tela. As funcoes devem ser puras, tipadas e testaveis:
classificar visibilidade, consultar permissoes por estado/acao/tipo de dado e
mapear mensagens seguras.

**Alternatives considered**: Colocar regras em `src/features/couple` foi
rejeitado porque misturaria relacionamento com regras financeiras futuras.
Criar provider global foi rejeitado por enquanto porque a F03 precisa de
contratos e helpers, nao de estado remoto proprio.

## Decision: Usar matriz de permissao com estado, tipo de dado e acao

**Rationale**: A spec exige decisoes testaveis para visualizar, criar,
atualizar, remover, listar, buscar, contar e resumir. A matriz reduz risco de
features futuras tratarem listas, contadores ou filtros de forma diferente da
leitura individual.

**Alternatives considered**: Criar apenas flags soltas como `canViewSharedData`
foi rejeitado porque nao cobre agregacoes, buscas, estados vazios e acoes de
mutacao com granularidade suficiente.

## Decision: Diferenciar escopo de visibilidade de autorizacao final

**Rationale**: O usuario precisa entender se algo e individual, compartilhado
ou indisponivel, mas esse rotulo nao pode ser confundido com permissao de banco.
O escopo de visibilidade orienta UI e mensagens; RLS decide o acesso final no
Supabase.

**Alternatives considered**: Retornar mensagens diretamente de policies/RPCs
foi rejeitado porque pode expor detalhes internos e dificulta consistencia de
linguagem.

## Decision: Fazer hardening incremental da F02 somente se necessario

**Rationale**: F02 ja criou `shared_budgets`, `budget_members`,
`budget_invitations`, RLS, indices e RPCs. A F03 deve revisar essas policies e
funcoes contra a matriz de permissao e adicionar migration incremental apenas
para lacunas reais, como grants, search path, policies de SELECT necessarias
para UPDATE, ou mensagens indiretas derivadas de operacoes.

**Alternatives considered**: Reescrever as migrations de F02 foi rejeitado
porque aumenta risco e mexe em historico ja produzido. Ignorar F02 foi
rejeitado porque F03 depende dela como fonte de relacionamento.

## Decision: Padronizar futuras tabelas financeiras por `user_id` ou `shared_budget_id`

**Rationale**: Dados individuais futuros devem referenciar o dono por
`user_id`; dados compartilhados devem referenciar `shared_budget_id`. Essa
separacao permite policies simples, indices diretos e agregacoes filtradas pelo
mesmo escopo das linhas de origem.

**Alternatives considered**: Uma coluna booleana `is_shared` sem chave de
escopo foi rejeitada porque nao identifica o casal autorizado. Duplicar dados
individuais para o parceiro foi rejeitado porque viola privacidade.

## Decision: Mensagens seguras vencem mensagens especificas

**Rationale**: Para usuarios nao relacionados, recurso inexistente, removido,
indisponivel ou nao autorizado deve parecer indisponivel sem confirmar
existencia. Mensagens especificas so podem aparecer quando o usuario ja esta
autorizado a conhecer o contexto.

**Alternatives considered**: Mostrar erro detalhado do Supabase foi rejeitado
por privacidade e UX. Confirmar "nao autorizado" para qualquer URL foi
rejeitado porque pode revelar existencia de recurso privado.

## Decision: Nao usar TanStack Query nesta F03

**Rationale**: A feature define contratos e helpers puros, sem listas remotas
complexas. A F02 ja usa hooks proprios para relacionamento. TanStack Query fica
reservado para listas, dashboards e consultas financeiras com cache real.

**Alternatives considered**: Introduzir cache agora foi rejeitado porque pode
mostrar permissao antiga apos mudanca de sessao ou relacionamento sem ganho
proporcional.

## Decision: Validar vazamento indireto explicitamente

**Rationale**: A spec exige que listas, filtros, buscas, contadores, resumos,
graficos e estados vazios considerem somente dados permitidos. Mesmo antes de
existirem tabelas financeiras, contratos e testes de matriz devem cobrir essas
operacoes para orientar F04-F10.

**Alternatives considered**: Validar apenas leitura de linhas individuais foi
rejeitado porque nao cobre vazamentos por agregacao ou ausencia de dados.
