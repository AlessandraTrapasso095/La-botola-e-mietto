import {
  accountRegistrationResultSchema,
  accountUserSchema,
} from "@/lib/validation/auth";
import type {
  AccountPreferencesUpdate,
  AccountProfileUpdate,
  AccountRegistration,
  AuthService,
} from "@/services/auth/auth-service";

const genericError = "Non è stato possibile completare l’operazione.";

async function readResponse<T>(
  response: Response,
  parse: (value: unknown) => T,
): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : genericError;
    throw new Error(message);
  }
  return parse(body);
}

async function post<T>(
  path: string,
  payload: unknown,
  parse: (value: unknown) => T,
) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return readResponse(response, parse);
}

export class SupabaseAuthService implements AuthService {
  async getSession() {
    const response = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (response.status === 401) return null;
    return readResponse(response, (value) => accountUserSchema.parse(value));
  }

  signIn(email: string, password: string) {
    return post("/api/auth/login", { email, password }, (value) =>
      accountUserSchema.parse(value),
    );
  }

  register(registration: AccountRegistration) {
    return post("/api/auth/register", registration, (value) =>
      accountRegistrationResultSchema.parse(value),
    );
  }

  async requestPasswordReset(email: string) {
    await post("/api/auth/password-reset", { email }, () => undefined);
  }

  updateProfile(profile: AccountProfileUpdate) {
    return post("/api/account/profile", profile, (value) =>
      accountUserSchema.parse(value),
    );
  }

  updatePreferences(preferences: AccountPreferencesUpdate) {
    return post("/api/account/preferences", preferences, (value) =>
      accountUserSchema.parse(value),
    );
  }

  async updatePassword(password: string) {
    await post("/api/auth/password", { password }, () => undefined);
  }

  async signOut() {
    await post("/api/auth/logout", {}, () => undefined);
  }
}
