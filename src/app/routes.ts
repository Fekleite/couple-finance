export const PUBLIC_ROUTES = {
  home: {
    path: "/",
    title: "Couple Finance",
    description: "Organizacao financeira para casais com clareza, privacidade e simplicidade.",
    status: "available"
  },
  login: {
    path: "/login",
    title: "Entrar | Couple Finance",
    description: "Entre com e-mail e senha para acessar seu espaco privado.",
    status: "available"
  },
  signUp: {
    path: "/sign-up",
    title: "Criar conta | Couple Finance",
    description: "Crie uma conta para iniciar uma experiencia privada.",
    status: "available"
  },
  forgotPassword: {
    path: "/forgot-password",
    title: "Recuperar acesso | Couple Finance",
    description: "Solicite instrucoes por e-mail para recuperar o acesso.",
    status: "available"
  },
  resetPassword: {
    path: "/reset-password",
    title: "Redefinir senha | Couple Finance",
    description: "Defina uma nova senha a partir de um fluxo valido de recuperacao.",
    status: "available"
  }
} as const;

export const PRIVATE_ROUTES = {
  app: {
    path: "/app",
    title: "Espaco privado | Couple Finance",
    description: "Area autenticada inicial do Couple Finance.",
    status: "available"
  },
  invitation: {
    path: "/app/invites/:invitationId",
    title: "Convite do casal | Couple Finance",
    description: "Visualize e responda a um convite para espaco compartilhado.",
    status: "available"
  },
  categories: {
    path: "/app/categories",
    title: "Categorias financeiras | Couple Finance",
    description: "Consulte o catalogo padrao de categorias financeiras.",
    status: "available"
  }
} as const;

export const FUTURE_PROTECTED_AREAS = [
  {
    label: "Convite de casal",
    intendedFeature: "F02",
    status: "available"
  },
  {
    label: "Dashboard financeiro",
    intendedFeature: "F07",
    status: "planned"
  }
] as const;

export type PublicRouteKey = keyof typeof PUBLIC_ROUTES;
