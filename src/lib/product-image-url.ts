import { getPublicEnvironment } from "@/config/public-env";

const PRODUCT_IMAGE_BUCKET = "product-images";
const STORAGE_PRODUCT_PREFIX = "products/";

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function resolveProductImageUrl(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  if (path.startsWith(STORAGE_PRODUCT_PREFIX)) {
    const supabaseUrl = getPublicEnvironment().NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl) {
      return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${encodeStoragePath(path)}`;
    }
  }

  return path.startsWith("/") ? path : `/${path}`;
}
