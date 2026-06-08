import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/auth-schemas";
import { sendPasswordRecovery } from "@/features/auth/auth-service";
import { setPageTitle } from "@/lib/page-title";

export function ForgotPasswordPage() {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formTone, setFormTone] = useState<"success" | "error">("success");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: ""
    }
  });

  useEffect(() => {
    setPageTitle(PUBLIC_ROUTES.forgotPassword.title);
  }, []);

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormMessage(null);
    const result = await sendPasswordRecovery(values.email);
    setFormTone(result.ok ? "success" : "error");
    setFormMessage(result.message ?? null);
  }

  return (
    <Card className="mx-auto w-full max-w-md min-w-0 overflow-hidden">
      <CardHeader>
        <p className="text-sm font-semibold break-words text-primary uppercase">Acesso privado</p>
        <CardTitle className="text-2xl break-words">Recuperar acesso</CardTitle>
        <CardDescription className="break-words">
          Informe seu e-mail. A resposta nao revela se existe uma conta associada.
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
              <FieldLabel htmlFor="recovery-email">E-mail</FieldLabel>
              <Input
                id="recovery-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "recovery-email-error" : undefined}
                {...register("email")}
              />
              <FieldError id="recovery-email-error" errors={[errors.email]} />
            </Field>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Enviando..." : "Enviar instrucoes"}
            </Button>
            <p className="text-sm leading-6 break-words text-muted-foreground">
              Lembrou a senha?{" "}
              <Link
                className="font-medium break-words text-primary underline-offset-4 hover:underline"
                to={PUBLIC_ROUTES.login.path}
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
