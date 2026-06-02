import { Navigate, Outlet } from "react-router-dom";

import { PRIVATE_ROUTES } from "@/app/routes";
import { LoadingState } from "@/components/feedback/loading-state";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { useAuth } from "@/features/auth/use-auth";

export function PublicAuthRoute() {
  const { status } = useAuth();

  if (status === "loading" || status === "ending") {
    return (
      <LoadingState
        title={AUTH_MESSAGES.sessionLoading}
        message="Aguarde enquanto preparamos o caminho correto para voce."
      />
    );
  }

  if (status === "authenticated") {
    return <Navigate to={PRIVATE_ROUTES.app.path} replace />;
  }

  return <Outlet />;
}
