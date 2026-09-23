import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin email marketing runtime input validation", () => {
  const source = readFileSync(
    resolve("src/server/admin/admin-email-marketing.ts"),
    "utf8",
  );

  it("valida campaignId come UUID a runtime", () => {
    expect(source).toContain("campaignId: z.string().trim().uuid()");

    expect(source).toContain(
      "adminMarketingCampaignInputSchema.safeParse(input)",
    );
  });

  it("mantiene i limiti già esposti dalla UI per oggetto titolo e CTA", () => {
    expect(source).toContain("subject: z.string().trim().min(1).max(160)");

    expect(source).toContain("title: z.string().trim().min(1).max(120)");

    expect(source).toContain("ctaLabel: z.string().trim().max(80).optional()");
  });

  it("valida ogni destinatario selezionato come UUID", () => {
    expect(source).toContain("profileIds: z.array(z.string().uuid()).min(1)");

    expect(source).toContain('z.discriminatedUnion("mode"');

    expect(source).toContain('mode: z.literal("all")');

    expect(source).toContain('mode: z.literal("selected")');
  });

  it("richiede testo e link CTA insieme", () => {
    expect(source).toContain("Boolean(ctaLabel) !== Boolean(ctaHref)");

    expect(source).toContain(
      "Testo e link del pulsante devono essere compilati insieme.",
    );
  });

  it("limita il link CTA ai protocolli http e https", () => {
    expect(source).toContain('protocol === "http:" || protocol === "https:"');

    expect(source).toContain("marketingCampaignUrlSchema.safeParse(ctaHref)");
  });

  it("non introduce limiti arbitrari su intro e contenuto", () => {
    expect(source).toContain("intro: z.string().trim().min(1)");

    expect(source).toContain("content: z.string().trim().min(1)");

    expect(source).not.toContain("intro: z.string().trim().min(1).max(");

    expect(source).not.toContain("content: z.string().trim().min(1).max(");
  });
});
