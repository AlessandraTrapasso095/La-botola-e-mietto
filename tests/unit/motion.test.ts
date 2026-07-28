import { describe, expect, it } from "vitest";

import {
  prefersReducedMotion,
  reducedMotionMediaQuery,
} from "@/lib/browser/motion";

describe("prefersReducedMotion", () => {
  it("legge la preferenza di sistema", () => {
    const matchMedia = (query: string) => ({
      matches: query === reducedMotionMediaQuery,
    });

    expect(prefersReducedMotion(matchMedia)).toBe(true);
  });

  it("usa un fallback sicuro senza browser API", () => {
    expect(prefersReducedMotion(undefined)).toBe(false);
  });
});
