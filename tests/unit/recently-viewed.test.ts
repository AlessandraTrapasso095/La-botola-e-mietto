import { describe, expect, it } from "vitest";

import {
  readRecentlyViewed,
  registerRecentlyViewed,
} from "@/features/product/recently-viewed-storage";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("prodotti visti di recente", () => {
  it("mantiene ordine, deduplica e limite massimo", () => {
    const storage = createStorage();
    ["uno", "due", "tre", "quattro", "cinque", "sei", "sette", "tre"].forEach(
      (slug) => registerRecentlyViewed(storage, slug),
    );

    expect(readRecentlyViewed(storage)).toEqual([
      "tre",
      "sette",
      "sei",
      "cinque",
      "quattro",
      "due",
    ]);
  });

  it("ignora dati non validi", () => {
    const storage = {
      getItem: () => "{non-json",
      setItem: () => undefined,
    };
    expect(readRecentlyViewed(storage)).toEqual([]);
  });
});
