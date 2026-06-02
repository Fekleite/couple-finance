import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { LoadingState } from "@/components/feedback/loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/auth-schemas";
import { updatePassword } from "@/features/auth/auth-service";
import { useAuth } from "@/features/auth/use-auth";
import { setPageTitle } from "@/lib/page-title";

export function ResetPasswordPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string | null>(
    status === "unauthenticated" ? AUTH_MESSAGES.recoveryLinkInvalid : null
  );
  const [formTone, setFormTone] = useState<"success" | "error">("error");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    setPageTitle(PUBLIC_ROUTES.resetPassword.title);
  }, []);

  async function onSubmit(values: ResetPasswordFormValues) {
    setFormMessage(null);
    const result = await updatePassword(values.password);

    if (!result.ok) {
      setFormTone("error");
      setFormMessage(result.message);
      return;
    }

    setFormTone("success");
    setFormMessage(result.message ?? AUTH_MESSAGES.passwordUpdated);
    navigate(PRIVATE_ROUTES.app.path, { replace: true });
  }

  if (status === "loading") {
    return (
      <LoadingState
        title="Validando link de recuperacao"
        message="Aguarde enquanto confirmamos se este fluxo de redefinicao ainda esta valido."
      />
    );
  }

  const invalidLink = status === "unauthenticated";

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Acesso privado</p>
        <CardTitle className="text-2xl">Redefinir senha</CardTitle>
        <CardDescription>
          Defina uma nova senha quando o link de recuperacao estiver valido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formMessage ? (
            <Alert variant={formTone === "error" ? "destructive" : "default"}>
              <AlertDescription>{formMessage}</AlertDescription>
            </Alert>
          ) : null}
          {invalidLink ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Solicite um novo e-mail em{" "}
              <Link
                className="font-medium text-primary underline-offset-4 hover:underline"
                to={PUBLIC_ROUTES.forgotPassword.path}
              >
                recuperar acesso
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="gap-4">
                <Field className="gap-2" data-invalid={Boolean(errors.password)}>
                  <FieldLabel htmlFor="reset-password">Nova senha</FieldLabel>
                  <Input
                    id="reset-password"
                    type={"password"}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "reset-password-error" : "reset-password-hint"
                    }
                    {...register("password")}
                  />
                  {errors.password ? (
                    <FieldError id="reset-password-error" errors={[errors.password]} />
                  ) : (
                    <FieldDescription id="reset-password-hint">
                      A nova senha precisa ter 8 caracteres ou mais.
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-2" data-invalid={Boolean(errors.confirmPassword)}>
                  <FieldLabel htmlFor="reset-confirm-password">Confirmar nova senha</FieldLabel>
                  <Input
                    id="reset-confirm-password"
                    type={"password"}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword ? "reset-confirm-password-error" : undefined
                    }
                    {...register("confirmPassword")}
                  />
                  <FieldError id="reset-confirm-password-error" errors={[errors.confirmPassword]} />
                </Field>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                  {isSubmitting ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </FieldGroup>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
