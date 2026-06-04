# Research: F05 - Registro de transacoes

## Decision: Persistir valor em centavos inteiros

**Rationale**: `amount_cents bigint` preserva precisao exata, evita ponto
flutuante e simplifica comparacao, soma e transporte pelo cliente. O frontend
converte a entrada `pt-BR` para inteiro antes da RPC e formata o inteiro para
exibicao. O limite do MVP sera R$ 999.999.999,99, ou `99999999999` centavos,
valor muito abaixo do limite seguro de inteiro do JavaScript.

**Alternatives considered**: `double precision` foi rejeitado por erro de
arredondamento. `numeric(12,2)` e seguro no banco, mas chega ao cliente como
string e exige mais conversoes; permanece alternativa futura se multiplas
escalas monetarias forem necessarias.

## Decision: Usar `date` para a data da transacao

**Rationale**: A data representa um dia civil, nao um instante. Persistir
`transaction_date date` e transportar `YYYY-MM-DD` evita mudanca de dia por
timezone. `created_at timestamptz` continua representando o instante de criacao.

**Alternatives considered**: `timestamptz` para a data financeira foi rejeitado
porque conversoes de fuso podem alterar o dia exibido.

## Decision: Definir limites consistentes no frontend e banco

**Rationale**: Titulo normalizado deve ter de 1 a 120 caracteres; observacao
normalizada pode ser nula ou ter ate 500 caracteres; valor deve ficar entre 1 e
`99999999999` centavos. Zod orienta cedo e constraints no banco preservam a
regra contra clientes alternativos.

**Alternatives considered**: Textos sem limite e valor limitado apenas pelo tipo
foram rejeitados por reduzir previsibilidade de UX e manutencao.

## Decision: Usar uma unica tabela para escopos individual e compartilhado

**Rationale**: `public.financial_transactions` guarda a mesma entidade e usa
`visibility` e `shared_budget_id` para distinguir escopo. Constraints garantem
que individual nao possui espaco e tem criador igual ao responsavel, enquanto
compartilhada exige espaco. Isso evita duplicacao de schema e facilita futuras
consultas autorizadas.

**Alternatives considered**: Tabelas separadas foram rejeitadas por duplicar
regras, servicos e futuras agregacoes. Um campo booleano `shared` foi rejeitado
por ser menos explicito que uma visibilidade literal.

## Decision: Criar somente por RPC transacional idempotente

**Rationale**: A confirmacao precisa revalidar atomica e simultaneamente sessao,
categoria ativa e aplicavel, membership do criador, membership do responsavel,
espaco ativo e idempotencia. A RPC publica `create_financial_transaction` sera
uma camada fina `security invoker`; ela chama funcao `security definer` em
schema privado, com `search_path` vazio e referencias qualificadas. O cliente
nao recebe `INSERT` direto.

**Alternatives considered**: `INSERT` direto com RLS foi rejeitado porque
espalha validacoes entre policy, trigger e cliente e dificulta retorno
idempotente. Uma funcao privilegiada diretamente no schema exposto foi
rejeitada porque amplia a superficie privilegiada.

## Decision: Idempotencia unica por criador e chave de tentativa

**Rationale**: Cada formulario pronto gera uma UUID `idempotency_key`, preservada
durante envio e retries. A tabela possui unicidade em
`(created_by_user_id, idempotency_key)`. Sob conflito, a funcao bloqueia e le a
linha existente: payload equivalente retorna o mesmo resumo; payload diferente
falha com conflito seguro. Se a pessoa editar qualquer valor canonico depois de
uma tentativa, o controller gera nova chave antes do proximo envio. Iniciar
outra transacao tambem gera nova chave.

**Alternatives considered**: Desabilitar apenas o botao foi rejeitado porque nao
protege retries de rede. Chave global foi rejeitada porque poderia criar
colisao ou inferencia entre pessoas.

