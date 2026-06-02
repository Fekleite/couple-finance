import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import type {
  AuthCredentials,
  AuthServiceResult,
  SignUpCredentials
} from "@/features/auth/auth-types";
import { getSupabaseClient } from "@/lib/supabase";

type AuthSubscription = {
  unsubscribe: () => void;
};

type AuthStateCallback = (event: AuthChangeEvent, session: Session | null) => void;

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw new Error(AUTH_MESSAGES.temporaryFailure);
  }

  return data.session;
}

export function onAuthStateChange(callback: AuthStateCallback): AuthSubscription {
  const { data } = getSupabaseClient().auth.onAuthStateChange(callback);
  return data.subscription;
}

export async function signUpWithEmail({
  name,
  email,
  password
}: SignUpCredentials): Promise<AuthServiceResult> {
  try {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      return { ok: false, message: mapAuthError(error.message, "signup") };
    }

    return {
      ok: true,
      needsConfirmation: !data.session,
      message: data.session ? AUTH_MESSAGES.signupSuccess : AUTH_MESSAGES.signupConfirmation
    };
  } catch {
    return { ok: false, message: AUTH_MESSAGES.configurationError };
  }
}

export async function signInWithEmail({
  email,
  password
}: AuthCredentials): Promise<AuthServiceResult> {
  try {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { ok: false, message: AUTH_MESSAGES.invalidLogin };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: AUTH_MESSAGES.configurationError };
  }
}

export async function signOutCurrentSession(): Promise<AuthServiceResult> {
  try {
    const { error } = await getSupabaseClient().auth.signOut();

    if (error) {
      return { ok: false, message: AUTH_MESSAGES.temporaryFailure };
    }

    return { ok: true, message: AUTH_MESSAGES.logoutSuccess };
  } catch {
    return { ok: false, message: AUTH_MESSAGES.configurationError };
  }
}

export async function sendPasswordRecovery(email: string): Promise<AuthServiceResult> {
  try {
    const redirectTo =
      (import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL as string | undefined) ??
      `${window.location.origin}/reset-password`;
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo
    });

    if (error) {
      return { ok: false, message: AUTH_MESSAGES.temporaryFailure };
    }

    return { ok: true, message: AUTH_MESSAGES.recoveryRequested };
  } catch {
    return { ok: false, message: AUTH_MESSAGES.configurationError };
  }
}

export async function updatePassword(password: string): Promise<AuthServiceResult> {
  try {
    const { error } = await getSupabaseClient().auth.updateUser({ password });

    if (error) {
      return { ok: false, message: mapAuthError(error.message, "reset") };
    }

    return { ok: true, message: AUTH_MESSAGES.passwordUpdated };
  } catch {
    return { ok: false, message: AUTH_MESSAGES.configurationError };
  }
}

function mapAuthError(message: string, flow: "signup" | "reset"): string {
  const normalized = message.toLowerCase();

  if (flow === "signup" && /(already|registered|exists|duplicate)/u.test(normalized)) {
    return AUTH_MESSAGES.existingSignupEmail;
  }

  if (/(weak|password|characters|short)/u.test(normalized)) {
    return AUTH_MESSAGES.weakPassword;
  }

  if (flow === "reset" && /(expired|invalid|token|link)/u.test(normalized)) {
    return AUTH_MESSAGES.recoveryLinkInvalid;
  }

  return AUTH_MESSAGES.temporaryFailure;
}
