# Research: F04 - Categorias financeiras padrao

## Decision: Persistir o catalogo canonico no Supabase PostgreSQL

**Rationale**: Futuras transacoes precisam de integridade referencial e todos
os clientes devem compartilhar a mesma taxonomia. Uma tabela de referencia
versionada por migration permite chave estrangeira futura, renomeacao sem
trocar identidade e validacao centralizada. O catalogo permanece pequeno e
simples de consultar.

**Alternatives considered**: Um array TypeScript foi rejeitado como fonte
canonica porque o banco nao conseguiria validar futuras referencias e outros
clientes poderiam divergir. Duplicar tabela e constante completa foi rejeitado
porque cria duas fontes de verdade.

## Decision: Usar `code` textual estavel como chave primaria

**Rationale**: Codes como `housing`, `food` e `income` sao legiveis em
migrations, testes, filtros e contratos, permanecem estaveis quando o texto em
portugues muda e funcionam diretamente como futura chave estrangeira. O nome
exibido nunca participa da identidade.

**Alternatives considered**: UUID foi rejeitado porque adiciona opacidade sem
beneficio para um conjunto pequeno e controlado. Usar o nome em portugues foi
rejeitado porque renomeacoes quebrariam referencias.

## Decision: Catalogo somente leitura para pessoas autenticadas

**Rationale**: A spec disponibiliza categorias a usuarios autenticados e
proibe personalizacao no MVP. RLS habilitado, policy `SELECT` para
`authenticated`, grant de leitura e ausencia de policies/grants de mutacao
mantem o cliente incapaz de alterar a taxonomia.

**Alternatives considered**: Leitura anonima foi rejeitada porque a superficie
da F04 e privada e nao ha beneficio atual. Mutacoes por usuarios foram
rejeitadas por violar o escopo.

## Decision: Seed idempotente e evolucao sem exclusao destrutiva

**Rationale**: A migration insere ou atualiza textos e ordem por `code`, o que
permite repetir o setup e evoluir a apresentacao. `is_active` permite retirar
uma opcao de novos seletores no futuro sem quebrar registros historicos.
Remover ou trocar um `code` publicado nao e permitido.

**Alternatives considered**: DELETE de categorias descontinuadas foi rejeitado
porque quebraria chaves estrangeiras e historico. Seeds executados apenas no
frontend foram rejeitados por dependerem do cliente.

## Decision: Incluir `Renda` alem das dez categorias minimas

**Rationale**: A especificacao exige aplicabilidade a receitas e despesas e
meta de cobertura de exemplos comuns. Sem uma categoria explicita de renda,
salario, pagamentos e outras entradas comuns cairiam em `Outros`, contrariando
a intencao de favorecer categorias especificas. O catalogo inicial fica:

| Order | Code | Name | Applicability | Intent |
|-------|------|------|---------------|--------|
| 10 | `income` | Renda | income | Salarios, pagamentos, beneficios e outras entradas |
| 20 | `housing` | Moradia | expense | Aluguel, condominio, manutencao e itens essenciais da residencia |
| 30 | `food` | Alimentacao | expense | Mercado, feira, restaurantes, delivery e refeicoes |
| 40 | `transportation` | Transporte | expense | Combustivel, transporte publico, aplicativos e manutencao |
| 50 | `health` | Saude | expense | Consultas, medicamentos, exames e plano de saude |
| 60 | `bills` | Contas | expense | Agua, luz, internet, telefone, assinaturas e seguros |
| 70 | `education` | Educacao | expense | Cursos, livros, mensalidades e materiais |
| 80 | `shopping` | Compras | expense | Roupas, eletronicos, presentes e itens pessoais nao recorrentes |
| 90 | `leisure` | Lazer | expense | Entretenimento, viagens, hobbies, eventos e experiencias |
| 100 | `investments` | Investimentos | both | Aportes, aplicacoes, resgates e movimentacoes patrimoniais |
| 110 | `other` | Outros | both | Casos sem categoria especifica adequada |

**Alternatives considered**: Manter somente as dez categorias minimas foi
rejeitado porque nao classifica uma receita comum com clareza. Criar varias
categorias de receita foi rejeitado por ampliar o MVP sem evidencia.

## Decision: Diferenciar Moradia, Contas e Compras por descricao

**Rationale**: A distincao deve ser ensinada no proprio catalogo: Moradia cobre
custos da residencia e manutencao; Contas cobre servicos e cobrancas
recorrentes; Compras cobre aquisicoes pessoais ou pontuais. Isso reduz
ambiguidade sem criar subcategorias.

**Alternatives considered**: Mesclar as categorias foi rejeitado porque reduz
clareza de analises futuras. Subcategorias foram rejeitadas por estarem fora do
MVP.

## Decision: Categoria e referencia global; visibilidade pertence ao registro

**Rationale**: A F03 define dados individuais e compartilhados. Uma categoria
padrao nao pertence a usuario ou casal e nao concede acesso financeiro. Uma
futura transacao guarda `category_code`, mas continua autorizada por seu
`user_id` ou `shared_budget_id`.

**Alternatives considered**: Duplicar categorias por pessoa ou casal foi
rejeitado porque cria divergencia e confunde vocabulario com autorizacao.

## Decision: Criar pagina autenticada de consulta e seletor reutilizavel

**Rationale**: `/app/categories` entrega uma superficie real para consultar
nomes e descricoes sem inventar transacoes. `CategorySelector` fica pronto e
testado para F05, mas nao e acoplado a formulario ou persistencia nesta
feature. A pagina usa lista sem contadores ou indicadores de uso.

**Alternatives considered**: Mostrar categorias apenas em testes foi rejeitado
porque nao entrega consulta ao usuario. Criar uma selecao persistida ou
simulacao de transacao foi rejeitado por ampliar o escopo.

## Decision: Nao usar TanStack Query, React Hook Form ou Zod

**Rationale**: O catalogo faz uma leitura pequena e nao possui formulario ou
mutacao. Um servico e hook locais com estados explicitos atendem a necessidade
sem cache complexo ou validacao de entrada.

**Alternatives considered**: Introduzir TanStack Query agora foi rejeitado por
nao haver invalidacao, paginacao ou mutacao que justifique a dependencia.
React Hook Form e Zod foram rejeitados porque nao existe formulario na F04.

## Decision: Usar icones apenas como apoio visual

**Rationale**: Lucide React ja esta instalado e pode acelerar reconhecimento,
mas nome e descricao continuam obrigatorios. O code persistido pode ser
mapeado para icone no frontend; o nome do icone nao faz parte do modelo de
dados nem da identidade.

**Alternatives considered**: Persistir nomes de icones foi rejeitado porque
acopla dados de dominio a uma biblioteca visual. Usar somente icones foi
rejeitado por acessibilidade e ambiguidade.
