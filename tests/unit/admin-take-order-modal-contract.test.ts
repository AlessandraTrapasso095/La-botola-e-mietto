import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/order-status-actions.tsx"),
  "utf8",
);

describe("modal prendi in carico ordine", () => {
  it("intercetta il passaggio received -> preparing", () => {
    expect(source).toContain('nextStatus === "preparing"');
    expect(source).toContain("setShowTakeOrderConfirm(true)");
  });

  it("non aggiorna direttamente lo stato dal bottone principale", () => {
    expect(source).toContain("onClick={handleMainAction}");
  });

  it("mostra un dialog accessibile", () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain("Prendi in carico l&apos;ordine?");
  });

  it("spiega il cambio di stato", () => {
    expect(source).toContain("Ricevuto");
    expect(source).toContain("Preso in carico");
  });

  it("espone conferma e annullamento", () => {
    expect(source).toContain("Annulla");
    expect(source).toContain("Conferma");
  });
});
