import { useEffect } from "react";

import { PRIVATE_ROUTES } from "@/app/routes";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_MESSAGES } from "@/features/categories/category-messages";
import { CategoryOption } from "@/features/categories/category-option";
import { orderActiveCategories } from "@/features/categories/category-catalog";
import { useCategories } from "@/features/categories/use-categories";
import { setPageTitle } from "@/lib/page-title";

export function CategoriesPage() {
  const { catalogState, refresh } = useCategories();

  useEffect(() => {
    setPageTitle(PRIVATE_ROUTES.categories.title);
  }, []);

  if (catalogState.status === "loading") {
    return (
      <LoadingState
        title={CATEGORY_MESSAGES.loadingTitle}
        message={CATEGORY_MESSAGES.loadingMessage}
      />
    );
  }

  if (catalogState.status === "empty") {
    return <EmptyState title={CATEGORY_MESSAGES.emptyTitle} message={catalogState.message} />;
  }

  if (catalogState.status === "error") {
    return (
      <ErrorState
        title={CATEGORY_MESSAGES.errorTitle}
        message={catalogState.message}
        actionLabel={CATEGORY_MESSAGES.retryLabel}
        onAction={refresh}
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl" aria-labelledby="categories-title">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Catalogo padrao
        </p>
        <h2 id="categories-title" className="mt-2 text-2xl font-bold">
          Categorias financeiras
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Consulte nomes e descricoes para classificar futuras movimentacoes com clareza.
        </p>
      </header>
      <ul className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {orderActiveCategories(catalogState.categories).map((category) => (
          <li key={category.code} className="min-w-0">
            <Card className="h-full" size="sm">
              <CardHeader>
                <CardTitle>
                  <CategoryOption category={category} />
                </CardTitle>
                <CardDescription className="sr-only">
                  Categoria padrao {category.displayName}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Codigo estavel: <code>{category.code}</code>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
