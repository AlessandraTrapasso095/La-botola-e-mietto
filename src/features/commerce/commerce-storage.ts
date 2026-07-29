export type StoredCommerceState = {
  cart: Record<string, number>;
  wishlist: string[];
};

const storageKey = "lbm-demo-commerce";

function isStoredCommerceState(value: unknown): value is StoredCommerceState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredCommerceState>;

  return (
    Boolean(candidate.cart) &&
    typeof candidate.cart === "object" &&
    Array.isArray(candidate.wishlist) &&
    candidate.wishlist.every((slug) => typeof slug === "string")
  );
}

export function readCommerceState(
  storage: Pick<Storage, "getItem">,
): StoredCommerceState | null {
  const serialized = storage.getItem(storageKey);
  if (!serialized) return null;

  try {
    const parsed: unknown = JSON.parse(serialized);
    return isStoredCommerceState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCommerceState(
  storage: Pick<Storage, "setItem">,
  state: StoredCommerceState,
) {
  storage.setItem(storageKey, JSON.stringify(state));
}
