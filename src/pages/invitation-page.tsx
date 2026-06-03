import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COUPLE_MESSAGES } from "@/features/couple/couple-messages";
import { useCoupleRelationship } from "@/features/couple/use-couple-relationship";
import { setPageTitle } from "@/lib/page-title";

export function InvitationPage() {
  const { invitationId } = useParams();
  const { invitation, relationshipState, mutationState, accept, decline, refresh } =
    useCoupleRelationship(invitationId);

  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.invitation.title);
  }, []);

  if (!invitationId || relationshipState.status === "invitation_unavailable") {
    return (
      <ErrorState title={COUPLE_MESSAGES.unavailableTitle} message={COUPLE_MESSAGES.unavailable} />
    );
  }

  if (!invitation && relationshipState.status === "loading") {
    return <LoadingState title="Verificando convite" message={COUPLE_MESSAGES.loadingInvitation} />;
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

  if (!invitation) {
    return (
      <ErrorState title={COUPLE_MESSAGES.unavailableTitle} message={COUPLE_MESSAGES.unavailable} />
    );
  }

  const isLoading = mutationState.status === "loading";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {mutationState.message ? (
        <Alert variant={mutationState.status === "unavailable" ? "destructive" : "default"}>
          <AlertDescription>{mutationState.message}</AlertDescription>
        </Alert>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>{COUPLE_MESSAGES.receivedTitle}</CardTitle>
          <CardDescription>
            {invitation.inviterLabel} convidou voce para entrar em {invitation.sharedBudgetName}. A
            resposta cria apenas o vinculo do casal para as proximas etapas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => void accept()} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Aceitar convite
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void decline()}
            disabled={isLoading}
          >
            Recusar convite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
