import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function migration(file: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations", file),
    "utf8",
  );
}

const accountRoles = migration("0020_account_roles.sql");
const cancellationRefunds = migration("0024_admin_cancellation_refunds.sql");
const directCancellation = migration(
  "0025_admin_direct_order_cancellation.sql",
);
const bankTransfer = migration("0032_admin_confirm_bank_transfer.sql");
const stripeFinalization = migration(
  "0016_stripe_payment_cart_finalization.sql",
);
const promotionValidation = migration("0045_promotion_code_validation.sql");
const checkout = migration("0047_checkout_promotion_minimum_payable.sql");
const descriptions = migration(
  "0049_admin_batch_update_product_descriptions.sql",
);
const commercialCatalog = migration(
  "0050_admin_batch_apply_commercial_catalog.sql",
);
const characteristics = migration("0051_product_characteristics.sql");
const bankTransferHardening = migration(
  "0052_harden_confirm_admin_bank_transfer_search_path.sql",
);

describe("RPC security contract", () => {
  it("mantiene current_user_is_admin limitata agli autenticati", () => {
    expect(accountRoles).toContain(
      "revoke all on function public.current_user_is_admin() from public;",
    );

    expect(accountRoles).toContain(
      "grant execute on function public.current_user_is_admin()",
    );

    expect(accountRoles).toContain("to authenticated;");
  });

  it("mantiene le RPC di annullamento admin service-role only", () => {
    for (const source of [cancellationRefunds, directCancellation]) {
      expect(source).toContain("from public, anon, authenticated;");

      expect(source).toContain("to service_role;");
      expect(source).toContain("security definer");
      expect(source).toContain("set search_path = ''");
    }
  });

  it("mantiene la conferma bonifico service-role only", () => {
    expect(bankTransfer).toContain(
      "revoke all on function public.confirm_admin_bank_transfer(uuid) from public;",
    );

    expect(bankTransfer).toContain(
      "revoke all on function public.confirm_admin_bank_transfer(uuid) from anon;",
    );

    expect(bankTransfer).toContain(
      "revoke all on function public.confirm_admin_bank_transfer(uuid) from authenticated;",
    );

    expect(bankTransfer).toContain("to service_role;");
  });

  it("rimuove il search_path public dalla RPC bonifico privilegiata", () => {
    expect(bankTransferHardening).toContain(
      "alter function public.confirm_admin_bank_transfer(uuid)",
    );

    expect(bankTransferHardening).toContain("set search_path = '';");
  });

  it("mantiene la finalizzazione Stripe service-role only", () => {
    expect(stripeFinalization).toContain("to service_role;");

    expect(stripeFinalization).toContain("set search_path = ''");

    expect(stripeFinalization).toContain("security definer");
  });

  it("mantiene validate_promotion_code service-role only", () => {
    expect(promotionValidation).toContain(
      "revoke execute on function public.validate_promotion_code",
    );

    expect(promotionValidation).toContain("from anon, authenticated;");

    expect(promotionValidation).toContain("to service_role;");
  });

  it("mantiene checkout_account_cart disponibile solo agli autenticati", () => {
    expect(checkout).toContain(
      "revoke all on function public.checkout_account_cart",
    );

    expect(checkout).toContain(
      "grant execute on function public.checkout_account_cart",
    );

    expect(checkout).toContain("to authenticated;");

    expect(checkout).toContain("v_profile_id := auth.uid();");
  });

  it("mantiene le RPC batch amministrative service-role only", () => {
    for (const source of [descriptions, commercialCatalog, characteristics]) {
      expect(source).toContain("from public, anon, authenticated;");

      expect(source).toContain("to service_role;");
      expect(source).toContain("security definer");
      expect(source).toContain("set search_path = ''");
    }
  });
});
