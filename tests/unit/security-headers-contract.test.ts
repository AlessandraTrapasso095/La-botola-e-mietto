import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("security headers contract", () => {
  const config = source("next.config.ts");

  it("applies security headers to every application route", () => {
    expect(config).toContain('source: "/(.*)"');
    expect(config).toContain("headers: securityHeaders");
    expect(config).toContain("poweredByHeader: false");
  });

  it("defines a restrictive content security policy", () => {
    expect(config).toContain(`"default-src 'self'"`);
    expect(config).toContain(`"object-src 'none'"`);
    expect(config).toContain(`"script-src-attr 'none'"`);
    expect(config).toContain(`"frame-src 'none'"`);
    expect(config).toContain(`"manifest-src 'self'"`);
    expect(config).toContain(`"base-uri 'self'"`);
    expect(config).toContain(`"form-action 'self'"`);
    expect(config).toContain(`"frame-ancestors 'none'"`);
  });

  it("allows only the image and connection sources used by the app", () => {
    expect(config).toContain(
      `"img-src 'self' data: blob: https://*.supabase.co"`,
    );
    expect(config).toContain(
      `"connect-src 'self' https://*.supabase.co wss://*.supabase.co"`,
    );
  });

  it("keeps development-only eval out of production CSP", () => {
    expect(config).toContain(`isDevelopment ? " 'unsafe-eval'" : ""`);
    expect(config).toContain(
      `isDevelopment ? [] : ["upgrade-insecure-requests"]`,
    );
  });

  it("prevents MIME sniffing and framing", () => {
    expect(config).toContain(`key: "X-Content-Type-Options"`);
    expect(config).toContain(`value: "nosniff"`);
    expect(config).toContain(`key: "X-Frame-Options"`);
    expect(config).toContain(`value: "DENY"`);
  });

  it("sets privacy-oriented browser policies", () => {
    expect(config).toContain(`key: "Referrer-Policy"`);
    expect(config).toContain(`value: "strict-origin-when-cross-origin"`);
    expect(config).toContain(`key: "Permissions-Policy"`);
    expect(config).toContain(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    );
    expect(config).toContain(`key: "Cross-Origin-Opener-Policy"`);
    expect(config).toContain(`value: "same-origin"`);
  });

  it("enables HSTS only outside development", () => {
    expect(config).toContain(`key: "Strict-Transport-Security"`);
    expect(config).toContain(`value: "max-age=31536000; includeSubDomains"`);
    expect(config).toContain("...(!isDevelopment");
  });

  it("does not unnecessarily allow third-party frames or objects", () => {
    expect(config).not.toMatch(/frame-src[^"]+https:/);
    expect(config).not.toMatch(/object-src[^"]+https:/);
  });
});
