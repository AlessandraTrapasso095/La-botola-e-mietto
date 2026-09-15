import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "supabase/migrations/0048_email_marketing_campaigns.sql",
  ),
  "utf8",
);

describe("email marketing campaigns schema contract", () => {
  it("crea la tabella dello storico campagne", () => {
    expect(source).toContain("create table public.email_marketing_campaigns");
  });

  it("usa una campaign key univoca per idempotenza", () => {
    expect(source).toContain("campaign_key text not null");
    expect(source).toContain("email_marketing_campaigns_campaign_key_unique");
  });

  it("salva contenuto e CTA della campagna", () => {
    expect(source).toContain("subject text not null");
    expect(source).toContain("title text not null");
    expect(source).toContain("intro text not null");
    expect(source).toContain("content text not null");
    expect(source).toContain("cta_label text");
    expect(source).toContain("cta_href text");
  });

  it("supporta pubblico completo o selezionato", () => {
    expect(source).toContain("audience_mode in ('all', 'selected')");
    expect(source).toContain("selected_profile_ids uuid[]");
    expect(source).toContain(
      "email_marketing_campaigns_selected_audience_valid",
    );
  });

  it("registra i risultati della campagna", () => {
    expect(source).toContain("eligible_count integer");
    expect(source).toContain("sent_count integer");
    expect(source).toContain("duplicate_count integer");
    expect(source).toContain("failed_count integer");
  });

  it("registra lo stato operativo della campagna", () => {
    expect(source).toContain("'draft'");
    expect(source).toContain("'sending'");
    expect(source).toContain("'completed'");
    expect(source).toContain("'completed_with_errors'");
    expect(source).toContain("'failed'");
    expect(source).toContain("started_at timestamptz");
    expect(source).toContain("completed_at timestamptz");
  });

  it("protegge la tabella con RLS e service role", () => {
    expect(source).toContain("enable row level security");
    expect(source).toContain("from public, anon, authenticated");
    expect(source).toContain("to service_role");
  });

  it("crea indici per storico e stato", () => {
    expect(source).toContain("email_marketing_campaigns_created_at_idx");
    expect(source).toContain("email_marketing_campaigns_status_idx");
  });
});
