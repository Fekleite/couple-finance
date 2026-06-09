<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- I. Simplicidade e Experiencia do Usuario -> I. Simplicidade, Clareza Visual e Experiencia do Usuario
- II. Transparencia Financeira e Confianca -> II. Transparencia Financeira e Confianca
- III. Mobile-First e Responsividade -> III. Mobile-First e Responsividade
- IV. Acessibilidade como Qualidade Obrigatoria -> IV. Acessibilidade como Qualidade Obrigatoria
- V. Seguranca, Privacidade e Isolamento de Dados -> V. Seguranca, Privacidade e Isolamento de Dados
- VI. Qualidade Tecnica e Manutencao -> VI. Qualidade Tecnica, Testes e Manutencao
- VII. Performance e Clareza de Dados Financeiros -> VII. Performance, Server State e Clareza de Dados Financeiros
Added sections:
- VIII. Evolucao Incremental e Nao Regressao
- IX. Persistencia, Prisma e Camada Server-Side
- Baseline Concluido e Roadmap 2.0
- Criterios Transversais 2.0
Removed sections:
- Nenhuma
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
- ✅ reviewed .specify/extensions/git/commands/*.md
- ✅ reviewed AGENTS.md
- ✅ reviewed docs/FEATURES_2.0.md
- ✅ reviewed docs/CONTEXTO_2.0.md
Follow-up TODOs:
- Nenhum
-->
# Couple Finance Constitution

## Core Principles

### I. Simplicidade, Clareza Visual e Experiencia do Usuario
O produto MUST priorizar simplicidade sobre complexidade em todas as decisoes de
escopo, interface e fluxo. Acoes frequentes, como registrar gastos, visualizar
saldo e acompanhar metas, MUST exigir poucos passos e apresentar feedback visual
imediato. A interface MUST ser limpa, intuitiva, sem excesso visual, e cada
estado vazio, carregamento ou erro MUST orientar o usuario de forma amigavel.
Elementos visuais, textos, cards, badges, graficos ou blocos informativos MUST
existir apenas quando ajudarem diretamente na tomada de decisao financeira,
seguranca, auditoria ou orientacao do usuario.

Rationale: o publico-alvo precisa confiar rapidamente na ferramenta e concluir
tarefas financeiras sem friccao, ruido visual ou ambiguidades.

### II. Transparencia Financeira e Confianca
O produto MUST reforcar confianca entre os membros do casal. Toda informacao
financeira MUST deixar claro se e individual ou compartilhada, quem e o
responsavel quando aplicavel, e qual contexto explica saldos, receitas,
despesas, metas e alteracoes importantes. Informacoes compartilhadas MUST ser
faceis de entender, rastrear e auditar dentro do nivel de detalhe adequado ao
usuario. Comparativos entre pessoas MUST usar linguagem neutra, com foco em
organizacao financeira, nunca julgamento.

Rationale: uma plataforma para financas de casal falha se gerar duvida sobre
responsabilidade, origem dos valores ou visibilidade dos dados.

### III. Mobile-First e Responsividade
A experiencia mobile MUST ser tratada como prioridade real desde a especificacao
ate a implementacao. Nenhuma funcionalidade essencial MAY depender
exclusivamente de desktop. Controles MUST ser adequados para toque, a navegacao
mobile MUST ser simples e direta, e layouts MUST se adaptar com fluidez para
tablet e desktop sem perda de usabilidade ou conteudo essencial. Layouts
autenticados, incluindo sidebar, drawer, bottom navigation ou menu compacto,
MUST preservar orientacao, item ativo, sessao e fluxo rapido de registro.

Rationale: financas pessoais sao registradas e consultadas em momentos curtos,
frequentemente no celular, e o produto precisa funcionar bem nesse contexto.

### IV. Acessibilidade como Qualidade Obrigatoria
O projeto MUST seguir boas praticas compativeis com WCAG. Toda interacao
essencial MUST ser possivel por teclado, o foco visivel MUST estar presente, e
formularios MUST ter labels claros, mensagens de erro compreensiveis e
associacao semantica correta. Tabelas, navegacao autenticada, dialogos, filtros,
graficos e estados de interface MUST expor nomes, cabecalhos, relacoes e
alternativas textuais adequadas. Contraste, hierarquia visual e compatibilidade
com leitores de tela MUST ser criterios de aceite, nao melhorias opcionais.

Rationale: acessibilidade amplia o alcance do produto e reduz ambiguidades em
fluxos financeiros sensiveis.

### V. Seguranca, Privacidade e Isolamento de Dados
Dados financeiros MUST ser tratados como sensiveis. Usuarios MUST acessar apenas
dados com autorizacao explicita, e orcamentos compartilhados MUST ser acessiveis
somente por membros vinculados ao casal. Autenticacao, sessao persistente,
autorizacao, escopo individual/compartilhado e regras de isolamento de dados
MUST ser requisitos fundamentais. Qualquer mudanca que fragilize permissoes,
privacidade, isolamento via backend ou Row Level Security MUST ser considerada
violacao da constituicao. Mensagens, estados, logs e erros MUST NOT revelar ou
permitir inferir dados inacessiveis.

Rationale: confianca no produto depende de seguranca real, nao apenas de
indicacoes visuais na interface.

### VI. Qualidade Tecnica, Testes e Manutencao
O codigo MUST ser modular, escalavel, testavel e manutenivel. Componentes MUST
ser pequenos, reutilizaveis e ter responsabilidades claras. Logica reutilizavel
MUST ser extraida para hooks, servicos, repositories ou modulos apropriados.
Baixo acoplamento, alta coesao, TypeScript em modo estrito e convencoes
consistentes de nomeacao MUST ser padroes obrigatorios: componentes em
PascalCase, hooks em useCamelCase, funcoes em camelCase e constantes em
UPPER_CASE.

Toda nova logica de negocio, permissao, validacao, formatacao, filtro, coluna de
tabela, hook com logica, service, repository ou comportamento condicional
relevante MUST ter testes unitarios proporcionais ao risco. Bugs corrigidos MUST
receber teste de regressao. Pull Requests MUST executar lint, formatacao quando
aplicavel, typecheck, testes e build; falha em qualquer etapa MUST bloquear
merge.

Rationale: a fase 2.0 exige evolucao continua sem regressao nos fluxos ja
entregues, especialmente em regras financeiras e autorizacao.

### VII. Performance, Server State e Clareza de Dados Financeiros
A aplicacao MUST carregar rapidamente e manter interacoes fluidas desde o MVP.
Telas com listas, tabelas, graficos e dashboards MUST evitar trabalho
desnecessario. Lazy loading, code splitting, paginacao, virtualizacao e
memoizacao SHOULD ser usados quando reduzirem custo real sem aumentar
complexidade indevida. O TanStack Query MUST evitar refetch automatico global ao
trocar de janela ou aba, usando `refetchOnWindowFocus: false`, salvo excecao
documentada. Mutacoes financeiras MUST atualizar dados por invalidacao
controlada ou estrategia equivalente e verificavel.

Valores monetarios, datas, categorias, totais, graficos, tabelas e indicadores
MUST ser consistentes em toda a aplicacao. Dashboards e listagens MUST priorizar
clareza sobre densidade de informacao. Lighthouse acima de 90 SHOULD ser meta
de qualidade para a experiencia web quando aplicavel.

Rationale: performance, previsibilidade de server state e consistencia de
representacao afetam diretamente a confianca e a tomada de decisao financeira.

### VIII. Evolucao Incremental e Nao Regressao
As features F00 a F11 constituem o baseline concluido do produto. Novas specs
MUST tratar esse baseline como existente e MUST NOT pedir recriacao de
autenticacao, vinculo de casal, permissoes, transacoes, dashboard, graficos,
metas, auditoria, responsividade ou acessibilidade base sem justificativa
explicita. Toda mudanca MUST declarar quais fluxos existentes reaproveita, quais
fluxos pode afetar e quais testes comprovam equivalencia ou melhoria.

Refatoracoes MUST ter proposito verificavel: clareza, seguranca, testabilidade,
performance, consistencia arquitetural ou reducao de manutencao. Nenhum fluxo
ja desenvolvido MAY ser reescrito sem testes que comprovem nao regressao.

Rationale: o projeto entrou em fase de consolidacao; o valor agora vem de
incrementar sem quebrar a confianca acumulada nas entregas F00-F11.

### IX. Persistencia, Prisma e Camada Server-Side
Prisma MAY ser introduzido como ORM para modelagem, migrations e acesso tipado
ao PostgreSQL, mas MUST ser usado apenas em ambiente backend/server-side. Prisma
MUST NOT ser exposto diretamente no frontend ou em codigo enviado ao navegador.
Qualquer feature que use Prisma MUST definir a camada server-side/API, validar
usuario autenticado, aplicar escopo de casal/usuario, preservar regras de
autorizacao e manter compatibilidade com Supabase Auth, PostgreSQL e RLS quando
aplicavel.

Componentes React MUST NOT conhecer detalhes de persistencia. TanStack Query
MUST consumir hooks ou services claros; services e repositories MUST encapsular
acesso a dados, mapeamentos, erros e regras de permissao testaveis.

Rationale: Prisma fortalece tipagem e evolucao de schema somente se for
introduzido sem enfraquecer isolamento, autorizacao e separacao de camadas.

## Restricoes de Produto, Dados e Tecnologia

O baseline F00-F11 esta concluido e inclui configuracao do app, autenticacao,
convite e vinculo do casal, permissoes e isolamento, categorias, transacoes,
lista e filtros, dashboard, graficos basicos, metas, auditoria simples,
responsividade e acessibilidade base.

A stack padrao do projeto e React, Vite, TypeScript, TailwindCSS, Shadcn/ui,
React Router, React Hook Form, Zod, TanStack Query, TanStack Table, Recharts,
Supabase Authentication/PostgreSQL/RLS e, para a fase 2.0, Prisma apenas quando
houver camada backend/server-side segura. Mudancas de stack MUST justificar o
beneficio para produto, seguranca, manutencao ou performance e MUST registrar
impactos em plano, tarefas e testes.

Dados financeiros MUST usar formatacao consistente para moeda, data, categoria,
responsavel, natureza individual/compartilhada e totalizadores. Toda decisao de
modelagem MUST preservar rastreabilidade, autorizacao e interpretabilidade dos
dados pelo usuario.

## Baseline Concluido e Roadmap 2.0

A versao 2.0 do produto e uma etapa de consolidacao e maturidade. O roadmap
incremental vigente prioriza:

- F17 Pipeline de Pull Request com lint, testes, typecheck e build.
- F18 Politica de testes unitarios para tudo que for criado.
- F15 Configuracao do TanStack Query sem refetch ao trocar de janela ou aba.
- F12 Limpeza visual e remocao de informacoes desnecessarias.
- F13 Layout principal com sidebar de dashboard.
- F14 Tabela de transacoes com TanStack Table.
- F16 Introducao do Prisma como ORM, condicionada a camada server-side segura.
- F19 Revisao da arquitetura de dados e services apos Prisma.
- F20 Consolidacao dos criterios de aceite transversais 2.0.

Cada incremento MUST ser pequeno o suficiente para revisao segura e MUST
preservar os fluxos F00-F11 aplicaveis.

## Criterios Transversais 2.0

Toda spec, plano e tasks de feature incremental MUST declarar:

- qual feature ou fluxo existente sera incrementado;
- quais fluxos F00-F11 podem regredir;
- impacto em UI, dados, permissao, auditoria e estados de interface;
- impacto em TanStack Query, incluindo invalidacoes e excecoes de refetch;
- impacto em Prisma/schema/migrations e necessidade de camada server-side;
- testes unitarios, de componente, integracao ou validacoes automatizadas;
- comportamento mobile e acessibilidade;
- como lint, typecheck, testes e build cobrem a entrega;
- documentacao minima para mudancas arquiteturais ou comportamento global.

## Fluxo de Desenvolvimento e Criterios de Decisao

Toda especificacao, plano e implementacao MUST passar por uma verificacao de
constituicao antes de ser considerada pronta. A verificacao MUST responder:

- A solucao e incremental sobre F00-F11, sem recriar fluxos ja entregues?
- A solucao mantem fluxos simples para tarefas frequentes?
- O usuario sempre sabe se a informacao e individual ou compartilhada?
- A experiencia essencial funciona bem em mobile?
- Interacoes essenciais sao acessiveis por teclado e compreensiveis por leitores
  de tela?
- Autorizacao, isolamento de dados e privacidade foram preservados?
- Prisma, quando usado, permanece somente em backend/server-side seguro?
- TanStack Query evita refetch desnecessario e atualiza dados por invalidacao
  controlada?
- Nova logica, filtros, services, repositories, hooks e componentes relevantes
  possuem testes proporcionais?
- O pipeline de PR executa lint, typecheck, testes e build?
- Listas, tabelas, graficos e dashboards permanecem claros e performaticos?

Quando houver conflito entre criterios, a prioridade MUST ser: seguranca e
privacidade primeiro; preservacao do baseline e nao regressao em seguida;
acessibilidade e clareza financeira depois; simplicidade e experiencia mobile
depois; performance, testabilidade e manutenibilidade como requisitos
continuos; velocidade de entrega e expansao de escopo por ultimo. Qualquer
excecao MUST ser documentada no plano com risco, alternativa rejeitada e
estrategia de mitigacao.

## Governance

Esta constituicao supersede preferencias locais, decisoes ad hoc e praticas que
entrem em conflito com seus principios. Alteracoes futuras MUST incluir motivo,
impacto esperado, arquivos sincronizados e estrategia de migracao quando houver
mudanca em especificacoes, templates ou comportamento de produto.

Versionamento MUST seguir SemVer: MAJOR para remocao ou redefinicao
incompativel de principios; MINOR para novo principio, nova secao ou expansao
material de orientacao; PATCH para esclarecimentos e ajustes editoriais sem
mudanca semantica. Toda feature MUST registrar conformidade na Constitution
Check do plano e refletir principios aplicaveis em specs, tasks e criterios de
aceite. Revisoes de PR MUST bloquear mudancas que violem seguranca, privacidade,
acessibilidade essencial, nao regressao do baseline, pipeline obrigatorio ou
clareza financeira.

**Version**: 1.1.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-06-08
