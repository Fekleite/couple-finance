# CONTEXTO 2.0 — Incremental pós-MVP inicial

**Data**: 2026-06-08  
**Projeto**: Plataforma Web de Controle Financeiro para Casais  
**Versão**: 2.0  
**Premissa central**: as features **F00 a F11 já foram desenvolvidas**. Este contexto descreve o estado evolutivo do projeto e orienta os próximos incrementos.

---

# 1. Visão geral atualizada

A aplicação é uma plataforma web de controle financeiro para casais, com foco em organização compartilhada, transparência, simplicidade, segurança e experiência mobile-first.

A versão atual já contempla a fundação inicial do produto:

- autenticação;
- sessão persistente;
- vínculo de casal;
- permissões e isolamento de dados;
- categorias financeiras;
- transações;
- lista e filtros;
- dashboard;
- gráficos básicos;
- metas;
- auditoria simples;
- responsividade e acessibilidade base.

A partir da versão 2.0, o projeto entra em uma fase de **incrementos sobre uma base existente**, não de criação do zero.

---

# 2. Direção da versão 2.0

A versão 2.0 deve consolidar o produto, reduzir ruídos e fortalecer a engenharia.

Os principais objetivos são:

- remover informações visuais desnecessárias;
- transformar o menu principal em uma sidebar de dashboard;
- evoluir a listagem de transações para uma tabela com TanStack Table;
- evitar refetch automático do TanStack Query ao trocar de aba ou janela;
- introduzir Prisma como ORM de forma segura;
- criar pipeline de Pull Request com lint, testes, typecheck e build;
- garantir testes unitários para tudo que for criado;
- preservar os fluxos já desenvolvidos nas features F00–F11.

---

# 3. Estado funcional assumido

## 3.1 Produto

O sistema já permite que usuários/casais:

- criem e acessem contas;
- mantenham sessão autenticada;
- criem ou aceitem vínculo de casal;
- registrem receitas e despesas;
- filtrem transações;
- acompanhem dashboard financeiro;
- visualizem gráficos básicos;
- criem metas financeiras;
- tenham algum nível de auditoria/rastreabilidade;
- usem a aplicação em telas pequenas com acessibilidade base.

## 3.2 Engenharia

O projeto já possui ou deve ser tratado como possuindo:

- React;
- Vite;
- TypeScript;
- TailwindCSS;
- Shadcn/ui;
- React Router;
- React Hook Form;
- Zod;
- TanStack Query;
- Recharts;
- Supabase Auth/PostgreSQL;
- estrutura feature-based;
- padrões iniciais de responsividade e acessibilidade.

---

# 4. Stack tecnológica alvo 2.0

## 4.1 Frontend

- React.
- Vite.
- TypeScript em modo estrito.
- TailwindCSS.
- Shadcn/ui.
- React Router.
- React Hook Form.
- Zod.
- TanStack Query.
- TanStack Table.
- Recharts.

## 4.2 Backend, dados e autenticação

- Supabase Auth para identidade e sessão, salvo decisão futura explícita em contrário.
- PostgreSQL como banco relacional.
- Prisma como ORM para modelagem, migrações e acesso tipado ao banco.
- Camada server-side/API para qualquer operação que use Prisma.
- Services/repositories para encapsular acesso a dados.

## 4.3 Qualidade

- ESLint.
- Prettier.
- Typecheck.
- Testes unitários.
- Pipeline de Pull Request.
- Build obrigatório antes de merge.
- Husky/lint-staged se já estiverem presentes ou forem úteis ao fluxo local.

---

# 5. Arquitetura alvo

## 5.1 Princípio geral

A arquitetura deve continuar feature-based, mas com separação mais explícita entre:

- interface;
- hooks;
- validações;
- regras de domínio;
- queries/mutations;
- services;
- repositories;
- persistência;
- permissões.

