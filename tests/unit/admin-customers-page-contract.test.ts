import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/clienti/page.tsx"),
  "utf8",
);

describe("admin customers page contract", () => {
  it("usa il backend customer management", () => {
    expect(source).toContain("getAdminCustomers");
    expect(source).toContain("AdminCustomerMarketingFilter");
  });

  it("mostra il riepilogo clienti", () => {
    expect(source).toContain('label="Clienti totali"');
    expect(source).toContain('label="Consenso marketing"');
    expect(source).toContain('label="Con almeno un ordine"');
    expect(source).toContain('label="Clienti paganti"');
    expect(source).toContain('label="Totale acquistato"');
  });

  it("supporta ricerca per cliente", () => {
    expect(source).toContain('name="q"');
    expect(source).toContain("Nome, cognome, email o telefono");
  });

  it("supporta filtro consenso marketing", () => {
    expect(source).toContain('name="marketing"');
    expect(source).toContain('value="consented"');
    expect(source).toContain('value="not_consented"');
  });

  it("mostra le principali metriche per cliente senza tabella orizzontale", () => {
    expect(source).toContain(">Ordini<");
    expect(source).toContain(">Acquistato<");
    expect(source).toContain(">Attività<");
    expect(source).toContain("customer.orderCount");
    expect(source).toContain("customer.paidOrderCount");
    expect(source).toContain("customer.paidGrossAmountMinor");
    expect(source).toContain("table-fixed");
    expect(source).not.toContain("min-w-[1220px]");
    expect(source).not.toContain('className="overflow-x-auto"');
  });

  it("mostra il consenso marketing", () => {
    expect(source).toContain("Consenso attivo");
    expect(source).toContain("Consenso assente");
  });

  it("prevede il collegamento al dettaglio cliente", () => {
    expect(source).toContain("href={`/admin/clienti/${customer.id}`}");
    expect(source).toContain("Dettaglio");
  });

  it("supporta paginazione server-side", () => {
    expect(source).toContain("buildPageHref");
    expect(source).toContain("Precedente");
    expect(source).toContain("Successiva");
  });
});
