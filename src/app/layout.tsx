import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ageGateConfig, cookieConsentConfig } from "@/config/consent";
import { baseMetadata } from "@/config/metadata";
import { catalogProducts } from "@/content/catalog/products";
import { AgeGate } from "@/features/age-gate/age-gate";
import { AccountProvider } from "@/features/account/account-provider";
import { CommerceOverlays } from "@/features/commerce/commerce-overlays";
import { CommerceProvider } from "@/features/commerce/commerce-provider";
import { isAgeConfirmationValueValid } from "@/features/age-gate/age-gate-storage";
import { CookiePreferencesBanner } from "@/features/cookie-consent/cookie-preferences-banner";
import { createCatalogProductViews } from "@/server/catalog-view";

import "@/styles/globals.css";

const manrope = localFont({
  src: "../assets/fonts/manrope-latin-variable.woff2",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

const playfair = localFont({
  src: [
    {
      path: "../assets/fonts/playfair-display-latin-variable.woff2",
      style: "normal",
      weight: "400 900",
    },
    {
      path: "../assets/fonts/playfair-display-latin-variable-italic.woff2",
      style: "italic",
      weight: "400 900",
    },
  ],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = baseMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const ageConfirmation = cookieStore.get(ageGateConfig.cookieName)?.value;
  const initiallyConfirmed = isAgeConfirmationValueValid(ageConfirmation);
  const cookiePreferencesConfigured = cookieStore.has(
    cookieConsentConfig.cookieName,
  );
  const commerceProducts = createCatalogProductViews(catalogProducts);

  return (
    <html
      lang="it"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${playfair.variable} ${
        initiallyConfirmed ? "" : "age-gate-active"
      }`}
      suppressHydrationWarning
    >
      <body>
        <a className="skip-link" href="#main-content">
          Vai al contenuto
        </a>
        <AccountProvider>
          <CommerceProvider products={commerceProducts}>
            <div id="site-shell">
              <SiteHeader />
              {children}
              <SiteFooter />
              <CookiePreferencesBanner
                initiallyConfigured={cookiePreferencesConfigured}
              />
            </div>
            <CommerceOverlays />
          </CommerceProvider>
        </AccountProvider>
        <AgeGate initiallyConfirmed={initiallyConfirmed} />
      </body>
    </html>
  );
}
