# Contract: Deferred Cleanup Candidate

## Purpose

Registrar elementos que parecem removiveis, mas cuja remocao exige cuidado
posterior.

## Required Fields

- Tela
- Elemento
- Motivo do adiamento
- Risco se removido agora
- Condicao para revisao futura
- Dono logico da decisao: produto, UX, seguranca, acessibilidade ou engenharia

## Valid Reasons

- Pode carregar significado financeiro essencial.
- Pode carregar contexto de permissao ou visibilidade.
- Pode afetar auditoria ou rastreabilidade.
- Pode afetar acessibilidade.
- Depende de feature futura como F13, F14, F16 ou F20.
- Falta teste ou validacao suficiente.

## Pass Criteria

- Nenhum item e adiado sem motivo.
- Itens adiados nao bloqueiam os ganhos principais da F12.
- Itens adiados ficam claros para planejamento futuro.
