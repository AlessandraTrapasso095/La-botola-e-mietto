import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin order HTTP error boundaries", () => {
  const status = source("src/app/api/admin/orders/status/route.ts");

  const shipping = source("src/app/api/admin/orders/shipping/route.ts");

  it("usa il boundary HTTP centralizzato per lo stato ordine", () => {
    expect(status).toContain("authErrorResponse");
    expect(status).toContain("return authErrorResponse(error)");
    expect(status).toContain("authJson(result)");
    expect(status).not.toContain("NextResponse");
  });

  it("usa il boundary HTTP centralizzato per la spedizione", () => {
    expect(shipping).toContain("authErrorResponse");
    expect(shipping).toContain("return authErrorResponse(error)");
    expect(shipping).toContain("authJson(result)");
    expect(shipping).not.toContain("NextResponse");
  });

  it("mantiene input malformato come 400 controllato", () => {
    expect(status).toContain(
      'throw new AuthHttpError(400, "Richiesta non valida.")',
    );

    expect(shipping).toContain(
      'throw new AuthHttpError(400, "Dati di spedizione non validi.")',
    );
  });

  it("non serializza manualmente error.message nelle API", () => {
    expect(status).not.toContain("message: error.message");
    expect(shipping).not.toContain("message: error.message");
  });

  it("usa safeParse dopo un JSON parse fail-safe", () => {
    expect(status).toContain("await request.json().catch(() => null)");

    expect(shipping).toContain("await request.json().catch(() => null)");

    expect(status).toContain("inputSchema.safeParse(body)");
    expect(shipping).toContain("inputSchema.safeParse(body)");
  });
});
