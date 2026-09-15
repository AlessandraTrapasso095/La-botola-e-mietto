import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-taxonomy-manager.tsx"),
  "utf8",
);

describe("admin taxonomy management cards responsive contract", () => {
  it("usa una sola ManagementCard condivisa dalle tre sezioni", () => {
    expect(source).toContain('title="Marchi"');
    expect(source).toContain('title="Categorie"');
    expect(source).toContain('title="Sottocategorie"');
    expect(source).toContain("function ManagementCard");
  });

  it("impedisce alla card di allargare la pagina", () => {
    expect(source).toContain("min-w-0 overflow-hidden rounded-xl");
  });

  it("mantiene titolo e pulsante in verticale fino al tablet", () => {
    expect(source).toContain("md:grid-cols-[minmax(0,1fr)_auto]");
  });

  it("rende Visualizza tutte full-width sui telefoni", () => {
    expect(source).toContain(
      "min-h-11 w-full min-w-0 items-center justify-center",
    );
    expect(source).toContain("md:w-auto");
  });

  it("permette ai testi lunghi di andare a capo", () => {
    expect(source).toContain("font-semibold break-words text-white");
    expect(source).toContain("leading-5 font-semibold break-words");
  });

  it("protegge anche il contenuto dei form", () => {
    expect(source).toContain('<div className="min-w-0 pt-5">{children}</div>');
  });
});
