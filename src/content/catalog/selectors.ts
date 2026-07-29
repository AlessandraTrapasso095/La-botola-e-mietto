import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogProducts } from "@/content/catalog/products";

export function getCategoryBySlug(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getBrandBySlug(slug: string) {
  return catalogBrands.find((brand) => brand.slug === slug);
}

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return catalogProducts.filter(
    (product) => product.categorySlug === categorySlug,
  );
}

export function getProductsByBrand(brandSlug: string) {
  return catalogProducts.filter((product) => product.brandSlug === brandSlug);
}

export function getRelatedProducts(productSlug: string, limit = 4) {
  const product = getProductBySlug(productSlug);
  if (!product) return [];

  const sameCategory = catalogProducts.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.categorySlug === product.categorySlug,
  );
  const complementary = catalogProducts.filter(
    (candidate) =>
      candidate.slug !== product.slug && !sameCategory.includes(candidate),
  );

  return [...sameCategory, ...complementary].slice(0, limit);
}
