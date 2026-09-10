import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin delivered email", () => {
  it("keeps customer delivery notification", () => {
    const status = source("src/server/email/order-status.ts");

    expect(status).toContain('"customer-order-delivered"');
    expect(status).toContain('audience: "customer"');
  });

  it("notifies opted-in admins when an order is delivered", () => {
    const status = source("src/server/email/order-status.ts");

    expect(status).toContain('.eq("role", "admin")');
    expect(status).toContain('.eq("admin_notify_shipping", true)');
    expect(status).toContain('"admin-order-delivered"');
    expect(status).toContain('audience: "admin"');
  });

  it("uses independent idempotency for customer and admin recipients", () => {
    const status = source("src/server/email/order-status.ts");

    expect(status).toContain("const adminEventKey = createEmailEventKey");
    expect(status).toContain("recipient: recipient.email");
  });

  it("includes order and customer context for the admin", () => {
    const status = source("src/server/email/order-status.ts");

    expect(status).toContain('title: "Cliente"');
    expect(status).toContain('title: "Consegna"');
    expect(status).toContain('label: "Apri ordine in admin"');
  });
});
