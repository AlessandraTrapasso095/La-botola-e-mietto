import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("promotional email campaigns", () => {
  it("keeps the promotion email contracts", () => {
    const contracts = source("src/server/email/contracts.ts");

    expect(contracts).toContain('"promotion.created"');
    expect(contracts).toContain('"customer-promotion"');
  });

  it("only selects customers with active marketing consent", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).toContain('.eq("role", "customer")');
    expect(promotion).toContain('.eq("marketing_consent", true)');
    expect(promotion).toContain('.is("deleted_at", null)');
  });

  it("does not use email_updates as the marketing consent source", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).not.toContain('.eq("email_updates", true)');
  });

  it("uses campaign id and recipient for idempotent delivery", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).toContain('eventType: "promotion.created"');
    expect(promotion).toContain("entityId: campaignId");
    expect(promotion).toContain("recipient: recipient.email");
  });

  it("tracks each recipient independently", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).toContain("for (const recipient of recipients)");
    expect(promotion).toContain("result.sent += 1");
    expect(promotion).toContain("result.duplicate += 1");
    expect(promotion).toContain("result.failed += 1");
  });

  it("uses the branded customer promotion template", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).toContain('templateKey: "customer-promotion"');
    expect(promotion).toContain(
      "hai fornito il consenso alle comunicazioni promozionali",
    );
  });

  it("does not expose an admin API yet", () => {
    const promotion = source("src/server/email/promotion.ts");

    expect(promotion).toContain("export async function sendPromotionCampaign");
  });
});
