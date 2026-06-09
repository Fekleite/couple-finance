import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/features/auth/auth-context";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { getCurrentSession, onAuthStateChange } from "@/features/auth/auth-service";
import { useAuth } from "@/features/auth/use-auth";

vi.mock("@/features/auth/auth-service", () => ({
  getCurrentSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signOutCurrentSession: vi.fn()
}));

function SessionProbe() {
  const { status, user, message } = useAuth();
  return (
    <div>
      <span>{status}</span>
      <span>{user?.name}</span>
      <span>{user?.email}</span>
      <span>{user?.avatarUrl}</span>
      <span>{message}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(onAuthStateChange).mockReturnValue({ unsubscribe: vi.fn() });
  });

  it("recognizes an existing session during initial load", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: {
        id: "user-1",
        email: "ana@example.com",
        user_metadata: { full_name: "Ana Financeira", avatar_url: "https://example.com/a.png" }
      },
      expires_at: 123
    } as never);

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("authenticated")).toBeInTheDocument());
    expect(screen.getByText("Ana Financeira")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/a.png")).toBeInTheDocument();
  });

  it("shows recoverable error when session check fails", async () => {
    vi.mocked(getCurrentSession).mockRejectedValue(new Error("network"));

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText("error")).toBeInTheDocument());
    expect(screen.getByText(AUTH_MESSAGES.temporaryFailure)).toBeInTheDocument();
  });
});
