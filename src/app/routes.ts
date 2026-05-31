export const PUBLIC_ROUTES = {
  home: {
    path: "/",
    title: "Couple Finance",
    description: "Organizacao financeira para casais com clareza, privacidade e simplicidade.",
    status: "available"
  }
} as const;

export const FUTURE_PROTECTED_AREAS = [
  {
    label: "Autenticacao",
    intendedFeature: "F01",
    status: "planned"
  },
  {
    label: "Convite de casal",
    intendedFeature: "F02",
    status: "planned"
  },
  {
    label: "Dashboard financeiro",
    intendedFeature: "F07",
    status: "planned"
  }
] as const;

export type PublicRouteKey = keyof typeof PUBLIC_ROUTES;
