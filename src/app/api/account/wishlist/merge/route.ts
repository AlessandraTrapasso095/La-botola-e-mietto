import { type NextRequest } from "next/server";

import { wishlistMergeInputSchema } from "@/lib/validation/wishlist";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import { mergeAccountWishlist } from "@/server/wishlist/account-wishlist";

export async function PUT(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const { slugs } = await parseAuthInput(request, wishlistMergeInputSchema);
    return authJson(
      await mergeAccountWishlist(await createSupabaseServerClient(), slugs),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
