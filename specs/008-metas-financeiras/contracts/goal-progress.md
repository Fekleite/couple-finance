# Contract: Goal Progress

## Purpose

Definir calculos e apresentacao textual de progresso de uma meta financeira.

## Input

```ts
type GoalProgressInput = {
  targetAmountCents: number;
  currentAmountCents: number;
  deadlineDate: string | null;
  status: "active" | "completed" | "archived";
  today: string;
};
```

## Output

```ts
type GoalProgress = {
  percent: number;
  displayPercent: number;
  barPercent: number;
  remainingAmountCents: number;
  exceededAmountCents: number;
  achievement: "in_progress" | "reached" | "exceeded";
  deadlineState: "none" | "future" | "today" | "overdue" | "completed";
  summary: string;
};
```

## Rules

- `percent = currentAmountCents / targetAmountCents * 100`.
- `displayPercent` e arredondado para leitura, sem alterar valores monetarios.
- `barPercent` fica entre 0 e 100.
- `remainingAmountCents` nunca e negativo.
- `exceededAmountCents` comunica ultrapassagem quando houver.
- Prazo `null` vira `deadlineState = "none"`.
- Meta concluida usa `deadlineState = "completed"`.
- Atraso e comunicado de forma neutra e nao julgadora.

## Accessibility

O resumo textual deve comunicar valor atual, valor alvo, percentual, valor
restante ou ultrapassado e estado de prazo sem depender da barra visual.
