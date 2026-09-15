import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-settings-panel.tsx"),
  "utf8",
);

describe("admin settings responsive contract", () => {
  it("protegge il wrapper e le sezioni da overflow", () => {
    expect(source).toContain("mt-8 grid min-w-0 gap-6");

    expect(source).toContain("min-w-0 overflow-hidden rounded-lg");
  });

  it("mantiene il profilo a una colonna su telefono", () => {
    expect(source).toContain("mt-6 grid min-w-0 gap-4 sm:grid-cols-2");
  });

  it("rende gli input fluidi nella griglia", () => {
    expect(source).toContain("min-h-11 w-full min-w-0 rounded-md");

    expect(
      source.match(/min-h-11 w-full min-w-0 rounded-md/g)?.length,
    ).toBeGreaterThanOrEqual(7);
  });

  it("protegge email e sicurezza", () => {
    expect(source).toContain("w-full");
    expect(source).toContain("max-w-xl");
    expect(source).toContain("min-w-0");
    expect(source).toContain("[overflow-wrap:anywhere]");
  });

  it("rende i pulsanti principali full-width su telefono", () => {
    expect(source).toContain("w-full rounded-md bg-orange-400");

    expect(source).toContain("sm:w-auto");
  });

  it("protegge le righe delle notifiche", () => {
    expect(source).toContain("flex min-w-0 cursor-pointer items-start");

    expect(source).toContain('className="min-w-0 flex-1"');

    expect(source).toContain("break-words text-white/40");
  });
});
