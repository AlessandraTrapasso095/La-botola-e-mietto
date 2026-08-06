import type {
  AccountPreferencesUpdate,
  AccountProfileUpdate,
  AccountRegistration,
  AccountRegistrationResult,
  AccountUser,
} from "@/services/auth/auth-service";
import {
  accountAccessCredentials,
  accountStorageKey,
  DemoAuthService,
  isAccountUser,
} from "@/services/auth/demo-auth-service";

export type {
  AccountPreferencesUpdate,
  AccountProfileUpdate,
  AccountRegistration,
  AccountRegistrationResult,
  AccountUser,
};
export { accountAccessCredentials };

const demoAuthService = new DemoAuthService();

export const browserAccountAuthAdapter = {
  readSession(storage: Storage) {
    try {
      const serialized = storage.getItem(accountStorageKey);
      if (!serialized) return null;
      const parsed: unknown = JSON.parse(serialized);
      return isAccountUser(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  signIn: (email: string, password: string) =>
    demoAuthService.signIn(email, password),
  register: (registration: AccountRegistration) =>
    demoAuthService.register(registration),
  requestPasswordReset: () => demoAuthService.requestPasswordReset(),
  writeSession(storage: Storage, user: AccountUser) {
    storage.setItem(accountStorageKey, JSON.stringify(user));
  },
  clearSession(storage: Storage) {
    storage.removeItem(accountStorageKey);
  },
};
