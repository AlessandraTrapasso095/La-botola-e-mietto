import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("account route protection contract", () => {
  const proxy = source("src/proxy.ts");

  const accountLayout = source("src/app/(storefront)/account/layout.tsx");

  const accountUser = source("src/server/auth/account-user.ts");

  const orders = source("src/server/account/orders.ts");

  const cancelOrder = source("src/server/account/cancel-order.ts");

  const hideOrder = source("src/server/account/hide-order.ts");

  const hideOrderMigration = source(
    "supabase/migrations/0019_order_cancellation_requests_and_history.sql",
  );

  const promotionPreview = source(
    "src/server/checkout/promotion-code-preview.ts",
  );

  const promotionRoute = source(
    "src/app/api/account/checkout/promotion-code/route.ts",
  );

  it("blocca nel proxy le route account quando manca la sessione", () => {
    expect(proxy).toContain("const accountRoute =");

    expect(proxy).toContain(
      'pathname === "/account" || pathname.startsWith("/account/")',
    );

    expect(proxy).toContain("accountRoute && !user");

    expect(proxy).toContain('destination.pathname = "/accedi"');

    expect(proxy).toContain(
      "getSafeRedirectPath(`${pathname}${request.nextUrl.search}`)",
    );
  });

  it("verifica nuovamente l'utente lato server nel layout account", () => {
    expect(accountLayout).toContain("getServerAccountUser");

    expect(accountLayout).toContain("!(await getServerAccountUser())");

    expect(accountLayout).toContain('redirect("/accedi")');
  });

  it("valida la sessione account con Supabase getUser", () => {
    expect(accountUser).toContain("client.auth.getUser()");

    expect(accountUser).not.toContain("client.auth.getSession()");
  });

  it("limita lista e dettaglio ordini al proprietario autenticato", () => {
    expect(orders.match(/\.eq\("profile_id", accountUser\.id\)/g)).toHaveLength(
      2,
    );

    expect(orders).toContain('.eq("order_number", orderNumber)');

    expect(orders).toContain('.is("hidden_from_customer_at", null)');
  });

  it("impedisce l'annullamento di ordini appartenenti ad altri utenti", () => {
    expect(cancelOrder).toContain("client.auth.getUser()");

    expect(cancelOrder).toContain('.eq("id", orderId)');

    expect(cancelOrder).toContain(
      '.eq("profile_id", userResponse.data.user.id)',
    );
  });

  it("richiede una sessione prima di invocare l'RPC hide order", () => {
    const authIndex = hideOrder.indexOf("client.auth.getUser()");

    const rpcIndex = hideOrder.indexOf(
      'client.rpc("hide_cancelled_account_order"',
    );

    expect(authIndex).toBeGreaterThan(-1);
    expect(rpcIndex).toBeGreaterThan(authIndex);

    expect(hideOrder).toContain(
      'throw new AuthHttpError(401, "Accesso richiesto.")',
    );
  });

  it("vincola hide_cancelled_account_order ad auth.uid e ownership", () => {
    expect(hideOrderMigration).toContain("v_profile_id := auth.uid();");

    expect(hideOrderMigration).toContain("and profile_id = v_profile_id");

    expect(hideOrderMigration).toContain("and status = 'cancelled'");

    expect(hideOrderMigration).toContain("security definer");

    expect(hideOrderMigration).toContain("set search_path = ''");

    expect(hideOrderMigration).toContain(
      "revoke all on function public.hide_cancelled_account_order(uuid) from public;",
    );

    expect(hideOrderMigration).toContain(
      "grant execute on function public.hide_cancelled_account_order(uuid)",
    );

    expect(hideOrderMigration).toContain("to authenticated;");
  });

  it("usa il service role nella preview promo solo dopo auth e rate limit", () => {
    const authIndex = promotionPreview.indexOf(
      "await requireAccountUser(client)",
    );

    const rateLimitIndex = promotionPreview.indexOf(
      "await enforceUserRateLimit(",
    );

    const adminIndex = promotionPreview.indexOf("createSupabaseAdminClient()");

    expect(authIndex).toBeGreaterThan(-1);
    expect(rateLimitIndex).toBeGreaterThan(authIndex);
    expect(adminIndex).toBeGreaterThan(rateLimitIndex);

    expect(promotionPreview).toContain("accountUser.id");
  });

  it("mantiene la route preview promo autenticata e same-origin", () => {
    expect(promotionRoute).toContain("requireSupabaseAuthMode();");

    expect(promotionRoute).toContain("requireSameOrigin(request);");

    expect(promotionRoute).toContain("previewPromotionCode(client, input)");
  });
});
