import type {
  AccountPreferencesUpdate,
  AccountProfileUpdate,
  AccountRegistration,
  AccountUser,
  AuthService,
} from "@/services/auth/auth-service";

export const accountAccessCredentials = {
  email: "cliente@labotolaemietto.it",
  password: "Cantina18!",
} as const;

export const accountStorageKey = "lbm:account-session:v1";
const responseDelay = 350;

const previewAccount: AccountUser = {
  id: "account-preview",
  firstName: "Giulia",
  lastName: "Ferri",
  email: accountAccessCredentials.email,
  phone: "+39 333 000 0000",
  birthDate: "",
  marketingConsent: true,
  emailUpdates: true,
};

function waitForResponse() {
  return new Promise<void>((resolve) =>
    window.setTimeout(resolve, responseDelay),
  );
}

export function isAccountUser(value: unknown): value is AccountUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AccountUser>;
  return (
    typeof user.id === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.email === "string" &&
    typeof user.phone === "string" &&
    typeof user.birthDate === "string" &&
    typeof user.marketingConsent === "boolean" &&
    typeof user.emailUpdates === "boolean"
  );
}

export class DemoAuthService implements AuthService {
  getSession() {
    try {
      const storedSession = window.localStorage.getItem(accountStorageKey);
      if (!storedSession) return null;
      const parsedSession: unknown = JSON.parse(storedSession);
      return isAccountUser(parsedSession) ? parsedSession : null;
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string) {
    await waitForResponse();
    if (
      email.trim().toLowerCase() !== accountAccessCredentials.email ||
      password !== accountAccessCredentials.password
    ) {
      throw new Error("Le credenziali inserite non sono corrette.");
    }
    await this.persistSession(previewAccount);
    return previewAccount;
  }

  async register(registration: AccountRegistration) {
    await waitForResponse();
    const user = {
      id: `account-${Date.now()}`,
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email.toLowerCase(),
      phone: "",
      birthDate: "",
      marketingConsent: registration.marketingConsent,
      emailUpdates: true,
    };
    await this.persistSession(user);
    return { status: "authenticated" as const, user };
  }

  async requestPasswordReset() {
    await waitForResponse();
  }

  async updateProfile(profile: AccountProfileUpdate) {
    const user = this.getSession();
    if (!user) throw new Error("Sessione non disponibile.");
    const updatedUser = { ...user, ...profile };
    await this.persistSession(updatedUser);
    return updatedUser;
  }

  async updatePreferences(preferences: AccountPreferencesUpdate) {
    const user = this.getSession();
    if (!user) throw new Error("Sessione non disponibile.");
    const updatedUser = { ...user, ...preferences };
    await this.persistSession(updatedUser);
    return updatedUser;
  }

  async updatePassword() {
    await waitForResponse();
  }

  private async persistSession(user: AccountUser) {
    window.localStorage.setItem(accountStorageKey, JSON.stringify(user));
  }

  async signOut() {
    window.localStorage.removeItem(accountStorageKey);
  }
}
