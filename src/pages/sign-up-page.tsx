import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { signupSchema, type SignupFormValues } from "@/features/auth/auth-schemas";
import { signUpWithEmail } from "@/features/auth/auth-service";
import { setPageTitle } from "@/lib/page-title";

export function SignUpPage() {
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formTone, setFormTone] = useState<"success" | "error">("success");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    setPageTitle(PUBLIC_ROUTES.signUp.title);
  }, []);

  async function onSubmit(values: SignupFormValues) {
    setFormMessage(null);
    const result = await signUpWithEmail(values);

    if (!result.ok) {
      setFormTone("error");
      setFormMessage(result.message);
      if (result.message === AUTH_MESSAGES.existingSignupEmail) {
        setFocus("email");
      }
      return;
    }

    setFormTone("success");
    setFormMessage(result.message ?? AUTH_MESSAGES.signupSuccess);
    reset();

    if (!result.needsConfirmation) {
      navigate(PRIVATE_ROUTES.app.path, { replace: true });
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md min-w-0 overflow-hidden">
      <CardHeader>
        <p className="text-sm font-semibold break-words text-primary uppercase">Acesso privado</p>
        <CardTitle className="text-2xl break-words">Criar conta</CardTitle>
        <CardDescription className="break-words">
          Use e-mail e senha para iniciar seu espaco privado antes de qualquer dado financeiro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4">
            {formMessage ? (
              <Alert
                variant={formTone === "error" ? "destructive" : "default"}
                role={formTone === "error" ? "alert" : "status"}
              >
                <AlertDescription>{formMessage}</AlertDescription>
              </Alert>
            ) : null}
            <Field className="gap-2" data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="signup-name">Nome</FieldLabel>
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "signup-name-error" : undefined}
                {...register("name")}
              />
              <FieldError id="signup-name-error" errors={[errors.name]} />
            </Field>
            <Field className="gap-2" data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="signup-email">E-mail</FieldLabel>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "signup-email-error" : undefined}
                {...register("email")}
              />
              <FieldError id="signup-email-error" errors={[errors.email]} />
            </Field>
            <Field className="gap-2" data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="signup-password">Senha</FieldLabel>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "signup-password-error" : "signup-password-hint"
                }
                {...register("password")}
              />
              {errors.password ? (
                <FieldError id="signup-password-error" errors={[errors.password]} />
              ) : (
                <FieldDescription id="signup-password-hint">
                  A senha precisa ter 8 caracteres ou mais.
                </FieldDescription>
              )}
            </Field>
            <Field className="gap-2" data-invalid={Boolean(errors.confirmPassword)}>
              <FieldLabel htmlFor="signup-confirm-password">Confirmar senha</FieldLabel>
              <Input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword ? "signup-confirm-password-error" : undefined
                }
                {...register("confirmPassword")}
              />
              <FieldError id="signup-confirm-password-error" errors={[errors.confirmPassword]} />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
            <p className="text-sm leading-6 break-words text-muted-foreground">
              Ja tem conta?{" "}
              <Link
                className="font-medium break-words text-primary underline-offset-4 hover:underline"
                to="/login"
              >
                Entrar
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
