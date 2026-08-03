export type AccountUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  marketingConsent: boolean;
};

export type AccountRegistration = Pick<
  AccountUser,
  "firstName" | "lastName" | "email" | "marketingConsent"
> & {
  password: string;
};

export type AccountProfileUpdate = Pick<
  AccountUser,
  "firstName" | "lastName" | "email" | "phone" | "birthDate"
>;

export type AccountAuthAdapter = {
  readSession: (storage: Storage) => AccountUser | null;
  signIn: (email: string, password: string) => Promise<AccountUser>;
  register: (registration: AccountRegistration) => Promise<AccountUser>;
  requestPasswordReset: (email: string) => Promise<void>;
  writeSession: (storage: Storage, user: AccountUser) => void;
  clearSession: (storage: Storage) => void;
};

export const accountAccessCredentials = {
  email: "cliente@labotolaemietto.it",
  password: "Cantina18!",
} as const;

const accountStorageKey = "lbm:account-session:v1";
const responseDelay = 350;

const previewAccount: AccountUser = {
  id: "account-preview",
  firstName: "Giulia",
  lastName: "Ferri",
  email: accountAccessCredentials.email,
  phone: "+39 333 000 0000",
  birthDate: "",
  marketingConsent: true,
};

function waitForResponse() {
  return new Promise<void>((resolve) =>
    window.setTimeout(resolve, responseDelay),
  );
}

function isAccountUser(value: unknown): value is AccountUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AccountUser>;
  return (
    typeof user.id === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.email === "string" &&
    typeof user.phone === "string" &&
    typeof user.birthDate === "string" &&
    typeof user.marketingConsent === "boolean"
  );
}

export const browserAccountAuthAdapter: AccountAuthAdapter = {
  readSession(storage) {
    try {
      const storedSession = storage.getItem(accountStorageKey);
      if (!storedSession) return null;
      const parsedSession: unknown = JSON.parse(storedSession);
      return isAccountUser(parsedSession) ? parsedSession : null;
    } catch {
      return null;
    }
  },
  async signIn(email, password) {
    await waitForResponse();
    if (
      email.trim().toLowerCase() !== accountAccessCredentials.email ||
      password !== accountAccessCredentials.password
    ) {
      throw new Error("Le credenziali inserite non sono corrette.");
    }
    return previewAccount;
  },
  async register(registration) {
    await waitForResponse();
    return {
      id: `account-${Date.now()}`,
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email.toLowerCase(),
      phone: "",
      birthDate: "",
      marketingConsent: registration.marketingConsent,
    };
  },
  async requestPasswordReset() {
    await waitForResponse();
  },
  writeSession(storage, user) {
    storage.setItem(accountStorageKey, JSON.stringify(user));
  },
  clearSession(storage) {
    storage.removeItem(accountStorageKey);
  },
};
