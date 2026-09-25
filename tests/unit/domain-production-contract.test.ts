import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("production domain contract", () => {
  it("uses the .it apex as canonical fallback", () => {
    const metadata = source("src/config/metadata.ts");

    expect(metadata).toContain('defaultSiteUrl = "https://labotolaemietto.it"');

    expect(metadata).not.toContain(
      'defaultSiteUrl = "https://labotolaemietto.com"',
    );
  });

  it("redirects www permanently to the apex .it host", () => {
    const config = source("next.config.ts");

    expect(config).toContain('value: "www.labotolaemietto.it"');

    expect(config).toContain(
      'destination: "https://labotolaemietto.it/:path*"',
    );

    expect(config).toContain("permanent: true");
  });

  it("uses the .it website reference in the privacy page", () => {
    const privacy = source("src/app/(storefront)/privacy-policy/page.tsx");

    expect(privacy).toContain("labotolaemietto.it");
    expect(privacy).not.toContain("www.labotolaemietto.com");
  });

  it("does not silently rewrite business email addresses", () => {
    const business = source("src/config/business.ts");

    expect(business).toContain('email: "info@labotolaemietto.com"');
  });
});