## 5.2 Estrutura recomendada

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── feedback/
│   ├── layout/
│   └── data-display/
├── features/
│   ├── auth/
│   ├── couples/
│   ├── dashboard/
│   ├── transactions/
│   ├── categories/
│   ├── goals/
│   ├── permissions/
│   └── settings/
├── hooks/
├── lib/
│   ├── query/
│   ├── prisma/
│   ├── supabase/
│   └── utils/
├── server/
│   ├── repositories/
│   ├── services/
│   └── routes/
├── store/
├── types/
└── styles/
```

A pasta `server/` só deve existir se a arquitetura do projeto suportar execução server-side. Se o projeto continuar estritamente SPA estática, será necessário definir uma camada backend antes de usar Prisma.

---

# 6. Diretrizes para incrementos sobre F00–F11

## 6.1 Não recriar o que já existe

As features iniciais devem ser tratadas como entregues. Specs futuras não devem pedir:

- recriação da autenticação;
- recriação do dashboard inicial;
- recriação do cadastro de transações;
- recriação do vínculo de casal;
- recriação do modelo de permissões;
- recriação das metas financeiras.

Mudanças nessas áreas devem ser descritas como ajustes incrementais, refatorações ou melhorias.

## 6.2 Preservar contratos existentes

Antes de alterar componentes ou dados existentes, identificar:

- rotas afetadas;
- tipos afetados;
- hooks afetados;
- queries/mutations afetadas;
- regras de permissão afetadas;
- testes existentes que precisam continuar passando.

## 6.3 Testar regressões

Sempre que uma feature alterar comportamento já existente, deve incluir teste de regressão.

---

# 7. UX e interface 2.0

## 7.1 Clareza acima de decoração

A interface deve evitar elementos que apenas ocupam espaço ou criam aparência de dashboard sem utilidade real.

Devem ser removidos ou consolidados:

- cards duplicados;
- textos explicativos permanentes sem função;
- métricas que não orientam decisão;
- ícones decorativos em excesso;
- gráficos sem leitura acionável;
- badges redundantes;
- blocos informativos que repetem dados da própria tela.

## 7.2 Sidebar como navegação principal

A área autenticada deve usar menu lateral no padrão dashboard.

A sidebar deve:

- exibir rotas principais;
- indicar item ativo;
- ser acessível por teclado;
- funcionar bem em desktop;
- adaptar-se em mobile;
- não prejudicar o fluxo de registro rápido de transações.

## 7.3 Transações como tabela

A listagem de transações deve usar TanStack Table.

A tabela deve ser adequada para:

- filtros;
- ordenação;
- ações por linha;
- leitura clara de valores;
- distinção entre receita e despesa;
- responsável;
- categoria;
- data;
- visibilidade individual/compartilhada.

Em mobile, a tabela pode se adaptar para layout responsivo ou visualização compacta, desde que use a mesma lógica de dados e preserve acessibilidade.

---

# 8. TanStack Query 2.0

## 8.1 Comportamento global

O Query Client deve ser configurado para não fazer refetch automático ao trocar de janela ou aba:

```ts
refetchOnWindowFocus: false
```

## 8.2 Invalidação controlada

Atualizações de dados devem ocorrer por invalidação explícita após ações como:

- criar transação;
- editar transação;
- excluir transação;
- criar meta;
- atualizar meta;
- aceitar convite;
- alterar dados financeiros relevantes.

## 8.3 Exceções

Qualquer query que precise sobrescrever `refetchOnWindowFocus` deve justificar o motivo no código ou documentação técnica.

---

# 9. Prisma e camada de dados

## 9.1 Papel do Prisma

Prisma deve ser usado como ORM para:

- modelagem do schema;
- migrations;
- acesso tipado ao PostgreSQL;
- padronização da camada de persistência;
- evolução segura do modelo de dados.

## 9.2 Restrições importantes

Prisma não deve ser usado diretamente no frontend.

O projeto precisa de uma camada backend/server-side para:

- receber usuário autenticado;
- validar sessão;
- validar permissões;
- executar operações com Prisma;
- retornar dados seguros para o frontend.

## 9.3 Relação com Supabase

Supabase pode continuar responsável por:

- autenticação;
- sessão;
- PostgreSQL;
- políticas de segurança no banco, quando aplicável.

Prisma deve complementar a modelagem e acesso a dados, não enfraquecer o isolamento de segurança já desenvolvido.

## 9.4 Entidades principais

O schema deve refletir, no mínimo:

- usuários/perfis;
- casais/orçamentos;
- membros do casal;
- convites;
- transações;
- categorias, se customização existir ou for planejada;
- metas;
- auditoria/eventos financeiros.

---

# 10. Qualidade e pipeline

## 10.1 Pull Request obrigatório

Todo Pull Request deve executar validações automáticas.

Validações mínimas:

- instalação de dependências;
- lint;
- typecheck;
- testes unitários;
- build.

## 10.2 Critério de merge

Não deve haver merge quando:

- lint falhar;
- typecheck falhar;
- testes falharem;
- build falhar;
- nova lógica for adicionada sem testes proporcionais.

## 10.3 Scripts esperados

O projeto deve possuir scripts claros, por exemplo:

```json
{
  "lint": "...",
  "typecheck": "...",
  "test": "...",
  "build": "..."
}
```

Os nomes finais devem seguir o padrão real do repositório.

---

# 11. Política de testes 2.0

## 11.1 Regra principal

Tudo que for criado a partir da versão 2.0 deve ter testes unitários quando houver lógica, comportamento condicional ou risco de regressão.

## 11.2 O que testar

Devem ser testados:

- validações de formulário;
- formatadores monetários e de data;
- regras financeiras;
- regras de permissão;
- filtros de transações;
- definição de colunas da TanStack Table;
- hooks com lógica;
- services/repositories;
- estados de componentes;
- Query Client e configurações globais relevantes;
- regressões de bugs corrigidos.

## 11.3 O que evitar

Evitar testes que apenas validam detalhes internos sem valor, como:

- classes CSS geradas;
- implementação interna irrelevante;
- snapshots frágeis sem intenção clara;
- cobertura artificial sem proteção real.

---

# 12. Segurança e permissões

A versão 2.0 deve preservar o modelo de isolamento já desenvolvido.

Qualquer nova operação deve respeitar:

- usuário autenticado;
- vínculo de casal;
- escopo individual ou compartilhado;
- autorização de leitura;
- autorização de escrita;
- auditoria quando houver alteração financeira relevante.

A introdução do Prisma não pode permitir acesso amplo ao banco sem validação de permissão.

---

# 13. Performance

## 13.1 Objetivos

- Evitar chamadas redundantes.
- Evitar refetch desnecessário ao trocar de aba.
- Manter renderização eficiente da tabela de transações.
- Usar memoização apenas quando houver necessidade real.
- Preparar paginação ou virtualização para listas maiores.

## 13.2 Métricas orientativas

- Build sem erros.
- Lighthouse acima de 90 quando aplicável.
- Sem degradação perceptível nos fluxos principais.
- Tabela de transações responsiva com volume razoável de dados.

---

# 14. Acessibilidade e responsividade

As melhorias 2.0 devem preservar a base F11.

Critérios mínimos:

- foco visível;
- navegação por teclado;
- labels em formulários;
- cabeçalhos adequados em tabelas;
- contraste adequado;
- estados de erro compreensíveis;
- sidebar acessível;
- adaptação mobile das telas principais.

---

# 15. Roadmap incremental 2.0

## Prioridade 1 — Proteger a base

- Pipeline de Pull Request.
- Política de testes unitários.
- Configuração do TanStack Query.

## Prioridade 2 — Melhorar UX dos fluxos existentes

- Limpeza visual.
- Sidebar de dashboard.
- Tabela de transações com TanStack Table.

## Prioridade 3 — Fortalecer arquitetura

- Prisma como ORM.
- Camada de services/repositories.
- Revisão de acesso a dados e permissões.

## Prioridade 4 — Governança para próximas specs

- Checklist transversal 2.0.
- Documentação de contribuição.
- Padrões para specs futuras no GitHub Spec Kit.

---

# 16. Checklist para qualquer nova feature

Toda feature futura deve informar:

- É incremento de qual feature existente?
- Quais fluxos F00–F11 podem ser afetados?
- Há alteração de UI?
- Há alteração de schema ou Prisma?
- Há alteração em TanStack Query?
- Há impacto em permissões?
- Há impacto em auditoria?
- Quais testes unitários serão criados?
- Quais estados de loading, vazio e erro existem?
- Como será validado em mobile?
- Como será validada a acessibilidade?
- O pipeline de PR cobre a entrega?

---

# 17. Prompt base para specs futuras

```text
Considere que as features F00 a F11 já foram desenvolvidas e compõem o baseline atual da aplicação.

