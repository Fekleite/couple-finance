import { useEffect } from "react";

import { PRIVATE_ROUTES } from "@/app/routes";
import { EmptyState } from "@/components/feedback/empty-state";
import { setPageTitle } from "@/lib/page-title";

export function PrivateHomePage() {
  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.app.title);
  }, []);

  return (
    <EmptyState
      title="Seu espaco privado esta pronto"
      message="A autenticacao esta ativa. Convites de casal, dashboard, transacoes, metas e graficos ainda serao implementados em etapas futuras."
    />
  );
}
