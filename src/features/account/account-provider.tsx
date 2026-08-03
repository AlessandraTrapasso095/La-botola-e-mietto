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
  browserAccountAuthAdapter,
  type AccountProfileUpdate,
  type AccountRegistration,
  type AccountUser,
} from "@/features/account/auth-adapter";

type AccountContextValue = {
  user: AccountUser | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  registerAccount: (registration: AccountRegistration) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (profile: AccountProfileUpdate) => void;
  updateMarketingConsent: (accepted: boolean) => void;
  signOut: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationFrame = window.requestAnimationFrame(() => {
      setUser(browserAccountAuthAdapter.readSession(window.localStorage));
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(hydrationFrame);
  }, []);

  const persistUser = (nextUser: AccountUser) => {
    browserAccountAuthAdapter.writeSession(window.localStorage, nextUser);
    setUser(nextUser);
  };

  const value = useMemo<AccountContextValue>(
    () => ({
      user,
      hydrated,
      signIn: async (email, password) => {
        persistUser(await browserAccountAuthAdapter.signIn(email, password));
      },
      registerAccount: async (registration) => {
        persistUser(await browserAccountAuthAdapter.register(registration));
      },
      requestPasswordReset: (email) =>
        browserAccountAuthAdapter.requestPasswordReset(email),
      updateProfile: (profile) => {
        if (!user) return;
        persistUser({ ...user, ...profile });
      },
      updateMarketingConsent: (marketingConsent) => {
        if (!user) return;
        persistUser({ ...user, marketingConsent });
      },
      signOut: () => {
        browserAccountAuthAdapter.clearSession(window.localStorage);
        setUser(null);
      },
    }),
    [hydrated, user],
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
