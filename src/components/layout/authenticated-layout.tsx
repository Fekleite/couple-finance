import { LogOut, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { PUBLIC_ROUTES } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getPrivateNavigationItems,
  isPrivateNavigationItemActive,
  type PrivateNavigationItem
} from "@/components/layout/private-navigation";
import { AUTH_MESSAGES } from "@/features/auth/auth-messages";
import { useAuth } from "@/features/auth/use-auth";
import { cn } from "@/lib/utils";

export function AuthenticatedLayout() {
  const { user, status, message, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const compactTriggerRef = useRef<HTMLButtonElement>(null);
  const [compactNavigationOpen, setCompactNavigationOpen] = useState(false);
  const isEnding = status === "ending";
  const displayName = user ? user.name?.trim() || nameFromEmail(user.email) : "Sua conta";
  const email = user?.email || "E-mail indisponivel";
  const initials = initialsFromName(displayName);
  const navigationItems = getPrivateNavigationItems();

  async function handleSignOut() {
    await signOut();
    navigate(PUBLIC_ROUTES.login.path, {
      replace: true,
      state: { message: AUTH_MESSAGES.logoutSuccess }
    });
  }

  function closeCompactNavigation() {
    setCompactNavigationOpen(false);
    compactTriggerRef.current?.focus();
  }

  function handleCompactNavigationClick() {
    setCompactNavigationOpen(false);
  }

  return (
    <section className="min-w-0">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-6 space-y-4 rounded-lg border border-border bg-background p-4">
            <AccountSummary
              displayName={displayName}
              email={email}
              initials={initials}
              avatarUrl={user?.avatarUrl}
            />
            <PrivateNavigation
              items={navigationItems}
              pathname={location.pathname}
              label="Navegacao privada"
            />
            <SignOutButton isEnding={isEnding} onSignOut={handleSignOut} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <header className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-background p-4 md:flex-row md:items-center md:justify-between sm:p-5 lg:hidden">
            <AccountSummary
              displayName={displayName}
              email={email}
              initials={initials}
              avatarUrl={user?.avatarUrl}
            />
            <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 md:w-auto md:shrink-0 md:flex md:items-center">
              <Button
                ref={compactTriggerRef}
                type="button"
                variant="secondary"
                onClick={() => setCompactNavigationOpen((open) => !open)}
                aria-expanded={compactNavigationOpen}
                aria-controls="navegacao-privada-compacta"
                className="w-full md:w-auto"
              >
                {compactNavigationOpen ? (
                  <X className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {compactNavigationOpen ? "Fechar menu" : "Abrir menu"}
              </Button>
              <SignOutButton isEnding={isEnding} onSignOut={handleSignOut} />
            </div>
          </header>

          {compactNavigationOpen ? (
            <div
              id="navegacao-privada-compacta"
              className="rounded-lg border border-border bg-background p-3 lg:hidden"
            >
              <PrivateNavigation
                items={navigationItems}
                pathname={location.pathname}
                label="Navegacao privada compacta"
                onNavigate={handleCompactNavigationClick}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={closeCompactNavigation}
                className="mt-3 w-full justify-center"
              >
                Fechar navegacao
              </Button>
            </div>
          ) : null}

          {message ? (
            <Alert className="max-w-2xl">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
          <Outlet />
        </div>
      </div>
    </section>
  );
}

type AccountSummaryProps = {
  displayName: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
};

function AccountSummary({ displayName, email, initials, avatarUrl }: AccountSummaryProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`Avatar de ${displayName}`}
          className="size-11 shrink-0 rounded-full border border-border object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-muted-foreground"
          aria-label={`Avatar de ${displayName}`}
          role="img"
        >
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold break-words">{displayName}</p>
        <p className="text-sm leading-6 break-words text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}

type PrivateNavigationProps = {
  items: readonly PrivateNavigationItem[];
  pathname: string;
  label: string;
  onNavigate?: () => void;
};

function PrivateNavigation({ items, pathname, label, onNavigate }: PrivateNavigationProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex min-w-0 flex-col gap-1">
        {items.map((item) => {
          const active = isPrivateNavigationItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <li key={item.id} className="min-w-0">
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-10 min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 break-words">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type SignOutButtonProps = {
  isEnding: boolean;
  onSignOut: () => void | Promise<void>;
};

function SignOutButton({ isEnding, onSignOut }: SignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onSignOut}
      disabled={isEnding}
      aria-label={isEnding ? "Saindo da conta" : "Sair da conta"}
      aria-busy={isEnding}
      className="w-full justify-center md:w-auto lg:w-full"
    >
      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
      {isEnding ? "Saindo..." : "Sair"}
    </Button>
  );
}

function nameFromEmail(email: string | undefined): string {
  const localPart = email?.split("@")[0]?.trim();
  return localPart || "Sua conta";
}

function initialsFromName(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2);
  return parts.join("").toUpperCase() || "CF";
}
