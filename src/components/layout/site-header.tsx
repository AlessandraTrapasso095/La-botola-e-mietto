import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { businessInfo } from "@/config/business";
import { createCatalogMenuGroups } from "@/config/catalog";
import { catalogCollections } from "@/content/catalog/collections";
import { formatEuroMinor } from "@/lib/money";

export function SiteHeader() {
  const collectionLinks = catalogCollections
    .filter((collection) => collection.productSlugs.length > 0)
    .map((collection) => ({
      label: collection.label,
      href: collection.href,
    }));

  return (
    <SiteHeaderClient
      menuGroups={createCatalogMenuGroups(collectionLinks)}
      freeShippingThreshold={formatEuroMinor(
        businessInfo.freeShippingThresholdMinor,
      )}
    />
  );
}
