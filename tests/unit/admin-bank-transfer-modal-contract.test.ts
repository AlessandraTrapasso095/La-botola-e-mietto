import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/confirm-bank-transfer-button.tsx",
  ),
  "utf8",
);

describe("modal conferma bonifico admin", () => {
  it("non usa il confirm nativo del browser", () => {
    expect(source).not.toContain("window.confirm");
  });

  it("mostra un dialog accessibile", () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain("Conferma ricezione bonifico");
  });

  it("espone conferma e annullamento", () => {
    expect(source).toContain("Conferma pagamento");
    expect(source).toContain("Annulla");
  });

  it("ricorda che lo stato ordine non cambia", () => {
    expect(source).toContain("stato dell&apos;ordine resterà invariato.");
  });
});
