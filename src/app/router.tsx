import { createBrowserRouter } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { PublicAuthRoute } from "@/features/auth/public-auth-route";
import { ForgotPasswordPage } from "@/pages/forgot-password-page";
import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { PrivateHomePage } from "@/pages/private-home-page";
import { ResetPasswordPage } from "@/pages/reset-password-page";
import { SignUpPage } from "@/pages/sign-up-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: PUBLIC_ROUTES.home.path,
        element: <HomePage />
      },
      {
        element: <PublicAuthRoute />,
        children: [
          {
            path: PUBLIC_ROUTES.login.path,
            element: <LoginPage />
          },
          {
            path: PUBLIC_ROUTES.signUp.path,
            element: <SignUpPage />
          },
          {
            path: PUBLIC_ROUTES.forgotPassword.path,
            element: <ForgotPasswordPage />
          }
        ]
      },
      {
        path: PUBLIC_ROUTES.resetPassword.path,
        element: <ResetPasswordPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: PRIVATE_ROUTES.app.path,
                element: <PrivateHomePage />
              }
            ]
          }
        ]
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);
