import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("shared rate limiting schema contract", () => {
  const source = readFileSync(
    resolve("supabase/migrations/0055_shared_rate_limiting.sql"),
    "utf8",
  );

  it("mantiene lo stato del limiter nel database condiviso", () => {
    expect(source).toContain("create table public.rate_limit_buckets");

    expect(source).toContain("primary key (scope, identifier_hash)");

    expect(source).toContain("window_started_at timestamptz not null");

    expect(source).toContain("request_count integer not null");
  });

  it("non accetta identificatori in chiaro al posto di un SHA-256", () => {
    expect(source).toContain("identifier_hash ~ '^[a-f0-9]{64}$'");
  });

  it("consuma il limite tramite una RPC atomica", () => {
    expect(source).toContain(
      "create or replace function public.consume_rate_limit",
    );

    expect(source).toContain("on conflict (scope, identifier_hash)");

    expect(source).toContain("public.rate_limit_buckets.request_count + 1");
  });

  it("riapre automaticamente una finestra scaduta", () => {
    expect(source).toContain(
      "public.rate_limit_buckets.window_started_at + v_window <= v_now",
    );

    expect(source).toContain("then 1");
  });

  it("restituisce allowed remaining retry-after e reset", () => {
    expect(source).toContain("allowed boolean");

    expect(source).toContain("remaining integer");

    expect(source).toContain("retry_after_seconds integer");

    expect(source).toContain("reset_at timestamptz");
  });

  it("usa SECURITY DEFINER con search_path vuoto", () => {
    expect(source).toContain("security definer");
    expect(source).toContain("set search_path = ''");
  });

  it("nega tabella e RPC ai ruoli pubblici", () => {
    expect(source).toContain("from public, anon, authenticated");
  });

  it("espone la RPC esclusivamente al service role", () => {
    expect(source).toContain("grant execute");

    expect(source).toContain("to service_role");
  });

  it("mantiene RLS abilitato sulla tabella", () => {
    expect(source).toContain("alter table public.rate_limit_buckets");

    expect(source).toContain("enable row level security");
  });
});
