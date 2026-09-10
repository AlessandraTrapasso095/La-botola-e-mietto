import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("email delivery architecture", () => {
  const migration = readFileSync(
    resolve("supabase/migrations/0027_email_delivery_log.sql"),
    "utf8",
  );

  const contracts = readFileSync(
    resolve("src/server/email/contracts.ts"),
    "utf8",
  );

  const eventKey = readFileSync(
    resolve("src/server/email/event-key.ts"),
    "utf8",
  );

  const deliveryLog = readFileSync(
    resolve("src/server/email/delivery-log.ts"),
    "utf8",
  );

  it("impedisce duplicati tramite event_key univoca", () => {
    expect(migration).toContain("email_deliveries_event_key_unique");

    expect(migration).toContain("on public.email_deliveries(event_key)");
  });

  it("supporta pending sent failed e skipped", () => {
    expect(migration).toContain("'pending'");
    expect(migration).toContain("'sent'");
    expect(migration).toContain("'failed'");
    expect(migration).toContain("'skipped'");
  });

  it("registra identificativo provider e tentativi", () => {
    expect(migration).toContain("provider_message_id");

    expect(migration).toContain("attempt_count");
  });

  it("definisce gli eventi principali cliente e admin", () => {
    expect(contracts).toContain('"order.created"');

    expect(contracts).toContain('"order.shipped"');

    expect(contracts).toContain('"order.delivered"');

    expect(contracts).toContain('"order.cancelled_by_admin"');

    expect(contracts).toContain('"promotion.created"');
  });

  it("costruisce una chiave evento per audience e destinatario", () => {
    expect(eventKey).toContain("eventType");

    expect(eventKey).toContain("entityId");

    expect(eventKey).toContain("audience");

    expect(eventKey).toContain("recipient");
  });

  it("riserva un invio prima di spedire l'email", () => {
    expect(deliveryLog).toContain("reserveEmailDelivery");

    expect(deliveryLog).toContain('status: "pending"');
  });

  it("gestisce sent failed e skipped", () => {
    expect(deliveryLog).toContain("markEmailDeliverySent");

    expect(deliveryLog).toContain("markEmailDeliveryFailed");

    expect(deliveryLog).toContain("markEmailDeliverySkipped");
  });
});
