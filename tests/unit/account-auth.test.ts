import { describe, expect, it, vi } from "vitest";

import {
  accountAccessCredentials,
  browserAccountAuthAdapter,
} from "@/features/account/auth-adapter";

async function resolveDelayed<T>(promise: Promise<T>) {
  await vi.runAllTimersAsync();
  return promise;
}

describe("account auth adapter", () => {
  it("rifiuta credenziali non riconosciute", async () => {
    vi.useFakeTimers();
    const request = browserAccountAuthAdapter.signIn(
      "cliente@example.com",
      "Password18!",
    );
    const rejection = expect(request).rejects.toThrow(
      "Le credenziali inserite non sono corrette.",
    );
    await vi.runAllTimersAsync();
    await rejection;
    vi.useRealTimers();
  });

  it("crea e persiste una sessione valida", async () => {
    vi.useFakeTimers();
    const user = await resolveDelayed(
      browserAccountAuthAdapter.signIn(
        accountAccessCredentials.email,
        accountAccessCredentials.password,
      ),
    );
    browserAccountAuthAdapter.writeSession(window.localStorage, user);

    expect(browserAccountAuthAdapter.readSession(window.localStorage)).toEqual(
      user,
    );
    browserAccountAuthAdapter.clearSession(window.localStorage);
    expect(
      browserAccountAuthAdapter.readSession(window.localStorage),
    ).toBeNull();
    vi.useRealTimers();
  });

  it("registra un profilo senza dipendenze da servizi remoti", async () => {
    vi.useFakeTimers();
    const result = await resolveDelayed(
      browserAccountAuthAdapter.register({
        firstName: "Livia",
        lastName: "Conti",
        email: "LIVIA@EXAMPLE.COM",
        password: "Cantina18!",
        privacyConsent: true,
        marketingConsent: false,
        adultConfirmation: true,
      }),
    );

    expect(result.user).toMatchObject({
      firstName: "Livia",
      lastName: "Conti",
      email: "livia@example.com",
      marketingConsent: false,
    });
    vi.useRealTimers();
  });
});
