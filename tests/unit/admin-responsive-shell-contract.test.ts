import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const layoutSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/layout.tsx"),
  "utf8",
);

const navigationSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-mobile-navigation.tsx"),
  "utf8",
);

const logoutSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-logout-button.tsx"),
  "utf8",
);

const orderStatusSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/order-status-actions.tsx"),
  "utf8",
);

describe("admin responsive shell contract", () => {
  it("impedisce overflow orizzontale globale dell'admin", () => {
    expect(layoutSource).toContain("overflow-x-hidden");
    expect(layoutSource).toContain("min-w-0 lg:pl-64");
  });

  it("usa padding responsive compatto e compensa l'header fisso", () => {
    expect(layoutSource).toContain("px-3");
    expect(layoutSource).toContain("pt-[4.5rem]");
    expect(layoutSource).toContain("sm:px-5");
    expect(layoutSource).toContain("sm:pt-20");
    expect(layoutSource).toContain("md:px-6");
    expect(layoutSource).toContain("lg:px-8");
    expect(layoutSource).toContain("lg:pt-24");
  });

  it("rende il drawer full-screen sui telefoni e compatto da tablet", () => {
    expect(navigationSource).toContain("h-[100dvh]");
    expect(navigationSource).toContain("w-full");
    expect(navigationSource).toContain("flex-col");
    expect(navigationSource).toContain("bg-[#171717]");
    expect(navigationSource).toContain("sm:w-[360px]");
    expect(navigationSource).toContain("sm:max-w-[88vw]");
  });

  it("mantiene il contenuto del drawer scrollabile", () => {
    expect(navigationSource).toContain("min-h-0 flex-1");
    expect(navigationSource).toContain("overflow-y-auto");
    expect(navigationSource).toContain("overscroll-contain");
  });

  it("non contiene classi tailwind concatenate per errore nel logout", () => {
    expect(logoutSource).not.toContain("hover:bg-white/5hover:");
    expect(logoutSource).not.toContain("hover:border-orange-400/40hover:");
  });

  it("limita l'altezza della modale ordine su smartphone", () => {
    expect(orderStatusSource).toContain("max-h-[calc(100dvh-2rem)]");
    expect(orderStatusSource).toContain("overflow-y-auto");
  });
});
