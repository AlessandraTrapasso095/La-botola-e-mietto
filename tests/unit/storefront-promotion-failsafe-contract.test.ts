import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/catalog/storefront-promotion.ts"),
  "utf8",
);

describe("storefront promotion fail-safe contract", () => {
  it("isola il caricamento reale della promozione", () => {
    expect(source).toContain(
      "async function loadStorefrontPromotion(): Promise<StorefrontPromotion | null>",
    );
  });

  it("non lascia propagare errori della promo al render storefront", () => {
    expect(source).toContain("try {");
    expect(source).toContain("return await loadStorefrontPromotion()");
    expect(source).toContain("catch (error)");
    expect(source).toContain("return null");
  });

  it("registra l'errore lato server senza esporlo al cliente", () => {
    expect(source).toContain(
      '"[storefront-promotion] impossibile caricare la promozione"',
    );

    expect(source).toContain(
      "error instanceof Error ? error.message : String(error)",
    );
  });

  it("mantiene il service role confinato al loader server-side", () => {
    const loaderIndex = source.indexOf(
      "async function loadStorefrontPromotion()",
    );

    const adminIndex = source.indexOf(
      "createSupabaseAdminClient()",
    );

    expect(loaderIndex).toBeGreaterThan(-1);
    expect(adminIndex).toBeGreaterThan(loaderIndex);
  });
});
