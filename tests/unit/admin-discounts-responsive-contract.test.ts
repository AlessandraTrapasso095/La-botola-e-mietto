import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const page = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/sconti/page.tsx"),
  "utf8",
);

const manager = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-promotion-code-manager.tsx",
  ),
  "utf8",
);

describe("admin discounts responsive contract", () => {
  it("elimina gli overflow orizzontali", () => {
    expect(page).not.toContain("overflow-x-auto");
    expect(page).not.toContain("overflow-x-scroll");
  });

  it("usa card responsive per coupon e offerte", () => {
    expect(page.match(/divide-y divide-white\/10 2xl:hidden/g)?.length).toBe(2);

    expect(page.match(/hidden 2xl:block/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("mantiene le tabelle complete solo desktop", () => {
    expect(page).toContain("min-w-[1320px]");
    expect(page).toContain("min-w-[1100px]");
  });

  it("protegge i valori delle summary card", () => {
    expect(page).toContain("min-w-0 overflow-hidden rounded-lg");

    expect(page).toContain("leading-tight font-semibold break-words");
    expect(page).toContain("tabular-nums");
  });

  it("rende i filtri responsive", () => {
    expect(page).toContain(
      "md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_auto]",
    );

    expect(page).toContain("md:grid-cols-2 xl:col-span-1 xl:flex");
  });

  it("rende la paginazione sicura sui telefoni", () => {
    expect(page).toContain("grid grid-cols-2 gap-3 border-t");

    expect(page).toContain("col-span-2 row-start-1 text-center");
  });

  it("rende il manager coupon mobile friendly", () => {
    expect(manager).toContain("grid w-full grid-cols-2 gap-2");

    expect(manager).toContain("min-h-10 w-full items-center justify-center");
  });

  it("rende l'editor coupon sicuro rispetto alla viewport", () => {
    expect(manager).toContain("max-h-[calc(100dvh-1rem)]");

    expect(manager).toContain("overflow-y-auto");
  });
});
