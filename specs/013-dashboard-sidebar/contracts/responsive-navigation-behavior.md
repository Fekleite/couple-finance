# Contract: Responsive Navigation Behavior

## Purpose

Definir comportamento esperado da sidebar desktop e da navegacao compacta em
tablet/mobile.

## Viewports

- Mobile
- Tablet
- Desktop
- Conteudo longo
- Texto ampliado ou zoom alto quando aplicavel

## Rules

- Desktop deve exibir sidebar lateral clara e persistente, salvo decisao
  justificada por area util.
- Tablet/mobile devem usar drawer, menu compacto ou alternativa equivalente com
  acesso aos destinos principais.
- Modo compacto deve ter controle de abrir e fechar com nome acessivel.
- A navegacao aberta nao deve causar rolagem horizontal obrigatoria.
- A navegacao nao deve cobrir permanentemente conteudo ou acoes essenciais.
- Labels longos devem quebrar linha ou ser tratados sem estourar containers.
- Mudanca de viewport nao deve perder rota ativa, sessao ou conteudo.

## Pass Criteria

- Layout validado em mobile, tablet e desktop.
- Nenhum viewport essencial exige rolagem horizontal obrigatoria.
- Controle compacto e itens principais sao acionaveis por toque e teclado.
- Area de conteudo financeiro permanece legivel.
