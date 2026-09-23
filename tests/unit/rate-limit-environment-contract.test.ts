import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("rate limit environment contract", () => {
  const environment = source("src/server/env.ts");
  const example = source(".env.example");
  const limiter = source("src/server/security/rate-limit.ts");

  it("dichiara un segreto dedicato per il rate limiting", () => {
    expect(environment).toContain("RATE_LIMIT_SECRET");
    expect(environment).toContain("rateLimitSecret");
    expect(example).toContain("RATE_LIMIT_SECRET=");
  });

  it("richiede almeno 32 caratteri quando il segreto viene configurato", () => {
    expect(environment).toContain("z.string().min(32).optional()");
  });

  it("non riutilizza la service role key come chiave HMAC", () => {
    expect(limiter).toContain("RATE_LIMIT_SECRET");
    expect(limiter).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("consente il fallback locale ma fallisce chiuso in produzione", () => {
    expect(limiter).toContain('process.env.NODE_ENV !== "production"');
    expect(limiter).toContain('"local-rate-limit-secret-development-only"');
    expect(limiter).toContain("new AuthHttpError(");
    expect(limiter).toContain("503");
  });
});
