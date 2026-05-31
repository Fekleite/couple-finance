<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Simplicidade e Experiencia do Usuario
- Template principle 2 -> II. Transparencia Financeira e Confianca
- Template principle 3 -> III. Mobile-First e Responsividade
- Template principle 4 -> IV. Acessibilidade como Qualidade Obrigatoria
- Template principle 5 -> V. Seguranca, Privacidade e Isolamento de Dados
Added sections:
- Restricoes de Produto, Dados e Tecnologia
- Fluxo de Desenvolvimento e Criterios de Decisao
Removed sections:
- Nenhuma
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
- ⚠ pending .specify/templates/commands/*.md (directory not present)
Follow-up TODOs:
- Nenhum
-->
# Couple Finance Constitution

## Core Principles

### I. Simplicidade e Experiencia do Usuario
O produto MUST priorizar simplicidade sobre complexidade em todas as decisoes de
escopo, interface e fluxo. Acoes frequentes, como registrar gastos, visualizar
saldo e acompanhar metas, MUST exigir poucos passos e apresentar feedback visual
imediato. A interface MUST ser limpa, intuitiva, sem excesso visual, e cada
estado vazio, carregamento ou erro MUST orientar o usuario de forma amigavel.
Dados financeiros MUST ser apresentados com clareza, legibilidade e linguagem
facil de interpretar.

Rationale: o publico-alvo precisa confiar rapidamente na ferramenta e concluir
tarefas financeiras sem friccao ou ambiguidades.

### II. Transparencia Financeira e Confianca
O produto MUST reforcar confianca entre os membros do casal. Toda informacao
financeira MUST deixar claro se e individual ou compartilhada, quem e o
responsavel quando aplicavel, e qual contexto explica saldos, receitas, despesas,
metas e alteracoes importantes. Informacoes compartilhadas MUST ser faceis de
entender, rastrear e auditar dentro do nivel de detalhe adequado ao usuario.
Comparativos entre pessoas MUST usar linguagem neutra, com foco em organizacao
financeira, nunca julgamento.

Rationale: uma plataforma para financas de casal falha se gerar duvida sobre
responsabilidade, origem dos valores ou visibilidade dos dados.

### III. Mobile-First e Responsividade
A experiencia mobile MUST ser tratada como prioridade real desde a especificacao
ate a implementacao. Nenhuma funcionalidade essencial do MVP MAY depender
exclusivamente de desktop. Controles MUST ser adequados para toque, a navegacao
mobile MUST ser simples e direta, e layouts MUST se adaptar com fluidez para
tablet e desktop sem perda de usabilidade ou conteudo essencial.

Rationale: financas pessoais sao registradas e consultadas em momentos curtos,
frequentemente no celular, e o MVP precisa funcionar bem nesse contexto.

### IV. Acessibilidade como Qualidade Obrigatoria
O projeto MUST seguir boas praticas compativeis com WCAG. Toda interacao
essencial MUST ser possivel por teclado, o foco visivel MUST estar presente, e
formularios MUST ter labels claros, mensagens de erro compreensiveis e associacao
semantica correta. Contraste, hierarquia visual e compatibilidade com leitores de
tela MUST ser criterios de aceite, nao melhorias opcionais.

Rationale: acessibilidade amplia o alcance do produto e reduz ambiguidades em
fluxos financeiros sensiveis.

### V. Seguranca, Privacidade e Isolamento de Dados
Dados financeiros MUST ser tratados como sensiveis. Usuarios MUST acessar apenas
dados com autorizacao explicita, e orcamentos compartilhados MUST ser acessiveis
somente por membros vinculados ao casal. Autenticacao, sessao persistente,
autorizacao e regras de isolamento de dados MUST ser requisitos fundamentais.
Qualquer mudanca que fragilize permissoes, privacidade, isolamento via backend
ou Row Level Security MUST ser considerada violacao da constituicao.

Rationale: confianca no produto depende de seguranca real, nao apenas de
indicacoes visuais na interface.

### VI. Qualidade Tecnica e Manutencao
O codigo MUST ser modular, escalavel e manutenivel. Componentes MUST ser
pequenos, reutilizaveis e ter responsabilidades claras. Logica reutilizavel MUST
ser extraida para hooks, servicos ou modulos apropriados. Baixo acoplamento,
alta coesao, TypeScript em modo estrito e convencoes consistentes de nomeacao
MUST ser padroes obrigatorios: componentes em PascalCase, hooks em useCamelCase,
funcoes em camelCase e constantes em UPPER_CASE.

Rationale: o produto deve crescer para metas, convites, graficos, categorias e
futuras capacidades sem reescritas desnecessarias.

### VII. Performance e Clareza de Dados Financeiros
A aplicacao MUST carregar rapidamente e manter interacoes fluidas desde o MVP.
Telas com listas, graficos e dashboards MUST evitar trabalho desnecessario.
Lazy loading, code splitting e memoizacao SHOULD ser usados quando reduzirem
custo real sem aumentar complexidade indevida. Valores monetarios, datas,
categorias, totais, graficos e indicadores MUST ser consistentes em toda a
aplicacao. Dashboards MUST priorizar clareza sobre densidade de informacao.
Lighthouse acima de 90 SHOULD ser meta de qualidade para a experiencia web.

Rationale: performance e consistencia de representacao afetam diretamente a
percepcao de confianca e a tomada de decisao financeira.

## Restricoes de Produto, Dados e Tecnologia

O MVP MUST priorizar autenticacao, convite de casal, transacoes, dashboard,
categorias, metas, graficos basicos e responsividade. Funcionalidades futuras,
como integracao bancaria, exportacao PDF, notificacoes, multi-moeda, IA e app
mobile nativo, MUST NOT comprometer simplicidade, seguranca, acessibilidade,
performance ou manutenibilidade do MVP.

A stack padrao do projeto e React, Vite, TypeScript, TailwindCSS, Shadcn/ui,
React Router, React Hook Form, Zod, TanStack Query, Recharts e Supabase
Authentication/PostgreSQL/RLS. Mudancas de stack MUST justificar o beneficio
para produto, seguranca, manutencao ou performance e MUST registrar impactos em
plano, tarefas e testes.

Dados financeiros MUST usar formatacao consistente para moeda, data, categoria,
responsavel, natureza individual/compartilhada e totalizadores. Toda decisao de
modelagem MUST preservar rastreabilidade, autorizacao e interpretabilidade dos
dados pelo usuario.

## Fluxo de Desenvolvimento e Criterios de Decisao

Toda especificacao, plano e implementacao MUST passar por uma verificacao de
constituicao antes de ser considerada pronta. A verificacao MUST responder:

- A solucao mantem fluxos simples para tarefas frequentes?
- O usuario sempre sabe se a informacao e individual ou compartilhada?
- A experiencia essencial funciona bem em mobile?
- Interacoes essenciais sao acessiveis por teclado e compreensiveis por leitores
  de tela?
- Autorizacao, isolamento de dados e privacidade foram preservados?
- A implementacao e modular, tipada, testavel e consistente com a stack?
- Listas, graficos e dashboards permanecem claros e performaticos?

Quando houver conflito entre criterios, a prioridade MUST ser: seguranca e
privacidade primeiro; acessibilidade e clareza financeira em seguida;
simplicidade e experiencia mobile depois; performance e manutenibilidade como
requisitos continuos; velocidade de entrega e expansao de escopo por ultimo.
Qualquer excecao MUST ser documentada no plano com risco, alternativa rejeitada e
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
acessibilidade essencial ou ambiguidade financeira.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
