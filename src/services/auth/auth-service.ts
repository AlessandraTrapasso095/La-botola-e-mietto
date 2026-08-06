export type AccountUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  marketingConsent: boolean;
  emailUpdates: boolean;
};

export type AccountRegistration = Pick<
  AccountUser,
  "firstName" | "lastName" | "email" | "marketingConsent"
> & {
  password: string;
  privacyConsent: boolean;
  adultConfirmation: boolean;
};

export type AccountProfileUpdate = Pick<
  AccountUser,
  "firstName" | "lastName" | "email" | "phone" | "birthDate"
>;

export type AccountPreferencesUpdate = Pick<
  AccountUser,
  "marketingConsent" | "emailUpdates"
>;

export type AccountRegistrationResult = {
  status: "authenticated" | "confirmation-required";
  user: AccountUser | null;
};

export type AccountConsentHistoryEntry = {
  id: string;
  type: "privacy" | "marketing" | "age_confirmation";
  granted: boolean;
  createdAt: string;
};

export interface AuthService {
  getSession(): AccountUser | null | Promise<AccountUser | null>;
  signIn(email: string, password: string): Promise<AccountUser>;
  register(
    registration: AccountRegistration,
  ): Promise<AccountRegistrationResult>;
  requestPasswordReset(email: string): Promise<void>;
  updateProfile(profile: AccountProfileUpdate): Promise<AccountUser>;
  updatePreferences(
    preferences: AccountPreferencesUpdate,
  ): Promise<AccountUser>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}
