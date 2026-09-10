import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("branded email template", () => {
  const template = readFileSync(
    resolve("src/server/email/template.ts"),
    "utf8",
  );

  const message = readFileSync(resolve("src/server/email/message.ts"), "utf8");

  it("usa il brand La Botola e Mietto", () => {
    expect(template).toContain('"La Botola e Mietto"');

    expect(template).toContain("La Botola e Mietto");
  });

  it("include il footer automatico no reply", () => {
    expect(template).toContain(
      "Questa email è stata generata automaticamente.",
    );

    expect(template).toContain(
      "Ti chiediamo di non rispondere a questo messaggio.",
    );
  });

  it("genera sia HTML sia testo", () => {
    expect(template).toContain("return {");

    expect(template).toContain("html,");

    expect(template).toContain("text:");
  });

  it("supporta CTA cliccabile", () => {
    expect(template).toContain("action.label");

    expect(template).toContain("action.href");
  });

  it("usa layout compatibile con client email", () => {
    expect(template).toContain('role="presentation"');

    expect(template).toContain("max-width:640px");
  });

  it("centralizza la creazione del messaggio", () => {
    expect(message).toContain("createBrandedEmailMessage");

    expect(message).toContain("renderBrandedEmail");
  });
});

describe("email logo storage", () => {
  it("usa il logo pubblico Supabase Storage", () => {
    const template = readFileSync(
      resolve("src/server/email/template.ts"),
      "utf8",
    );

    expect(template).toContain(
      "storage/v1/object/public/email-assets/mietto-logo.png",
    );

    expect(template).toContain("<img");
  });
});
