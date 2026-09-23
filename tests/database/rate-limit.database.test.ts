import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("shared rate limiting Supabase locale", () => {
  const environment = getLocalSupabaseEnvironment();

  const database = postgres(environment.DB_URL, {
    max: 1,
  });

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  } as const;

  const service = createClient<Database>(
    environment.API_URL,
    environment.SERVICE_ROLE_KEY,
    options,
  );

  const scopePrefix = `qa-rate-limit-${Date.now()}`;

  function hashIdentifier(identifier: string) {
    return createHash("sha256").update(identifier).digest("hex");
  }

  async function consume(
    scope: string,
    identifierHash: string,
    limit: number,
    windowSeconds = 300,
  ) {
    const response = await service.rpc("consume_rate_limit", {
      p_scope: scope,
      p_identifier_hash: identifierHash,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    expect(response.error).toBeNull();
    expect(response.data).toHaveLength(1);

    const result = response.data?.[0];

    if (!result) {
      throw new Error("La RPC consume_rate_limit non ha restituito risultati.");
    }

    return result;
  }

  beforeEach(async () => {
    await database`
      delete from public.rate_limit_buckets
      where scope like ${`${scopePrefix}%`}
    `;
  });

  afterAll(async () => {
    await database`
      delete from public.rate_limit_buckets
      where scope like ${`${scopePrefix}%`}
    `;

    await database.end();
  });

  it("serializza un burst concorrente senza superare la soglia", async () => {
    const scope = `${scopePrefix}:concurrency`;
    const identifierHash = hashIdentifier("same-user");
    const limit = 5;
    const requestCount = 20;

    const results = await Promise.all(
      Array.from({ length: requestCount }, () =>
        consume(scope, identifierHash, limit),
      ),
    );

    const allowed = results.filter((result) => result.allowed);
    const denied = results.filter((result) => !result.allowed);

    expect(allowed).toHaveLength(limit);
    expect(denied).toHaveLength(requestCount - limit);

    expect(
      denied.every(
        (result) =>
          result.remaining === 0 &&
          result.retry_after_seconds >= 1 &&
          result.retry_after_seconds <= 300,
      ),
    ).toBe(true);

    const [bucket] = await database<
      {
        request_count: number;
      }[]
    >`
      select request_count
      from public.rate_limit_buckets
      where scope = ${scope}
        and identifier_hash = ${identifierHash}
    `;

    expect(bucket?.request_count).toBe(requestCount);
  });

  it("isola completamente identificatori diversi nello stesso scope", async () => {
    const scope = `${scopePrefix}:isolation`;

    const firstIdentifierHash = hashIdentifier("user-one");
    const secondIdentifierHash = hashIdentifier("user-two");

    const [firstResults, secondResults] = await Promise.all([
      Promise.all(
        Array.from({ length: 3 }, () => consume(scope, firstIdentifierHash, 2)),
      ),
      Promise.all(
        Array.from({ length: 3 }, () =>
          consume(scope, secondIdentifierHash, 2),
        ),
      ),
    ]);

    expect(firstResults.filter((result) => result.allowed)).toHaveLength(2);

    expect(secondResults.filter((result) => result.allowed)).toHaveLength(2);

    const buckets = await database<
      {
        identifier_hash: string;
        request_count: number;
      }[]
    >`
      select
        identifier_hash,
        request_count
      from public.rate_limit_buckets
      where scope = ${scope}
      order by identifier_hash
    `;

    expect(buckets).toHaveLength(2);

    expect(buckets.map((bucket) => bucket.request_count)).toEqual([3, 3]);
  });

  it("isola lo stesso identificatore tra scope diversi", async () => {
    const identifierHash = hashIdentifier("shared-user");

    const firstScope = `${scopePrefix}:scope-one`;
    const secondScope = `${scopePrefix}:scope-two`;

    const [first, second] = await Promise.all([
      consume(firstScope, identifierHash, 1),
      consume(secondScope, identifierHash, 1),
    ]);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);

    const [firstBlocked, secondBlocked] = await Promise.all([
      consume(firstScope, identifierHash, 1),
      consume(secondScope, identifierHash, 1),
    ]);

    expect(firstBlocked.allowed).toBe(false);
    expect(secondBlocked.allowed).toBe(false);
  });

  it("riapre atomicamente una finestra realmente scaduta", async () => {
    const scope = `${scopePrefix}:reset`;
    const identifierHash = hashIdentifier("reset-user");

    const first = await consume(scope, identifierHash, 1, 300);

    const blocked = await consume(scope, identifierHash, 1, 300);

    expect(first.allowed).toBe(true);
    expect(blocked.allowed).toBe(false);

    await database`
      update public.rate_limit_buckets
      set window_started_at = now() - interval '10 minutes'
      where scope = ${scope}
        and identifier_hash = ${identifierHash}
    `;

    const reopened = await consume(scope, identifierHash, 1, 300);

    expect(reopened.allowed).toBe(true);
    expect(reopened.remaining).toBe(0);
    expect(reopened.retry_after_seconds).toBe(0);

    const [bucket] = await database<
      {
        request_count: number;
      }[]
    >`
      select request_count
      from public.rate_limit_buckets
      where scope = ${scope}
        and identifier_hash = ${identifierHash}
    `;

    expect(bucket?.request_count).toBe(1);
  });
});
