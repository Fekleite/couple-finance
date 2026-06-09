import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  label: string;
  value: string;
  description?: string;
  resultText?: string;
  tone?: "positive" | "negative" | "neutral";
};

export function DashboardIndicatorCard({
  label,
  value,
  description,
  resultText,
  tone = "neutral"
}: Props) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-rose-700"
        : "text-foreground";
  return (
    <Card size="sm" className="min-w-0 focus-within:ring-2 focus-within:ring-ring">
      <CardHeader className="gap-1 pb-0">
        <CardTitle className="text-sm font-medium break-words text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5">
        <p className={`break-words text-2xl font-bold tabular-nums ${toneClass}`}>{value}</p>
        {description ? (
          <p className="text-sm leading-5 break-words text-muted-foreground">{description}</p>
        ) : null}
        {resultText ? (
          <p className="text-sm leading-5 font-medium break-words">{resultText}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
