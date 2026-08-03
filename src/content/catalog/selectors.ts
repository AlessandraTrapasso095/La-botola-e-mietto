import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogCollections } from "@/content/catalog/collections";
import {
  catalogOfferProductCodes,
  isCatalogOfferProductCode,
} from "@/content/catalog/offers";
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

export function getCollectionBySlug(slug: string) {
  return catalogCollections.find((collection) => collection.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  if (categorySlug === "bottiglie-rare") {
    return catalogProducts.filter((product) => product.isLimited);
  }

  return catalogProducts.filter(
    (product) => product.categorySlug === categorySlug,
  );
}

export function getProductsByBrand(brandSlug: string) {
  return catalogProducts.filter((product) => product.brandSlug === brandSlug);
}

export function getProductsByCollection(collectionSlug: string) {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return [];

  const productSlugs = new Set(collection.productSlugs);
  return catalogProducts.filter((product) => productSlugs.has(product.slug));
}

export function getOfferProducts() {
  const productsByCode = new Map(
    catalogProducts.map((product) => [product.code, product]),
  );

  return catalogOfferProductCodes.flatMap((code) => {
    const product = productsByCode.get(code);
    return product ? [product] : [];
  });
}

export function getOfferProductBySlug(slug: string) {
  const product = getProductBySlug(slug);
  return product && isCatalogOfferProductCode(product.code)
    ? product
    : undefined;
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
