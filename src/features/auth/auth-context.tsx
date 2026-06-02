import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "@/features/auth/auth-context-value";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import {
  getCurrentSession,
  onAuthStateChange,
  signOutCurrentSession
} from "@/features/auth/auth-service";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthSession,
  AuthStatus
} from "@/features/auth/auth-types";
import { toAuthSession } from "@/features/auth/auth-types";

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const applySession = useCallback((nextSession: Parameters<typeof toAuthSession>[0] | null) => {
    if (nextSession) {
      setSession(toAuthSession(nextSession));
      setStatus("authenticated");
      setMessage(null);
      return;
    }

    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const refreshSession = useCallback(async () => {
    setStatus((current) => (current === "authenticated" ? current : "loading"));
    try {
      applySession(await getCurrentSession());
    } catch {
      setSession(null);
      setStatus("error");
      setMessage(AUTH_MESSAGES.temporaryFailure);
    }
  }, [applySession]);

  const signOut = useCallback(async () => {
    setStatus("ending");
    setMessage(AUTH_MESSAGES.logoutProgress);
    const result = await signOutCurrentSession();

    if (result.ok) {
      setSession(null);
      setStatus("unauthenticated");
      setMessage(result.message ?? AUTH_MESSAGES.logoutSuccess);
      return;
    }

    setStatus("error");
    setMessage(result.message);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCurrentSession()
      .then((currentSession) => {
        if (!isMounted) {
          return;
        }
        applySession(currentSession);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setSession(null);
        setStatus("error");
        setMessage(AUTH_MESSAGES.temporaryFailure);
      });

    const subscription = subscribeToAuthChanges(() => {
      if (!isMounted) {
        return;
      }
      setSession(null);
      setStatus("error");
      setMessage(AUTH_MESSAGES.configurationError);
    });

    function subscribeToAuthChanges(onSubscriptionError: () => void) {
      try {
        return onAuthStateChange((event, nextSession) => {
          if (!isMounted) {
            return;
          }

          if (nextSession) {
            setSession(toAuthSession(nextSession, event));
            setStatus("authenticated");
            setMessage(null);
            return;
          }

          setSession(null);
          setStatus(event === "TOKEN_REFRESHED" ? "expired" : "unauthenticated");
          setMessage(event === "SIGNED_OUT" ? AUTH_MESSAGES.logoutSuccess : null);
        });
      } catch {
        onSubscriptionError();
        return { unsubscribe: () => undefined };
      }
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      session,
      message,
      signOut,
      refreshSession
    }),
    [message, refreshSession, session, signOut, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
