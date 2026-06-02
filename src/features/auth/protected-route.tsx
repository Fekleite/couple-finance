import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PUBLIC_ROUTES } from "@/app/routes";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { useAuth } from "@/features/auth/use-auth";

export function ProtectedRoute() {
  const { status, message, refreshSession } = useAuth();
  const location = useLocation();

  if (status === "loading" || status === "ending") {
    return (
      <LoadingState
        title={AUTH_MESSAGES.sessionLoading}
        message={message ?? "Aguarde enquanto confirmamos se esta area pode ser aberta."}
      />
    );
  }

  if (status === "authenticated") {
    return <Outlet />;
  }

  if (status === "expired") {
    return (
      <ErrorState
        title={AUTH_MESSAGES.sessionExpired}
        message="Entre novamente para voltar ao espaco privado."
        actionLabel="Entrar novamente"
        actionHref={PUBLIC_ROUTES.login.path}
      />
    );
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Nao foi possivel verificar seu acesso"
        message={message ?? AUTH_MESSAGES.temporaryFailure}
        actionLabel="Tentar novamente"
        onAction={refreshSession}
      />
    );
  }

  return <Navigate to={PUBLIC_ROUTES.login.path} replace state={{ from: location.pathname }} />;
}
