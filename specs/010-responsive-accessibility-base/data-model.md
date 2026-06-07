# Data Model: F11 - Responsividade e acessibilidade base

Este modelo e conceitual. A F11 nao cria persistencia nova; define contratos de
interface e criterios transversais para implementar e validar os fluxos
existentes do MVP.

## Essential Flow

Representa uma jornada essencial coberta pela revisao.

| Field | Type | Rules |
|-------|------|-------|
| `id` | `auth \| account_recovery \| private_home \| couple_invitation \| permissions \| categories \| transaction_form \| transaction_list \| dashboard \| charts \| goals \| audit` | Conjunto fechado para o MVP |
| `routeScope` | `public \| private` | Indica se exige autenticacao |
| `primaryTask` | `string` | Tarefa principal da pessoa |
| `states` | `InterfaceState[]` | Estados relevantes do fluxo |
| `financialContexts` | `FinancialContextLabel[]` | Rotulos aplicaveis |
| `validationChecklist` | `FutureFeatureAcceptanceBaseline` | Baseline reutilizavel |

**Invariants**

- Fluxo privado nunca deve exibir dado sem autorizacao.
- Fluxo individual deve funcionar sem vinculo compartilhado ativo quando o
  dominio permitir.
- Fluxo essencial nao pode depender exclusivamente de desktop.

## Responsive Requirement

Representa uma exigencia responsiva verificavel.

| Field | Type | Rules |
|-------|------|-------|
| `viewport` | `mobile \| tablet \| desktop` | Mobile e prioridade |
| `contentCase` | `default \| long_text \| large_money \| enlarged_text \| narrow_width \| virtual_keyboard` | Casos de estresse |
| `layoutRule` | `string` | Regra esperada para composicao |
| `horizontalScrollAllowed` | `boolean` | Deve ser `false` para fluxos essenciais |
| `primaryActionsReachable` | `boolean` | Deve ser `true` |

**Invariants**

- Conteudo longo quebra linha sem ocultar acao principal.
- Valores, datas e status financeiros permanecem legiveis.
- Nenhum fluxo essencial exige rolagem horizontal obrigatoria.

## Accessible Control

Representa um elemento interativo essencial.

| Field | Type | Rules |
|-------|------|-------|
| `controlType` | `link \| button \| input \| select \| checkbox \| radio \| menu \| tab \| dialog_action \| retry` | Tipo semantico |
| `accessibleName` | `string` | Obrigatorio e compreensivel |
| `labelId` | `string?` | Obrigatorio para campos quando aplicavel |
| `descriptionId` | `string?` | Usado para ajuda ou erro |
| `errorId` | `string?` | Associado ao campo invalido |
| `focusVisible` | `boolean` | Deve ser `true` |
| `keyboardReachable` | `boolean` | Deve ser `true` |
| `disabledReason` | `string?` | Deve ser seguro e nao tecnico |

**Invariants**

- Icone sozinho so pode comunicar acao se houver nome acessivel.
- Campo invalido deve indicar erro sem depender apenas de cor.
- Foco nao pode ficar cortado, escondido ou perdido fora da area visivel.

## Interface State

Representa um estado perceptivel de tela, lista, formulario ou acao.

| Field | Type | Rules |
|-------|------|-------|
| `kind` | `loading \| saving \| success \| empty \| recoverable_error \| permission_unavailable \| no_shared_relationship \| session_expired \| retrying` | Conjunto fechado |
| `title` | `string` | Claro e humano |
| `message` | `SafeMessage` | Nao revela dados inacessiveis |
| `actionLabel` | `string?` | Presente quando ha proxima acao clara |
| `announced` | `boolean` | Usar com criterio para evitar ruido |
| `preservesInput` | `boolean?` | Obrigatorio em formularios quando seguro |

**Transitions**

- `loading` -> `success | empty | recoverable_error | permission_unavailable | session_expired`
- `saving` -> `success | recoverable_error | permission_unavailable | session_expired`
- `recoverable_error` -> `retrying | previous_safe_context`
- `session_expired` -> `public_login_context`

## Safe Message

Representa uma mensagem segura exibida para a pessoa usuaria.

| Field | Type | Rules |
|-------|------|-------|
| `audience` | `visitor \| authenticated_user \| linked_member \| unlinked_user` | Contexto da pessoa |
| `tone` | `neutral_collaborative` | Sem culpa, vigilancia ou ranking |
| `body` | `string` | Sem detalhes internos |
| `recoveryAction` | `string?` | Tentar novamente, voltar ou corrigir |
| `privacyRisk` | `none \| reviewed` | `reviewed` quando envolve permissao/dado financeiro |

**Invariants**

- Nao revelar existencia, quantidade, dono, valor, categoria, meta, transacao,
  evento ou status de dados inacessiveis.
- Nao expor SQL, RLS, stack trace, tokens ou detalhes de infraestrutura.
- Nao diferenciar inexistente, removido e nao autorizado quando isso puder
  revelar informacao.

## Financial Context Label

Representa o contexto textual de uma informacao financeira.

| Field | Type | Rules |
|-------|------|-------|
| `scope` | `individual \| shared \| restricted` | Sempre textual quando ambiguo |
| `ownerLabel` | `current_user \| shared_space \| unavailable` | Sem inventar identidade |
| `statusLabel` | `string?` | Ex.: concluida, arquivada, pendente |
| `periodLabel` | `string?` | Formato consistente |
| `amountLabel` | `string?` | Formato monetario consistente |

**Invariants**

- Cor, icone ou posicao nao substituem rotulo textual.
- Dados compartilhados exigem membership ativa.
- Dados restritos nao indicam propriedade ou existencia oculta.

## Accessible Financial Summary

Representa equivalente textual para informacao visual financeira.

| Field | Type | Rules |
|-------|------|-------|
| `source` | `chart \| indicator \| card \| list \| badge` | Origem visual |
| `headline` | `string` | Principal leitura financeira |
| `details` | `string[]` | Valores essenciais |
| `periodLabel` | `string?` | Periodo do dado |
| `privacyNote` | `SafeMessage?` | Quando houver dado parcial/autorizado |

**Invariants**

- Deve comunicar o essencial sem depender de cor, hover, tooltip ou legenda
  visual.
- Deve usar linguagem neutra e nao julgadora.
- Deve respeitar dados autorizados atuais.

## Future Feature Acceptance Baseline

Baseline reutilizavel para features atuais e futuras.

| Field | Type | Rules |
|-------|------|-------|
| `mobileUsable` | `boolean` | Deve ser `true` |
| `keyboardOperable` | `boolean` | Deve ser `true` |
| `visibleFocus` | `boolean` | Deve ser `true` |
| `labelsAndErrorsAssociated` | `boolean` | Deve ser `true` para formularios |
| `safeStates` | `boolean` | Deve ser `true` |
| `visualInfoHasTextEquivalent` | `boolean` | Deve ser `true` |
| `privacyPreserved` | `boolean` | Deve ser `true` |

**Validation Rules**

- Falha em `privacyPreserved` bloqueia entrega.
- Falha em `keyboardOperable`, `visibleFocus` ou
  `labelsAndErrorsAssociated` bloqueia fluxos essenciais.
- Excecoes devem ser documentadas com risco, alternativa rejeitada e mitigacao.
