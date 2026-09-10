import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("account security email lifecycle", () => {
  it("keeps password security contracts", () => {
    const contracts = source("src/server/email/contracts.ts");

    expect(contracts).toContain('"auth.password_changed"');
    expect(contracts).toContain('"customer-password-changed"');
    expect(contracts).toContain('"admin-password-changed"');
  });

  it("selects the customer or admin template from the account role", () => {
    const email = source("src/server/email/account-security.ts");

    expect(email).toContain('account.role === "admin"');
    expect(email).toContain('"admin-password-changed"');
    expect(email).toContain('"customer-password-changed"');
  });

  it("never includes the new password in the email sender", () => {
    const email = source("src/server/email/account-security.ts");

    expect(email).not.toContain("password: string");
    expect(email).not.toContain("newPassword");
    expect(email).toContain(
      "questa email non contiene e non mostrerà mai la tua password",
    );
  });

  it("sends the email only after Supabase accepts the password update", () => {
    const route = source("src/app/api/auth/password/route.ts");

    const updateIndex = route.indexOf("client.auth.updateUser");
    const emailIndex = route.indexOf("safelySendPasswordChangedEmail(");

    expect(updateIndex).toBeGreaterThan(-1);
    expect(emailIndex).toBeGreaterThan(updateIndex);
  });

  it("uses safe-send so email failure does not undo the password change", () => {
    const safeSend = source("src/server/email/safe-send.ts");

    expect(safeSend).toContain("safelySendPasswordChangedEmail");
    expect(safeSend).toContain(
      "sendPasswordChangedEmail(userId, occurrenceId)",
    );
  });
});

describe("admin email change lifecycle", () => {
  it("notifies the existing admin address when an email change is requested", () => {
    const email = source("src/server/email/account-security.ts");
    const route = source("src/app/api/admin/settings/email/route.ts");

    expect(email).toContain('"auth.email_change_requested"');
    expect(email).toContain("sendAdminEmailChangeRequestedEmail");
    expect(route).toContain("safelySendAdminEmailChangeRequestedEmail");
  });

  it("synchronizes profiles.email after Supabase confirms the new address", () => {
    const confirm = source("src/app/(storefront)/auth/confirm/route.ts");

    expect(confirm).toContain("confirmedUser?.email");
    expect(confirm).toContain(
      "profileResponse.data.email !== confirmedUser.email",
    );
    expect(confirm).toContain("email: confirmedUser.email");
  });

  it("notifies the admin at the confirmed new address", () => {
    const email = source("src/server/email/account-security.ts");
    const confirm = source("src/app/(storefront)/auth/confirm/route.ts");

    expect(email).toContain('"auth.email_changed"');
    expect(email).toContain("sendAdminEmailChangedEmail");
    expect(confirm).toContain("safelySendAdminEmailChangedEmail");
  });
});

describe("security event idempotency", () => {
  it("uses a unique occurrence id for every password change", () => {
    const email = source("src/server/email/account-security.ts");
    const route = source("src/app/api/auth/password/route.ts");

    expect(email).toContain("`${account.id}:${occurrenceId}`");
    expect(route).toContain("passwordChangeOccurrenceId");
    expect(route).toContain("updatedUserData.user.updated_at");
  });

  it("uses a unique occurrence id for admin email changes", () => {
    const email = source("src/server/email/account-security.ts");
    const adminRoute = source("src/app/api/admin/settings/email/route.ts");
    const confirmRoute = source("src/app/(storefront)/auth/confirm/route.ts");

    expect(email).toContain("`${account.id}:${occurrenceId}`");
    expect(email).toContain("`${userId}:${occurrenceId}`");
    expect(adminRoute).toContain("emailChangeOccurrenceId");
    expect(adminRoute).toContain("updatedUserData.user.updated_at");
    expect(confirmRoute).toContain("emailChangedOccurrenceId");
    expect(confirmRoute).toContain("confirmedUser.updated_at");
  });
});
