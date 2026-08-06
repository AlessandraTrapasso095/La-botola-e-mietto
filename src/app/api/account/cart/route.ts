import { type NextRequest } from "next/server";

import {
  cartProductInputSchema,
  cartQuantityInputSchema,
  cartRemoveInputSchema,
} from "@/lib/validation/cart";
import {
  addAccountCartProduct,
  readAccountCart,
  removeAccountCartProduct,
  setAccountCartProductQuantity,
} from "@/server/cart/account-cart";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

export async function GET() {
  try {
    requireSupabaseAuthMode();

    return authJson(await readAccountCart(await createSupabaseServerClient()));
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const { slug, quantity } = await parseAuthInput(
      request,
      cartProductInputSchema,
    );

    return authJson(
      await addAccountCartProduct(
        await createSupabaseServerClient(),
        slug,
        quantity,
      ),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const { slug, quantity } = await parseAuthInput(
      request,
      cartQuantityInputSchema,
    );

    return authJson(
      await setAccountCartProductQuantity(
        await createSupabaseServerClient(),
        slug,
        quantity,
      ),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const { slug } = await parseAuthInput(request, cartRemoveInputSchema);

    return authJson(
      await removeAccountCartProduct(await createSupabaseServerClient(), slug),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
