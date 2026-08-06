"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type AccountPreferencesUpdate,
  type AccountProfileUpdate,
  type AccountRegistration,
  type AccountRegistrationResult,
  type AccountUser,
} from "@/features/account/auth-adapter";
import { getBrowserAuthService } from "@/services/auth/get-browser-auth-service";
import type { AuthMode } from "@/services/auth/auth-mode";

type AccountContextValue = {
  user: AccountUser | null;
  hydrated: boolean;
  authMode: AuthMode;
  signIn: (email: string, password: string) => Promise<void>;
  registerAccount: (
    registration: AccountRegistration,
  ) => Promise<AccountRegistrationResult>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (profile: AccountProfileUpdate) => Promise<void>;
  updatePreferences: (preferences: AccountPreferencesUpdate) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({
  authMode = "demo",
  children,
  initialUser = null,
}: {
  authMode?: AuthMode;
  children: ReactNode;
  initialUser?: AccountUser | null;
}) {
  const authService = useMemo(
    () => getBrowserAuthService(authMode),
    [authMode],
  );
  const [user, setUser] = useState<AccountUser | null>(initialUser);
  const [hydrated, setHydrated] = useState(authMode === "supabase");

  useEffect(() => {
    if (authMode === "supabase") return;
    const hydrationFrame = window.requestAnimationFrame(() => {
      const session = authService.getSession();
      if (session instanceof Promise) {
        session.then(setUser).finally(() => setHydrated(true));
        return;
      }
      setUser(session);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(hydrationFrame);
  }, [authMode, authService]);

  const value = useMemo<AccountContextValue>(
    () => ({
      user,
      hydrated,
      authMode,
      signIn: async (email, password) => {
        setUser(await authService.signIn(email, password));
      },
      registerAccount: async (registration) => {
        const result = await authService.register(registration);
        setUser(result.user);
        return result;
      },
      requestPasswordReset: (email) => authService.requestPasswordReset(email),
      updateProfile: async (profile) => {
        setUser(await authService.updateProfile(profile));
      },
      updatePreferences: async (preferences) => {
        setUser(await authService.updatePreferences(preferences));
      },
      updatePassword: (password) => authService.updatePassword(password),
      signOut: async () => {
        await authService.signOut();
        setUser(null);
      },
    }),
    [authMode, authService, hydrated, user],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount deve essere usato dentro AccountProvider.");
  }
  return context;
}

export function useOptionalAccount() {
  return useContext(AccountContext);
}
