# Contract: Focus Return Context Preservation

## Purpose

Definir o que deve permanecer estavel quando a pessoa troca de aba/janela ou
retorna ao navegador/app.

## Preserved Context

- Rota atual.
- Filtros de transacoes.
- Ordenacao de tabela de transacoes.
- Pagina ou cursor carregado quando aplicavel.
- Periodo selecionado em dashboard ou graficos.
- Filtro de status de metas.
- Dados autorizados ja exibidos.
- Estados de erro, vazio ou sem resultados ja apresentados.

## Focus Return Behavior

- Nao iniciar loading global.
- Nao chamar services remotos apenas por foco.
- Nao limpar dados prontos.
- Nao alterar filtros, ordenacao, cursor ou periodo.
- Nao esconder erro anterior sem retry ou gatilho controlado.

## Mobile Considerations

Navegadores mobile podem pausar a aplicacao em segundo plano. Mesmo assim, o
retorno ao app nao deve ser tratado como gatilho automatico de refetch global.
Uma carga so e permitida se houver outro gatilho valido, como remount com
contexto real de rota/autenticacao ou retry explicito.

## Verification

- Renderizar hooks/componentes com dados carregados.
- Disparar `focus` ou evento equivalente.
- Confirmar que services mockados nao recebem nova chamada.
- Confirmar que estado visivel permanece pronto e com contexto preservado.
