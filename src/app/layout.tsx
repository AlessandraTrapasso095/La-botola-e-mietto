import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ageGateConfig, cookieConsentConfig } from "@/config/consent";
import { baseMetadata } from "@/config/metadata";
import { AgeGate } from "@/features/age-gate/age-gate";
import { isAgeConfirmationValueValid } from "@/features/age-gate/age-gate-storage";
import { CookiePreferencesBanner } from "@/features/cookie-consent/cookie-preferences-banner";

import "@/styles/globals.css";

const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

const playfair = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
      style: "normal",
      weight: "400 900",
    },
    {
      path: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2",
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

  return (
    <html
      lang="it"
      className={`${manrope.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a className="skip-link" href="#main-content">
          Vai al contenuto
        </a>
        <div id="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
          <CookiePreferencesBanner
            initiallyConfigured={cookiePreferencesConfigured}
          />
        </div>
        <AgeGate initiallyConfirmed={initiallyConfirmed} />
      </body>
    </html>
  );
}
