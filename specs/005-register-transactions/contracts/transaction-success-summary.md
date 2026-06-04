# Contract: Transaction Success Summary

## Purpose

Confirmar o registro sem criar uma lista de transacoes.

## Required Content

- Receita ou despesa.
- Valor formatado em `pt-BR`.
- Data civil formatada.
- Nome da categoria resolvido pelo catalogo autorizado.
- Responsavel: `Voce` ou `Pessoa parceira`.
- Visibilidade individual ou compartilhada.
- Autoria clara quando responsavel for outra pessoa.

## Rules

- Dados vem do retorno autorizado da criacao idempotente.
- Nao consulta lista, total, saldo ou registros relacionados.
- Nao depende apenas de cor ou icone.
- Nao exibe IDs, erros internos ou dados pessoais adicionais.
- Acao `Registrar outra transacao` limpa o formulario e gera nova chave.
