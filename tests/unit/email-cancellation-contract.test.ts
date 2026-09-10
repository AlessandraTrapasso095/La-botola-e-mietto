import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("email cancellation lifecycle", () => {
  it("defines cancellation event and template contracts", () => {
    const contracts = source("src/server/email/contracts.ts");

    expect(contracts).toContain('"order.cancelled_by_admin"');
    expect(contracts).toContain('"order.cancelled_by_customer"');
    expect(contracts).toContain('"order.cancellation_requested"');
    expect(contracts).toContain('"order.cancellation_approved"');
    expect(contracts).toContain('"order.cancellation_rejected"');

    expect(contracts).toContain('"customer-order-cancelled-admin"');
    expect(contracts).toContain('"customer-order-cancelled-self"');
    expect(contracts).toContain('"customer-cancellation-requested"');
    expect(contracts).toContain('"customer-cancellation-approved"');
    expect(contracts).toContain('"customer-cancellation-rejected"');
    expect(contracts).toContain('"admin-order-cancellation"');
  });

  it("notifies customer and opted-in admins for a customer cancellation request", () => {
    const email = source("src/server/email/order-cancellation.ts");
    const route = source("src/app/api/account/orders/cancel/route.ts");

    expect(email).toContain('admin_notify_cancellations", true');
    expect(email).toContain('templateKey: "customer-cancellation-requested"');
    expect(email).toContain('templateKey: "admin-order-cancellation"');

    expect(route).toContain('result.action === "requested"');
    expect(route).toContain(
      "safelySendCustomerCancellationRequestedEmails(input.orderId)",
    );
    expect(route).toContain(
      "safelySendCustomerOrderCancelledEmails(input.orderId)",
    );
  });

  it("notifies the customer after a direct admin cancellation", () => {
    const route = source("src/app/api/admin/orders/cancel/route.ts");
    const email = source("src/server/email/order-cancellation.ts");

    expect(route).toContain(
      "safelySendAdminOrderCancelledEmail(input.orderId)",
    );
    expect(email).toContain('templateKey: "customer-order-cancelled-admin"');
    expect(email).toContain("customer_cancellation_note");
  });

  it("notifies the customer when an admin approves or rejects the request", () => {
    const route = source("src/app/api/admin/orders/cancellation/route.ts");
    const email = source("src/server/email/order-cancellation.ts");

    expect(route).toContain('result.action === "approved"');
    expect(route).toContain(
      "safelySendCancellationApprovedEmail(input.orderId)",
    );
    expect(route).toContain(
      "safelySendCancellationRejectedEmail(input.orderId)",
    );

    expect(email).toContain('templateKey: "customer-cancellation-approved"');
    expect(email).toContain('templateKey: "customer-cancellation-rejected"');
    expect(email).toContain("refund_amount_minor");
    expect(email).toContain("cancellation_resolution_note");
  });

  it("uses safe-send so email failures never roll back cancellation state", () => {
    const safeSend = source("src/server/email/safe-send.ts");

    expect(safeSend).toContain("safelySendCustomerCancellationRequestedEmails");
    expect(safeSend).toContain("safelySendCustomerOrderCancelledEmails");
    expect(safeSend).toContain("safelySendAdminOrderCancelledEmail");
    expect(safeSend).toContain("safelySendCancellationApprovedEmail");
    expect(safeSend).toContain("safelySendCancellationRejectedEmail");
  });
});
