# Especificação Completa — Plataforma Web de Controle Financeiro para Casais

## Visão Geral do Projeto

A aplicação será uma plataforma web moderna de controle financeiro voltada para casais, permitindo gerenciamento compartilhado e individual das finanças de forma simples, intuitiva e acessível.

O foco principal do produto será:

- Facilidade de uso
- Organização financeira compartilhada
- Transparência entre os cônjuges
- Experiência mobile-first
- Performance elevada
- Código escalável e manutenível

A plataforma deve transmitir sensação de clareza, leveza e confiança.

---

# Objetivos do Produto

## Objetivo Principal

Permitir que casais:

- controlem receitas e despesas;
- acompanhem gastos individuais e compartilhados;
- definam metas financeiras;
- visualizem evolução financeira;
- mantenham transparência no orçamento conjunto.

---

# Público-Alvo

## Primário

- Casais jovens
- Noivos
- Casados
- Pessoas morando juntas

## Secundário

- Usuários individuais interessados em organização financeira simples

---

# Stack Tecnológica

## Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- Shadcn/ui
- React Router
- React Hook Form
- Zod
- TanStack Query
- Recharts

## Backend / Infra

- Supabase
  - Authentication
  - PostgreSQL
  - Row Level Security (RLS)

## Qualidade

- ESLint
- Prettier
- Husky
- lint-staged

---

# Princípios do Projeto

## Produto

- Simplicidade acima de complexidade
- Poucos cliques para executar ações
- Interface limpa
- Feedback visual imediato
- Dados fáceis de interpretar

## Engenharia

- Clean Code
- SOLID
- Componentização
- Escalabilidade
- Reutilização
- Baixo acoplamento
- Alta coesão
- Responsividade real
- Acessibilidade WCAG

---

# Funcionalidades

# 1. Autenticação

## Status atual

Implementada na F01 com Supabase Auth, e-mail/senha, cadastro, login, logout,
recuperação e redefinição de senha, sessão persistente e proteção da rota
privada inicial `/app`. A F01 não cria tabelas financeiras, orçamento
compartilhado, convite de casal, dashboard, metas, transações, migrations ou
políticas RLS.

## Funcionalidades

- Cadastro
- Login
- Logout
- Recuperação de senha
- Sessão persistente

## Regras

- Cada usuário possui conta individual
- Usuário pode:
  - criar orçamento compartilhado;
  - aceitar convite de outro usuário.

## Fluxo

### Usuário A

1. Cria conta
2. Cria orçamento do casal
3. Envia convite

### Usuário B

1. Recebe convite
2. Cria conta ou faz login
3. Aceita convite
4. Passa a compartilhar orçamento

---

# 2. Dashboard Principal

## Objetivo

Exibir visão consolidada das finanças.

## Componentes

### Cards principais

- Saldo total
- Receita do mês
- Despesas do mês
- Economia do mês

### Gráficos

- Gastos por categoria
- Evolução mensal
- Comparativo entre cônjuges

### Resumos rápidos

- Últimas transações
- Meta mais próxima
- Categoria com maior gasto

---

# 3. Controle de Entradas e Saídas

## Funcionalidades

- Criar transação
- Editar transação
- Excluir transação
- Filtrar transações

## Campos da transação

| Campo         | Tipo             |
| ------------- | ---------------- |
| título        | string           |
| valor         | number           |
| tipo          | income / expense |
| categoria     | enum             |
| data          | date             |
| responsável   | spouse           |
| compartilhado | boolean          |
| observação    | string opcional  |

---

# 4. Categorias Financeiras

## Categorias padrão

- Moradia
- Alimentação
- Transporte
- Saúde
- Lazer
- Compras
- Educação
- Investimentos
- Contas
- Outros

## Funcionalidades futuras

- Criar categorias customizadas

---

# 5. Lista Mensal de Gastos

## Funcionalidades

- Filtro por mês
- Filtro por categoria
- Filtro por cônjuge
- Busca textual

## Visualização

- Lista agrupada
- Soma por categoria
- Percentual do total mensal

---

# 6. Metas Financeiras

## Tipos

### Individuais

- Cada usuário possui metas próprias

### Compartilhadas

- Metas do casal

## Campos

| Campo       | Tipo                  |
| ----------- | --------------------- |
| nome        | string                |
| valor alvo  | number                |
| valor atual | number                |
| data limite | date                  |
| tipo        | individual / conjunta |

## Recursos

- Barra de progresso
- Percentual concluído
- Status visual

---

# 7. Balanço Financeiro

## Objetivo

Mostrar resultado consolidado.

## Informações

- Total de receitas
- Total de despesas
- Economia líquida
- Média mensal
- Comparativo histórico

