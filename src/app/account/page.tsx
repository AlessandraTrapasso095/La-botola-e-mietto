import { getOfferProducts } from "@/content/catalog/selectors";
import { AccountDashboard } from "@/features/account/account-dashboard";
import { createCatalogProductViews } from "@/server/catalog-view";

export default function AccountPage() {
  const offerProducts = createCatalogProductViews(getOfferProducts());
  return <AccountDashboard offerProducts={offerProducts} />;
}
