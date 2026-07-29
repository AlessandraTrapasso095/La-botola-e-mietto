import { describe, expect, it } from "vitest";

import { ageGateConfig } from "@/config/consent";
import {
  clearAgeConfirmation,
  createAgeConfirmationExpiry,
  isAgeConfirmationValueValid,
  serializeAgeConfirmation,
} from "@/features/age-gate/age-gate-storage";

describe("persistenza age gate", () => {
  const now = Date.UTC(2026, 6, 28);

  it("crea una conferma persistente con scadenza configurabile", () => {
    const serialized = serializeAgeConfirmation(now);

    expect(serialized).toContain(`${ageGateConfig.cookieName}=`);
    expect(serialized).toContain("SameSite=Lax");
    expect(serialized).toContain("Path=/");
  });

  it("considera valida una conferma non scaduta", () => {
    const expiry = createAgeConfirmationExpiry(now);

    expect(isAgeConfirmationValueValid(String(expiry), now)).toBe(true);
  });

  it("rifiuta una conferma scaduta o non valida", () => {
    expect(isAgeConfirmationValueValid(String(now - 1), now)).toBe(false);
    expect(isAgeConfirmationValueValid("valore-non-valido", now)).toBe(false);
    expect(isAgeConfirmationValueValid(undefined, now)).toBe(false);
  });

  it("rimuove la conferma quando viene richiesta una nuova verifica", () => {
    document.cookie = serializeAgeConfirmation(now);
    expect(document.cookie).toContain(ageGateConfig.cookieName);

    clearAgeConfirmation(document);

    expect(document.cookie).not.toContain(ageGateConfig.cookieName);
  });
});
