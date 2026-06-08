export const AUTH_MESSAGES = {
  requiredEmail: "Informe seu e-mail.",
  invalidEmail: "Informe um e-mail valido.",
  requiredPassword: "Informe sua senha.",
  weakPassword: "Use pelo menos 8 caracteres.",
  passwordMismatch: "Repita a mesma senha.",
  invalidLogin: "E-mail ou senha invalidos. Confira os dados e tente novamente.",
  existingSignupEmail:
    "Nao foi possivel criar a conta com esses dados. Entre ou recupere o acesso.",
  signupSuccess: "Conta criada com sucesso. Preparando seu espaco privado.",
  signupConfirmation:
    "Conta criada. Se a confirmacao por e-mail estiver ativa, siga as instrucoes enviadas.",
  logoutProgress: "Encerrando sua sessao com seguranca.",
  logoutSuccess: "Seu acesso privado foi encerrado neste dispositivo.",
  sessionLoading: "Verificando seu acesso privado.",
  sessionExpired: "Sua sessao terminou. Entre novamente para continuar.",
  recoveryRequested:
    "Se houver uma conta associada a esse e-mail, enviaremos instrucoes para recuperar o acesso.",
  recoveryLinkInvalid:
    "Este link de redefinicao e invalido ou expirou. Solicite um novo e-mail de recuperacao.",
  passwordUpdated: "Senha atualizada com sucesso. Voce ja pode continuar.",
  temporaryFailure: "Nao foi possivel concluir agora. Tente novamente em instantes.",
  configurationError: "A autenticacao ainda nao esta configurada neste ambiente."
} as const;

export type AuthMessageKey = keyof typeof AUTH_MESSAGES;
