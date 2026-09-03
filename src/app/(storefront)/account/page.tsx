import { getOfferProducts } from "@/content/catalog/selectors";
import {
  accountOrders,
  initialAccountAddresses,
} from "@/content/account/account-data";
import { AccountDashboard } from "@/features/account/account-dashboard";
import { createCatalogProductViews } from "@/server/catalog-view";
import { getServerEnvironment } from "@/server/env";

export default function AccountPage() {
  const demoMode = getServerEnvironment().AUTH_SERVICE === "demo";
  const offerProducts = demoMode
    ? createCatalogProductViews(getOfferProducts())
    : [];
  return (
    <AccountDashboard
      addresses={demoMode ? initialAccountAddresses : []}
      offerProducts={offerProducts}
      orders={demoMode ? accountOrders : []}
    />
  );
}