A nova feature deve ser tratada como incremento, refatoração ou melhoria sobre o sistema existente, preservando autenticação, vínculo de casal, permissões, transações, dashboard, metas, auditoria, responsividade e acessibilidade já implementados.

Gere uma especificação com requisitos funcionais, requisitos não funcionais, critérios de aceite, testes unitários obrigatórios, riscos de regressão e impactos em UI, dados, Prisma, TanStack Query, permissões e pipeline de PR.
```

---

# 18. Definição de pronto 2.0

Uma entrega 2.0 está pronta quando:

- é incremental e não recria indevidamente features F00–F11;
- preserva os fluxos existentes;
- passa em lint, typecheck, testes e build;
- possui testes unitários proporcionais;
- mantém isolamento e autorização;
- não expõe Prisma no frontend;
- não causa refetch desnecessário ao trocar de aba;
- mantém UX limpa e objetiva;
- funciona em mobile;
- preserva acessibilidade base;
- possui documentação mínima quando altera arquitetura ou comportamento global.

---

# 19. Síntese

O projeto já tem o núcleo funcional inicial. A versão 2.0 deve ser usada para amadurecer a aplicação: menos ruído visual, navegação mais profissional, listagem de transações mais robusta, dados melhor estruturados, pipeline confiável e testes como regra de evolução.

A diretriz central é simples: **incrementar sem regredir**.
