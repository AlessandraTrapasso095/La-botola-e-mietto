import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-customers.ts"),
  "utf8",
);

describe("admin customers server contract", () => {
  it("richiede autenticazione amministratore", () => {
    expect(source).toContain("getServerAdminUser");
    expect(source).toContain(
      'throw new Error("Accesso amministratore richiesto.")',
    );
    expect(source).toContain("await requireAdmin()");
  });

  it("carica esclusivamente profili cliente non eliminati", () => {
    expect(source).toContain('.from("profiles")');
    expect(source).toContain('.eq("role", "customer")');
    expect(source).toContain('.is("deleted_at", null)');
  });

  it("supporta ricerca per nome cognome email e telefono", () => {
    expect(source).toContain("first_name.ilike");
    expect(source).toContain("last_name.ilike");
    expect(source).toContain("email.ilike");
    expect(source).toContain("phone.ilike");
    expect(source).toContain("escapePostgrestSearch");
  });

  it("supporta filtro consenso marketing", () => {
    expect(source).toContain('"consented"');
    expect(source).toContain('"not_consented"');
    expect(source).toContain('.eq("marketing_consent", true)');
    expect(source).toContain('.eq("marketing_consent", false)');
  });

  it("supporta paginazione server-side", () => {
    expect(source).toContain("normalizePage");
    expect(source).toContain("normalizePageSize");
    expect(source).toContain(".range(from, to)");
    expect(source).toContain("totalPages");
  });

  it("calcola numero ordini e ultimo ordine per cliente", () => {
    expect(source).toContain("orderCountByProfile");
    expect(source).toContain("lastOrderAtByProfile");
    expect(source).toContain('order("created_at", { ascending: false })');
  });

  it("calcola acquisti reali solo da ordini pagati e non annullati", () => {
    expect(source).toContain('order.status !== "cancelled"');
    expect(source).toContain('order.payment_status === "paid"');
    expect(source).toContain("paidOrderCountByProfile");
    expect(source).toContain("paidGrossByProfile");
  });

  it("espone un riepilogo globale clienti", () => {
    expect(source).toContain("totalCustomers");
    expect(source).toContain("marketingConsentedCount");
    expect(source).toContain("customersWithOrdersCount");
    expect(source).toContain("paidCustomersCount");
    expect(source).toContain("paidGrossAmountMinor");
  });
});
