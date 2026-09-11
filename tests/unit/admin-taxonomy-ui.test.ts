import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin taxonomy UI", () => {
  const manager = source("src/features/admin/admin-taxonomy-manager.tsx");

  it("keeps only management cards on the main catalog page", () => {
    expect(manager).toContain('title="Marchi"');
    expect(manager).toContain('title="Categorie"');
    expect(manager).toContain('title="Sottocategorie"');

    expect(manager).toContain('browserLabel="Visualizza tutti i marchi"');
    expect(manager).toContain('browserLabel="Visualizza tutte le categorie"');
    expect(manager).toContain(
      'browserLabel="Visualizza tutte le sottocategorie"',
    );
  });

  it("opens a catalog browser with working search", () => {
    expect(manager).toContain("function TaxonomyBrowser");
    expect(manager).toContain('type="search"');
    expect(manager).toContain("normalizedSearch");
    expect(manager).toContain("includes(normalizedSearch)");
  });

  it("shows status and edit controls inside the browser", () => {
    expect(manager).toContain("StatusBadge");
    expect(manager).toContain("Modifica");
    expect(manager).toContain('mode: "edit"');
  });

  it("allows full editing inside the same popup", () => {
    expect(manager).toContain("Conferma modifica marchio");
    expect(manager).toContain("Conferma modifica categoria");
    expect(manager).toContain("Conferma modifica sottocategoria");
    expect(manager).toContain("Salva modifiche");
  });

  it("asks for confirmation before going back from editing", () => {
    expect(manager).toContain("Tornare all’elenco?");
    expect(manager).toContain(
      "Sei sicuro di voler tornare indietro? Le modifiche non salvate andranno perse.",
    );
    expect(manager).toContain("Sì, torna indietro");
  });

  it("never uses native browser confirmation dialogs", () => {
    expect(manager).toContain("AdminConfirmDialog");
    expect(manager).not.toContain("window.confirm");
    expect(manager).not.toContain("window.alert");
    expect(manager).not.toContain("window.prompt");
  });
});

describe("admin taxonomy deletion UI", () => {
  const manager = source("src/features/admin/admin-taxonomy-manager.tsx");

  it("shows status edit and delete for taxonomy rows", () => {
    expect(manager).toContain("StatusBadge");
    expect(manager).toContain("Modifica");
    expect(manager).toContain("Elimina");
  });

  it("requires styled confirmation before deletion", () => {
    expect(manager).toContain('type: "delete"');
    expect(manager).toContain("Sì, elimina");
    expect(manager).toContain(
      "Questa operazione rimuoverà l’elemento dal catalogo. Sei sicuro di voler continuare?",
    );
    expect(manager).toContain("AdminConfirmDialog");
    expect(manager).not.toContain("window.confirm");
  });
});
