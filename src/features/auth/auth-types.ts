import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import type { ReactNode } from "react";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "ending"
  | "expired"
  | "error";

export type AuthUser = Pick<User, "id" | "email"> & {
  name?: string;
  avatarUrl?: string | null;
};

export type AuthSession = {
  user: AuthUser;
  startedAt: string;
  expiresAt: number | null;
  lastEvent: AuthChangeEvent | "INITIAL_CHECK";
};

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  message: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthServiceResult =
  | { ok: true; message?: string; needsConfirmation?: boolean }
  | { ok: false; message: string };

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = AuthCredentials & {
  name: string;
};

export function toAuthSession(
  session: Session,
  lastEvent: AuthSession["lastEvent"] = "INITIAL_CHECK"
): AuthSession {
  const metadata = session.user.user_metadata;
  const name = readMetadataString(metadata, "full_name") ?? readMetadataString(metadata, "name");
  const avatarUrl =
    readMetadataString(metadata, "avatar_url") ?? readMetadataString(metadata, "picture");

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? "",
      name,
      avatarUrl: avatarUrl ?? null
    },
    startedAt: new Date().toISOString(),
    expiresAt: session.expires_at ?? null,
    lastEvent
  };
}

function readMetadataString(metadata: User["user_metadata"], key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
