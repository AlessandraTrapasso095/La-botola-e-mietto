export function createCatalogSubcategorySlug(
  categorySlug: string,
  subcategory: string,
) {
  const suffix = subcategory
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${categorySlug}--${suffix}`;
}
