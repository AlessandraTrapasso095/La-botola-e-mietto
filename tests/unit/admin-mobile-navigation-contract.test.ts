import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const navigationSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-mobile-navigation.tsx"),
  "utf8",
);

const layoutSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/layout.tsx"),
  "utf8",
);

describe("admin mobile navigation contract", () => {
  it("espone tutte le principali sezioni admin", () => {
    expect(navigationSource).toContain('"Dashboard"');
    expect(navigationSource).toContain('"Ordini"');
    expect(navigationSource).toContain('"Prodotti"');
    expect(navigationSource).toContain('"Catalogo"');
    expect(navigationSource).toContain('"Sconti"');
    expect(navigationSource).toContain('"Email marketing"');
    expect(navigationSource).toContain('"Clienti"');
    expect(navigationSource).toContain('"Impostazioni"');
  });

  it("è accessibile come drawer mobile", () => {
    expect(navigationSource).toContain('role="dialog"');
    expect(navigationSource).toContain('aria-modal="true"');
    expect(navigationSource).toContain("aria-expanded={open}");
    expect(navigationSource).toContain(
      'aria-controls="admin-mobile-navigation"',
    );
  });

  it("supporta chiusura da backdrop escape e pulsante", () => {
    expect(navigationSource).toContain('event.key === "Escape"');
    expect(navigationSource).toContain("Chiudi menu amministrazione");
    expect(navigationSource).toContain("closeNavigation()");
  });

  it("blocca e ripristina lo scroll quando il menu è aperto", () => {
    expect(navigationSource).toContain(
      'document.body.style.overflow = "hidden"',
    );
    expect(navigationSource).toContain(
      'document.documentElement.style.overflow = "hidden"',
    );
    expect(navigationSource).toContain(
      "document.body.style.overflow = previousBodyOverflow",
    );
    expect(navigationSource).toContain(
      "document.documentElement.style.overflow = previousHtmlOverflow",
    );
  });

  it("evidenzia la route corrente", () => {
    expect(navigationSource).toContain("usePathname");
    expect(navigationSource).toContain(
      'aria-current={active ? "page" : undefined}',
    );
  });

  it("integra il drawer nel layout admin", () => {
    expect(layoutSource).toContain("AdminMobileNavigation");
    expect(layoutSource).toContain("firstName={admin.firstName}");
    expect(layoutSource).toContain("lastName={admin.lastName}");
  });

  it("mantiene la sidebar desktop e il main responsive sotto l'header fisso", () => {
    expect(layoutSource).toContain("lg:flex");
    expect(layoutSource).toContain("w-full min-w-0");
    expect(layoutSource).toContain("px-3");
    expect(layoutSource).toContain("pt-[4.5rem]");
    expect(layoutSource).toContain("sm:px-5");
    expect(layoutSource).toContain("sm:pt-20");
    expect(layoutSource).toContain("md:px-6");
    expect(layoutSource).toContain("lg:px-8");
    expect(layoutSource).toContain("lg:pt-24");
  });
});
