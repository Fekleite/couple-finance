import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { createInviteSchema, type InviteFormValues } from "@/features/couple/couple-schemas";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import {
  DashboardView,
  normalizeDashboardMonth,
  useDashboard,
  useDashboardCharts
} from "@/features/dashboard";
import { useAuth } from "@/features/auth/use-auth";
import { getPermissionMessage, VisibilityLabel } from "@/features/permissions";
import { setPageTitle } from "@/lib/page-title";

export function PrivateHomePage() {
  const { user } = useAuth();
  const { relationshipState, mutationState, createInvite, cancel, refresh } =
    useCoupleRelationship();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPeriod = useMemo(
    () => normalizeDashboardMonth(searchParams.get("month")),
    [searchParams]
  );
  const authorizationContext = `${user?.id ?? "signed-out"}:${relationshipContext(relationshipState)}`;
  const { state: dashboardState, retry: retryDashboard } = useDashboard(
    selectedPeriod,
    authorizationContext
  );
  const { state: chartState, retry: retryCharts } = useDashboardCharts(
    selectedPeriod,
    authorizationContext
  );
  const inviteSchema = useMemo(() => createInviteSchema(user?.email), [user?.email]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
    defaultValues: {
      inviteeEmail: ""
    }
  });

  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.app.title);
  }, []);
  useEffect(() => {
    if (searchParams.get("month") !== selectedPeriod.key) {
      const next = new URLSearchParams(searchParams);
      next.set("month", selectedPeriod.key);
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, selectedPeriod, setSearchParams]);

  async function onSubmit(values: InviteFormValues) {
    const result = await createInvite(values);
    if (result?.ok) {
      reset();
    }
  }

  if (relationshipState.status === "loading") {
    return (
      <LoadingState
        title="Verificando seu espaco"
        message={getPermissionMessage("permissionChecking")}
      />
    );
  }

  if (relationshipState.status === "error") {
    return (
      <ErrorState
        title={COUPLE_MESSAGES.errorTitle}
        message={relationshipState.message}
        actionLabel="Tentar novamente"
        onAction={refresh}
      />
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-5">
      {mutationState.message ? (
        <Alert variant={mutationState.status === "error" ? "destructive" : "default"}>
          <AlertDescription>{mutationState.message}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardView
        selectedPeriod={selectedPeriod}
        state={dashboardState}
        chartsState={chartState}
        onRetry={retryDashboard}
        onChartsRetry={retryCharts}
        onMonthChange={(period) => {
          const next = new URLSearchParams(searchParams);
          next.set("month", period.key);
          setSearchParams(next);
        }}
      />

      <section className="grid min-w-0 gap-3 sm:grid-cols-3" aria-label="Acoes financeiras">
        <Card size="sm" className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Consultar transacoes</CardTitle>
            <CardDescription>
              Visualize e filtre as movimentacoes disponiveis por mes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link to={PRIVATE_ROUTES.transactions.path}>Ver transacoes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card size="sm" className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Registrar transacao</CardTitle>
            <CardDescription>
              Adicione uma receita ou despesa individual ou compartilhada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to={PRIVATE_ROUTES.newTransaction.path}>Nova transacao</Link>
            </Button>
          </CardContent>
        </Card>

        <Card size="sm" className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Categorias financeiras padrao</CardTitle>
            <CardDescription>
              Consulte o vocabulario para classificar movimentacoes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link to={PRIVATE_ROUTES.categories.path}>Consultar categorias</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {relationshipState.status === "no_shared_budget" ? (
        <Card>
          <CardHeader>
            <VisibilityLabel scope="individual" className="mb-2 w-fit" />
            <CardTitle>{COUPLE_MESSAGES.noSharedBudgetTitle}</CardTitle>
            <CardDescription>{COUPLE_MESSAGES.noSharedBudgetMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="gap-4">
                <Field data-invalid={Boolean(errors.inviteeEmail)}>
                  <FieldLabel htmlFor="invitee-email">E-mail da pessoa parceira</FieldLabel>
                  <Input
                    id="invitee-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.inviteeEmail)}
                    aria-describedby={errors.inviteeEmail ? "invitee-email-error" : undefined}
                    {...register("inviteeEmail")}
                  />
                  <FieldError id="invitee-email-error" errors={[errors.inviteeEmail]} />
                </Field>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                  {isSubmitting ? "Criando convite..." : "Criar espaco e convidar"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {relationshipState.status === "invitation_sent" ? (
        <Card>
          <CardHeader>
            <VisibilityLabel scope="individual" className="mb-2 w-fit" />
            <CardTitle>{COUPLE_MESSAGES.sentTitle}</CardTitle>
            <CardDescription>
              Convite pendente para {relationshipState.invitation.inviteeEmail}. Expira em{" "}
              {formatDate(relationshipState.invitation.expiresAt)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void cancel(relationshipState.invitation.id)}
              disabled={mutationState.status === "loading"}
            >
              Cancelar convite
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {relationshipState.status === "invitation_received" ? (
        <Card>
          <CardHeader>
            <VisibilityLabel scope="inaccessible" className="mb-2 w-fit" />
            <CardTitle>{COUPLE_MESSAGES.receivedTitle}</CardTitle>
            <CardDescription>
              {relationshipState.invitation.inviterLabel} convidou voce para{" "}
              {relationshipState.invitation.sharedBudgetName}.{" "}
              {getPermissionMessage("permissionBlocked")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={`/app/invites/${relationshipState.invitation.id}`}>Responder convite</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {relationshipState.status === "couple_linked" ? (
        <Card>
          <CardHeader>
            <VisibilityLabel scope="shared" className="mb-2 w-fit" />
            <CardTitle>{COUPLE_MESSAGES.linkedTitle}</CardTitle>
            <CardDescription>{COUPLE_MESSAGES.linkedMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {relationshipState.sharedBudget.name} esta ativo com{" "}
              {relationshipState.sharedBudget.memberCount} membros.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {relationshipState.status === "invitation_unavailable" ? (
        <ErrorState
          title={COUPLE_MESSAGES.unavailableTitle}
          message={getPermissionMessage("permissionUnavailable")}
        />
      ) : null}
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function relationshipContext(state: ReturnType<typeof useCoupleRelationship>["relationshipState"]) {
  if (state.status === "couple_linked") return `${state.status}:${state.sharedBudget.id}`;
  return state.status;
}
