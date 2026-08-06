import { type NextRequest } from "next/server";

import { wishlistProductInputSchema } from "@/lib/validation/wishlist";
import {
  addAccountWishlistProduct,
  readAccountWishlist,
  removeAccountWishlistProduct,
} from "@/server/wishlist/account-wishlist";
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
    return authJson(
      await readAccountWishlist(await createSupabaseServerClient()),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const { slug } = await parseAuthInput(request, wishlistProductInputSchema);
    return authJson(
      await addAccountWishlistProduct(await createSupabaseServerClient(), slug),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const { slug } = await parseAuthInput(request, wishlistProductInputSchema);
    return authJson(
      await removeAccountWishlistProduct(
        await createSupabaseServerClient(),
        slug,
      ),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
