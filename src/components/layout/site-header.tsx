import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { businessInfo } from "@/config/business";
import { formatEuroMinor } from "@/lib/money";

export function SiteHeader() {
  return (
    <SiteHeaderClient
      freeShippingThreshold={formatEuroMinor(
        businessInfo.freeShippingThresholdMinor,
      )}
    />
  );
}
