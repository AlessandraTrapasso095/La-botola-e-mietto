import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const template = fs.readFileSync(
  path.join(process.cwd(), "src/server/email/template.ts"),
  "utf8",
);

const orderEmail = fs.readFileSync(
  path.join(process.cwd(), "src/server/email/order-created.ts"),
  "utf8",
);

describe("layout email bonifico", () => {
  it("supporta campi strutturati nel template", () => {
    expect(template).toContain("fields?: EmailTemplateSectionField[]");
    expect(template).toContain("section.fields");
  });

  it("separa visivamente etichetta e valore", () => {
    expect(template).toContain("text-transform:uppercase");
    expect(template).toContain("overflow-wrap:anywhere");
  });

  it("crea una sezione bonifico dedicata", () => {
    expect(orderEmail).toContain("bankTransferEmailSection");
    expect(orderEmail).toContain('label: "Intestatario"');
    expect(orderEmail).toContain('label: "IBAN"');
    expect(orderEmail).toContain('label: "Banca"');
    expect(orderEmail).toContain('label: "Causale"');
    expect(orderEmail).toContain('label: "Importo da pagare"');
  });

  it("evidenzia graficamente l'importo", () => {
    expect(orderEmail).toContain("emphasize: true");
  });

  it("mantiene le informazioni operative", () => {
    expect(orderEmail).toContain(
      "Inserisci la causale esattamente come indicata",
    );
    expect(orderEmail).toContain("5-7 giorni lavorativi");
  });
});
