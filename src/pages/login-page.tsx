import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth-schemas";
import { signInWithEmail } from "@/features/auth/auth-service";
import { setPageTitle } from "@/lib/page-title";

type LoginLocationState = {
  message?: string;
  from?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const [formMessage, setFormMessage] = useState<string | null>(state?.message ?? null);
  const [formTone, setFormTone] = useState<"success" | "error">(
    state?.message ? "success" : "error"
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    setPageTitle(PUBLIC_ROUTES.login.title);
  }, []);

  async function onSubmit(values: LoginFormValues) {
    setFormMessage(null);
    const result = await signInWithEmail(values);

    if (!result.ok) {
      setFormTone("error");
      setFormMessage(result.message);
      return;
    }

    const destination = state?.from?.startsWith("/") ? state.from : PRIVATE_ROUTES.app.path;
    navigate(destination, { replace: true });
  }

  return (
    <Card className="mx-auto w-full max-w-md min-w-0 overflow-hidden">
      <CardHeader>
        <p className="text-sm font-semibold break-words text-primary uppercase">Acesso privado</p>
        <CardTitle className="text-2xl break-words">Entrar</CardTitle>
        <CardDescription className="break-words">
          Acesse seu espaco privado com e-mail e senha. Mensagens de erro preservam sua privacidade.
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
            <Field className="gap-2" data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                {...register("email")}
              />
              <FieldError id="login-email-error" errors={[errors.email]} />
            </Field>
            <Field className="gap-2" data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="login-password">Senha</FieldLabel>
              <Input
                id="login-password"
                type={"password"}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                {...register("password")}
              />
              <FieldError id="login-password-error" errors={[errors.password]} />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
            <div className="space-y-2 text-sm leading-6 break-words text-muted-foreground">
              <p>
                Ainda nao tem conta?{" "}
                <Link
                  className="font-medium break-words text-primary underline-offset-4 hover:underline"
                  to={PUBLIC_ROUTES.signUp.path}
                >
                  Criar conta
                </Link>
              </p>
              <p>
                Esqueceu a senha?{" "}
                <Link
                  className="font-medium break-words text-primary underline-offset-4 hover:underline"
                  to={PUBLIC_ROUTES.forgotPassword.path}
                >
                  Recuperar acesso
                </Link>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
