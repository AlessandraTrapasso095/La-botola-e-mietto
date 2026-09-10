import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("email provider foundation", () => {
  const config = readFileSync(resolve("src/server/email/config.ts"), "utf8");

  const provider = readFileSync(
    resolve("src/server/email/provider.ts"),
    "utf8",
  );

  const sender = readFileSync(resolve("src/server/email/send.ts"), "utf8");

  it("usa Resend come provider", () => {
    expect(provider).toContain('from "resend"');

    expect(config).toContain('"resend"');
  });

  it("richiede configurazione email server-side", () => {
    expect(config).toContain("EMAIL_PROVIDER_API_KEY");

    expect(config).toContain("EMAIL_FROM_ADDRESS");
  });

  it("usa nome e indirizzo mittente configurabili", () => {
    expect(provider).toContain("configuration.fromName");

    expect(provider).toContain("configuration.fromAddress");
  });

  it("non considera configurato il provider senza credenziali", () => {
    expect(config).toContain("return null");
  });

  it("registra l'invio tramite delivery log", () => {
    expect(sender).toContain("reserveEmailDelivery");

    expect(sender).toContain("markEmailDeliverySent");

    expect(sender).toContain("markEmailDeliveryFailed");
  });

  it("salta una email già inviata", () => {
    expect(sender).toContain('reservation.status !== "failed"');

    expect(sender).toContain("duplicate: true");
  });
});
