import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const adminSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-email-marketing.ts"),
  "utf8",
);

const promotionSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/email/promotion.ts"),
  "utf8",
);

describe("admin email marketing contract", () => {
  it("protegge lettura e invio con autenticazione admin", () => {
    expect(adminSource).toContain("getServerAdminUser");
    expect(adminSource).toContain("await requireAdmin()");
  });

  it("espone tutti i clienti admin ma calcola separatamente gli idonei", () => {
    expect(adminSource).toContain('.eq("role", "customer")');
    expect(adminSource).toContain('.is("deleted_at", null)');
    expect(adminSource).toContain("totalCustomers");
    expect(adminSource).toContain("totalEligible");
    expect(adminSource).toContain("recipient.marketingConsent");
  });

  it("supporta ricerca per nome cognome email e telefono", () => {
    expect(adminSource).toContain("first_name.ilike");
    expect(adminSource).toContain("last_name.ilike");
    expect(adminSource).toContain("email.ilike");
    expect(adminSource).toContain("phone.ilike");
  });

  it("supporta invio a tutti o a una selezione", () => {
    expect(promotionSource).toContain('mode: "all"');
    expect(promotionSource).toContain('mode: "selected"');
    expect(promotionSource).toContain('query.in("id", uniqueProfileIds)');
  });

  it("non consente una selezione vuota", () => {
    expect(promotionSource).toContain(
      'throw new Error("Seleziona almeno un destinatario.")',
    );
    expect(adminSource).toContain(
      'throw new Error("Seleziona almeno un destinatario.")',
    );
  });

  it("mantiene il consenso marketing come filtro anche nella selezione manuale", () => {
    expect(promotionSource).toContain('.eq("marketing_consent", true)');
    expect(promotionSource).toContain('.eq("role", "customer")');
  });

  it("usa il backend email promozionale già esistente", () => {
    expect(adminSource).toContain("sendPromotionCampaign");
    expect(adminSource).toContain("sendAdminMarketingCampaign");
  });

  it("mantiene l'idempotenza per campagna e destinatario", () => {
    expect(promotionSource).toContain("entityId: campaignId");
    expect(promotionSource).toContain("recipient: recipient.email");
  });

  it("registra la campagna prima dell'invio", () => {
    expect(adminSource).toContain('"email_marketing_campaigns"');
    expect(adminSource).toContain("campaign_key: campaignId");
    expect(adminSource).toContain('status: "sending"');
    expect(adminSource).toContain("selected_profile_ids");
  });

  it("aggiorna lo storico con gli esiti reali dell'invio", () => {
    expect(adminSource).toContain("eligible_count: result.eligible");
    expect(adminSource).toContain("sent_count: result.sent");
    expect(adminSource).toContain("duplicate_count: result.duplicate");
    expect(adminSource).toContain("failed_count: result.failed");
    expect(adminSource).toContain("completed_at");
  });

  it("mantiene la campaign id come chiave idempotente", () => {
    expect(adminSource).toContain('onConflict: "campaign_key"');
    expect(adminSource).toContain("const campaignId = input.campaignId.trim()");
    expect(adminSource).toContain("campaign_key: campaignId");
    expect(adminSource).toContain("campaignId,");
  });

  it("marca la campagna come fallita se l'invio genera un errore globale", () => {
    expect(adminSource).toContain('status: "failed"');
    expect(adminSource).toContain(
      "impossibile marcare la campagna come fallita",
    );
  });
});
