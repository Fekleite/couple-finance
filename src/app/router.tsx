import { Navigate, createBrowserRouter } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { PublicAuthRoute } from "@/features/auth/public-auth-route";
import { AuditPage } from "@/pages/audit-page";
import { ForgotPasswordPage } from "@/pages/forgot-password-page";
import { GoalsPage } from "@/pages/goals-page";
import { InvitationPage } from "@/pages/invitation-page";
import { LoginPage } from "@/pages/login-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { PrivateHomePage } from "@/pages/private-home-page";
import { ResetPasswordPage } from "@/pages/reset-password-page";
import { SignUpPage } from "@/pages/sign-up-page";
import { CategoriesPage } from "@/pages/categories-page";
import { NewTransactionPage } from "@/pages/new-transaction-page";
import { TransactionsPage } from "@/pages/transactions-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: PUBLIC_ROUTES.home.path,
        element: <Navigate to={PUBLIC_ROUTES.login.path} replace />
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
              },
              {
                path: PRIVATE_ROUTES.invitation.path,
                element: <InvitationPage />
              },
              {
                path: PRIVATE_ROUTES.categories.path,
                element: <CategoriesPage />
              },
              {
                path: PRIVATE_ROUTES.transactions.path,
                element: <TransactionsPage />
              },
              {
                path: PRIVATE_ROUTES.goals.path,
                element: <GoalsPage />
              },
              {
                path: PRIVATE_ROUTES.audit.path,
                element: <AuditPage />
              },
              {
                path: PRIVATE_ROUTES.newTransaction.path,
                element: <NewTransactionPage />
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