---

# Arquitetura Frontend

# Estrutura de Pastas

```
src/
├── app/
├── components/
│   ├── ui/
│   ├── feedback/
│   └── layout/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── transactions/
│   ├── goals/
│   └── settings/
├── hooks/
├── lib/
├── store/
├── types/
└── styles/
```

---

# Padrão Arquitetural

## Estratégia

Feature-based architecture.

## Benefícios

- Escalabilidade
- Organização
- Isolamento de domínio
- Facilidade de manutenção

---

# Gerenciamento de Estado

## Estratégia Recomendada

### Global

- Zustand

### Server State

- TanStack Query

---

# Modelagem Inicial do Banco

# users

```
id
name
email
created_at
```

# couples

```
id
created_by
created_at
```

# couple_members

```
id
couple_id
user_id
role
joined_at
```

# invitations

```
id
couple_id
email
status
expires_at
```

# transactions

```
id
couple_id
created_by
title
amount
type
category
shared
transaction_date
notes
created_at
```

# goals

```
id
couple_id
created_by
name
target_amount
current_amount
goal_type
deadline
created_at
```

---

# Segurança

## Supabase Auth

- JWT authentication
- Sessão persistente
- Refresh token automático

## Row Level Security

### Objetivo

Garantir que:

- usuários vejam apenas seus dados;
- apenas membros do casal acessem orçamento compartilhado.

---

# Responsividade

# Mobile First

## Breakpoints

| Dispositivo | Largura |
| ----------- | ------- |
| Mobile      | < 640px |
| Tablet      | 640px+  |
| Desktop     | 1024px+ |

## Diretrizes

- Navegação simples
- Componentes grandes para toque
- Menos densidade visual
- Sidebar colapsável
- Bottom navigation no mobile

---

# Acessibilidade

## Requisitos

- Navegação por teclado
- Focus visível
- Contraste adequado
- Labels em formulários
- ARIA attributes
- Compatibilidade com screen readers

---

# Design System

# Visual

## Estilo

- Minimalista
- Moderno
- Clean
- Espaçamentos amplos

## Componentes principais

- Cards
- Dialogs
- Drawers
- Tabs
- Tables
- Charts
- Toasts

---

# UX

## Regras

- Feedback instantâneo
- Skeleton loading
- Estados vazios amigáveis
- Tratamento claro de erros
- Fluxos curtos

---

# Performance

## Objetivos

- Lighthouse > 90
- Baixo tempo de carregamento
- Lazy loading
- Code splitting
- Memoization quando necessário

## Estratégias

- React.lazy
- Suspense
- Dynamic imports
- Virtualização de listas futuras

---

# Qualidade de Código

## Convenções

### Typescript Strict Mode

Obrigatório.

### Nomeação

| Elemento    | Convenção    |
| ----------- | ------------ |
| Componentes | PascalCase   |
| Hooks       | useCamelCase |
| Funções     | camelCase    |
| Constantes  | UPPER_CASE   |

---

# Padrões de Desenvolvimento

## Componentes

- Pequenos
- Reutilizáveis
- Sem lógica excessiva

## Hooks

- Centralizar lógica reutilizável

## Services

- Isolar chamadas HTTP/Supabase

---

# Tratamento de Erros

## Estratégia

- Error Boundaries
- Toast notifications
- Logs organizados
- Mensagens amigáveis

---

# Roadmap Futuro

## V2

- Metas automáticas
- Integração bancária
- Exportação PDF
- Notificações
- Modo escuro
- Multi-moeda
- Planejamento mensal

## V3

- App mobile
- IA para análise financeira
- Sugestões de economia
- Insights automáticos

---

# MVP

## Funcionalidades essenciais

- Login
- Convite de casal
- Cadastro de transações
- Dashboard
- Categorias
- Metas
- Gráficos básicos
- Responsividade

---

# Critérios de Sucesso

## Produto

- Facilidade de uso
- Navegação intuitiva
- Tempo curto para registrar gastos

## Técnicos

- Código modular
- Escalabilidade
- Cobertura de testes futura
- Performance consistente

---

# Requisitos Não Funcionais

| Requisito        | Objetivo                |
| ---------------- | ----------------------- |
| Performance      | carregamento rápido     |
| Segurança        | proteção de dados       |
| Escalabilidade   | crescimento sustentável |
| Acessibilidade   | uso inclusivo           |
| Manutenabilidade | fácil evolução          |
| Responsividade   | experiência fluida      |

---

# Diferenciais do Projeto

- Foco em casais
- Simplicidade real
- Interface moderna
- Experiência mobile otimizada
- Separação clara entre individual e compartilhado
- Forte preocupação com UX e arquitetura
