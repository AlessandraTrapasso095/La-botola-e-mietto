import { describe, expect, it } from "vitest";

import {
  calculateProductThumbnailDimensions,
  getProductImageAdvisories,
  validateProductImageDimensions,
} from "@/lib/product-image-processing";

describe("product image processing", () => {
  it("accepts valid image dimensions", () => {
    expect(
      validateProductImageDimensions({
        width: 1200,
        height: 1500,
      }),
    ).toBeNull();
  });

  it("rejects invalid or excessive dimensions", () => {
    expect(
      validateProductImageDimensions({
        width: 0,
        height: 1500,
      }),
    ).toContain("non sono valide");

    expect(
      validateProductImageDimensions({
        width: 20001,
        height: 1500,
      }),
    ).toContain("20000 px");
  });

  it("reports low resolution and non-4:5 images as advisories", () => {
    const advisories = getProductImageAdvisories({
      width: 600,
      height: 600,
    });

    expect(advisories).toHaveLength(2);
    expect(advisories[0]).toContain("800 × 1000");
    expect(advisories[1]).toContain("4:5");
  });

  it("does not report advisories for a recommended image", () => {
    expect(
      getProductImageAdvisories({
        width: 1200,
        height: 1500,
      }),
    ).toEqual([]);
  });

  it("creates proportional thumbnail dimensions without upscaling", () => {
    expect(
      calculateProductThumbnailDimensions({
        width: 2400,
        height: 3000,
      }),
    ).toEqual({
      width: 480,
      height: 600,
    });

    expect(
      calculateProductThumbnailDimensions({
        width: 320,
        height: 400,
      }),
    ).toEqual({
      width: 320,
      height: 400,
    });
  });
});