## Decision: RLS separa leitura individual e compartilhada

**Rationale**: RLS fica habilitado. Uma policy `SELECT to authenticated`
permite linha individual apenas quando `created_by_user_id = auth.uid()` e
linha compartilhada apenas quando a pessoa possui membership ativa no
`shared_budget_id`. `authenticated` recebe `SELECT` e `EXECUTE` da RPC publica,
mas nao `INSERT`, `UPDATE` ou `DELETE`.

**Alternatives considered**: Uma policy ampla baseada apenas em
`responsible_user_id` foi rejeitada porque responsabilidade nao define acesso.
Liberar leitura por convite foi rejeitado porque convite nao concede acesso
financeiro.

## Decision: Grants explicitos e Data API tratada como configuracao

**Rationale**: A migration revoga privilegios padrao, concede apenas `SELECT`
na tabela e `EXECUTE` na RPC publica para `authenticated`, e habilita RLS. Isso
permanece correto em projetos onde novas tabelas nao sao expostas
automaticamente pela Data API, mudanca disponibilizada pelo Supabase em 28 de
abril de 2026.

**Alternatives considered**: Depender de grants implicitos foi rejeitado por
variar entre configuracoes de projeto e ampliar acesso sem intencao.

## Decision: Categoria e elegibilidade sao revalidadas no banco

**Rationale**: A funcao aceita `category_code`, mas confirma que a categoria
existe, esta ativa e possui aplicabilidade igual ao tipo ou `both`. Para
compartilhada, confirma criador e responsavel como membros ativos do mesmo
espaco. Para individual, ignora escolha externa e grava o criador como
responsavel.

**Alternatives considered**: Confiar no seletor e nos membros carregados foi
rejeitado porque esses dados podem mudar durante o preenchimento.

## Decision: Usar labels de membro sem criar perfil

**Rationale**: A F05 usa IDs de memberships autorizadas somente no payload e
mostra `Voce` para a pessoa atual e `Pessoa parceira` para o outro membro. Isso
atende clareza de responsabilidade sem criar perfis ou expor e-mails.

**Alternatives considered**: Mostrar e-mail foi rejeitado por privacidade e
porque perfil esta fora do escopo. Inventar nome foi rejeitado por ambiguidade.

## Decision: Formulario com defaults seguros e preservacao seletiva

**Rationale**: O formulario inicia como individual, responsavel pela pessoa
atual, data civil atual, sem categoria preselecionada e com tipo exigido de
forma explicita. Ao mudar tipo, categoria invalida e limpa. Ao mudar para
individual, responsavel volta explicitamente para a pessoa atual. Falhas
recuperaveis preservam textos, valor, tipo e data, mas revalidam categoria,
visibilidade e responsavel.

**Alternatives considered**: Iniciar compartilhada ou selecionar categoria
automaticamente foi rejeitado por ambiguidade. Limpar todo o formulario em
falha foi rejeitado por friccao.

## Decision: Nao adicionar TanStack Query ou bibliotecas de moeda/data

**Rationale**: O fluxo possui poucas leituras e uma mutacao. Servicos e hooks
locais existentes, `Intl.NumberFormat`, input de data e funcoes puras atendem
sem cache ou dependencias adicionais.

**Alternatives considered**: Adicionar cache remoto, mascara monetaria ou
biblioteca de data foi rejeitado por complexidade sem beneficio comprovado.

## Decision: Indices focam autorizacao e evolucao imediata

**Rationale**: A unicidade de idempotencia cobre retry. Indices em
`(created_by_user_id, transaction_date desc)` e
`(shared_budget_id, transaction_date desc)` sustentam isolamento e as futuras
listas mais provaveis. Indice adicional por responsavel, tipo ou categoria fica
para quando F06-F08 definirem consultas reais.

**Alternatives considered**: Indexar todas as colunas foi rejeitado por custo de
escrita e ausencia de consultas comprovadas.
