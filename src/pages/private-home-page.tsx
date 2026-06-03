import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
import { useAuth } from "@/features/auth/use-auth";
import { setPageTitle } from "@/lib/page-title";

export function PrivateHomePage() {
  const { user } = useAuth();
  const { relationshipState, mutationState, createInvite, cancel, refresh } =
    useCoupleRelationship();
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

  async function onSubmit(values: InviteFormValues) {
    const result = await createInvite(values);
    if (result?.ok) {
      reset();
    }
  }

  if (relationshipState.status === "loading") {
    return (
      <LoadingState title="Verificando seu espaco" message={COUPLE_MESSAGES.loadingRelationship} />
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {mutationState.message ? (
        <Alert variant={mutationState.status === "error" ? "destructive" : "default"}>
          <AlertDescription>{mutationState.message}</AlertDescription>
        </Alert>
      ) : null}

      {relationshipState.status === "no_shared_budget" ? (
        <Card>
          <CardHeader>
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
            <CardTitle>{COUPLE_MESSAGES.receivedTitle}</CardTitle>
            <CardDescription>
              {relationshipState.invitation.inviterLabel} convidou voce para{" "}
              {relationshipState.invitation.sharedBudgetName}.
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
          message={COUPLE_MESSAGES.unavailable}
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
