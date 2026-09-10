import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("registration completed email", () => {
  it("uses the registration completed contract", () => {
    const registration = source("src/server/email/registration.ts");

    expect(registration).toContain('eventType: "auth.registration_completed"');
    expect(registration).toContain(
      'templateKey: "customer-registration-completed"',
    );
  });

  it("only sends the application email to customer profiles", () => {
    const registration = source("src/server/email/registration.ts");

    expect(registration).toContain('if (response.data.role !== "customer")');
  });

  it("uses the user id for idempotency", () => {
    const registration = source("src/server/email/registration.ts");

    expect(registration).toContain("entityId: response.data.id");
    expect(registration).toContain("recipient: response.data.email");
  });

  it("is connected through safe-send", () => {
    const safeSend = source("src/server/email/safe-send.ts");

    expect(safeSend).toContain("safelySendRegistrationCompletedEmail");
    expect(safeSend).toContain("sendRegistrationCompletedEmail(userId)");
  });

  it("is triggered only for signup confirmation", () => {
    const confirm = source("src/app/(storefront)/auth/confirm/route.ts");

    expect(confirm).toContain('requestedType === "signup"');
    expect(confirm).toContain(
      "safelySendRegistrationCompletedEmail(confirmedUser.id)",
    );
  });

  it("does not send the completed-registration email from register POST", () => {
    const register = source("src/app/api/auth/register/route.ts");

    expect(register).not.toContain("safelySendRegistrationCompletedEmail");
  });
});
