const storageKey = "lbm-recently-viewed";
const maximumItems = 6;

export function readRecentlyViewed(storage: Pick<Storage, "getItem">) {
  const serialized = storage.getItem(storageKey);
  if (!serialized) return [] as string[];

  try {
    const parsed: unknown = JSON.parse(serialized);
    return Array.isArray(parsed)
      ? parsed.filter((slug): slug is string => typeof slug === "string")
      : [];
  } catch {
    return [] as string[];
  }
}

export function registerRecentlyViewed(
  storage: Pick<Storage, "getItem" | "setItem">,
  slug: string,
) {
  const next = [
    slug,
    ...readRecentlyViewed(storage).filter((candidate) => candidate !== slug),
  ].slice(0, maximumItems);
  storage.setItem(storageKey, JSON.stringify(next));
  return next;
}
