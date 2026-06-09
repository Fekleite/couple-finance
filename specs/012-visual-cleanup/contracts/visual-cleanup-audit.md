# Contract: Visual Cleanup Audit

## Purpose

Garantir que cada tela revisada tenha inventario antes de remocoes visuais.

## Required Scope

- Dashboard
- Transacoes
- Metas
- Categorias
- Convites/parceiro
- Configuracoes, quando existir na aplicacao atual
- Estados compartilhados de loading, vazio, erro e sucesso

## Review Fields

Cada item inventariado deve registrar:

- tela;
- elemento visual;
- tipo do elemento;
- funcao atual;
- decisao: manter, remover, consolidar, reordenar, reescrever ou adiar;
- justificativa;
- risco de regressao;
- teste ou validacao necessaria.

## Pass Criteria

- 100% das telas em escopo possuem inventario.
- Nenhuma remocao ocorre sem justificativa.
- Elementos adiados possuem motivo e condicao de revisao futura.
- Itens removidos nao carregam informacao financeira, permissao, auditoria,
  seguranca ou acessibilidade sem substituto equivalente.
