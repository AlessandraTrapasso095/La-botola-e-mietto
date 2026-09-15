import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const serverHeader = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/site-header.tsx"),
  "utf8",
);

const clientHeader = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/site-header-client.tsx"),
  "utf8",
);

describe("storefront promotion header plumbing contract", () => {
  it("carica la promo storefront lato server", () => {
    expect(serverHeader).toContain("getStorefrontPromotion");
    expect(serverHeader).toContain("Promise.all");
    expect(serverHeader).toContain("storefrontPromotion");
  });

  it("passa la promo al client header", () => {
    expect(serverHeader).toContain("storefrontPromotion={storefrontPromotion}");
  });

  it("tipizza la prop come promo o null", () => {
    expect(clientHeader).toContain(
      "storefrontPromotion: StorefrontPromotion | null",
    );
  });

  it("riceve la prop nel componente client", () => {
    expect(clientHeader).toContain("storefrontPromotion,");
  });

  it("non modifica ancora il layout della barra", () => {
    expect(clientHeader).toContain("Spedizione gratuita in Italia sopra");
  });
});
